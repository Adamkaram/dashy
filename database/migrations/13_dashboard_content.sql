-- Dashboard Content Table
-- Stores videos, articles, and tips that appear in the admin dashboard

CREATE TABLE IF NOT EXISTS dashboard_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('video', 'article', 'tip')),
    title TEXT NOT NULL,
    description TEXT,
    content JSONB NOT NULL DEFAULT '{}',
    -- For videos: { url: "youtube/vimeo url", embed_code: "optional", thumbnail: "url" }
    -- For articles: { body: "markdown text", read_time: "5 min" }
    -- For tips: { body: "short text" }
    category TEXT DEFAULT 'general',
    -- Categories: 'domains', 'products', 'orders', 'general'
    display_location TEXT[] DEFAULT ARRAY['dashboard'],
    -- Locations: 'dashboard', 'domains_page', 'products_page', 'settings_page'
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_dashboard_content_active ON dashboard_content(is_active);
CREATE INDEX IF NOT EXISTS idx_dashboard_content_category ON dashboard_content(category);
CREATE INDEX IF NOT EXISTS idx_dashboard_content_location ON dashboard_content USING GIN(display_location);

-- Enable RLS
ALTER TABLE dashboard_content ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active content
CREATE POLICY "Anyone can read active content" ON dashboard_content
    FOR SELECT USING (is_active = true);

-- Policy: Admin can do everything (using service role)
CREATE POLICY "Service role has full access" ON dashboard_content
    FOR ALL USING (true);

-- Insert sample content
INSERT INTO dashboard_content (type, title, description, content, category, display_location, display_order) VALUES
(
    'video',
    'How to Add a Custom Domain',
    'Learn how to connect your custom domain in just 5 minutes',
    '{"url": "https://www.youtube.com/watch?v=example", "thumbnail": "https://img.youtube.com/vi/example/maxresdefault.jpg"}',
    'domains',
    ARRAY['domains_page'],
    1
),
(
    'article',
    'DNS Configuration Guide',
    'Step-by-step guide for configuring DNS records',
    '{"body": "# DNS Configuration\n\n## Step 1: Access your DNS provider\n\nGo to your domain registrar and find DNS settings...", "read_time": "3 min"}',
    'domains',
    ARRAY['domains_page'],
    2
),
(
    'tip',
    'Pro Tip: DNS Propagation',
    'DNS changes can take up to 24-48 hours to propagate worldwide',
    '{"body": "Use tools like https://dnschecker.org to verify your DNS records have propagated."}',
    'domains',
    ARRAY['domains_page'],
    3
);
