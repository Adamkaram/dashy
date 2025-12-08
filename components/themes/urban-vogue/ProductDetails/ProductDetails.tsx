import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import AddToCartNotificationResolver from "@/components/resolvers/AddToCartNotificationResolver";

interface Product {
    id: string;
    title: string;
    basePrice: number;
    salePrice?: number | null;
    image: string;
    slug: string;
    images?: { imageUrl: string }[];
    description?: string | null;
}

interface ProductDetailsProps {
    product: Product;
    relatedProducts: Product[];
}

const sizes = ["32", "34", "36", "38", "40", "42", "44", "46"];

export default function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState(sizes[0]);
    const { addToCart } = useCart();
    const [isCareInstructionsOpen, setIsCareInstructionsOpen] = useState(false);
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
        ? product.images.map(img => img.imageUrl)
        : [product.image];

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

    const [showNotification, setShowNotification] = useState(false);
    const [lastAddedItem, setLastAddedItem] = useState<{
        title: string;
        image: string;
        price: number;
        size: string;
        quantity: number;
    } | null>(null);

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.title,
            price: displayPrice,
            image: product.image,
            size: selectedSize,
        });

        setLastAddedItem({
            title: product.title,
            image: product.image,
            price: displayPrice,
            size: selectedSize,
            quantity: 1
        });
        setShowNotification(true);
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
                                            const newDirection = newIndex > selectedImageIndex ? 1 : -1;
                                            setDirection(newDirection);
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
                                            const newDirection = index > selectedImageIndex ? 1 : -1;
                                            setDirection(newDirection);
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
                                            const newDirection = newIndex > selectedImageIndex ? 1 : -1;
                                            setDirection(newDirection);
                                            setSelectedImageIndex(newIndex);
                                        }}
                                        className="absolute bottom-0 left-0 w-full h-8 flex items-center justify-center bg-white z-20 cursor-pointer text-black"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 bg-gray-50 aspect-[2/3] relative overflow-hidden">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={selectedImageIndex}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "tween", duration: 0.3, ease: "easeInOut" },
                                        opacity: { duration: 0.2 }
                                    }}
                                    className="absolute w-full h-full"
                                >
                                    <Image
                                        src={currentImage}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                        priority
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        unoptimized
                                    />
                                </motion.div>
                            </AnimatePresence>
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

                        {/* Size Selector */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm uppercase tracking-wider text-gray-600">Size</span>
                                <button className="text-sm underline underline-offset-4 text-gray-500 hover:text-black">
                                    Size Guide
                                </button>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`h-12 border transition-all duration-200 text-sm ${selectedSize === size
                                            ? "border-black bg-black text-white"
                                            : "border-gray-200 hover:border-black text-gray-800"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4 pt-2">
                            <button
                                onClick={handleAddToCart}
                                className="w-full h-14 text-sm font-medium tracking-widest uppercase border border-black hover:bg-black hover:text-white transition-all duration-300"
                            >
                                Add to cart
                            </button>
                            <button
                                onClick={handleAddToCart}
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
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    For the <strong>Dark Navy</strong> shade, please wash the jeans once before first use. These pieces are made with a special tint that gives each one a unique look. Due to the nature of the material, some color release may occur during the first 2-3 washes this is completely normal.
                                </p>
                            </div>
                        </div>

                        {/* Accordions */}
                        <div className="border-t border-b border-gray-200 divide-y divide-gray-200">
                            {/* Materials */}
                            <button className="w-full flex items-center justify-between py-5 text-sm uppercase tracking-wide hover:text-gray-600 transition-colors">
                                <span>Materials</span>
                                <span className="text-lg font-light">+</span>
                            </button>

                            {/* Shipping & Returns */}
                            <button className="w-full flex items-center justify-between py-5 text-sm uppercase tracking-wide hover:text-gray-600 transition-colors">
                                <span>Shipping & Returns</span>
                                <span className="text-lg font-light">+</span>
                            </button>

                            {/* Care Instructions */}
                            <div>
                                <button
                                    onClick={() => setIsCareInstructionsOpen(!isCareInstructionsOpen)}
                                    className="w-full flex items-center justify-between py-5 text-sm uppercase tracking-wide hover:text-gray-600 transition-colors"
                                >
                                    <span>Care Instructions</span>
                                    <span className="text-lg font-light">{isCareInstructionsOpen ? '-' : '+'}</span>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isCareInstructionsOpen ? "max-h-40 opacity-100 pb-5" : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <p className="text-sm text-gray-600 leading-relaxed font-light">
                                        Machine wash cold. Do not bleach. Tumble dry low. Warm iron if needed. Wash separately for the first few washes.
                                    </p>
                                </div>
                            </div>
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
