'use client';

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import Link from "next/link";

export interface ProductCardProps {
    id?: string;
    slug: string;
    image: string;
    title: string;
    price?: string;
    originalPrice?: string;
    salePrice?: string;
    badge?: string | null;
    discount?: string;
}

export default function ProductCard({
    id,
    slug,
    image,
    title,
    price,
    originalPrice,
    salePrice,
    badge,
    discount
}: ProductCardProps) {
    return (
        <Link href={`/products/${slug}`}>
            <Card className="group cursor-pointer overflow-hidden border-0 shadow-none bg-transparent transition-all hover:scale-[1.02]">
                <div className="relative overflow-hidden mb-4 rounded-sm">
                    {badge && (
                        <Badge
                            className={`absolute top-3 left-3 z-10 rounded-none px-3 py-1 text-xs font-semibold ${badge === 'Sale' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                                }`}
                        >
                            {badge}
                        </Badge>
                    )}
                    <img
                        src={image}
                        alt={title}
                        className="w-full aspect-[3/4] object-cover transition-all duration-500 group-hover:scale-110"
                        loading="lazy"
                    />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-sm font-light mb-2 leading-tight group-hover:text-gray-600 transition">{title}</h3>
                    {salePrice ? (
                        <div className="space-y-1">
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-sm line-through text-gray-500">{originalPrice || price}</span>
                                <span className="text-sm font-medium text-red-600">{salePrice}</span>
                            </div>
                            {discount && (
                                <p className="text-xs text-red-600 font-medium">{discount}</p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm font-medium">{price}</p>
                    )}
                </div>
            </Card>
        </Link>
    );
}
