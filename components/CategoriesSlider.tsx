'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

interface Category {
    id: string;
    name: string;
    icon?: string;
}

interface CategoriesSliderProps {
    categories: Category[];
}

export default function CategoriesSlider({ categories }: CategoriesSliderProps) {
    if (categories.length === 0) return null;

    return (
        <div className="page-header">
            <div className="container mx-auto px-4">
                <div className="buttons-slider position-relative">
                    <Swiper
                        modules={[FreeMode]}
                        spaceBetween={10}
                        slidesPerView="auto"
                        freeMode={true}
                        dir="rtl"
                        className="swiper-wrapper"
                    >
                        {categories.map((category) => (
                            <SwiperSlide key={category.id} className="nav-item" style={{ width: 'auto' }}>
                                <Link
                                    href={`/categories/${category.id}`}
                                    className="nav-link"
                                >
                                    {category.name}
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
}
