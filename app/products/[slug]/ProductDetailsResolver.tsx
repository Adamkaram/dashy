"use client";

import { useThemeComponents } from "@/lib/theme/ThemeComponentProvider";

interface Product {
    id: string;
    title: string;
    basePrice: number;
    salePrice?: number | null;
    image: string;
    slug: string;
    images?: { imageUrl: string }[];
    description?: string | null;
}

interface ProductDetailsResolverProps {
    product: any; // Using any to avoid strict type mismatch if DB schema differs slightly from component props
    relatedProducts: any[];
}

export default function ProductDetailsResolver({ product, relatedProducts }: ProductDetailsResolverProps) {
    const { ProductDetails } = useThemeComponents();

    if (ProductDetails) {
        return <ProductDetails product={product} relatedProducts={relatedProducts} />;
    }

    return (
        <div className="container mx-auto p-4 text-center">
            <p>Product details component not found for this theme.</p>
        </div>
    );
}
