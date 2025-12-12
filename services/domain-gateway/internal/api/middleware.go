package api

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.uber.org/zap"

	"github.com/panaroid/domain-gateway/internal/config"
)

// Claims represents JWT claims
type Claims struct {
	TenantID string `json:"tenant_id"`
	UserID   string `json:"user_id"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

// contextKey is a custom type for context keys
type contextKey string

const (
	ContextKeyTenantID contextKey = "tenant_id"
	ContextKeyUserID   contextKey = "user_id"
	ContextKeyRole     contextKey = "role"
)

// Middleware provides HTTP middleware functions
type Middleware struct {
	jwtConfig config.JWTConfig
	logger    *zap.Logger
}

// NewMiddleware creates a new middleware instance
func NewMiddleware(jwtConfig config.JWTConfig, logger *zap.Logger) *Middleware {
	return &Middleware{
		jwtConfig: jwtConfig,
		logger:    logger,
	}
}

// Logging logs HTTP requests
func (m *Middleware) Logging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Wrap response writer to capture status code
		wrapped := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}

		next.ServeHTTP(wrapped, r)

		m.logger.Info("HTTP request",
			zap.String("method", r.Method),
			zap.String("path", r.URL.Path),
			zap.Int("status", wrapped.statusCode),
			zap.Duration("duration", time.Since(start)),
			zap.String("remote_addr", r.RemoteAddr),
		)
	})
}

// responseWriter wraps http.ResponseWriter to capture status code
type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

// Auth validates JWT tokens
func (m *Middleware) Auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get token from Authorization header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			m.sendError(w, http.StatusUnauthorized, "missing_token", "Authorization header required")
			return
		}

		// Extract Bearer token
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			m.sendError(w, http.StatusUnauthorized, "invalid_token_format", "Invalid authorization header format")
			return
		}

		tokenString := parts[1]

		// Parse and validate token
		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(m.jwtConfig.Secret), nil
		})

		if err != nil {
			m.logger.Debug("Token validation failed", zap.Error(err))
			m.sendError(w, http.StatusUnauthorized, "invalid_token", "Invalid or expired token")
			return
		}

		if !token.Valid {
			m.sendError(w, http.StatusUnauthorized, "invalid_token", "Token is not valid")
			return
		}

		// Add claims to context
		ctx := context.WithValue(r.Context(), ContextKeyTenantID, claims.TenantID)
		ctx = context.WithValue(ctx, ContextKeyUserID, claims.UserID)
		ctx = context.WithValue(ctx, ContextKeyRole, claims.Role)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// AdminOnly restricts access to admin users
func (m *Middleware) AdminOnly(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		role, ok := r.Context().Value(ContextKeyRole).(string)
		if !ok || role != "admin" {
			m.sendError(w, http.StatusForbidden, "forbidden", "Admin access required")
			return
		}
		next.ServeHTTP(w, r)
	})
}

// CORS handles CORS headers
func (m *Middleware) CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// Recovery recovers from panics
func (m *Middleware) Recovery(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				m.logger.Error("Panic recovered",
					zap.Any("error", err),
					zap.String("path", r.URL.Path),
				)
				m.sendError(w, http.StatusInternalServerError, "internal_error", "An internal error occurred")
			}
		}()
		next.ServeHTTP(w, r)
	})
}

func (m *Middleware) sendError(w http.ResponseWriter, status int, code, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{
		"error": message,
		"code":  code,
	})
}

// GetTenantID extracts tenant ID from context
func GetTenantID(ctx context.Context) string {
	if id, ok := ctx.Value(ContextKeyTenantID).(string); ok {
		return id
	}
	return ""
}

// GetUserID extracts user ID from context
func GetUserID(ctx context.Context) string {
	if id, ok := ctx.Value(ContextKeyUserID).(string); ok {
		return id
	}
	return ""
}
