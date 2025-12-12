import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useThemeToast } from "@/hooks/useThemeToast";
import { motion, AnimatePresence } from "framer-motion";
import AddToCartNotificationResolver from "@/components/resolvers/AddToCartNotificationResolver";
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Info, Truck, Shield, Sparkles, Leaf, FileText, AlertCircle, Heart, Ruler } from 'lucide-react';
import 'swiper/css/effect-fade';

interface ProductOption {
    id: string;
    title: string;
    type: string;
    displayStyle: string;
    isRequired: boolean;
    options: { label: string; price: number; value?: string }[];
}

interface Product {
    id: string;
    title: string;
    basePrice: number;
    salePrice?: number | null;
    image: string;
    slug: string;
    images?: { imageUrl: string }[];
    description?: string | null;
    metadata?: Record<string, any>;
    options?: ProductOption[];
}

interface ProductDetailsProps {
    product: Product;
    relatedProducts: Product[];
}

const iconMap: Record<string, any> = {
    Info, Truck, Shield, Sparkles, Leaf, FileText, AlertCircle, Heart, Ruler
};

function AccordionItem({ title, children, iconName }: { title: string; children: React.ReactNode; iconName?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const Icon = iconName ? iconMap[iconName] || Info : Info;

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-5 text-sm uppercase tracking-wide hover:text-gray-600 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {iconName && <Icon className="w-4 h-4 text-gray-400" />}
                    <span>{title}</span>
                </div>
                <span className={`text-lg font-light transition-transform duration-300 flex items-center justify-center w-6 h-6 ${isOpen ? 'rotate-45' : ''}`}>
                    +
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100 pb-5" : "max-h-0 opacity-0"}`}
            >
                <div className="text-sm text-gray-600 font-light whitespace-pre-line pl-7">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    // Initialize selected options with defaults (first choice of each option)
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
        const defaults: Record<string, string> = {};
        if (product.options) {
            product.options.forEach(opt => {
                if (opt.options && opt.options.length > 0) {
                    defaults[opt.title] = opt.options[0].label;
                }
            });
        }
        return defaults;
    });

    const [imageDimensions, setImageDimensions] = useState<Record<number, { width: number; height: number }>>({});
    const swiperRef = useRef<SwiperType | null>(null);
    const { addToCart } = useCart();
    const toast = useThemeToast();
    // Accordion state managed by AccordionItem component
    const [direction, setDirection] = useState(0);
    const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? "100%" : "-100%",
            opacity: 0
        })
    };

    // Build gallery images array
    const galleryImages = product.images && product.images.length > 0
        ? product.images.map(img => img.imageUrl).filter(url => url && url.length > 0)
        : [product.image].filter(url => url && url.length > 0);

    const currentImage = galleryImages[selectedImageIndex] || product.image;
    const displayPrice = product.salePrice || product.basePrice;

    const [canScrollUp, setCanScrollUp] = useState(false);
    const [canScrollDown, setCanScrollDown] = useState(false);

    // Check scroll capability
    const checkScroll = () => {
        const container = thumbnailRefs.current[0]?.parentElement;
        if (container) {
            setCanScrollUp(container.scrollTop > 0);
            setCanScrollDown(container.scrollTop < container.scrollHeight - container.clientHeight - 1);
        }
    };

    useEffect(() => {
        checkScroll();
        // Add resize listener just in case
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [galleryImages]);

    // Track Recently Viewed
    useEffect(() => {
        try {
            const viewedItem = {
                id: product.id,
                title: product.title,
                price: displayPrice,
                image: product.image,
                slug: product.slug,
                salePrice: product.salePrice
            };

            const existing = localStorage.getItem('recentlyViewed');
            let viewed = existing ? JSON.parse(existing) : [];

            // Remove if exists to re-add at top
            viewed = viewed.filter((item: any) => item.id !== product.id);

            // Add to beginning
            viewed.unshift(viewedItem);

            // Limit to 10 items
            if (viewed.length > 10) {
                viewed = viewed.slice(0, 10);
            }

            localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
        } catch (error) {
            console.error('Error saving recently viewed:', error);
        }
    }, [product, displayPrice]);

    // Auto-scroll to active thumbnail
    useEffect(() => {
        const container = thumbnailRefs.current[0]?.parentElement;
        const selectedThumbnail = thumbnailRefs.current[selectedImageIndex];
        const firstThumbnail = thumbnailRefs.current[0];

        if (container && selectedThumbnail && firstThumbnail) {
            // Get the actual top offset (usually includes padding)
            const baseOffset = firstThumbnail.offsetTop;
            // Calculate item height including gap
            const itemHeight = selectedThumbnail.offsetHeight + 12;

            if (selectedImageIndex === 0) {
                container.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (selectedImageIndex === galleryImages.length - 1) {
                // Determine scrolling for last image: user requested "animation scroll... down... percent"
                // forcing scrollHeight ensures the padding is visible and the image is cleared from the arrow.
                container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
            } else if (selectedImageIndex === 1) {
                // Image 1 (Index 1) - slight offset to hint at previous
                container.scrollTo({ top: baseOffset + (itemHeight / 3), behavior: 'smooth' });
            } else if (selectedImageIndex === 2) {
                // Image 2 (Index 2) - show more context
                container.scrollTo({ top: baseOffset + itemHeight + (itemHeight / 3), behavior: 'smooth' });
            } else {
                // Standard behavior for others - Ensure minimal scroll movement if already visible
                selectedThumbnail.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                });
            }

            // Give time for scroll to happen before checking
            setTimeout(checkScroll, 300);
        }
    }, [selectedImageIndex, galleryImages.length]);

    // Initialize PhotoSwipe
    useEffect(() => {
        let lightbox: PhotoSwipeLightbox | null = new PhotoSwipeLightbox({
            gallery: '.product-image-main',
            children: 'a',
            pswpModule: () => import('photoswipe')
        });

        lightbox.init();

        return () => {
            lightbox?.destroy();
            lightbox = null;
        };
    }, []);

    const [showNotification, setShowNotification] = useState(false);
    const [lastAddedItem, setLastAddedItem] = useState<{
        title: string;
        image: string;
        price: number;
        selectedOptions: Record<string, string>;
        quantity: number;
    } | null>(null);

    const router = useRouter();

    const handleAddToCart = () => {
        // Validate required options (though we default select them, good to be safe)
        if (product.options) {
            const missing = product.options.find(opt => opt.isRequired && !selectedOptions[opt.title]);
            if (missing) {
                toast.error(`Please select ${missing.title}`);
                return;
            }
        }

        addToCart({
            id: product.id,
            name: product.title,
            price: displayPrice,
            image: product.image,
            selectedOptions: selectedOptions,
        });

        setLastAddedItem({
            title: product.title,
            image: product.image,
            price: displayPrice,
            selectedOptions: selectedOptions,
            quantity: 1
        });
        setShowNotification(true);
    };

    const handleBuyNow = () => {
        if (product.options) {
            const missing = product.options.find(opt => opt.isRequired && !selectedOptions[opt.title]);
            if (missing) {
                toast.error(`Please select ${missing.title}`);
                return;
            }
        }

        addToCart({
            id: product.id,
            name: product.title,
            price: displayPrice,
            image: product.image,
            selectedOptions: selectedOptions,
        });
        router.push('/checkout');
    };

    return (
        <div className="bg-white min-h-screen font-vogue">
            {/* Product Section */}
            <div className="container mx-auto px-4 lg:px-12 py-8 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Image Gallery */}
                    <div className="flex gap-6 sticky top-24 h-[calc(100vh-12rem)] min-h-[600px]">
                        {/* Thumbnails Wrapper */}
                        <div className="relative flex flex-col w-20 flex-shrink-0 h-full">
                            {/* Up Arrow - Absolute layout relative to wrapper */}
                            <AnimatePresence>
                                {canScrollUp && (
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => {
                                            // Act as "Previous Image" button
                                            const newIndex = Math.max(0, selectedImageIndex - 1);
                                            swiperRef.current?.slideTo(newIndex);
                                            setSelectedImageIndex(newIndex);
                                        }}
                                        className="absolute top-0 left-0 w-full h-8 flex items-center justify-center bg-white z-20 cursor-pointer text-black"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                                    </motion.button>
                                )}
                            </AnimatePresence>

                            <div
                                className="flex-1 overflow-y-auto scrollbar-hide py-10 no-scrollbar scroll-smooth"
                                onScroll={checkScroll}
                            >
                                <style jsx global>{`
                                    .no-scrollbar::-webkit-scrollbar {
                                        display: none;
                                    }
                                    .no-scrollbar {
                                        -ms-overflow-style: none;
                                        scrollbar-width: none;
                                    }
                                `}</style>
                                {galleryImages.map((img, index) => (
                                    <button
                                        key={index}
                                        ref={(el) => {
                                            thumbnailRefs.current[index] = el;
                                        }}
                                        onClick={() => {
                                            swiperRef.current?.slideTo(index);
                                            setSelectedImageIndex(index);
                                        }}
                                        className={`product__thumb-item relative aspect-[2/3] w-full mb-[8.5px] md:mb-[15px] transition-all duration-300 border border-transparent ${selectedImageIndex === index
                                            ? "is-active"
                                            : "opacity-100 hover:opacity-80"
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`View ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="96px"
                                            unoptimized
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Down Arrow - Absolute layout relative to wrapper */}
                            <AnimatePresence>
                                {canScrollDown && (
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => {
                                            // Act as "Next Image" button
                                            const newIndex = Math.min(galleryImages.length - 1, selectedImageIndex + 1);
                                            swiperRef.current?.slideTo(newIndex);
                                            setSelectedImageIndex(newIndex);
                                        }}
                                        className="absolute bottom-0 left-0 w-full h-8 flex items-center justify-center bg-white z-20 cursor-pointer text-black"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Main Image Slider */}
                        <div className="flex-1 bg-gray-50 aspect-[2/3] relative overflow-hidden product-image-main group">
                            <Swiper
                                modules={[Navigation]}
                                spaceBetween={0}
                                slidesPerView={1}
                                className="h-full w-full"
                                onSlideChange={(swiper) => {
                                    setSelectedImageIndex(swiper.activeIndex);
                                    // Update direction for thumbnail sync if needed
                                    setDirection(swiper.activeIndex > selectedImageIndex ? 1 : -1);
                                }}
                                onSwiper={(swiper) => {
                                    swiperRef.current = swiper;
                                }}
                                initialSlide={selectedImageIndex}
                            >
                                {galleryImages.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="relative w-full h-full image-wrap">
                                            <a
                                                href={img}
                                                data-pswp-src={img}
                                                data-pswp-width={imageDimensions[index]?.width || 1800}
                                                data-pswp-height={imageDimensions[index]?.height || 2700}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block w-full h-full cursor-zoom-in"
                                                id={`image-link-${index}`}
                                            >
                                                <Image
                                                    src={img}
                                                    alt={`${product.title} - View ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    priority={index === 0}
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    unoptimized
                                                    onLoadingComplete={(result) => {
                                                        setImageDimensions(prev => ({
                                                            ...prev,
                                                            [index]: {
                                                                width: result.naturalWidth,
                                                                height: result.naturalHeight
                                                            }
                                                        }));
                                                    }}
                                                />
                                            </a>

                                            {/* Zoom Button */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    const link = document.getElementById(`image-link-${index}`);
                                                    if (link) link.click();
                                                }}
                                                className="btn btn--body btn--circle js-photoswipe__zoom product__photo-zoom absolute bottom-4 right-4 z-10 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform hidden lg:flex items-center justify-center text-black"
                                                aria-label="Zoom"
                                            >
                                                <svg aria-hidden="true" focusable="false" role="presentation" className="icon icon-search w-5 h-5" viewBox="0 0 64 64">
                                                    <title>icon-search</title>
                                                    <path d="M47.16 28.58A18.58 18.58 0 1 1 28.58 10a18.58 18.58 0 0 1 18.58 18.58ZM54 54 41.94 42" stroke="currentColor" strokeWidth="4" fill="none"></path>
                                                </svg>
                                            </button>

                                            {/* Mobile/Tablet Zoom Hint */}
                                            <div className="absolute top-4 right-4 lg:hidden pointer-events-none">
                                                <span className="bg-black/10 backdrop-blur-sm p-1.5 rounded-full block text-white">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" /></svg>
                                                </span>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-10 pt-4 max-w-lg">
                        {/* Title & Price */}
                        <div className="space-y-4">
                            <h1 className="text-3xl lg:text-4xl font-normal tracking-wide uppercase leading-tight">
                                {product.title}
                            </h1>
                            <p className="text-xl lg:text-2xl font-normal tracking-wide">
                                {product.salePrice ? (
                                    <>
                                        <span className="line-through text-gray-400 mr-3 text-lg">
                                            LE {product.basePrice.toLocaleString()}
                                        </span>
                                        LE {product.salePrice.toLocaleString()}
                                    </>
                                ) : (
                                    `LE ${product.basePrice.toLocaleString()}.00`
                                )}
                            </p>
                        </div>

                        {/* Product Options */}
                        {/* Product Options Logic */}
                        {(() => {
                            // Smart Extraction: Find the "Main" size option to feature at the top
                            const sizeOption = product.options?.find(opt =>
                                opt.title.toLowerCase().includes('size') ||
                                opt.title.includes('مقاس') ||
                                opt.title.toLowerCase().includes('dimension')
                            );

                            // Legacy Fallback if NO options exist at all
                            if (!product.options || product.options.length === 0) {
                                return (
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900">
                                                Size: <span className="text-gray-500 font-normal normal-case ml-1">{selectedOptions['Size'] || 'Select a size'}</span>
                                            </h3>
                                            <button className="text-xs text-gray-500 underline hover:text-black flex items-center gap-1">
                                                <Ruler className="w-3 h-3" /> Size Guide
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {['36', '38', '40', '42'].map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedOptions(prev => ({ ...prev, 'Size': size }))}
                                                    className={`h-12 px-6 min-w-[3rem] border transition-all duration-200 text-sm flex items-center justify-center ${selectedOptions['Size'] === size
                                                        ? "border-black bg-black text-white"
                                                        : "border-gray-200 hover:border-black text-gray-800"
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }

                            // If we found a "Size" option, render it here (Prime Spot) with full dynamic features
                            if (sizeOption) {
                                return (
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900">
                                                {sizeOption.title}: <span className="text-gray-500 font-normal normal-case ml-1">{selectedOptions[sizeOption.title]}</span>
                                            </h3>
                                            <button className="text-xs text-gray-500 underline hover:text-black flex items-center gap-1">
                                                <Ruler className="w-3 h-3" /> Size Guide
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {sizeOption.options.map(choice => {
                                                const isSelected = selectedOptions[sizeOption.title] === choice.label;
                                                return (
                                                    <button
                                                        key={choice.label}
                                                        onClick={() => setSelectedOptions(prev => ({ ...prev, [sizeOption.title]: choice.label }))}
                                                        className={`h-12 px-6 min-w-[3rem] border transition-all duration-200 text-sm flex items-center justify-center ${isSelected
                                                            ? "border-black bg-black text-white"
                                                            : "border-gray-200 hover:border-black text-gray-800"
                                                            }`}
                                                    >
                                                        {choice.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            }

                            return null;
                        })()}

                        {product.options?.filter(opt =>
                            !opt.title.toLowerCase().includes('size') &&
                            !opt.title.includes('مقاس') &&
                            !opt.title.toLowerCase().includes('dimension')
                        ).map((option) => (
                            <div key={option.id}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900">
                                        {option.title}: <span className="text-gray-500 font-normal normal-case ml-1">{selectedOptions[option.title]}</span>
                                    </h3>
                                </div>

                                {option.type === 'select' ? (
                                    <div className="relative">
                                        <select
                                            value={selectedOptions[option.title] || ''}
                                            onChange={(e) => setSelectedOptions(prev => ({ ...prev, [option.title]: e.target.value }))}
                                            className="w-full appearance-none bg-white border border-gray-200 text-gray-900 text-sm p-3 pr-8 rounded-none focus:outline-none focus:border-black transition-colors cursor-pointer"
                                        >
                                            <option value="" disabled>Select {option.title}</option>
                                            {option.options.map(choice => (
                                                <option key={choice.label} value={choice.label}>
                                                    {choice.label} {choice.price > 0 && `(+${choice.price} EGP)`}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {option.options.map((choice) => {
                                            const isSelected = selectedOptions[option.title] === choice.label;

                                            // Color Swatch Style
                                            if (option.displayStyle === 'color') {
                                                return (
                                                    <button
                                                        key={choice.label}
                                                        onClick={() => setSelectedOptions(prev => ({ ...prev, [option.title]: choice.label }))}
                                                        className={`w-10 h-10 rounded-full border-[1px] relative transition-all duration-200 ${isSelected
                                                            ? "border-black scale-110 shadow-sm ring-1 ring-black ring-offset-2"
                                                            : "border-gray-200 hover:border-gray-400 hover:scale-105"
                                                            }`}
                                                        style={{ backgroundColor: choice.value || '#000000' }}
                                                        title={choice.label}
                                                    >
                                                        {isSelected && (
                                                            <span className="absolute inset-0 flex items-center justify-center">
                                                                <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            }

                                            // Default Buttons (Pills)
                                            return (
                                                <button
                                                    key={choice.label}
                                                    onClick={() => setSelectedOptions(prev => ({ ...prev, [option.title]: choice.label }))}
                                                    className={`h-12 px-6 min-w-[3rem] border transition-all duration-200 text-sm flex items-center justify-center ${isSelected
                                                        ? "border-black bg-black text-white"
                                                        : "border-gray-200 hover:border-black text-gray-800"
                                                        }`}
                                                >
                                                    {choice.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Action Buttons */}
                        <div className="space-y-4 pt-2">
                            <button
                                onClick={handleAddToCart}
                                className="w-full h-14 text-sm font-medium tracking-widest uppercase border border-black hover:bg-black hover:text-white transition-all duration-300"
                            >
                                Add to cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="w-full h-14 text-sm font-medium tracking-widest uppercase bg-black text-white hover:bg-gray-900 transition-colors duration-300"
                            >
                                Buy it now
                            </button>
                        </div>

                        {/* Description */}
                        <div className="space-y-6 text-base font-light leading-relaxed text-gray-800 pt-4">
                            <p>Introducing <em>Second Skin: The Next Layer.</em></p>
                            <p>Crafted from premium denim with a unique finish, they bring the perfect balance of style, comfort, and innovation.</p>
                            <p>Model is 167cm wearing size 36.</p>

                            <div className="pt-6 border-t border-gray-100">
                                <p className="font-medium uppercase tracking-wide text-xs mb-3 text-gray-500">Note</p>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                    {product.metadata?.note || 'For the Dark Navy shade, please wash the jeans once before first use. These pieces are made with a special tint that gives each one a unique look.'}
                                </p>
                            </div>
                        </div>

                        {/* Accordions */}
                        <div className="border-t border-b border-gray-200 divide-y divide-gray-200">
                            {/* Dynamic Sections rendering */}
                            {(product.metadata?.sections as any[])?.length > 0 ? (
                                (product.metadata!.sections as any[]).map((section, idx) => (
                                    <div key={idx}>
                                        <button
                                            onClick={() => {
                                                // Toggle logic needs state. Since sections are dynamic, we need an array or map of open states.
                                                // Simple hack: We can use a details/summary HTML default or a localized generic component.
                                                // But for "genius" animation, we need the state-driven height transition.
                                                // Let's create a local component for the accordion item to manage its own state.
                                            }}
                                            className="w-full flex items-center justify-between py-5 text-sm uppercase tracking-wide hover:text-gray-600 transition-colors"
                                        >
                                            {/* ... Content ... */}
                                        </button>
                                    </div>
                                ))
                            ) : (
                                // Legacy Fallback
                                <>
                                    {/* Materials */}
                                    {product.metadata?.materials && (
                                        <AccordionItem title="Materials">
                                            {product.metadata.materials}
                                        </AccordionItem>
                                    )}

                                    {/* Shipping & Returns */}
                                    {product.metadata?.shipping_returns && (
                                        <AccordionItem title="Shipping & Returns">
                                            {product.metadata.shipping_returns}
                                        </AccordionItem>
                                    )}

                                    {/* Care Instructions */}
                                    {product.metadata?.care_instructions && (
                                        <AccordionItem title="Care Instructions">
                                            {product.metadata.care_instructions}
                                        </AccordionItem>
                                    )}
                                </>
                            )}

                            {/* Render Dynamic Sections if present (Priority) */}
                            {product.metadata?.sections && (product.metadata.sections as any[]).map((section, idx) => (
                                <AccordionItem key={idx} title={section.title} iconName={section.icon}>
                                    {section.content}
                                </AccordionItem>
                            ))}
                        </div>

                        {/* Social Share */}
                        <div className="flex gap-6 pt-2">
                            <button className="flex items-center gap-2 text-sm uppercase tracking-wider text-gray-500 hover:text-black transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>
                                <span>Share</span>
                            </button>
                            <button className="flex items-center gap-2 text-sm uppercase tracking-wider text-gray-500 hover:text-black transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                                <span>Tweet</span>
                            </button>
                            <button className="flex items-center gap-2 text-sm uppercase tracking-wider text-gray-500 hover:text-black transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                                <span>Pin it</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* You Might Also Like Section */}
            {
                relatedProducts && relatedProducts.length > 0 && (
                    <div className="mt-24 pt-24 border-t border-gray-200 pb-24">
                        <div className="container mx-auto px-4 lg:px-12">
                            <h2 className="text-2xl text-center mb-12 uppercase tracking-widest font-normal">
                                You might also like
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {relatedProducts.slice(0, 4).map((relatedProduct) => (
                                    <Link
                                        key={relatedProduct.id}
                                        href={`/products/${relatedProduct.slug}`}
                                    >
                                        <div className="group cursor-pointer">
                                            {/* Product Image */}
                                            <div className="bg-gray-50 mb-4 overflow-hidden aspect-[2/3]">
                                                <Image
                                                    src={relatedProduct.image}
                                                    alt={relatedProduct.title}
                                                    width={400}
                                                    height={600}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="text-center space-y-1">
                                                <h3 className="text-sm font-medium tracking-wide uppercase hover:underline underline-offset-4 decoration-gray-300">
                                                    {relatedProduct.title}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {relatedProduct.salePrice ? (
                                                        <>
                                                            <span className="line-through text-gray-400 mr-2 text-xs">
                                                                LE {relatedProduct.basePrice.toLocaleString()}
                                                            </span>
                                                            LE {relatedProduct.salePrice.toLocaleString()} {/** Fixed currency typo EL -> LE */}
                                                        </>
                                                    ) : (
                                                        `LE ${relatedProduct.basePrice.toLocaleString()}.00`
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Notification Resolver */}
            {lastAddedItem && (
                <AddToCartNotificationResolver
                    isOpen={showNotification}
                    onClose={() => setShowNotification(false)}
                    product={lastAddedItem}
                />
            )}
        </div >
    );
}
