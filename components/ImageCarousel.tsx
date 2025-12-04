'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
    images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
    const [currentImage, setCurrentImage] = useState(0);
    const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
    const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
    const minSwipeDistance = 50;

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distanceX = touchStart.x - touchEnd.x;
        const distanceY = touchStart.y - touchEnd.y;
        const isLeftSwipe = distanceX > minSwipeDistance;
        const isRightSwipe = distanceX < -minSwipeDistance;

        if (Math.abs(distanceX) > Math.abs(distanceY)) {
            if (isLeftSwipe) {
                nextImage();
            } else if (isRightSwipe) {
                prevImage();
            }
        }
    };

    return (
        <div className="gallery-section w-full lg:w-1/2 lg:sticky lg:top-8 order-1">
            <div className="gallery-single-image">
                <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl shadow-black/5">
                    <div
                        className="relative h-[300px] md:h-[450px] lg:h-[600px] touch-pan-y"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <Image
                            src={images[currentImage] || images[0]}
                            alt="صورة الخدمة"
                            fill
                            className="object-cover select-none"
                            draggable={false}
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                            quality={85}
                            priority={currentImage === 0}
                        />

                        {/* Navigation Buttons */}
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-lg transition-all z-10"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="h-5 w-5 text-[#6b5448]" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-lg transition-all z-10"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="h-5 w-5 text-[#6b5448]" />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium z-10">
                            {currentImage + 1}/{images.length}
                        </div>

                        {/* Image Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImage(index)}
                                    className={`h-2 rounded-full transition-all ${index === currentImage ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
                                        }`}
                                    aria-label={`Go to image ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
