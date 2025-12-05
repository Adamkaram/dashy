const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const categories = [
    { name: 'Second Skin Collection', slug: 'second-skin', description: 'Comfortable and stylish second skin collection' },
    { name: 'Denim Collection', slug: 'denim', description: 'Premium denim for every occasion' },
    { name: 'A La Plage', slug: 'a-la-plage', description: 'Beachwear essentials' },
    { name: 'Timeless Threads', slug: 'timeless-threads', description: 'Classic pieces that never go out of style' }
];

const products = {
    'second-skin': [
        { title: "Women's Relaxed Wide Jeans in Snow Blue", image: "https://ext.same-assets.com/1322334751/47044124.jpeg", price: 1680, slug: 'womens-relaxed-wide-jeans-snow-blue' },
        { title: "Women's Fitted Jeans in Dark Navy", image: "https://ext.same-assets.com/1322334751/4140283186.jpeg", price: 1680, slug: 'womens-fitted-jeans-dark-navy' },
        { title: "Women's Relaxed Wide Jeans in Dune", image: "https://ext.same-assets.com/1322334751/2377290049.jpeg", price: 1680, slug: 'womens-relaxed-wide-jeans-dune' },
        { title: "Women's Relaxed Wide Jeans in Espresso Brown", image: "https://ext.same-assets.com/1322334751/3872683703.jpeg", price: 1680, slug: 'womens-relaxed-wide-jeans-espresso-brown' }
    ],
    'denim': [
        { title: "The Jagged Women's Jeans in Midnight Black", image: "https://ext.same-assets.com/1322334751/2890397992.jpeg", price: 1690, slug: 'jagged-womens-jeans-midnight-black' },
        { title: "The Buckle Up Women's Jeans in Sandstone", image: "https://ext.same-assets.com/1322334751/871644551.jpeg", price: 1690, slug: 'buckle-up-womens-jeans-sandstone' },
        { title: "The Jagged Women's Jeans in Navy Blue", image: "https://ext.same-assets.com/1322334751/3399780932.jpeg", price: 1690, slug: 'jagged-womens-jeans-navy-blue' },
        // Repeating one product as per request
        { title: "Women's Relaxed Wide Jeans in Dune", image: "https://ext.same-assets.com/1322334751/2377290049.jpeg", price: 1680, slug: 'womens-relaxed-wide-jeans-dune-2' }
    ],
    'a-la-plage': [
        { title: "A La Plage Chateau Green Oversize Tee", image: "https://ext.same-assets.com/1322334751/4279007733.jpeg", price: 300, slug: 'a-la-plage-green-tee' },
        { title: "Washed Black Women's Jorts", image: "https://ext.same-assets.com/1322334751/2529493474.jpeg", price: 890, slug: 'washed-black-womens-jorts' },
        { title: "Burnt Denim Blue Women's Jorts", image: "https://ext.same-assets.com/1322334751/4058527652.jpeg", price: 800, slug: 'burnt-denim-blue-womens-jorts' },
        { title: "A La Plage Mocha Oversized Tee", image: "https://ext.same-assets.com/1322334751/2757323073.jpeg", price: 300, slug: 'a-la-plage-mocha-tee' }
    ],
    'timeless-threads': [
        { title: "Hooded Trucker Jacket in Navy Blue", image: "https://ext.same-assets.com/1322334751/3884592263.jpeg", price: 2900, slug: 'hooded-trucker-jacket-navy-blue' },
        { title: "Hooded Trucker Jacket in Midnight Black", image: "https://ext.same-assets.com/1322334751/1195451337.jpeg", price: 2900, slug: 'hooded-trucker-jacket-midnight-black' },
        { title: "Denim Quarter Zip in Grime Green", image: "https://ext.same-assets.com/1322334751/4166313125.jpeg", price: 1200, slug: 'denim-quarter-zip-grime-green' },
        { title: "Denim Quarter Zip in Washed Grey", image: "https://ext.same-assets.com/1322334751/1525297008.jpeg", price: 1900, slug: 'denim-quarter-zip-washed-grey' }
    ]
};

const themeConfig = {
    id: 'urban-vogue-config',
    name: 'Urban Vogue Config',
    displayName: 'Urban Vogue Default Configuration',
    description: 'Default configuration for Urban Vogue theme',
    version: '1.0.0',
    colors: {
        primary: '#1a1a1a',
        secondary: '#f5f5f5',
        accent: '#f5f5f5',
        background: '#f6f6f4',
        foreground: '#2e2e2e',
        muted: '#f5f5f5',
        success: '#22c55e',
        warning: '#eab308',
        error: '#ef4444',
        info: '#3b82f6',
    },
    typography: {
        fontFamily: {
            primary: 'Montserrat, sans-serif',
            secondary: 'Inter, sans-serif',
            heading: 'Montserrat, sans-serif',
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
        },
        fontWeight: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
    },
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
    },
    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    },
    borders: {
        radius: {
            sm: '0rem',
            md: '0rem',
            lg: '0rem',
            xl: '0rem',
        },
    },
    layout: {
        containerWidth: '1400px',
        headerHeight: '80px',
        sectionPadding: '4rem',
        gridGap: '1.5rem',
    }
};

async function main() {
    try {
        console.log('🌱 Starting seed process...');

        // 1. Get Tenant
        const tenantRes = await pool.query('SELECT id FROM tenants LIMIT 1');
        if (tenantRes.rows.length === 0) {
            console.error('❌ No tenant found. Please create a tenant first.');
            return;
        }
        const tenantId = tenantRes.rows[0].id;
        console.log(`✅ Using tenant ID: ${tenantId}`);

        // 2. Update Theme Config
        console.log('🎨 Updating Urban Vogue theme config...');
        await pool.query(
            "UPDATE themes SET config = $1 WHERE slug = 'urban-vogue'",
            [JSON.stringify(themeConfig)]
        );
        console.log('✅ Theme config updated.');

        // 3. Create Categories & Products
        console.log('📦 Seeding categories and products...');

        for (const cat of categories) {
            // Check/Create Category
            let catId;
            const catRes = await pool.query(
                'SELECT id FROM categories WHERE slug = $1 AND tenant_id = $2',
                [cat.slug, tenantId]
            );

            if (catRes.rows.length > 0) {
                catId = catRes.rows[0].id;
                console.log(`   🔸 Category exists: ${cat.name}`);
            } else {
                const newCat = await pool.query(
                    'INSERT INTO categories (tenant_id, name, slug, description) VALUES ($1, $2, $3, $4) RETURNING id',
                    [tenantId, cat.name, cat.slug, cat.description]
                );
                catId = newCat.rows[0].id;
                console.log(`   ✅ Created category: ${cat.name}`);
            }

            // Insert Products for this category
            const catProducts = products[cat.slug];
            if (catProducts) {
                for (const prod of catProducts) {
                    await pool.query(
                        `INSERT INTO products (tenant_id, category_id, title, slug, image, base_price, is_active) 
                         VALUES ($1, $2, $3, $4, $5, $6, true)
                         ON CONFLICT (slug) DO UPDATE SET 
                            category_id = EXCLUDED.category_id,
                            title = EXCLUDED.title,
                            image = EXCLUDED.image,
                            base_price = EXCLUDED.base_price`,
                        [tenantId, catId, prod.title, prod.slug, prod.image, prod.price]
                    );
                }
                console.log(`   ✅ Seeded ${catProducts.length} products for ${cat.name}`);
            }
        }

        console.log('🎉 Seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        await pool.end();
    }
}

main();
