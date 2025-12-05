'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui-library/forms/Input";
import { Button } from "@/components/ui-library/buttons/Button";
import { Mail } from "lucide-react";
import ProductCard from "../ProductCard/ProductCard";
import Hero from "../Hero/Hero";

export default function Home() {
    const [products, setProducts] = useState<any[]>([]);
    const [heroLoaded, setHeroLoaded] = useState(false);

    useEffect(() => {
        // Trigger hero animation after component mounts
        const timer = setTimeout(() => setHeroLoaded(true), 100);

        async function fetchProducts() {
            try {
                const res = await fetch('/api/store/products?slug=urban-vogue');
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        }
        fetchProducts();

        return () => clearTimeout(timer);
    }, []);

    // Helper to get products for a section (simulated filtering or random)
    // Since we might not have exact categories "Second Skin", "Denim" in DB yet, 
    // we'll slice parts of the product array to populate sections.
    const secondSkinProducts = products.slice(0, 4);
    const denimProducts = products.slice(4, 8);
    const laPlageProducts = products.slice(8, 12);
    const timelessProducts = products.slice(12, 16);

    // If we don't have enough products, reuse or show available
    // Better to show real duplicates than dummy data if DB is small.

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <Hero slides={[]} />

            {/* Second Skin Collection */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-light tracking-wider mb-4">SECOND SKIN COLLECTION</h2>
                    <Link href="/shop" className="text-sm underline hover:no-underline">VIEW ALL</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {secondSkinProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            slug={product.slug}
                            image={product.image}
                            title={product.title}
                            price={`LE ${product.basePrice.toFixed(2)}`}
                            salePrice={product.salePrice ? `LE ${product.salePrice.toFixed(2)}` : undefined}
                            badge={product.badge}
                        />
                    ))}
                    {secondSkinProducts.length === 0 && <p className="text-center col-span-4 text-gray-500">Coming Soon</p>}
                </div>
            </section>

            {/* Denim Collection */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-light tracking-wider mb-4">DENIM COLLECTION</h2>
                    <Link href="/shop" className="text-sm underline hover:no-underline">VIEW ALL</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {denimProducts.length > 0 ? denimProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            slug={product.slug}
                            image={product.image}
                            title={product.title}
                            price={`LE ${product.basePrice.toFixed(2)}`}
                            salePrice={product.salePrice ? `LE ${product.salePrice.toFixed(2)}` : undefined}
                            badge={product.badge}
                        />
                    )) : (
                        // Fallback if not enough products, show secondSkin again or empty
                        <p className="text-center col-span-4 text-gray-500">Coming Soon</p>
                    )}
                </div>
            </section>

            {/* A La Plage Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-8 mb-6">
                        <img src="https://ext.same-assets.com/1322334751/8168510.png" alt="Beach icon" className="h-16" />
                        <div className="text-center">
                            <h2 className="text-4xl font-light tracking-wider mb-2">A LA PLAGE</h2>
                            <p className="text-2xl font-light" style={{ fontFamily: 'serif' }}>الى البلاج</p>
                            <p className="text-xs mt-2">EST THE STAHPS 2023</p>
                        </div>
                        <img src="https://ext.same-assets.com/1322334751/8168510.png" alt="Beach icon" className="h-16" />
                    </div>
                    <Link href="/shop" className="text-sm underline hover:no-underline">VIEW ALL</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {laPlageProducts.length > 0 ? laPlageProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            slug={product.slug}
                            image={product.image}
                            title={product.title}
                            price={`LE ${product.basePrice.toFixed(2)}`}
                            salePrice={product.salePrice ? `LE ${product.salePrice.toFixed(2)}` : undefined}
                            badge={product.badge}
                        />
                    )) : (
                        <p className="text-center col-span-4 text-gray-500">Coming Soon</p>
                    )}
                </div>
            </section>

            {/* Beach Hero Image */}
            <section className="relative h-[400px] overflow-hidden">
                <img
                    src="https://ext.same-assets.com/1322334751/1629805138.jpeg"
                    alt="A La Plage"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                        <h2 className="text-4xl font-light tracking-wider mb-2">A LA PLAGE</h2>
                        <p className="text-2xl" style={{ fontFamily: 'serif' }}>الى البلاج</p>
                    </div>
                </div>
            </section>

            {/* Timeless Threads Collection */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-light tracking-wider mb-4">TIMELESS THREADS COLLECTION</h2>
                    <Link href="/shop" className="text-sm underline hover:no-underline">VIEW ALL</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {timelessProducts.length > 0 ? timelessProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            slug={product.slug}
                            image={product.image}
                            title={product.title}
                            price={`LE ${product.basePrice.toFixed(2)}`}
                            salePrice={product.salePrice ? `LE ${product.salePrice.toFixed(2)}` : undefined}
                            badge={product.badge}
                        />
                    )) : (
                        <p className="text-center col-span-4 text-gray-500">Coming Soon</p>
                    )}
                </div>
            </section>
        </div>
    );
}
