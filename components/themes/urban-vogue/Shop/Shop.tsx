"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import Loading from "../Loading/Loading";

interface Product {
    id: string;
    slug: string;
    name: string;
    price: number;
    category: string;
    image: string;
    badge?: string;
    salePrice?: number;
}

const categories = ["All", "Jeans", "Jackets", "Quarter Zips", "Crewnecks"];
const priceRanges = [
    { label: "All Prices", min: 0, max: Infinity },
    { label: "Under LE 1,500", min: 0, max: 1500 },
    { label: "LE 1,500 - LE 2,500", min: 1500, max: 2500 },
    { label: "LE 2,500 - LE 3,500", min: 2500, max: 3500 },
    { label: "Over LE 3,500", min: 3500, max: Infinity },
];

export default function Shop() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedPriceRange, setSelectedPriceRange] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/api/store/products?slug=urban-vogue');
                const data = await response.json();

                // Transform API data to match our interface
                const transformedProducts = data.map((product: any) => ({
                    id: product.id,
                    slug: product.slug,
                    name: product.title || product.name,
                    price: product.basePrice || product.price || 0,
                    category: product.category?.name || "Uncategorized",
                    image: product.image || '/placeholder.jpg',
                    badge: product.badge,
                    salePrice: product.salePrice,
                }));

                setProducts(transformedProducts);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) => {
        const categoryMatch =
            selectedCategory === "All" || product.category === selectedCategory;
        const displayPrice = product.salePrice || product.price;
        const priceMatch =
            displayPrice >= priceRanges[selectedPriceRange].min &&
            displayPrice <= priceRanges[selectedPriceRange].max;

        return categoryMatch && priceMatch;
    });

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-normal tracking-wider uppercase mb-4 font-montserrat">
                    All Products
                </h1>
                <div className="flex items-center justify-between">
                    <p className="text-gray-600">
                        {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
                    </p>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors lg:hidden"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <motion.aside
                    initial={false}
                    animate={{
                        height: showFilters ? "auto" : 0,
                        opacity: showFilters ? 1 : 0,
                    }}
                    className="w-full lg:w-64 lg:h-auto lg:opacity-100 overflow-hidden"
                >
                    <div className="space-y-8 pb-8 lg:pb-0">
                        {/* Category Filter */}
                        <div>
                            <h3 className="font-medium mb-4 font-montserrat">Category</h3>
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`block w-full text-left px-3 py-2 rounded-md transition-colors font-montserrat ${selectedCategory === category
                                            ? "bg-black text-white"
                                            : "hover:bg-gray-100"
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div>
                            <h3 className="font-medium mb-4 font-montserrat">Price Range</h3>
                            <div className="space-y-2">
                                {priceRanges.map((range, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedPriceRange(index)}
                                        className={`block w-full text-left px-3 py-2 rounded-md transition-colors text-sm font-montserrat ${selectedPriceRange === index
                                            ? "bg-black text-white"
                                            : "hover:bg-gray-100"
                                            }`}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.aside>

                {/* Products Grid */}
                <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link href={`/products/${product.slug}`}>
                                    <div className="group cursor-pointer relative">
                                        {/* Badge */}
                                        {product.badge && (
                                            <div className="absolute top-3 left-3 z-10">
                                                <span
                                                    className={`px-3 py-1 text-xs text-white ${product.badge === "Sale"
                                                        ? "bg-red-600"
                                                        : "bg-gray-700"
                                                        }`}
                                                >
                                                    {product.badge}
                                                </span>
                                            </div>
                                        )}

                                        {/* Product Image */}
                                        <div className="bg-gray-50 mb-3 overflow-hidden aspect-[3/4]">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                width={400}
                                                height={600}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-montserrat">{product.name}</h3>
                                            <div className="flex items-center gap-2">
                                                {product.salePrice ? (
                                                    <>
                                                        <span className="text-sm text-gray-500 line-through">
                                                            LE {product.price.toFixed(2)}
                                                        </span>
                                                        <span className="text-sm font-medium font-montserrat">
                                                            LE {product.salePrice.toFixed(2)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-sm font-medium font-montserrat">
                                                        LE {product.price.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                            {product.salePrice && (
                                                <p className="text-xs text-red-600">
                                                    Save{" "}
                                                    {Math.round(
                                                        ((product.price - product.salePrice) /
                                                            product.price) *
                                                        100
                                                    )}
                                                    %
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-gray-600 mb-4">
                                No products found matching your filters.
                            </p>
                            <button
                                onClick={() => {
                                    setSelectedCategory("All");
                                    setSelectedPriceRange(0);
                                }}
                                className="text-black underline hover:opacity-70 font-montserrat"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
