"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    selectedOptions: Record<string, string>;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: string, selectedOptions: Record<string, string>) => void;
    updateQuantity: (id: string, selectedOptions: Record<string, string>, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

// Helper to compare options
const areOptionsEqual = (opts1: Record<string, string>, opts2: Record<string, string>) => {
    const keys1 = Object.keys(opts1).sort();
    const keys2 = Object.keys(opts2).sort();
    if (keys1.length !== keys2.length) return false;
    return keys1.every(key => opts1[key] === opts2[key]);
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // Initialize functionality only after mount to avoid hydration mismatch
    useEffect(() => {
        setIsMounted(true);
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart from local storage", e);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes, but only after mount
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("cart", JSON.stringify(items));
        }
    }, [items, isMounted]);

    const addToCart = (item: Omit<CartItem, "quantity">) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find(
                (i) => i.id === item.id && areOptionsEqual(i.selectedOptions, item.selectedOptions)
            );

            if (existingItem) {
                return prevItems.map((i) =>
                    i.id === item.id && areOptionsEqual(i.selectedOptions, item.selectedOptions)
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }

            return [...prevItems, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string, selectedOptions: Record<string, string>) => {
        setItems((prevItems) =>
            prevItems.filter((item) => !(item.id === id && areOptionsEqual(item.selectedOptions, selectedOptions)))
        );
    };

    const updateQuantity = (id: string, selectedOptions: Record<string, string>, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id, selectedOptions);
            return;
        }

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id && areOptionsEqual(item.selectedOptions, selectedOptions) ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const getTotalItems = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getTotalItems,
                getTotalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
