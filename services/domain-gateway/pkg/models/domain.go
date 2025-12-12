package models

import (
	"time"
)

// DomainType represents the type of domain
type DomainType string

const (
	DomainTypeSubdomain DomainType = "subdomain"
	DomainTypeCustom    DomainType = "custom"
)

// Domain represents a domain record in the database
type Domain struct {
	ID                string     `json:"id"`
	TenantID          string     `json:"tenant_id"`
	Domain            string     `json:"domain"`
	Type              DomainType `json:"type"`
	Verified          bool       `json:"verified"`
	VerificationToken string     `json:"verification_token,omitempty"`
	IsPrimary         bool       `json:"is_primary"`
	SSLIssued         bool       `json:"ssl_issued"`
	RedirectURL       string     `json:"redirect_url,omitempty"`
	Archived          bool       `json:"archived"`
	CreatedAt         time.Time  `json:"created_at"`
	UpdatedAt         time.Time  `json:"updated_at"`
	VerifiedAt        *time.Time `json:"verified_at,omitempty"`
}

// CreateDomainRequest is the request body for creating a domain
type CreateDomainRequest struct {
	Domain   string     `json:"domain"`
	Type     DomainType `json:"type"`
	TenantID string     `json:"tenant_id"`
}

// UpdateDomainRequest is the request body for updating a domain
type UpdateDomainRequest struct {
	RedirectURL *string `json:"redirect_url,omitempty"`
	Archived    *bool   `json:"archived,omitempty"`
}

// CreateDomainResponse is the response after creating a domain
type CreateDomainResponse struct {
	Domain           *Domain           `json:"domain"`
	VerificationInfo *VerificationInfo `json:"verification_info,omitempty"`
}

// VerificationInfo contains DNS verification instructions
type VerificationInfo struct {
	RecordType   string `json:"record_type"`
	RecordName   string `json:"record_name"`
	RecordValue  string `json:"record_value"`
	Instructions string `json:"instructions"`
}

// DomainListResponse is the response for listing domains
type DomainListResponse struct {
	Domains []Domain `json:"domains"`
	Total   int      `json:"total"`
}

// VerifyDomainResponse is the response for domain verification
type VerifyDomainResponse struct {
	Verified bool   `json:"verified"`
	Message  string `json:"message"`
}

// ErrorResponse represents an API error
type ErrorResponse struct {
	Error   string `json:"error"`
	Code    string `json:"code,omitempty"`
	Details string `json:"details,omitempty"`
}

// ProxyTarget represents a backend target for proxying
type ProxyTarget struct {
	TenantID string `json:"tenant_id"`
	Host     string `json:"host"`
	Port     int    `json:"port"`
}
