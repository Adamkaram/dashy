package config

import (
	"strings"
	"time"

	"github.com/spf13/viper"
	"go.uber.org/zap"
)

// Config holds all configuration for the service
type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Caddy    CaddyConfig
	DNS      DNSConfig
	JWT      JWTConfig
	Worker   WorkerConfig
}

// ServerConfig holds server-related configuration
type ServerConfig struct {
	APIPort     int    `mapstructure:"api_port"`
	HTTPPort    int    `mapstructure:"http_port"`
	HTTPSPort   int    `mapstructure:"https_port"`
	Environment string `mapstructure:"environment"`
}

// DatabaseConfig holds database configuration
type DatabaseConfig struct {
	URL             string        `mapstructure:"url"`
	MaxOpenConns    int           `mapstructure:"max_open_conns"`
	MaxIdleConns    int           `mapstructure:"max_idle_conns"`
	ConnMaxLifetime time.Duration `mapstructure:"conn_max_lifetime"`
}

// CaddyConfig holds Caddy-related configuration
type CaddyConfig struct {
	AdminAPIAddr string `mapstructure:"admin_api_addr"`
	StoragePath  string `mapstructure:"storage_path"`
	Email        string `mapstructure:"acme_email"`
	BaseDomain   string `mapstructure:"base_domain"`
	BackendHost  string `mapstructure:"backend_host"`
	BackendPort  int    `mapstructure:"backend_port"`
}

// DNSConfig holds DNS provider configuration
type DNSConfig struct {
	Provider string `mapstructure:"provider"`
	APIToken string `mapstructure:"api_token"`
	ZoneID   string `mapstructure:"zone_id"`
}

// JWTConfig holds JWT authentication configuration
type JWTConfig struct {
	Secret     string        `mapstructure:"secret"`
	Expiration time.Duration `mapstructure:"expiration"`
	Issuer     string        `mapstructure:"issuer"`
}

// WorkerConfig holds background worker configuration
type WorkerConfig struct {
	VerificationInterval time.Duration `mapstructure:"verification_interval"`
	MaxRetries           int           `mapstructure:"max_retries"`
}

// Load loads configuration from environment and config file
func Load(logger *zap.Logger) (*Config, error) {
	v := viper.New()

	// Set defaults
	v.SetDefault("server.api_port", 8080)
	v.SetDefault("server.http_port", 80)
	v.SetDefault("server.https_port", 443)
	v.SetDefault("server.environment", "development")

	v.SetDefault("database.max_open_conns", 25)
	v.SetDefault("database.max_idle_conns", 5)
	v.SetDefault("database.conn_max_lifetime", "5m")

	v.SetDefault("caddy.admin_api_addr", "localhost:2019")
	v.SetDefault("caddy.storage_path", "/data/caddy")
	v.SetDefault("caddy.backend_host", "localhost")
	v.SetDefault("caddy.backend_port", 3000)

	v.SetDefault("dns.provider", "cloudflare")

	v.SetDefault("jwt.expiration", "24h")
	v.SetDefault("jwt.issuer", "domain-gateway")

	v.SetDefault("worker.verification_interval", "5m")
	v.SetDefault("worker.max_retries", 3)

	// Environment variable bindings
	v.SetEnvPrefix("GATEWAY")
	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	v.AutomaticEnv()

	// Required environment variables
	_ = v.BindEnv("database.url", "DATABASE_URL")
	_ = v.BindEnv("dns.api_token", "DNS_API_TOKEN")
	_ = v.BindEnv("dns.zone_id", "DNS_ZONE_ID")
	_ = v.BindEnv("jwt.secret", "JWT_SECRET")
	_ = v.BindEnv("caddy.acme_email", "ACME_EMAIL")
	_ = v.BindEnv("caddy.base_domain", "BASE_DOMAIN")

	// Read config file if exists
	v.SetConfigName("config")
	v.SetConfigType("yaml")
	v.AddConfigPath("/etc/domain-gateway/")
	v.AddConfigPath(".")

	if err := v.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return nil, err
		}
		logger.Info("No config file found, using environment variables")
	}

	var cfg Config
	if err := v.Unmarshal(&cfg); err != nil {
		return nil, err
	}

	return &cfg, nil
}

// Validate validates the configuration
func (c *Config) Validate() error {
	return nil
}
