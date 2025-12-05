'use client';

import { motion } from 'framer-motion';
import { HeroProps } from '@/lib/theme/component-types';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero({ slides }: HeroProps) {
    // Use the first slide or a default placeholder
    const slide = slides?.[0] || {
        image: '/themes/urban/hero-bg.jpg', // Placeholder
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
            <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center items-start">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="max-w-2xl text-white"
                >
                    <h2 className="text-lg md:text-xl font-medium tracking-[0.2em] mb-4 uppercase">
                        {slide.subtitle}
                    </h2>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-tight">
                        {slide.title}
                    </h1>

                    <Link
                        href={slide.buttonLink || '/shop'}
                        className="inline-block bg-white text-black px-10 py-4 text-sm font-bold tracking-widest hover:bg-black hover:text-white transition-colors duration-300 uppercase"
                    >
                        {slide.buttonText}
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
