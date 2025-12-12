# Domain Gateway Service

خدمة إدارة النطاقات وشهادات SSL لتطبيق Multi-tenant SaaS.

## 🎯 المميزات

- ✅ إدارة Subdomains تلقائياً (`*.panaroid.app`)
- ✅ Custom Domains مع التحقق عبر TXT Record
- ✅ شهادات SSL من Let's Encrypt (أوتوماتيك)
- ✅ Reverse Proxy للخدمات الخلفية
- ✅ JWT Authentication
- ✅ Background Worker للتحقق من DNS

## 🚀 التشغيل السريع

### متطلبات
- Go 1.22+
- Docker & Docker Compose
- PostgreSQL/Supabase
- Cloudflare account (للـ DNS-01 Challenge)

### التطوير المحلي

```bash
# نسخ ملف الإعدادات
cp .env.example .env

# تعديل الإعدادات
vim .env

# تشغيل الخدمة
docker-compose up -d
```

### بناء يدوي

```bash
# تحميل الـ dependencies
go mod download

# بناء
go build -o gateway ./cmd/gateway

# تشغيل
./gateway
```

## ⚙️ Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `DNS_API_TOKEN` | Cloudflare API Token | ✅ |
| `DNS_ZONE_ID` | Cloudflare Zone ID | ✅ |
| `JWT_SECRET` | JWT signing secret | ✅ |
| `ACME_EMAIL` | Email for Let's Encrypt | ✅ |
| `BASE_DOMAIN` | Base domain (e.g., panaroid.app) | ✅ |
| `GATEWAY_CADDY_BACKEND_HOST` | Backend host | ❌ (default: localhost) |
| `GATEWAY_CADDY_BACKEND_PORT` | Backend port | ❌ (default: 3000) |

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Create Domain
```
POST /api/domains
Authorization: Bearer <token>

{
  "domain": "shop.example.com"
}
```

### List Domains
```
GET /api/domains
Authorization: Bearer <token>
```

### Verify Domain
```
POST /api/domains/{id}/verify
Authorization: Bearer <token>
```

### Delete Domain
```
DELETE /api/domains/{id}
Authorization: Bearer <token>
```

### Set Primary Domain
```
POST /api/domains/{id}/primary
Authorization: Bearer <token>
```

## 🔐 التحقق من النطاقات

### Subdomains
يتم التحقق تلقائياً لأننا نملك الـ base domain.

### Custom Domains
1. استدعِ `POST /api/domains` مع النطاق
2. ستحصل على تعليمات إضافة TXT record
3. أضف السجل في DNS الخاص بك
4. استدعِ `POST /api/domains/{id}/verify` أو انتظر التحقق التلقائي (كل 5 دقائق)

## 📁 هيكل المشروع

```
services/domain-gateway/
├── cmd/gateway/          # Entry point
├── internal/
│   ├── api/              # HTTP handlers & middleware
│   ├── caddy/            # Caddy configuration manager
│   ├── config/           # Configuration (Viper)
│   ├── database/         # Database layer
│   ├── dns/              # DNS verification
│   └── worker/           # Background worker
├── pkg/models/           # Shared models
├── Dockerfile
└── docker-compose.yml
```

## 🐳 Docker

```bash
# Build
docker build -t domain-gateway .

# Run
docker run -d \
  -p 80:80 -p 443:443 -p 8080:8080 \
  -v caddy_data:/data/caddy \
  -e DATABASE_URL="..." \
  -e DNS_API_TOKEN="..." \
  domain-gateway
```

## 📊 Monitoring

### Logs
```bash
docker logs -f domain-gateway
```

### Health
```bash
curl http://localhost:8080/health
```
