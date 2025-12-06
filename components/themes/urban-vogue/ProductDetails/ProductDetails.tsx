"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

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

    // Build gallery images array
    const galleryImages = product.images && product.images.length > 0
        ? product.images.map(img => img.imageUrl)
        : [product.image];

    const currentImage = galleryImages[selectedImageIndex] || product.image;
    const displayPrice = product.salePrice || product.basePrice;

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.title,
            price: displayPrice,
            image: product.image,
            size: selectedSize,
        });
        toast.success(`Added ${product.title} (Size ${selectedSize}) to cart`);
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Product Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Gallery */}
                    <div className="flex gap-4">
                        {/* Thumbnails */}
                        <div className="flex flex-col gap-2 w-20">
                            {galleryImages.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`border-2 transition-colors overflow-hidden ${selectedImageIndex === index
                                        ? "border-black"
                                        : "border-gray-200 hover:border-gray-400"
                                        }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`Product view ${index + 1}`}
                                        width={80}
                                        height={120}
                                        className="w-full h-auto object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 bg-gray-50">
                            <Image
                                src={currentImage}
                                alt={product.title}
                                width={600}
                                height={900}
                                className="w-full h-auto object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Title & Price */}
                        <div>
                            <h1 className="text-3xl font-normal tracking-wide uppercase mb-2">
                                {product.title}
                            </h1>
                            <p className="text-xl">
                                {product.salePrice ? (
                                    <>
                                        <span className="line-through text-gray-500 mr-2">
                                            LE {product.basePrice.toFixed(2)}
                                        </span>
                                        LE {product.salePrice.toFixed(2)}
                                    </>
                                ) : (
                                    `LE ${product.basePrice.toFixed(2)}`
                                )}
                            </p>
                        </div>

                        {/* Size Selector */}
                        <div>
                            <p className="text-sm font-medium mb-3">Size</p>
                            <div className="grid grid-cols-4 gap-2">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-3 border transition-colors text-sm ${selectedSize === size
                                            ? "border-black bg-black text-white"
                                            : "border-gray-300 hover:border-gray-400"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleAddToCart}
                                className="w-full h-12 text-sm font-medium tracking-wide border border-black hover:bg-black hover:text-white transition-all"
                            >
                                ADD TO CART
                            </button>
                            <button
                                onClick={handleAddToCart}
                                className="w-full h-12 text-sm font-medium tracking-wide bg-black text-white hover:bg-gray-800 transition-colors"
                            >
                                BUY IT NOW
                            </button>
                        </div>

                        {/* Description */}
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p>Introducing <em>Second Skin: The Next Layer.</em></p>
                            <p>Crafted from premium denim with a unique finish, they bring the perfect balance of style, comfort, and innovation.</p>
                            <p className="font-medium">Model is 167cm wearing size 36.</p>
                            <div className="pt-4">
                                <p className="font-bold">DISCLAIMER:</p>
                                <p className="mt-2">
                                    For the <strong>Dark Navy</strong> shade, please wash the jeans once before first use. These pieces are made with a special tint that gives each one a unique look. Due to the nature of the material, some color release may occur during the first 2-3 washes this is completely normal. To preserve the color, we recommend washing separately during the initial washes.
                                </p>
                            </div>
                        </div>

                        {/* Care Instructions Accordion */}
                        <div className="border-t border-gray-200 pt-4">
                            <button
                                onClick={() => setIsCareInstructionsOpen(!isCareInstructionsOpen)}
                                className="w-full flex items-center justify-between py-3 text-sm font-medium"
                            >
                                CARE INSTRUCTIONS
                                <span>{isCareInstructionsOpen ? '-' : '+'}</span>
                            </button>
                            {isCareInstructionsOpen && (
                                <div className="pb-4 text-sm text-gray-600 leading-relaxed">
                                    <p>Machine wash cold. Do not bleach. Tumble dry low. Warm iron if needed.</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-gray-200">
                            <button className="flex items-center gap-2 text-sm hover:opacity-70">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share2 w-4 h-4"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
                                <span>Share</span>
                            </button>
                            <button className="flex items-center gap-2 text-sm hover:opacity-70">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter w-4 h-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                                <span>Tweet</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* You Might Also Like Section */}
            {relatedProducts && relatedProducts.length > 0 && (
                <div className="mt-16 pt-16 border-t border-gray-200">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl text-center mb-8 uppercase tracking-wide">
                            You might also like
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedProducts.slice(0, 3).map((relatedProduct) => (
                                <Link
                                    key={relatedProduct.id}
                                    href={`/products/${relatedProduct.slug}`}
                                >
                                    <div className="group cursor-pointer">
                                        {/* Product Image */}
                                        <div className="bg-gray-50 mb-3 overflow-hidden">
                                            <Image
                                                src={relatedProduct.image}
                                                alt={relatedProduct.title}
                                                width={400}
                                                height={600}
                                                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <h3 className="text-sm mb-1">{relatedProduct.title}</h3>
                                        <p className="text-sm">
                                            {relatedProduct.salePrice ? (
                                                <>
                                                    <span className="line-through text-gray-500 mr-2">
                                                        LE {relatedProduct.basePrice.toFixed(2)}
                                                    </span>
                                                    LE {relatedProduct.salePrice.toFixed(2)}
                                                </>
                                            ) : (
                                                `LE ${relatedProduct.basePrice.toFixed(2)}`
                                            )}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
