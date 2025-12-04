'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { CategoryCardProps } from '@/lib/theme/component-types';

export default function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link
            href={`/categories/${category.slug}`}
            className="category-card group relative block overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl"
        >
            <div className="relative aspect-[3/2] overflow-hidden">
                {category.image && (
                    <>
                        <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    </>
                )}

                {!category.image && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#53131C] to-[#8F6B43]" />
                )}

                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white text-center drop-shadow-lg">
                        {category.name}
                    </h3>
                </div>
            </div>
        </Link>
    );
}
