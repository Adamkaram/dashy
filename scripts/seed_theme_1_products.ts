import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { tenants, categories, products } from '../db/schema';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const db = drizzle(pool, { schema });

const allProducts = [
    {
        id: "womens-fitted-jeans-dark-navy",
        name: "Women's Fitted Jeans in Dark Navy",
        price: 1680,
        category: "Jeans",
        image: "https://ext.same-assets.com/1322334751/1334190797.jpeg",
    },
    {
        id: "womens-relaxed-wide-jeans-dune",
        name: "Women's Relaxed Wide Jeans in Dune",
        price: 1680,
        category: "Jeans",
        image: "https://ext.same-assets.com/1322334751/3778424026.jpeg",
    },
    {
        id: "womens-relaxed-wide-jeans-dark-navy",
        name: "Women's Relaxed Wide Jeans in Dark Navy",
        price: 1680,
        category: "Jeans",
        image: "https://ext.same-assets.com/1322334751/3710519285.jpeg",
    },
    {
        id: "womens-relaxed-wide-jeans-espresso",
        name: "Women's Relaxed Wide Jeans in Espresso Brown",
        price: 1680,
        category: "Jeans",
        image: "https://ext.same-assets.com/1322334751/1127774697.jpeg",
    },
    {
        id: "hooded-trucker-navy",
        name: "Hooded Trucker Jacket in Navy Blue",
        price: 3500,
        salePrice: 2900,
        category: "Jackets",
        image: "https://ext.same-assets.com/1322334751/1988460870.jpeg",
        badge: "Sale",
    },
    {
        id: "hooded-trucker-black",
        name: "Hooded Trucker Jacket in Midnight Black",
        price: 3500,
        salePrice: 2900,
        category: "Jackets",
        image: "https://ext.same-assets.com/1322334751/2593589245.jpeg",
        badge: "Sold Out",
    },
    {
        id: "quarter-zip-green",
        name: "Denim Quarter Zip in Grime Green",
        price: 2500,
        salePrice: 1200,
        category: "Quarter Zips",
        image: "https://ext.same-assets.com/1322334751/3115209799.jpeg",
        badge: "Sold Out",
    },
    {
        id: "quarter-zip-grey",
        name: "Denim Quarter Zip in Washed Grey",
        price: 2500,
        salePrice: 1900,
        category: "Quarter Zips",
        image: "https://ext.same-assets.com/1322334751/1367131858.jpeg",
        badge: "Sale",
    },
    {
        id: "mens-relaxed-wide-jeans-dark-navy",
        name: "Men's Relaxed Wide Jeans in Dark Navy",
        price: 1680,
        category: "Jeans",
        image: "https://ext.same-assets.com/1322334751/1634659580.jpeg",
    },
    {
        id: "midnight-black-crewneck",
        name: "Midnight Black Oversized Crewneck",
        price: 1280,
        category: "Crewnecks",
        image: "https://ext.same-assets.com/1322334751/3884805819.jpeg",
    },
    {
        id: "mens-relaxed-wide-jeans-dune",
        name: "Men's Relaxed Wide Jeans in Dune",
        price: 1680,
        category: "Jeans",
        image: "https://ext.same-assets.com/1322334751/81029271.jpeg",
    },
];

async function main() {
    console.log("Seeding Urban Vogue Products...");

    // 1. Find or Create Tenant
    let tenant = await db.query.tenants.findFirst({
        where: eq(tenants.slug, "urban-vogue")
    });

    if (!tenant) {
        console.log("Creating tenant 'urban-vogue'...");
        const [newTenant] = await db.insert(tenants).values({
            name: "Urban Vogue",
            slug: "urban-vogue",
            domain: "urban-vogue.local",
        }).returning();
        tenant = newTenant;
    }
    console.log("Tenant ID:", tenant.id);

    // 2. Categories
    const uniqueCats = [...new Set(allProducts.map(p => p.category))];
    const catMap = new Map();

    for (const catName of uniqueCats) {
        let cat = await db.query.categories.findFirst({
            where: and(eq(categories.name, catName), eq(categories.tenantId, tenant.id))
        });

        if (!cat) {
            console.log(`Creating category ${catName}...`);
            const [newCat] = await db.insert(categories).values({
                tenantId: tenant.id,
                name: catName,
                slug: catName.toLowerCase().replace(/ /g, '-'),
            }).returning();
            cat = newCat;
        }
        catMap.set(catName, cat.id);
    }

    // 3. Products
    for (const p of allProducts) {
        // Check for existing product by SLUG (globally unique)
        const existing = await db.query.products.findFirst({
            where: eq(products.slug, p.id)
        });

        const productData = {
            tenantId: tenant.id,
            categoryId: catMap.get(p.category),
            title: p.name,
            slug: p.id,
            basePrice: p.price,
            salePrice: p.salePrice || null,
            badge: p.badge || null,
            image: p.image,
        };

        if (existing) {
            console.log(`Updating ${p.name} (ID: ${existing.id})...`);
            await db.update(products)
                .set(productData)
                .where(eq(products.id, existing.id));
        } else {
            console.log(`Inserting ${p.name}...`);
            await db.insert(products).values(productData);
        }
    }
    console.log("Seeding done!");
}

main().catch(console.error).finally(() => pool.end());
