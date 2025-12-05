'use client';

import { useThemeComponents } from '@/lib/theme/ThemeComponentProvider';
import { useCart } from '@/context/CartContext';

export default function CartPageRoute() {
    const { Cart } = useThemeComponents();

    if (Cart) {
        return <Cart />;
    }

    // Fallback if no theme cart is defined (simple default)
    const { items } = useCart();
    return (
        <div className="container mx-auto p-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
            <p>Cart component not found for this theme.</p>
            <p>Items in cart: {items.length}</p>
        </div>
    );
}
