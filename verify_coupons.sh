#!/bin/bash

BASE_URL="http://localhost:3000/api"
ADMIN_SECRET="service_role_key_placeholder" # Not needed if we use the public API for validation, but needed for creation if we don't have auth. 
# Actually, the admin API uses supabaseAdmin which bypasses RLS, but the route itself might not check for a specific header if not implemented. 
# Let's check the admin route implementation first.

# Create a coupon
echo "Creating Coupon TEST10..."
curl -X POST "$BASE_URL/admin/coupons" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TEST10",
    "discount_type": "percentage",
    "discount_value": 10,
    "usage_limit": 100,
    "expires_at": "2025-12-31T23:59:59Z",
    "is_active": true
  }'

echo -e "\n\nCreating Coupon TESTFIXED..."
curl -X POST "$BASE_URL/admin/coupons" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TESTFIXED",
    "discount_type": "fixed",
    "discount_value": 5,
    "usage_limit": 1,
    "expires_at": "2025-12-31T23:59:59Z",
    "is_active": true
  }'

echo -e "\n\nCreating Coupon EXPIRED..."
curl -X POST "$BASE_URL/admin/coupons" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "EXPIRED",
    "discount_type": "fixed",
    "discount_value": 5,
    "usage_limit": 100,
    "expires_at": "2020-01-01T00:00:00Z",
    "is_active": true
  }'

# Validate Coupons
echo -e "\n\nValidating TEST10 (Should be valid, 10% off 100 = 10)..."
curl -X POST "$BASE_URL/coupons/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TEST10",
    "totalAmount": 100
  }'

echo -e "\n\nValidating TESTFIXED (Should be valid, 5 off 100 = 5)..."
curl -X POST "$BASE_URL/coupons/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TESTFIXED",
    "totalAmount": 100
  }'

echo -e "\n\nValidating EXPIRED (Should be invalid)..."
curl -X POST "$BASE_URL/coupons/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "EXPIRED",
    "totalAmount": 100
  }'

echo -e "\n\nValidating INVALID (Should be invalid)..."
curl -X POST "$BASE_URL/coupons/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "INVALID_CODE_123",
    "totalAmount": 100
  }'
