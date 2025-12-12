package database

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/panaroid/domain-gateway/pkg/models"
)

// DomainRepository handles domain database operations
type DomainRepository struct {
	db *DB
}

// NewDomainRepository creates a new domain repository
func NewDomainRepository(db *DB) *DomainRepository {
	return &DomainRepository{db: db}
}

// Create creates a new domain
func (r *DomainRepository) Create(ctx context.Context, domain *models.Domain) error {
	if domain.ID == "" {
		domain.ID = uuid.New().String()
	}
	domain.CreatedAt = time.Now().UTC()
	domain.UpdatedAt = time.Now().UTC()

	query := `
		INSERT INTO domains (id, tenant_id, domain, type, verified, verification_token, is_primary, ssl_issued, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id
	`

	err := r.db.QueryRowContext(ctx, query,
		domain.ID,
		domain.TenantID,
		domain.Domain,
		domain.Type,
		domain.Verified,
		domain.VerificationToken,
		domain.IsPrimary,
		domain.SSLIssued,
		domain.CreatedAt,
		domain.UpdatedAt,
	).Scan(&domain.ID)

	if err != nil {
		return fmt.Errorf("failed to create domain: %w", err)
	}

	return nil
}

// GetByID retrieves a domain by ID
func (r *DomainRepository) GetByID(ctx context.Context, id string) (*models.Domain, error) {
	query := `
		SELECT id, tenant_id, domain, type, verified, verification_token, is_primary, ssl_issued, created_at, updated_at, verified_at
		FROM domains
		WHERE id = $1
	`

	domain := &models.Domain{}
	var verifiedAt sql.NullTime
	var verificationToken sql.NullString

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&domain.ID,
		&domain.TenantID,
		&domain.Domain,
		&domain.Type,
		&domain.Verified,
		&verificationToken,
		&domain.IsPrimary,
		&domain.SSLIssued,
		&domain.CreatedAt,
		&domain.UpdatedAt,
		&verifiedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get domain: %w", err)
	}

	if verifiedAt.Valid {
		domain.VerifiedAt = &verifiedAt.Time
	}
	if verificationToken.Valid {
		domain.VerificationToken = verificationToken.String
	}

	return domain, nil
}

// GetByDomain retrieves a domain by domain name
func (r *DomainRepository) GetByDomain(ctx context.Context, domainName string) (*models.Domain, error) {
	query := `
		SELECT id, tenant_id, domain, type, verified, verification_token, is_primary, ssl_issued, created_at, updated_at, verified_at
		FROM domains
		WHERE domain = $1
	`

	domain := &models.Domain{}
	var verifiedAt sql.NullTime
	var verificationToken sql.NullString

	err := r.db.QueryRowContext(ctx, query, domainName).Scan(
		&domain.ID,
		&domain.TenantID,
		&domain.Domain,
		&domain.Type,
		&domain.Verified,
		&verificationToken,
		&domain.IsPrimary,
		&domain.SSLIssued,
		&domain.CreatedAt,
		&domain.UpdatedAt,
		&verifiedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get domain: %w", err)
	}

	if verifiedAt.Valid {
		domain.VerifiedAt = &verifiedAt.Time
	}
	if verificationToken.Valid {
		domain.VerificationToken = verificationToken.String
	}

	return domain, nil
}

// ListByTenant retrieves all domains for a tenant
func (r *DomainRepository) ListByTenant(ctx context.Context, tenantID string) ([]models.Domain, error) {
	query := `
		SELECT id, tenant_id, domain, type, verified, verification_token, is_primary, ssl_issued, created_at, updated_at, verified_at
		FROM domains
		WHERE tenant_id = $1
		ORDER BY created_at DESC
	`

	rows, err := r.db.QueryContext(ctx, query, tenantID)
	if err != nil {
		return nil, fmt.Errorf("failed to list domains: %w", err)
	}
	defer rows.Close()

	var domains []models.Domain
	for rows.Next() {
		var domain models.Domain
		var verifiedAt sql.NullTime
		var verificationToken sql.NullString

		if err := rows.Scan(
			&domain.ID,
			&domain.TenantID,
			&domain.Domain,
			&domain.Type,
			&domain.Verified,
			&verificationToken,
			&domain.IsPrimary,
			&domain.SSLIssued,
			&domain.CreatedAt,
			&domain.UpdatedAt,
			&verifiedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan domain: %w", err)
		}

		if verifiedAt.Valid {
			domain.VerifiedAt = &verifiedAt.Time
		}
		if verificationToken.Valid {
			domain.VerificationToken = verificationToken.String
		}

		domains = append(domains, domain)
	}

	return domains, nil
}

// GetPendingVerification retrieves all domains pending verification
func (r *DomainRepository) GetPendingVerification(ctx context.Context) ([]models.Domain, error) {
	query := `
		SELECT id, tenant_id, domain, type, verified, verification_token, is_primary, ssl_issued, created_at, updated_at, verified_at
		FROM domains
		WHERE verified = FALSE AND type = 'custom'
		ORDER BY created_at ASC
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to list pending domains: %w", err)
	}
	defer rows.Close()

	var domains []models.Domain
	for rows.Next() {
		var domain models.Domain
		var verifiedAt sql.NullTime
		var verificationToken sql.NullString

		if err := rows.Scan(
			&domain.ID,
			&domain.TenantID,
			&domain.Domain,
			&domain.Type,
			&domain.Verified,
			&verificationToken,
			&domain.IsPrimary,
			&domain.SSLIssued,
			&domain.CreatedAt,
			&domain.UpdatedAt,
			&verifiedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan domain: %w", err)
		}

		if verifiedAt.Valid {
			domain.VerifiedAt = &verifiedAt.Time
		}
		if verificationToken.Valid {
			domain.VerificationToken = verificationToken.String
		}

		domains = append(domains, domain)
	}

	return domains, nil
}

// GetAllVerified retrieves all verified domains
func (r *DomainRepository) GetAllVerified(ctx context.Context) ([]models.Domain, error) {
	query := `
		SELECT id, tenant_id, domain, type, verified, verification_token, is_primary, ssl_issued, created_at, updated_at, verified_at
		FROM domains
		WHERE verified = TRUE
		ORDER BY domain ASC
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to list verified domains: %w", err)
	}
	defer rows.Close()

	var domains []models.Domain
	for rows.Next() {
		var domain models.Domain
		var verifiedAt sql.NullTime
		var verificationToken sql.NullString

		if err := rows.Scan(
			&domain.ID,
			&domain.TenantID,
			&domain.Domain,
			&domain.Type,
			&domain.Verified,
			&verificationToken,
			&domain.IsPrimary,
			&domain.SSLIssued,
			&domain.CreatedAt,
			&domain.UpdatedAt,
			&verifiedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan domain: %w", err)
		}

		if verifiedAt.Valid {
			domain.VerifiedAt = &verifiedAt.Time
		}
		if verificationToken.Valid {
			domain.VerificationToken = verificationToken.String
		}

		domains = append(domains, domain)
	}

	return domains, nil
}

// MarkVerified marks a domain as verified
func (r *DomainRepository) MarkVerified(ctx context.Context, id string) error {
	now := time.Now().UTC()
	query := `
		UPDATE domains
		SET verified = TRUE, verified_at = $2, updated_at = $3
		WHERE id = $1
	`

	result, err := r.db.ExecContext(ctx, query, id, now, now)
	if err != nil {
		return fmt.Errorf("failed to mark domain verified: %w", err)
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		return fmt.Errorf("domain not found")
	}

	return nil
}

// MarkSSLIssued marks a domain as having SSL issued
func (r *DomainRepository) MarkSSLIssued(ctx context.Context, id string) error {
	query := `
		UPDATE domains
		SET ssl_issued = TRUE, updated_at = $2
		WHERE id = $1
	`

	result, err := r.db.ExecContext(ctx, query, id, time.Now().UTC())
	if err != nil {
		return fmt.Errorf("failed to mark SSL issued: %w", err)
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		return fmt.Errorf("domain not found")
	}

	return nil
}

// Delete deletes a domain
func (r *DomainRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM domains WHERE id = $1`

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete domain: %w", err)
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		return fmt.Errorf("domain not found")
	}

	return nil
}

// Update updates a domain
func (r *DomainRepository) Update(ctx context.Context, domain *models.Domain) error {
	domain.UpdatedAt = time.Now().UTC()

	query := `
		UPDATE domains
		SET redirect_url = $2, archived = $3, updated_at = $4
		WHERE id = $1
	`

	result, err := r.db.ExecContext(ctx, query,
		domain.ID,
		domain.RedirectURL,
		domain.Archived,
		domain.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("failed to update domain: %w", err)
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		return fmt.Errorf("domain not found")
	}

	return nil
}

// SetPrimary sets a domain as primary for a tenant
func (r *DomainRepository) SetPrimary(ctx context.Context, tenantID, domainID string) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	// Unset all primary domains for tenant
	_, err = tx.ExecContext(ctx, `UPDATE domains SET is_primary = FALSE WHERE tenant_id = $1`, tenantID)
	if err != nil {
		return fmt.Errorf("failed to unset primary domains: %w", err)
	}

	// Set the new primary domain
	_, err = tx.ExecContext(ctx, `UPDATE domains SET is_primary = TRUE WHERE id = $1 AND tenant_id = $2`, domainID, tenantID)
	if err != nil {
		return fmt.Errorf("failed to set primary domain: %w", err)
	}

	return tx.Commit()
}
