package dns

import (
	"context"
	"fmt"
	"net"
	"strings"
	"time"

	"go.uber.org/zap"

	"github.com/panaroid/domain-gateway/pkg/models"
)

// Verifier handles DNS verification for custom domains
type Verifier struct {
	logger      *zap.Logger
	cnameTarget string
}

// NewVerifier creates a new DNS verifier
func NewVerifier(logger *zap.Logger) *Verifier {
	return &Verifier{
		logger:      logger,
		cnameTarget: "cname.panaroid.com",
	}
}

// GenerateToken generates a unique verification token (kept for backward compatibility)
func (v *Verifier) GenerateToken() string {
	return fmt.Sprintf("panaroid-verify-%d", time.Now().UnixNano())
}

// GetVerificationInstructions returns instructions for DNS verification
func (v *Verifier) GetVerificationInstructions(domain, token string) *models.VerificationInfo {
	parts := strings.Split(domain, ".")
	recordName := "www"
	if len(parts) > 2 {
		// Subdomain like shop.example.com → record name is "shop"
		recordName = parts[0]
	}

	return &models.VerificationInfo{
		RecordType:  "CNAME",
		RecordName:  recordName,
		RecordValue: v.cnameTarget,
		Instructions: fmt.Sprintf(
			"أضف سجل CNAME إلى DNS الخاص بنطاقك:\n\nاسم السجل: %s\nالنوع: CNAME\nالقيمة: %s\n\nقد يستغرق التحقق حتى 24 ساعة.",
			recordName,
			v.cnameTarget,
		),
	}
}

// Verify checks if the CNAME record points to our target
func (v *Verifier) Verify(ctx context.Context, domain *models.Domain) (bool, error) {
	// For CNAME verification, we check if the domain resolves to our CNAME target
	lookupName := domain.Domain

	// If it's a root domain (like example.com), check www subdomain
	parts := strings.Split(domain.Domain, ".")
	if len(parts) == 2 {
		lookupName = "www." + domain.Domain
	}

	v.logger.Debug("Looking up CNAME record",
		zap.String("domain", domain.Domain),
		zap.String("lookup", lookupName),
	)

	cname, err := net.LookupCNAME(lookupName)
	if err != nil {
		if dnsErr, ok := err.(*net.DNSError); ok && dnsErr.IsNotFound {
			v.logger.Debug("CNAME record not found", zap.String("domain", domain.Domain))
			return false, nil
		}
		v.logger.Warn("DNS lookup error",
			zap.String("domain", domain.Domain),
			zap.Error(err),
		)
		return false, nil
	}

	// Normalize CNAME (remove trailing dot)
	cname = strings.TrimSuffix(cname, ".")
	target := strings.TrimSuffix(v.cnameTarget, ".")

	if strings.EqualFold(cname, target) {
		v.logger.Info("Domain verification successful",
			zap.String("domain", domain.Domain),
			zap.String("cname", cname),
		)
		return true, nil
	}

	v.logger.Debug("CNAME does not match target",
		zap.String("domain", domain.Domain),
		zap.String("found", cname),
		zap.String("expected", target),
	)
	return false, nil
}

// VerifyWithRetry attempts verification with retry logic
func (v *Verifier) VerifyWithRetry(ctx context.Context, domain *models.Domain, maxRetries int) (bool, error) {
	for i := 0; i < maxRetries; i++ {
		select {
		case <-ctx.Done():
			return false, ctx.Err()
		default:
		}

		verified, err := v.Verify(ctx, domain)
		if err != nil {
			return false, err
		}
		if verified {
			return true, nil
		}

		if i < maxRetries-1 {
			delay := time.Duration(1<<uint(i)) * time.Second
			if delay > 30*time.Second {
				delay = 30 * time.Second
			}
			time.Sleep(delay)
		}
	}

	return false, nil
}
