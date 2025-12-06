import { db } from "@/lib/db";
import { products, productImages } from "@/db/schema";
import { eq } from "drizzle-orm";

async function main() {
    const slug = "quarter-zip-grey"; // The product to update

    console.log(`Finding product: ${slug}...`);

    const product = await db.query.products.findFirst({
        where: eq(products.slug, slug)
    });

    if (!product) {
        console.error(`Product not found: ${slug}`);
        process.exit(1);
    }

    console.log(`Found product: ${product.title} (ID: ${product.id})`);

    // Dummy images (placeholders)
    const dummyImages = [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542272617-08f08630329e?q=80&w=1000&auto=format&fit=crop",
        "https://plus.unsplash.com/premium_photo-1675130113886-f3f94b219fae?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?q=80&w=1000&auto=format&fit=crop"
    ];

    console.log(`Seeding 8 images for ${slug}...`);

    // Clear existing images first (optional, but cleaner for this task)
    await db.delete(productImages).where(eq(productImages.productId, product.id));
    console.log("Cleared existing images.");

    for (let i = 0; i < 8; i++) {
        await db.insert(productImages).values({
            tenantId: product.tenantId,
            productId: product.id,
            imageUrl: dummyImages[i],
            displayOrder: i
        });
        console.log(`Added image ${i + 1}/8`);
    }

    // Also update the main image if needed
    await db.update(products)
        .set({ image: dummyImages[0] })
        .where(eq(products.id, product.id));

    console.log("Updated main product image.");
    console.log("Done!");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
