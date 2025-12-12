package worker

import (
	"context"
	"sync"
	"time"

	"go.uber.org/zap"

	"github.com/panaroid/domain-gateway/internal/caddy"
	"github.com/panaroid/domain-gateway/internal/database"
	"github.com/panaroid/domain-gateway/internal/dns"
	"github.com/panaroid/domain-gateway/pkg/models"
)

// VerificationWorker periodically checks pending domain verifications
type VerificationWorker struct {
	repo         *database.DomainRepository
	verifier     *dns.Verifier
	caddyManager *caddy.Manager
	logger       *zap.Logger
	interval     time.Duration
	maxRetries   int
	stopCh       chan struct{}
	wg           sync.WaitGroup
}

// NewVerificationWorker creates a new verification worker
func NewVerificationWorker(
	repo *database.DomainRepository,
	verifier *dns.Verifier,
	caddyManager *caddy.Manager,
	logger *zap.Logger,
	interval time.Duration,
	maxRetries int,
) *VerificationWorker {
	return &VerificationWorker{
		repo:         repo,
		verifier:     verifier,
		caddyManager: caddyManager,
		logger:       logger,
		interval:     interval,
		maxRetries:   maxRetries,
		stopCh:       make(chan struct{}),
	}
}

// Start starts the verification worker
func (w *VerificationWorker) Start(ctx context.Context) {
	w.wg.Add(1)
	go w.run(ctx)
	w.logger.Info("Verification worker started", zap.Duration("interval", w.interval))
}

// Stop stops the verification worker
func (w *VerificationWorker) Stop() {
	close(w.stopCh)
	w.wg.Wait()
	w.logger.Info("Verification worker stopped")
}

func (w *VerificationWorker) run(ctx context.Context) {
	defer w.wg.Done()

	ticker := time.NewTicker(w.interval)
	defer ticker.Stop()

	// Run immediately on start
	w.checkPendingDomains(ctx)

	for {
		select {
		case <-ctx.Done():
			return
		case <-w.stopCh:
			return
		case <-ticker.C:
			w.checkPendingDomains(ctx)
		}
	}
}

func (w *VerificationWorker) checkPendingDomains(ctx context.Context) {
	w.logger.Debug("Checking pending domain verifications")

	domains, err := w.repo.GetPendingVerification(ctx)
	if err != nil {
		w.logger.Error("Failed to get pending domains", zap.Error(err))
		return
	}

	if len(domains) == 0 {
		w.logger.Debug("No pending domains to verify")
		return
	}

	w.logger.Info("Found pending domains", zap.Int("count", len(domains)))

	for _, domain := range domains {
		w.processDomain(ctx, &domain)
	}
}

func (w *VerificationWorker) processDomain(ctx context.Context, domain *models.Domain) {
	logger := w.logger.With(
		zap.String("domain", domain.Domain),
		zap.String("domain_id", domain.ID),
	)

	// Verify DNS record
	verified, err := w.verifier.Verify(ctx, domain)
	if err != nil {
		logger.Error("Verification failed", zap.Error(err))
		return
	}

	if !verified {
		logger.Debug("Domain not yet verified")
		return
	}

	// Mark as verified in database
	if err := w.repo.MarkVerified(ctx, domain.ID); err != nil {
		logger.Error("Failed to mark domain as verified", zap.Error(err))
		return
	}

	// Add route to Caddy
	domain.Verified = true
	if err := w.caddyManager.AddDomain(ctx, domain); err != nil {
		logger.Error("Failed to add domain to Caddy", zap.Error(err))
		return
	}

	// Mark SSL as issued (Caddy will handle cert automatically)
	if err := w.repo.MarkSSLIssued(ctx, domain.ID); err != nil {
		logger.Warn("Failed to mark SSL as issued", zap.Error(err))
	}

	logger.Info("Domain verified and activated successfully")
}

// VerifyNow triggers immediate verification for a specific domain
func (w *VerificationWorker) VerifyNow(ctx context.Context, domainID string) (bool, error) {
	domain, err := w.repo.GetByID(ctx, domainID)
	if err != nil {
		return false, err
	}
	if domain == nil {
		return false, nil
	}

	verified, err := w.verifier.Verify(ctx, domain)
	if err != nil {
		return false, err
	}

	if verified {
		w.processDomain(ctx, domain)
	}

	return verified, nil
}
