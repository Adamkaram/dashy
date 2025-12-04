'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ServiceCardProps } from '@/lib/theme/component-types';

export default function ServiceCard({ service, variant = 'default' }: ServiceCardProps) {

    return (
        <Link
            href={`/services/${service.slug}`}
            className="service-card group relative block overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay Gradient */}
                <div
                    className="absolute inset-0 transition-all duration-300"
                    style={{
                        background: `linear-gradient(to bottom, transparent 0%, rgba(83, 19, 28, 0.6) 50%, rgba(83, 19, 28, 0.9) 100%)`,
                    }}
                />

                {/* Hover Overlay */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background: `linear-gradient(to bottom, transparent 0%, rgba(180, 120, 108, 0.6) 50%, rgba(180, 120, 108, 0.9) 100%)`,
                    }}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="transform transition-transform duration-300 group-hover:scale-105">
                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                            {service.title}
                        </h3>
                        {service.subtitle && (
                            <p className="text-base lg:text-lg text-white/90 drop-shadow-md">
                                {service.subtitle}
                            </p>
                        )}
                        {service.basePrice && service.basePrice > 0 && (
                            <p className="mt-4 text-xl font-semibold text-white drop-shadow-md">
                                {service.basePrice} د.ك
                            </p>
                        )}
                    </div>

                    {/* View Details Link */}
                    <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <span className="text-white font-medium underline underline-offset-4">
                            عرض التفاصيل
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
