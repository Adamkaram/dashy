'use client';

import { motion } from 'framer-motion';
import { HeroProps } from '@/lib/theme/component-types';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero({ slides }: HeroProps) {
    if (!slides || slides.length === 0) {
        return <section className="relative h-screen w-full bg-gray-100" />;
    }

    const slide = slides[0];

    return (
        <section className="relative h-screen w-full overflow-hidden bg-gray-100">
            {/* Background Image with Side Slide Animation */}
            <motion.div
                initial={{ x: '200px', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute inset-0 z-0 hero__image-wrapper"
            >
                <div className="relative w-full h-full">
                    <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover hero__image"
                        priority
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20" />
                </div>
            </motion.div>

            {/* Content */}
            <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center">
                <div className="hero__text-content relative z-[4] py-4 md:py-12">
                    <div className="hero__text-shadow relative inline-block">
                        <motion.div
                            className="hero__link block relative mt-2 md:mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.3, duration: 2, ease: "easeOut" }}
                        >
                            <Link
                                href="/collections/winter-2025-collection"
                                className="btn btn--inverse inline-block px-4 py-3 text-sm md:text-base font-medium tracking-wide border border-white bg-transparent text-white hover:bg-white hover:text-black transition-colors duration-300 uppercase"
                            >
                                Second Skin Collection
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
