"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Share2, Twitter, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

interface Product {
    id: string;
    title: string;
    basePrice: number;
    salePrice?: number | null;
    image: string; // Main image from DB
    slug: string;
    images?: { imageUrl: string }[]; // Gallery images
    description?: string | null;
}

interface ProductDetailsProps {
    product: Product;
    relatedProducts: Product[];
}

const sizes = ["32", "34", "36", "38", "40", "42", "44", "46"];

export default function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState("32");
    const [showCareInstructions, setShowCareInstructions] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    // Safety check for cart context
    let addToCart: any = () => console.log("Add to cart (context missing)");
    try {
        const cart = useCart();
        addToCart = cart.addToCart;
    } catch (e) {
        console.warn("Cart context not found");
    }

    // Construct image list: Prefer the `images` relation if available, otherwise just the main image repeated or single
    // The seed script puts the main image in `image`. Let's use that + any gallery images.
    // If no gallery images, we'll just mock a few variations or repeat the main one for the gallery view effect 
    // to match the design aesthetics if real gallery data is missing.
    // However, the DB schema has `productImages`.

    const galleryImages = product.images && product.images.length > 0
        ? product.images.map(img => img.imageUrl)
        : [product.image];

    // If we only have 1 image, maybe duplicate it to show the gallery UI? 
    // Or just show what we have. For a "premium" feel, let's stick to what we have but handle the UI gracefully.

    const currentImage = galleryImages[selectedImageIndex] || product.image;

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.title,
            price: product.basePrice, // Use salePrice if logic dictates
            image: product.image,
            // size: selectedSize, // Add size if cart supports it
        });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left: Product Gallery */}
                <div className="flex gap-4">
                    {/* Thumbnails */}
                    {galleryImages.length > 1 && (
                        <div className="flex flex-col gap-2 w-20">
                            {galleryImages.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`border-2 ${selectedImageIndex === index ? "border-black" : "border-gray-200"
                                        } hover:border-gray-400 transition-colors overflow-hidden aspect-[2/3]`}
                                >
                                    <Image
                                        src={img}
                                        alt={`Product view ${index + 1}`}
                                        width={80}
                                        height={120}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Main Image */}
                    <div className="flex-1 bg-gray-50 aspect-[3/4] relative">
                        <Image
                            src={currentImage}
                            alt={product.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Right: Product Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-normal tracking-wide uppercase mb-2 font-montserrat">
                            {product.title}
                        </h1>
                        <div className="flex items-center gap-3">
                            {product.salePrice ? (
                                <>
                                    <p className="text-xl text-gray-500 line-through">LE {product.basePrice.toFixed(2)}</p>
                                    <p className="text-xl font-medium text-red-600">LE {product.salePrice.toFixed(2)}</p>
                                </>
                            ) : (
                                <p className="text-xl">LE {product.basePrice.toFixed(2)}</p>
                            )}
                        </div>
                    </div>

                    {/* Size Selector */}
                    <div>
                        <p className="text-sm font-medium mb-3">Size</p>
                        <div className="grid grid-cols-4 gap-2">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`py-3 border ${selectedSize === size
                                        ? "border-black bg-black text-white"
                                        : "border-gray-300 hover:border-gray-400"
                                        } transition-colors text-sm`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                        <Button
                            onClick={handleAddToCart}
                            variant="outline"
                            className="w-full h-12 text-sm font-medium tracking-wide border-black hover:bg-black hover:text-white transition-all relative rounded-none"
                        >
                            {addedToCart ? (
                                <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    ADDED TO CART
                                </motion.span>
                            ) : (
                                "ADD TO CART"
                            )}
                        </Button>
                        <Button className="w-full h-12 text-sm font-medium tracking-wide bg-black text-white hover:bg-gray-800 rounded-none">
                            BUY IT NOW
                        </Button>
                    </div>

                    {/* Product Description */}
                    <div className="space-y-4 text-sm leading-relaxed text-gray-700">
                        {product.description ? (
                            <div dangerouslySetInnerHTML={{ __html: product.description }} />
                        ) : (
                            <>
                                <p>
                                    Introducing <em>Second Skin: The Next Layer.</em>
                                </p>
                                <p>
                                    Crafted from premium denim with a unique finish, they bring the
                                    perfect balance of style, comfort, and innovation.
                                </p>
                                <p className="font-medium">Model is 167cm wearing size 36.</p>

                                <div className="pt-4">
                                    <p className="font-bold">DISCLAIMER:</p>
                                    <p className="mt-2">
                                        For the <strong>Dark Navy</strong> shade, please wash the jeans
                                        once before first use. These pieces are made with a special tint
                                        that gives each one a unique look. Due to the nature of the
                                        material, some color release may occur during the first 2-3
                                        washes this is completely normal. To preserve the color, we
                                        recommend washing separately during the initial washes.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Care Instructions - Collapsible */}
                    <div className="border-t border-gray-200 pt-4">
                        <button
                            onClick={() => setShowCareInstructions(!showCareInstructions)}
                            className="w-full flex items-center justify-between py-3 text-sm font-medium"
                        >
                            CARE INSTRUCTIONS
                            <span>{showCareInstructions ? "−" : "+"}</span>
                        </button>
                        {showCareInstructions && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="pt-3 pb-2 text-sm space-y-3 overflow-hidden"
                            >
                                <div>
                                    <p className="font-medium">1. Washing:</p>
                                    <p className="text-gray-600">
                                        Hand wash in cold water with a mild detergent, preferably
                                        with the garment turned inside out.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium">2. Drying:</p>
                                    <p className="text-gray-600">Avoid twisting your garment to dry.</p>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Social Share */}
                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                        <button className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity">
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity">
                            <Twitter className="w-4 h-4" />
                            <span>Tweet</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-16 pt-16 border-t border-gray-200">
                    <h2 className="text-2xl text-center mb-8 uppercase tracking-wide font-normal">
                        You might also like
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedProducts.map((p) => (
                            <Link key={p.id} href={`/products/${p.slug}`}>
                                <div className="group cursor-pointer">
                                    <div className="bg-gray-50 mb-3 overflow-hidden aspect-[3/4] relative">
                                        <Image
                                            src={p.image}
                                            alt={p.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                        />
                                    </div>
                                    <h3 className="text-sm mb-1 font-medium">{p.title}</h3>
                                    <div className="flex items-center gap-2">
                                        {p.salePrice ? (
                                            <>
                                                <span className="text-sm text-gray-500 line-through">LE {p.basePrice.toFixed(2)}</span>
                                                <span className="text-sm font-medium">LE {p.salePrice.toFixed(2)}</span>
                                            </>
                                        ) : (
                                            <span className="text-sm">LE {p.basePrice.toFixed(2)}</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
