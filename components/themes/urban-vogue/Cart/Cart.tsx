"use client";

import Link from "next/link";
import React from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const popularProducts = [
    {
        id: 1,
        name: "Hooded Trucker Jacket in Navy Blue",
        regularPrice: "LE 3,500.00",
        salePrice: "LE 2,900.00",
        discount: "Save 17%",
        image: "https://ext.same-assets.com/1322334751/1988460870.jpeg",
        badge: "Sale",
    },
    {
        id: 2,
        name: "Hooded Trucker Jacket in Midnight Black",
        regularPrice: "LE 3,500.00",
        salePrice: "LE 2,900.00",
        discount: "Save 17%",
        image: "https://ext.same-assets.com/1322334751/2593589245.jpeg",
        badge: "Sold Out",
    },
    {
        id: 3,
        name: "Denim Quarter Zip in Grime Green",
        regularPrice: "LE 2,500.00",
        salePrice: "LE 1,200.00",
        discount: "Save 52%",
        image: "https://ext.same-assets.com/1322334751/3115209799.jpeg",
        badge: "Sold Out",
    },
    {
        id: 4,
        name: "Denim Quarter Zip in Washed Grey",
        regularPrice: "LE 2,500.00",
        salePrice: "LE 1,900.00",
        discount: "Save 24%",
        image: "https://ext.same-assets.com/1322334751/1367131858.jpeg",
        badge: "Sale",
    },
];

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();
    const isEmpty = items.length === 0;

    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-normal tracking-wider uppercase mb-8 text-center font-heading">
                CART
            </h1>

            {isEmpty ? (
                /* Empty Cart State */
                <div className="text-center mb-20">
                    <p className="text-gray-600 mb-6">Your cart is currently empty.</p>
                    <Link href="/">
                        <Button
                            variant="link"
                            className="text-black underline hover:opacity-70"
                        >
                            Continue shopping
                        </Button>
                    </Link>
                </div>
            ) : (
                /* Cart Items */
                <div className="max-w-4xl mx-auto mb-16">
                    <AnimatePresence>
                        {items.map((item) => (
                            <motion.div
                                key={`${item.id}-${item.size}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                className="flex gap-4 py-6 border-b border-gray-200"
                            >
                                {/* Product Image */}
                                <div className="w-24 h-24 bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex-1">
                                    <h3 className="font-medium mb-1">{item.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">Size: {item.size}</p>
                                    <p className="text-sm font-medium">LE {item.price.toFixed(2)}</p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() =>
                                            updateQuantity(item.id, item.size, item.quantity - 1)
                                        }
                                        className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-medium">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() =>
                                            updateQuantity(item.id, item.size, item.quantity + 1)
                                        }
                                        className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeFromCart(item.id, item.size)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Cart Summary */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-lg font-medium">Subtotal</span>
                            <span className="text-2xl font-medium">
                                LE {getTotalPrice().toFixed(2)}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Taxes and shipping calculated at checkout
                        </p>
                        <Link href="/checkout">
                            <Button className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-none">
                                PROCEED TO CHECKOUT
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Recently Viewed Section */}
            <RecentlyViewed />

            {/* Popular Picks Section */}
            <div className="mt-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl uppercase tracking-wide font-heading">Popular picks</h2>
                    <Link
                        href="/products"
                        className="text-sm underline hover:opacity-70"
                    >
                        VIEW ALL
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {popularProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: product.id * 0.1 }}
                            className="group cursor-pointer relative"
                        >
                            {/* Badge */}
                            <div className="absolute top-3 left-3 z-10">
                                <span
                                    className={`px-3 py-1 text-xs text-white ${product.badge === "Sale" ? "bg-red-600" : "bg-gray-700"
                                        }`}
                                >
                                    {product.badge}
                                </span>
                            </div>

                            {/* Product Image */}
                            <div className="bg-gray-50 mb-3 overflow-hidden">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={400}
                                    height={600}
                                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="space-y-1">
                                <h3 className="text-sm">{product.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500 line-through">
                                        {product.regularPrice}
                                    </span>
                                    <span className="text-sm font-medium">{product.salePrice}</span>
                                </div>
                                <p className="text-xs text-red-600">{product.discount}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function RecentlyViewed() {
    const [viewedItems, setViewedItems] = React.useState<any[]>([]);

    React.useEffect(() => {
        try {
            const saved = localStorage.getItem('recentlyViewed');
            if (saved) {
                setViewedItems(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to load recently viewed items', e);
        }
    }, []);

    if (viewedItems.length === 0) return null;

    return (
        <div className="mt-16 text-center">
            <h2 className="text-2xl uppercase tracking-wide font-heading mb-10">Recently Viewed</h2>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-8">
                {viewedItems.map((item) => (
                    <Link href={`/products/${item.slug}`} key={item.id} className="group block">
                        <div className="bg-gray-50 mb-4 overflow-hidden aspect-[3/4]">
                            <Image
                                src={item.image}
                                alt={item.title}
                                width={300}
                                height={400}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            />
                        </div>
                        <div className="text-center space-y-1">
                            <h3 className="text-sm font-light text-gray-900 leading-snug min-h-[2.5em] flex items-start justify-center">
                                {item.title}
                            </h3>
                            <p className="text-sm font-normal text-gray-900">
                                {item.salePrice ? (
                                    <>
                                        <span className="line-through text-gray-400 mr-2">LE {item.price.toLocaleString()}</span>
                                        <span>LE {item.salePrice.toLocaleString()}</span>
                                    </>
                                ) : (
                                    <span>LE {item.price.toLocaleString()}</span>
                                )}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
