import ProductDetailsResolver from './ProductDetailsResolver';
import { db } from '@/lib/db';
import { products, categories, productImages } from '@/db/schema';
import { eq, ne, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';

interface ProductDetailsRouteProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProductDetailsRoute({ params }: ProductDetailsRouteProps) {
    const { slug } = await params;

    // 1. Fetch the main product
    const product = await db.query.products.findFirst({
        where: eq(products.slug, slug),
        with: {
            category: true,
            images: true,
            options: {
                orderBy: (options, { asc }) => [asc(options.displayOrder)],
            },
        },
    });

    if (!product) {
        notFound();
    }

    // 2. Fetch related products (same category, excluding current)
    const relatedProducts = await db.query.products.findMany({
        where: and(
            eq(products.categoryId, product.categoryId),
            ne(products.id, product.id)
        ),
        limit: 3,
        with: {
            images: true,
        }
    });

    // 3. Render the theme component with data via Resolver
    return <ProductDetailsResolver product={product} relatedProducts={relatedProducts} />;
}
