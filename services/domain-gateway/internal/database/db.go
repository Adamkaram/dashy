package database

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/panaroid/domain-gateway/internal/config"
)

// DB wraps the database connection
type DB struct {
	*sql.DB
	logger *zap.Logger
}

// New creates a new database connection
func New(cfg config.DatabaseConfig, logger *zap.Logger) (*DB, error) {
	db, err := sql.Open("postgres", cfg.URL)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Configure connection pool
	db.SetMaxOpenConns(cfg.MaxOpenConns)
	db.SetMaxIdleConns(cfg.MaxIdleConns)
	db.SetConnMaxLifetime(cfg.ConnMaxLifetime)

	// Test connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	logger.Info("Database connection established")

	return &DB{DB: db, logger: logger}, nil
}

// Close closes the database connection
func (db *DB) Close() error {
	return db.DB.Close()
}

// RunMigrations runs database migrations
func (db *DB) RunMigrations() error {
	migrations := []string{
		`CREATE TABLE IF NOT EXISTS domains (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			tenant_id UUID NOT NULL,
			domain VARCHAR(255) NOT NULL UNIQUE,
			type VARCHAR(50) NOT NULL CHECK (type IN ('subdomain', 'custom')),
			verified BOOLEAN DEFAULT FALSE,
			verification_token VARCHAR(255),
			is_primary BOOLEAN DEFAULT FALSE,
			ssl_issued BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMPTZ DEFAULT NOW(),
			updated_at TIMESTAMPTZ DEFAULT NOW(),
			verified_at TIMESTAMPTZ,
			CONSTRAINT unique_tenant_domain UNIQUE (tenant_id, domain)
		)`,
		`CREATE INDEX IF NOT EXISTS idx_domains_tenant ON domains(tenant_id)`,
		`CREATE INDEX IF NOT EXISTS idx_domains_verified ON domains(verified)`,
		`CREATE INDEX IF NOT EXISTS idx_domains_type ON domains(type)`,
	}

	for _, migration := range migrations {
		if _, err := db.Exec(migration); err != nil {
			return fmt.Errorf("migration failed: %w", err)
		}
	}

	db.logger.Info("Database migrations completed")
	return nil
}

// UpdateTimestamp updates the updated_at timestamp
func UpdateTimestamp() time.Time {
	return time.Now().UTC()
}
