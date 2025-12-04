'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import Image from 'next/image';
import type { HeroProps } from '@/lib/theme/component-types';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HeroSlider({ slides = [] }: HeroProps) {
    if (slides.length === 0) {
        return null;
    }

    return (
        <section className="hero-section relative w-full h-[500px] lg:h-[600px] xl:h-[700px]">
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet !bg-white/50',
                    bulletActiveClass: 'swiper-pagination-bullet-active !bg-white',
                }}
                effect="fade"
                loop
                className="h-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full h-full">
                            {/* Background Image */}
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-cover"
                                priority={slide.id === slides[0].id}
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />

                            {/* Content */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center px-4 max-w-4xl">
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                                        {slide.title}
                                    </h1>
                                    {slide.subtitle && (
                                        <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 drop-shadow-md">
                                            {slide.subtitle}
                                        </p>
                                    )}
                                    {slide.cta && (
                                        <a
                                            href={slide.cta.href}
                                            className="inline-block px-8 py-4 bg-white text-[#53131C] font-bold text-lg rounded-lg hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                                        >
                                            {slide.cta.text}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
