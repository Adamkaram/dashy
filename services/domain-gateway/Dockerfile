# Build stage
FROM golang:1.22-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git ca-certificates tzdata

# Set working directory
WORKDIR /app

# Copy go mod files
COPY go.mod go.sum* ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-w -s" \
    -o /gateway \
    ./cmd/gateway

# Final stage
FROM alpine:3.19

# Install runtime dependencies
RUN apk add --no-cache ca-certificates tzdata

# Create non-root user
RUN adduser -D -g '' appuser

# Create directories
RUN mkdir -p /data/caddy && chown -R appuser:appuser /data

# Copy binary from builder
COPY --from=builder /gateway /gateway

# Use non-root user
USER appuser

# Expose ports
# 80 - HTTP
# 443 - HTTPS  
# 8080 - API
EXPOSE 80 443 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Set environment defaults
ENV GATEWAY_SERVER_ENVIRONMENT=production
ENV GATEWAY_CADDY_STORAGE_PATH=/data/caddy

# Run the binary
ENTRYPOINT ["/gateway"]
