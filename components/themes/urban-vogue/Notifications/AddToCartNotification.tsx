"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { AddToCartNotificationProps } from "@/lib/theme/component-types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export default function AddToCartNotification({ isOpen, onClose }: AddToCartNotificationProps) {
    const { items, getTotalPrice, removeFromCart, updateQuantity } = useCart();

    // Auto close only if explicitly requested, but for a side cart proper, usually we keep it open until user closes it. 
    // However, to keep inconsistent with "Notification" behavior for now, we might want to extend the timer or remove it?
    // The user said "Side Cart opens", implying a drawer. I will remove the auto-close to behave like a real cart drawer.
    // Wait, the prompt implies "When I click add to cart... side cart opens... shows cards not just the added card". 
    // So distinct from a toast. Removing auto-close.

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
                        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-[2px]"
                    />

                    {/* Notification Drawer (Side Cart) */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", ease: "circOut", duration: 0.4 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-50 flex flex-col border-l border-gray-100 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-black">
                                Shopping Cart ({items.length})
                            </span>
                            <button onClick={onClose} className="text-black hover:opacity-60 transition-opacity">
                                <X className="size-5" strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Cart Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
                                    <p className="text-sm uppercase tracking-wide">Your cart is empty</p>
                                    <button onClick={onClose} className="text-xs font-bold underline text-black">Start Shopping</button>
                                </div>
                            ) : (
                                items.map((item, idx) => (
                                    <div key={`${item.id}-${idx}`} className="flex gap-6 group">
                                        <div className="relative w-20 h-28 bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-start gap-4">
                                                    <h3 className="text-sm font-medium uppercase tracking-wide leading-relaxed line-clamp-2">
                                                        {item.name}
                                                    </h3>
                                                    <button
                                                        onClick={() => removeFromCart(item.id, item.selectedOptions)}
                                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <X className="size-4" />
                                                    </button>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-wrap gap-1">
                                                        {item.selectedOptions && Object.entries(item.selectedOptions).map(([key, val]) => (
                                                            <span key={key} className="text-[10px] uppercase text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                                                {val}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                                                        <span className="w-px h-3 bg-gray-300 hidden"></span>
                                                        <div className="flex items-center border border-black/10 hover:border-black/30 transition-colors bg-white">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.selectedOptions, item.quantity - 1)}
                                                                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 hover:text-black"
                                                                aria-label="Decrease quantity"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-8 text-center text-xs font-medium text-black">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.selectedOptions, item.quantity + 1)}
                                                                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 hover:text-black"
                                                                aria-label="Increase quantity"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium">LE {item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer / Calculations */}
                        {items.length > 0 && (
                            <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
                                <div className="flex justify-between items-center text-sm font-medium uppercase tracking-widest text-[#46423D]">
                                    <span>Subtotal</span>
                                    <span>LE {getTotalPrice().toLocaleString()}</span>
                                </div>
                                <p className="text-[10px] text-gray-500 text-center">Shipping & taxes calculated at checkout</p>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <Link href="/cart" onClick={onClose} className="block">
                                        <Button variant="outline" className="w-full h-14 uppercase tracking-widest text-[10px] font-bold border-black hover:bg-black hover:text-white transition-all rounded-none bg-white">
                                            View Cart
                                        </Button>
                                    </Link>
                                    <Link href="/checkout" onClick={onClose} className="block">
                                        <Button className="w-full h-14 bg-black text-white hover:bg-gray-900 uppercase tracking-widest text-[10px] font-bold rounded-none border border-black">
                                            Checkout
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
