'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { CategoryCardProps } from '@/lib/theme/component-types';

export default function ModernCategoryCard({ category }: CategoryCardProps) {
    // Mock product data - in real app, this would come from props
    const mockPrice = 299;
    const mockOldPrice = 399;
    const mockRating = 4.5;
    const mockReviews = 128;

    return (
        <Link
            href={`/categories/${category.slug}`}
            className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
        >
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                {category.image_url ? (
                    <Image
                        src={category.image_url}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <ShoppingCart className="w-16 h-16" />
                    </div>
                )}

                {/* Discount Badge */}
                {mockOldPrice > mockPrice && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{Math.round(((mockOldPrice - mockPrice) / mockOldPrice) * 100)}%
                    </div>
                )}

                {/* Wishlist Button */}
                <button className="absolute top-3 left-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-5 h-5 text-gray-700" />
                </button>

                {/* Quick Add to Cart */}
                <button className="absolute bottom-3 left-3 right-3 bg-black text-white py-2 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-800 flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    أضف للسلة
                </button>
            </div>

            {/* Product Info */}
            <div className="p-4 flex-1 flex flex-col">
                {/* Category Name */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-black">
                    {category.name}
                </h3>

                {/* Description */}
                {category.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {category.description}
                    </p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(mockRating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-gray-600">
                        {mockRating} ({mockReviews})
                    </span>
                </div>

                {/* Price */}
                <div className="mt-auto">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-black">
                            {mockPrice} ر.س
                        </span>
                        {mockOldPrice > mockPrice && (
                            <span className="text-sm text-gray-400 line-through">
                                {mockOldPrice} ر.س
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                        ✓ متوفر في المخزون
                    </p>
                </div>
            </div>
        </Link>
    );
}
