package api

import (
	"encoding/json"
	"net/http"
	"strings"

	"go.uber.org/zap"

	"github.com/panaroid/domain-gateway/internal/caddy"
	"github.com/panaroid/domain-gateway/internal/config"
	"github.com/panaroid/domain-gateway/internal/database"
	"github.com/panaroid/domain-gateway/internal/dns"
	"github.com/panaroid/domain-gateway/internal/worker"
	"github.com/panaroid/domain-gateway/pkg/models"
)

// Handler handles HTTP requests
type Handler struct {
	repo         *database.DomainRepository
	verifier     *dns.Verifier
	caddyManager *caddy.Manager
	worker       *worker.VerificationWorker
	cfg          config.CaddyConfig
	logger       *zap.Logger
}

// NewHandler creates a new API handler
func NewHandler(
	repo *database.DomainRepository,
	verifier *dns.Verifier,
	caddyManager *caddy.Manager,
	worker *worker.VerificationWorker,
	cfg config.CaddyConfig,
	logger *zap.Logger,
) *Handler {
	return &Handler{
		repo:         repo,
		verifier:     verifier,
		caddyManager: caddyManager,
		worker:       worker,
		cfg:          cfg,
		logger:       logger,
	}
}

// CreateDomain handles POST /api/domains
func (h *Handler) CreateDomain(w http.ResponseWriter, r *http.Request) {
	var req models.CreateDomainRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.sendError(w, http.StatusBadRequest, "invalid_request", "Invalid request body")
		return
	}

	// Get tenant ID from context (set by auth middleware)
	tenantID := GetTenantID(r.Context())
	if tenantID == "" {
		h.sendError(w, http.StatusUnauthorized, "unauthorized", "Tenant ID not found")
		return
	}
	req.TenantID = tenantID

	// Validate domain
	if req.Domain == "" {
		h.sendError(w, http.StatusBadRequest, "invalid_domain", "Domain is required")
		return
	}

	// Normalize domain
	req.Domain = strings.ToLower(strings.TrimSpace(req.Domain))

	// Check if domain already exists
	existing, err := h.repo.GetByDomain(r.Context(), req.Domain)
	if err != nil {
		h.logger.Error("Failed to check existing domain", zap.Error(err))
		h.sendError(w, http.StatusInternalServerError, "internal_error", "Failed to create domain")
		return
	}
	if existing != nil {
		h.sendError(w, http.StatusConflict, "domain_exists", "Domain already exists")
		return
	}

	// Determine domain type
	domainType := req.Type
	if domainType == "" {
		// Auto-detect type based on base domain
		if strings.HasSuffix(req.Domain, "."+h.cfg.BaseDomain) {
			domainType = models.DomainTypeSubdomain
		} else {
			domainType = models.DomainTypeCustom
		}
	}

	// Create domain model
	domain := &models.Domain{
		TenantID: req.TenantID,
		Domain:   req.Domain,
		Type:     domainType,
	}

	var verificationInfo *models.VerificationInfo

	if domainType == models.DomainTypeSubdomain {
		// Subdomain: auto-verify (we own the parent domain)
		domain.Verified = true
		domain.SSLIssued = true // Wildcard cert handles this
	} else {
		// Custom domain: generate verification token
		domain.Verified = false
		domain.VerificationToken = h.verifier.GenerateToken()
		verificationInfo = h.verifier.GetVerificationInstructions(domain.Domain, domain.VerificationToken)
	}

	// Save to database
	if err := h.repo.Create(r.Context(), domain); err != nil {
		h.logger.Error("Failed to create domain", zap.Error(err))
		h.sendError(w, http.StatusInternalServerError, "internal_error", "Failed to create domain")
		return
	}

	// If subdomain, add to Caddy immediately
	if domain.Verified {
		if err := h.caddyManager.AddDomain(r.Context(), domain); err != nil {
			h.logger.Warn("Failed to add domain to Caddy", zap.Error(err))
		}
	}

	h.logger.Info("Domain created",
		zap.String("domain", domain.Domain),
		zap.String("type", string(domain.Type)),
		zap.Bool("verified", domain.Verified),
	)

	h.sendJSON(w, http.StatusCreated, models.CreateDomainResponse{
		Domain:           domain,
		VerificationInfo: verificationInfo,
	})
}

// ListDomains handles GET /api/domains
func (h *Handler) ListDomains(w http.ResponseWriter, r *http.Request) {
	tenantID := GetTenantID(r.Context())
	if tenantID == "" {
		h.sendError(w, http.StatusUnauthorized, "unauthorized", "Tenant ID not found")
		return
	}

	domains, err := h.repo.ListByTenant(r.Context(), tenantID)
	if err != nil {
		h.logger.Error("Failed to list domains", zap.Error(err))
		h.sendError(w, http.StatusInternalServerError, "internal_error", "Failed to list domains")
		return
	}

	h.sendJSON(w, http.StatusOK, models.DomainListResponse{
		Domains: domains,
		Total:   len(domains),
	})
}

// GetDomain handles GET /api/domains/{id}
func (h *Handler) GetDomain(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		h.sendError(w, http.StatusBadRequest, "invalid_id", "Domain ID is required")
		return
	}

	domain, err := h.repo.GetByID(r.Context(), id)
	if err != nil {
		h.logger.Error("Failed to get domain", zap.Error(err))
		h.sendError(w, http.StatusInternalServerError, "internal_error", "Failed to get domain")
		return
	}

	if domain == nil {
		h.sendError(w, http.StatusNotFound, "not_found", "Domain not found")
		return
	}

	// Verify tenant access
	tenantID := GetTenantID(r.Context())
	if domain.TenantID != tenantID {
		h.sendError(w, http.StatusForbidden, "forbidden", "Access denied")
		return
	}

	h.sendJSON(w, http.StatusOK, domain)
}

// DeleteDomain handles DELETE /api/domains/{id}
func (h *Handler) DeleteDomain(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		h.sendError(w, http.StatusBadRequest, "invalid_id", "Domain ID is required")
		return
	}

	// Get domain first to verify access
	domain, err := h.repo.GetByID(r.Context(), id)
	if err != nil {
		h.logger.Error("Failed to get domain", zap.Error(err))
		h.sendError(w, http.StatusInternalServerError, "internal_error", "Failed to delete domain")
		return
	}

	if domain == nil {
		h.sendError(w, http.StatusNotFound, "not_found", "Domain not found")
		return
	}

	// Verify tenant access
	tenantID := GetTenantID(r.Context())
	if domain.TenantID != tenantID {
		h.sendError(w, http.StatusForbidden, "forbidden", "Access denied")
		return
	}

	// Remove from Caddy first
	if domain.Verified {
		if err := h.caddyManager.RemoveDomain(r.Context(), id); err != nil {
			h.logger.Warn("Failed to remove domain from Caddy", zap.Error(err))
		}
	}

	// Delete from database
	if err := h.repo.Delete(r.Context(), id); err != nil {
		h.logger.Error("Failed to delete domain", zap.Error(err))
		h.sendError(w, http.StatusInternalServerError, "internal_error", "Failed to delete domain")
		return
	}

	h.logger.Info("Domain deleted", zap.String("domain", domain.Domain))

	w.WriteHeader(http.StatusNoContent)
}

// VerifyDomain handles POST /api/domains/{id}/verify
func (h *Handler) VerifyDomain(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		h.sendError(w, http.StatusBadRequest, "invalid_id", "Domain ID is required")
		return
	}

	// Get domain
	domain, err := h.repo.GetByID(r.Context(), id)
	if err != nil {
		h.logger.Error("Failed to get domain", zap.Error(err))
		h.sendError(w, http.StatusInternalServerError, "internal_error", "Failed to verify domain")
		return
	}

	if domain == nil {
		h.sendError(w, http.StatusNotFound, "not_found", "Domain not found")
		return
	}

	// Verify tenant access
	tenantID := GetTenantID(r.Context())
	if domain.TenantID != tenantID {
		h.sendError(w, http.StatusForbidden, "forbidden", "Access denied")
		return
	}

	if domain.Verified {
		h.sendJSON(w, http.StatusOK, models.VerifyDomainResponse{
			Verified: true,
			Message:  "Domain is already verified",
		})
		return
	}

	// Trigger verification
	verified, err := h.worker.VerifyNow(r.Context(), id)
	if err != nil {
		h.logger.Error("Verification failed", zap.Error(err))
		h.sendError(w, http.StatusInternalServerError, "verification_failed", "Failed to verify domain")
		return
	}

	if verified {
		h.sendJSON(w, http.StatusOK, models.VerifyDomainResponse{
			Verified: true,
			Message:  "Domain verified successfully",
		})
	} else {
		h.sendJSON(w, http.StatusOK, models.VerifyDomainResponse{
			Verified: false,
			Message:  "TXT record not found. Please add the DNS record and try again.",
		})
	}
}

// SetPrimaryDomain handles POST /api/domains/{id}/primary
func (h *Handler) SetPrimaryDomain(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		h.sendError(w, http.StatusBadRequest, "invalid_id", "Domain ID is required")
		return
	}

	tenantID := GetTenantID(r.Context())
	if tenantID == "" {
		h.sendError(w, http.StatusUnauthorized, "unauthorized", "Tenant ID not found")
		return
	}

	// Get domain to verify it exists and belongs to tenant
	domain, err := h.repo.GetByID(r.Context(), id)
	if err != nil {
		h.logger.Error("Failed to get domain", zap.Error(err))
		h.sendError(w, http.StatusInternalServerError, "internal_error", "Failed to set primary domain")
		return
	}

	if domain == nil {
		h.sendError(w, http.StatusNotFound, "not_found", "Domain not found")
		return
	}

	if domain.TenantID != tenantID {
		h.sendError(w, http.StatusForbidden, "forbidden", "Access denied")
		return
	}

	if !domain.Verified {
		h.sendError(w, http.StatusBadRequest, "not_verified", "Domain must be verified before setting as primary")
		return
	}

	if err := h.repo.SetPrimary(r.Context(), tenantID, id); err != nil {
		h.logger.Error("Failed to set primary domain", zap.Error(err))
		h.sendError(w, http.StatusInternalServerError, "internal_error", "Failed to set primary domain")
		return
	}

	h.logger.Info("Primary domain updated",
		zap.String("domain", domain.Domain),
		zap.String("tenant_id", tenantID),
	)

	h.sendJSON(w, http.StatusOK, map[string]string{
		"message": "Primary domain updated successfully",
	})
}

// Health handles GET /health
func (h *Handler) Health(w http.ResponseWriter, r *http.Request) {
	h.sendJSON(w, http.StatusOK, map[string]interface{}{
		"status":  "healthy",
		"routes":  h.caddyManager.GetRouteCount(),
		"service": "domain-gateway",
	})
}

func (h *Handler) sendJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func (h *Handler) sendError(w http.ResponseWriter, status int, code, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(models.ErrorResponse{
		Error: message,
		Code:  code,
	})
}
