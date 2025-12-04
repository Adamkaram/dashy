'use client';

import { ServiceCardProps } from '@/lib/theme/component-types';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ModernServiceCard({ service, variant = 'minimal' }: ServiceCardProps) {
    return (
        <Link href={`/services/${service.slug}`} className="group block h-full">
            <div className="bg-white h-full flex flex-col transition-all duration-300 hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 mb-4">
                    <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Price Tag - Minimal */}
                    {service.basePrice && (
                        <div className="absolute top-4 left-4 bg-white px-3 py-1 text-sm font-bold text-black">
                            {service.basePrice} د.ك
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-600 transition-colors">
                        {service.title}
                    </h3>
                    {service.subtitle && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                            {service.subtitle}
                        </p>
                    )}

                    <div className="mt-auto pt-4 flex items-center text-sm font-medium text-black group-hover:gap-2 transition-all">
                        <span>عرض التفاصيل</span>
                        <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
