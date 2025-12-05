'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroProps } from '@/lib/theme/component-types';

export default function ModernHero({ slides }: HeroProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slides
    useEffect(() => {
        if (!slides || slides.length === 0) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [slides]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % (slides?.length || 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + (slides?.length || 1)) % (slides?.length || 1));
    };

    if (!slides || slides.length === 0) {
        return (
            <section className="relative h-[500px] bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-5xl font-bold mb-4">تسوق الآن</h1>
                    <p className="text-xl text-gray-600 mb-8">اكتشف أحدث المنتجات</p>
                    <Link
                        href="/products"
                        className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                    >
                        تصفح المتجر
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="relative h-[500px] md:h-[600px] bg-gray-100 overflow-hidden">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        {slide.image_url && (
                            <Image
                                src={slide.image_url}
                                alt={slide.title || 'Hero Slide'}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full container mx-auto px-4 flex items-center">
                        <div className="max-w-2xl text-white">
                            {slide.subtitle && (
                                <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm mb-4">
                                    {slide.subtitle}
                                </span>
                            )}
                            <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                                {slide.title || 'عنوان العرض'}
                            </h2>
                            <p className="text-lg md:text-xl mb-8 text-gray-200">
                                {slide.description || 'وصف العرض الترويجي'}
                            </p>
                            <div className="flex gap-4">
                                <Link
                                    href={slide.link_url || '/products'}
                                    className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
                                >
                                    {slide.button_text || 'تسوق الآن'}
                                </Link>
                                <Link
                                    href="/deals"
                                    className="border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-black transition-colors"
                                >
                                    العروض الخاصة
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {slides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                                    ? 'bg-white w-8'
                                    : 'bg-white/50 hover:bg-white/75'
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Promotional Banner */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm text-white py-3 z-10">
                <div className="container mx-auto px-4 flex items-center justify-center gap-8 text-sm">
                    <span>✓ شحن مجاني فوق 500 ريال</span>
                    <span>✓ إرجاع مجاني خلال 30 يوم</span>
                    <span>✓ ضمان الجودة</span>
                </div>
            </div>
        </section>
    );
}
