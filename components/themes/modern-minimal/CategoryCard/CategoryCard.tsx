'use client';

import { CategoryCardProps } from '@/lib/theme/component-types';
import Image from 'next/image';
import Link from 'next/link';

export default function ModernCategoryCard({ category }: CategoryCardProps) {
    return (
        <Link href={`/categories/${category.slug}`} className="group block relative aspect-square overflow-hidden">
            {/* Background Image */}
            <Image
                src={category.image || '/placeholder-category.jpg'}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>

            {/* Content - Centered */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">
                        {category.name}
                    </h3>
                    <div className="h-0.5 w-0 bg-white mx-auto transition-all duration-300 group-hover:w-12"></div>
                </div>
            </div>
        </Link>
    );
}
