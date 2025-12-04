'use client';

import { HeroProps } from '@/lib/theme/component-types';
import { Container, Button } from '@/components/ui-library';
import Image from 'next/image';

export default function ModernHero({ slides, type = 'static' }: HeroProps) {
    // Use first slide or default
    const heroContent = slides?.[0] || {
        image: '/placeholder-hero.jpg',
        title: 'تصميم عصري لمناسباتك',
        subtitle: 'نقدم لك تجربة فريدة من نوعها',
        cta: { text: 'اكتشف المزيد', href: '/services' }
    };

    return (
        <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden bg-gray-50">
            {/* Background Image - Split Layout */}
            <div className="absolute inset-0 w-full h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                    <div className="bg-white hidden md:block"></div>
                    <div className="relative h-full w-full">
                        <Image
                            src={heroContent.image}
                            alt={heroContent.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <Container maxWidth="xl" className="relative z-10">
                <div className="max-w-2xl bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-none md:rounded-r-3xl border-l-4 border-black shadow-xl md:-ml-4">
                    <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-white bg-black uppercase">
                        New Collection
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-black mb-6 leading-tight">
                        {heroContent.title}
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                        {heroContent.subtitle}
                    </p>
                    <div className="flex gap-4">
                        <Button
                            variant="primary"
                            size="lg"
                            className="bg-black text-white hover:bg-gray-800 rounded-none min-w-[160px]"
                        >
                            {heroContent.cta?.text || 'تصفح الخدمات'}
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-black text-black hover:bg-black hover:text-white rounded-none min-w-[160px]"
                        >
                            تواصل معنا
                        </Button>
                    </div>
                </div>
            </Container>
        </section>
    );
}
