"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CheckoutPage() {
    const [email, setEmail] = useState("");
    const [emailOffers, setEmailOffers] = useState(false);
    const [sameAddress, setSameAddress] = useState(true);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Simplified Header for Checkout */}
            <header className="border-b border-gray-200 py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-1"></div>
                        <Link href="/" className="flex items-center justify-center">
                            <span className="text-2xl font-bold tracking-tight">THE STAHPS</span>
                            {/* Replaced image with text for now as placeholder, or use tenant logo */}
                        </Link>
                        <div className="flex-1"></div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    {/* Left: Form */}
                    <div className="space-y-8">
                        {/* Contact Section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-medium">Contact</h2>
                                <a href="#" className="text-sm underline hover:opacity-70">
                                    Sign in
                                </a>
                            </div>
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full"
                            />
                            <label className="flex items-center gap-2 mt-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={emailOffers}
                                    onChange={(e) => setEmailOffers(e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <span className="text-sm">Email me with news and offers</span>
                            </label>
                        </div>

                        {/* Delivery Section */}
                        <div>
                            <h2 className="text-lg font-medium mb-4">Delivery</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-600 block mb-1">
                                        Country/Region
                                    </label>
                                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-transparent">
                                        <option>Egypt</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input type="text" placeholder="First name" />
                                    <Input type="text" placeholder="Last name" />
                                </div>

                                <Input type="text" placeholder="Address" />
                                <Input type="text" placeholder="Apartment, suite, etc. (optional)" />

                                <div className="grid grid-cols-3 gap-4">
                                    <Input type="text" placeholder="City" />
                                    <select className="border border-gray-300 rounded-md px-3 py-2 bg-transparent">
                                        <option value="">Governorate</option>
                                        <option value="cairo">Cairo</option>
                                        <option value="giza">Giza</option>
                                        <option value="alexandria">Alexandria</option>
                                    </select>
                                    <Input type="text" placeholder="Postal code (optional)" />
                                </div>

                                <Input type="tel" placeholder="Phone" />

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                    <span className="text-sm">
                                        Save this information for next time
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Shipping Method */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">Shipping method</h3>
                            <div className="bg-gray-50 border border-gray-200 rounded-md px-4 py-6 text-center text-sm text-gray-600">
                                Enter your shipping address to view available shipping methods.
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div>
                            <h2 className="text-lg font-medium mb-2">Payment</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                All transactions are secure and encrypted.
                            </p>
                            <div className="border border-gray-300 rounded-md overflow-hidden">
                                <div className="px-4 py-3 bg-gray-50 border-b border-gray-300">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment"
                                            defaultChecked
                                            className="rounded-full border-gray-300"
                                        />
                                        <span className="text-sm font-medium">
                                            Cash on Delivery (COD)
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Billing Address */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">Billing address</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-md px-4 py-3 hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="billing"
                                        checked={sameAddress}
                                        onChange={() => setSameAddress(true)}
                                        className="rounded-full border-gray-300"
                                    />
                                    <span className="text-sm">Same as shipping address</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-md px-4 py-3 hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="billing"
                                        checked={!sameAddress}
                                        onChange={() => setSameAddress(false)}
                                        className="rounded-full border-gray-300"
                                    />
                                    <span className="text-sm">Use a different billing address</span>
                                </label>
                            </div>
                        </div>

                        {/* Complete Order Button */}
                        <Button className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-md text-base font-semibold">
                            Complete order
                        </Button>

                        {/* Refund Policy */}
                        <div className="text-center pt-4 border-t border-gray-200">
                            <a href="#" className="text-sm underline hover:opacity-70">
                                Refund policy
                            </a>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:pl-8 border-l-0 lg:border-l border-gray-200">
                        <div className="sticky top-24">
                            {/* Cart Item - Placeholder data for now */}
                            <div className="flex gap-4 mb-6">
                                <div className="relative">
                                    <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                                        {/* Placeholder image */}
                                        <span className="text-xs text-gray-400">Image</span>
                                    </div>
                                    <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        1
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium">Burnt Denim Blue Women&apos;s Jorts</h3>
                                    <p className="text-xs text-gray-600">46</p>
                                </div>
                                <p className="text-sm font-medium">E800.00</p>
                            </div>

                            {/* Discount Code */}
                            <div className="mb-6">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="Discount code"
                                        className="flex-1"
                                    />
                                    <Button variant="outline" className="border-gray-300 bg-gray-100 hover:bg-gray-200">
                                        Apply
                                    </Button>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="space-y-3 pt-4 border-t border-gray-200">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>E800.00</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span>—</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">Total</span>
                                    <span className="text-xs text-gray-500">EGP</span>
                                </div>
                                <span className="text-xl font-medium">E800.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
