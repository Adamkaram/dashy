'use client';

import { motion } from 'framer-motion';
import { HeroProps } from '@/lib/theme/component-types';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero({ slides }: HeroProps) {
    // Use the first slide or a default placeholder
    // Use the first slide or a default placeholder if no slides provided
    const slide = slides && slides.length > 0 ? slides[0] : {
        image: 'https://ext.same-assets.com/1322334751/1988460870.jpeg', // Valid placeholder
        title: 'URBAN ELEGANCE',
        subtitle: 'Discover the new collection',
        buttonText: 'SHOP NOW',
        buttonLink: '/shop'
    };

    return (
        <section className="relative h-screen w-full overflow-hidden bg-gray-100">
            {/* Background Image with Side Slide Animation */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} // Custom easing for smooth "slide" feel
                className="absolute inset-0 z-0"
            >
                <div className="relative w-full h-full">
                    <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20" />
                </div>
            </motion.div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="hero__text-content vertical-center horizontal-center"
                >
                    <div className="hero__text-shadow">
                        <div className="hero__link">
                            <Link
                                href="/collections/second-skin-collection"
                                className="btn--inverse inline-block"
                            >
                                Second Skin Collection
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
