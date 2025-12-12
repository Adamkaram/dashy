package api

import (
	"net/http"

	"go.uber.org/zap"

	"github.com/panaroid/domain-gateway/internal/config"
)

// Router sets up API routes
type Router struct {
	handler    *Handler
	middleware *Middleware
	logger     *zap.Logger
}

// NewRouter creates a new router
func NewRouter(handler *Handler, middleware *Middleware, logger *zap.Logger) *Router {
	return &Router{
		handler:    handler,
		middleware: middleware,
		logger:     logger,
	}
}

// Setup sets up all routes and returns the HTTP handler
func (r *Router) Setup() http.Handler {
	mux := http.NewServeMux()

	// Health check (no auth)
	mux.HandleFunc("GET /health", r.handler.Health)
	mux.HandleFunc("GET /", func(w http.ResponseWriter, req *http.Request) {
		if req.URL.Path == "/" {
			r.handler.Health(w, req)
			return
		}
		http.NotFound(w, req)
	})

	// Protected API routes
	mux.HandleFunc("POST /api/domains", r.withAuth(r.handler.CreateDomain))
	mux.HandleFunc("GET /api/domains", r.withAuth(r.handler.ListDomains))
	mux.HandleFunc("GET /api/domains/{id}", r.withAuth(r.handler.GetDomain))
	mux.HandleFunc("DELETE /api/domains/{id}", r.withAuth(r.handler.DeleteDomain))
	mux.HandleFunc("POST /api/domains/{id}/verify", r.withAuth(r.handler.VerifyDomain))
	mux.HandleFunc("POST /api/domains/{id}/primary", r.withAuth(r.handler.SetPrimaryDomain))

	// Apply global middleware
	handler := r.middleware.Recovery(mux)
	handler = r.middleware.Logging(handler)
	handler = r.middleware.CORS(handler)

	return handler
}

// withAuth wraps a handler with authentication middleware
func (r *Router) withAuth(fn http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		r.middleware.Auth(http.HandlerFunc(fn)).ServeHTTP(w, req)
	}
}

// SetupCaddyRoutes creates the initial Caddy configuration
func SetupCaddyRoutes(cfg config.CaddyConfig) {
	// This is handled by the CaddyManager now
}
