-- Migration: Create notifications table
-- Description: Multi-tenant notifications system

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Notification content
    type VARCHAR(50) NOT NULL DEFAULT 'info',  -- order, success, warning, info, error
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),  -- Icon name from lucide-react
    
    -- Status
    read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Optional link/action
    action_url TEXT,
    action_label VARCHAR(100),
    
    -- Related entity (optional)
    entity_type VARCHAR(50),  -- order, product, coupon, etc.
    entity_id UUID,
    
    -- Metadata for additional data
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_notifications_tenant ON notifications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_tenant_read ON notifications(tenant_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- Add comment for documentation
COMMENT ON TABLE notifications IS 'Multi-tenant notifications for admin dashboard';
COMMENT ON COLUMN notifications.type IS 'Notification type: order, success, warning, info, error';
COMMENT ON COLUMN notifications.entity_type IS 'Related entity type: order, product, coupon, etc.';
COMMENT ON COLUMN notifications.entity_id IS 'ID of the related entity';
COMMENT ON COLUMN notifications.expires_at IS 'Optional expiration time for auto-cleanup';
