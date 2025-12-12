package caddy

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	"go.uber.org/zap"

	"github.com/panaroid/domain-gateway/internal/config"
	"github.com/panaroid/domain-gateway/pkg/models"
)

// Manager manages Caddy dynamic configuration
type Manager struct {
	cfg      config.CaddyConfig
	dnsCfg   config.DNSConfig
	logger   *zap.Logger
	adminURL string
	mu       sync.RWMutex
	routes   map[string]*Route
}

// Route represents a Caddy route
type Route struct {
	Domain    string
	TenantID  string
	Upstream  string
	SSLIssued bool
}

// CaddyConfig represents the Caddy JSON config structure
type CaddyConfig struct {
	Apps CaddyApps `json:"apps"`
}

type CaddyApps struct {
	HTTP CaddyHTTPApp `json:"http"`
	TLS  CaddyTLSApp  `json:"tls,omitempty"`
}

type CaddyHTTPApp struct {
	Servers map[string]*CaddyHTTPServer `json:"servers"`
}

type CaddyHTTPServer struct {
	Listen []string     `json:"listen"`
	Routes []CaddyRoute `json:"routes"`
}

type CaddyRoute struct {
	Match    []CaddyMatch   `json:"match,omitempty"`
	Handle   []CaddyHandler `json:"handle"`
	Terminal bool           `json:"terminal,omitempty"`
}

type CaddyMatch struct {
	Host []string `json:"host,omitempty"`
}

type CaddyHandler struct {
	Handler   string          `json:"handler"`
	Upstreams []CaddyUpstream `json:"upstreams,omitempty"`
	Routes    []CaddyRoute    `json:"routes,omitempty"`
}

type CaddyUpstream struct {
	Dial string `json:"dial"`
}

type CaddyTLSApp struct {
	Automation CaddyTLSAutomation `json:"automation"`
}

type CaddyTLSAutomation struct {
	Policies []CaddyTLSPolicy `json:"policies"`
}

type CaddyTLSPolicy struct {
	Subjects []string      `json:"subjects,omitempty"`
	Issuers  []CaddyIssuer `json:"issuers,omitempty"`
}

type CaddyIssuer struct {
	Module     string          `json:"module"`
	Email      string          `json:"email,omitempty"`
	Challenges CaddyChallenges `json:"challenges,omitempty"`
}

type CaddyChallenges struct {
	DNS CaddyDNSChallenge `json:"dns,omitempty"`
}

type CaddyDNSChallenge struct {
	Provider CaddyDNSProvider `json:"provider"`
}

type CaddyDNSProvider struct {
	Name     string `json:"name"`
	APIToken string `json:"api_token"`
}

// NewManager creates a new Caddy manager
func NewManager(cfg config.CaddyConfig, dnsCfg config.DNSConfig, logger *zap.Logger) *Manager {
	return &Manager{
		cfg:      cfg,
		dnsCfg:   dnsCfg,
		logger:   logger,
		adminURL: fmt.Sprintf("http://%s", cfg.AdminAPIAddr),
		routes:   make(map[string]*Route),
	}
}

// BuildConfig builds the complete Caddy configuration
func (m *Manager) BuildConfig(domains []models.Domain) *CaddyConfig {
	m.mu.Lock()
	defer m.mu.Unlock()

	backend := fmt.Sprintf("%s:%d", m.cfg.BackendHost, m.cfg.BackendPort)

	// Build routes
	var routes []CaddyRoute

	// Add routes for each verified domain
	for _, domain := range domains {
		if !domain.Verified {
			continue
		}

		route := CaddyRoute{
			Match: []CaddyMatch{
				{Host: []string{domain.Domain}},
			},
			Handle: []CaddyHandler{
				{
					Handler: "reverse_proxy",
					Upstreams: []CaddyUpstream{
						{Dial: backend},
					},
				},
			},
			Terminal: true,
		}
		routes = append(routes, route)

		// Store in local cache
		m.routes[domain.Domain] = &Route{
			Domain:   domain.Domain,
			TenantID: domain.TenantID,
			Upstream: backend,
		}
	}

	// Add wildcard subdomain route
	if m.cfg.BaseDomain != "" {
		wildcardRoute := CaddyRoute{
			Match: []CaddyMatch{
				{Host: []string{fmt.Sprintf("*.%s", m.cfg.BaseDomain)}},
			},
			Handle: []CaddyHandler{
				{
					Handler: "reverse_proxy",
					Upstreams: []CaddyUpstream{
						{Dial: backend},
					},
				},
			},
			Terminal: true,
		}
		routes = append(routes, wildcardRoute)
	}

	// Build TLS automation
	var subjects []string
	for _, domain := range domains {
		if domain.Verified && domain.Type == models.DomainTypeCustom {
			subjects = append(subjects, domain.Domain)
		}
	}

	// Add wildcard to subjects
	if m.cfg.BaseDomain != "" {
		subjects = append(subjects, fmt.Sprintf("*.%s", m.cfg.BaseDomain))
	}

	config := &CaddyConfig{
		Apps: CaddyApps{
			HTTP: CaddyHTTPApp{
				Servers: map[string]*CaddyHTTPServer{
					"main": {
						Listen: []string{":80", ":443"},
						Routes: routes,
					},
				},
			},
			TLS: CaddyTLSApp{
				Automation: CaddyTLSAutomation{
					Policies: []CaddyTLSPolicy{
						{
							Subjects: subjects,
							Issuers: []CaddyIssuer{
								{
									Module: "acme",
									Email:  m.cfg.Email,
									Challenges: CaddyChallenges{
										DNS: CaddyDNSChallenge{
											Provider: CaddyDNSProvider{
												Name:     m.dnsCfg.Provider,
												APIToken: m.dnsCfg.APIToken,
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
	}

	return config
}

// LoadConfig loads the configuration into Caddy via Admin API
func (m *Manager) LoadConfig(ctx context.Context, config *CaddyConfig) error {
	data, err := json.Marshal(config)
	if err != nil {
		return fmt.Errorf("failed to marshal config: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, m.adminURL+"/load", bytes.NewReader(data))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to load config: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("caddy admin API returned status %d", resp.StatusCode)
	}

	m.logger.Info("Caddy configuration loaded successfully")
	return nil
}

// AddDomain adds a single domain route dynamically
func (m *Manager) AddDomain(ctx context.Context, domain *models.Domain) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	backend := fmt.Sprintf("%s:%d", m.cfg.BackendHost, m.cfg.BackendPort)

	route := map[string]interface{}{
		"@id": fmt.Sprintf("route-%s", domain.ID),
		"match": []map[string]interface{}{
			{"host": []string{domain.Domain}},
		},
		"handle": []map[string]interface{}{
			{
				"handler": "reverse_proxy",
				"upstreams": []map[string]interface{}{
					{"dial": backend},
				},
			},
		},
		"terminal": true,
	}

	data, err := json.Marshal(route)
	if err != nil {
		return fmt.Errorf("failed to marshal route: %w", err)
	}

	// Add route via PATCH to routes
	url := fmt.Sprintf("%s/config/apps/http/servers/main/routes", m.adminURL)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(data))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to add route: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return fmt.Errorf("failed to add route: status %d", resp.StatusCode)
	}

	// Store in cache
	m.routes[domain.Domain] = &Route{
		Domain:   domain.Domain,
		TenantID: domain.TenantID,
		Upstream: backend,
	}

	m.logger.Info("Domain route added", zap.String("domain", domain.Domain))
	return nil
}

// RemoveDomain removes a domain route
func (m *Manager) RemoveDomain(ctx context.Context, domainID string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	url := fmt.Sprintf("%s/id/route-%s", m.adminURL, domainID)
	req, err := http.NewRequestWithContext(ctx, http.MethodDelete, url, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to remove route: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		m.logger.Warn("Route might not exist", zap.String("domain_id", domainID))
	}

	m.logger.Info("Domain route removed", zap.String("domain_id", domainID))
	return nil
}

// GetRouteCount returns the number of active routes
func (m *Manager) GetRouteCount() int {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return len(m.routes)
}
