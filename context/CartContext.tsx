"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    size: string;
    image: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: string, size: string) => void;
    updateQuantity: (id: string, size: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            setItems(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (item: Omit<CartItem, "quantity">) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find(
                (i) => i.id === item.id && i.size === item.size
            );

            if (existingItem) {
                return prevItems.map((i) =>
                    i.id === item.id && i.size === item.size
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }

            return [...prevItems, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string, size: string) => {
        setItems((prevItems) =>
            prevItems.filter((item) => !(item.id === id && item.size === size))
        );
    };

    const updateQuantity = (id: string, size: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id, size);
            return;
        }

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id && item.size === size ? { ...item, quantity } : item
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
