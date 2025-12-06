
import { db } from "../lib/db";
import { products } from "../db/schema";
import { eq, ne, and } from "drizzle-orm";

async function main() {
    const slug = "quarter-zip-grey"; // The slug that is failing
    console.log(`Searching for product with slug: ${slug}`);

    const product = await db.query.products.findFirst({
        where: eq(products.slug, slug),
        with: {
            category: true,
        }
    });

    if (!product) {
        console.error("Product not found!");
        process.exit(1);
    }

    console.log("Found product:", product.title);
    console.log("Category ID:", product.categoryId);

    if (!product.categoryId) {
        console.log("Product has no category ID, so no related products can be found by category.");
        process.exit(0);
    }

    const related = await db.query.products.findMany({
        where: and(
            eq(products.categoryId, product.categoryId),
            ne(products.id, product.id)
        ),
        limit: 10,
    });

    console.log(`Found ${related.length} related products.`);
    related.forEach(p => console.log(`- ${p.title} (${p.slug})`));

    // If less than 3, suggest creating more
    if (related.length < 3) {
        console.log("\nNot enough related products. Creating dummy products...");

        const dummyProducts = [
            {
                title: "Related Product A",
                slug: "related-product-a",
                basePrice: 100,
                categoryId: product.categoryId,
                tenantId: product.tenantId, // Add tenantId
                image: product.image, // Reuse image for now
                description: "Dummy related product A"
            },
            {
                title: "Related Product B",
                slug: "related-product-b",
                basePrice: 150,
                categoryId: product.categoryId,
                tenantId: product.tenantId, // Add tenantId
                image: product.image,
                description: "Dummy related product B"
            },
            {
                title: "Related Product C",
                slug: "related-product-c",
                basePrice: 200,
                categoryId: product.categoryId,
                tenantId: product.tenantId, // Add tenantId
                image: product.image,
                description: "Dummy related product C"
            }
        ];

        for (const p of dummyProducts) {
            // Check if exists first
            const exists = await db.query.products.findFirst({
                where: eq(products.slug, p.slug)
            });

            if (!exists) {
                await db.insert(products).values(p);
                console.log(`Created ${p.title}`);
            } else {
                console.log(`${p.title} already exists.`);
            }
        }
        console.log("Dummy products check complete.");
    }
}

main().catch(console.error).then(() => process.exit(0));
