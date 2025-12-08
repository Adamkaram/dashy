"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { AddToCartNotificationProps } from "@/lib/theme/component-types";
import { Button } from "@/components/ui/button";

export default function AddToCartNotification({ isOpen, onClose, product }: AddToCartNotificationProps) {
    // Auto close after 5 seconds
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(onClose, 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 z-50 backdrop-blur-[1px]"
                    />

                    {/* Notification Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 p-6 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2 text-green-700">
                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                    <Check className="w-3 h-3" />
                                </div>
                                <span className="text-sm font-medium uppercase tracking-wide">Added to cart</span>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Product Info */}
                        <div className="flex gap-4 mb-8">
                            <div className="relative w-24 h-32 bg-gray-50 flex-shrink-0">
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 space-y-1">
                                <h3 className="text-sm font-medium uppercase tracking-wide leading-snug pr-4">
                                    {product.title}
                                </h3>
                                <p className="text-sm text-gray-500">Size: {product.size}</p>
                                <p className="text-sm font-medium">LE {product.price.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-auto space-y-3">
                            <Link href="/cart" onClick={onClose} className="block">
                                <Button variant="outline" className="w-full h-12 uppercase tracking-widest text-xs font-medium border-black hover:bg-black hover:text-white transition-all rounded-none">
                                    View Cart
                                </Button>
                            </Link>
                            <Link href="/checkout" onClick={onClose} className="block">
                                <Button className="w-full h-12 bg-black text-white hover:bg-gray-900 uppercase tracking-widest text-xs font-medium rounded-none">
                                    Check out
                                </Button>
                            </Link>
                            <button
                                onClick={onClose}
                                className="w-full text-center text-xs text-gray-500 underline hover:text-black mt-2"
                            >
                                Continue shopping
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
