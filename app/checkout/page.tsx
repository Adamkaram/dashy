"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/Select";

export default function CheckoutPage() {
    const [email, setEmail] = useState("");
    const [emailOffers, setEmailOffers] = useState(false);
    const [sameAddress, setSameAddress] = useState(true);
    const [country, setCountry] = useState("Egypt");
    const [governorate, setGovernorate] = useState("");

    // Dashboard-like input styles (Refined: smaller height/width)
    const inputStyles = "h-[50px] px-4 bg-gray-50 border-gray-100 rounded-lg text-[#46423D] text-sm focus-visible:ring-2 focus-visible:ring-[black]/20 focus-visible:border-[black] outline-none transition-all placeholder:text-gray-400 w-full";

    const governorates = [
        { value: "cairo", label: "Cairo" },
        { value: "giza", label: "Giza" },
        { value: "alexandria", label: "Alexandria" },
        { value: "dakahlia", label: "Dakahlia" },
        { value: "sharqia", label: "Sharqia" },
        { value: "monufia", label: "Monufia" },
        { value: "qalubia", label: "Qalubia" },
        { value: "gharbia", label: "Gharbia" },
        { value: "beheira", label: "Beheira" },
        { value: "damietta", label: "Damietta" },
        { value: "port-said", label: "Port Said" },
        { value: "ismailia", label: "Ismailia" },
        { value: "suez", label: "Suez" },
        { value: "sharkia", label: "Sharkia" },
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-[#46423D]">
            {/* Simplified Header for Checkout */}
            <header className="border-b border-gray-100 py-4">
                <div className="container mx-auto px-4 lg:px-20">
                    <div className="flex items-center justify-between">
                        <div className="flex-1"></div>
                        <Image
                            src="https://ext.same-assets.com/1322334751/3249687508.png"
                            alt="thestahps"
                            width={150}
                            height={40}
                            className="h-7 w-auto"
                        />
                        <div className="flex-1"></div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 lg:px-32 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left: Form */}
                    <div className="space-y-8 max-w-lg mx-auto lg:mx-0 w-full">
                        {/* Contact Section */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-medium text-gray-900">Contact</h2>
                                <a href="#" className="text-sm text-[black] underline hover:no-underline">
                                    Sign in
                                </a>
                            </div>
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputStyles}
                            />
                            <label className="flex items-center gap-3 mt-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={emailOffers}
                                        onChange={(e) => setEmailOffers(e.target.checked)}
                                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:bg-[black] checked:border-[black] hover:border-[black]"
                                    />
                                    <svg
                                        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                                        width="10"
                                        height="10"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M10 3L4.5 8.5L2 6"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Email me with news and offers</span>
                            </label>
                        </section>

                        {/* Delivery Section */}
                        <section className="space-y-5">
                            <h2 className="text-xl font-medium text-gray-900">Delivery</h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2 px-1">
                                        Country/Region
                                    </label>
                                    <Select
                                        value={country}
                                        onChange={setCountry}
                                        options={[{ value: "Egypt", label: "Egypt" }]}
                                        className="bg-gray-50 border-gray-100 h-[50px] rounded-lg"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Input type="text" placeholder="First name" className={inputStyles} />
                                    <Input type="text" placeholder="Last name" className={inputStyles} />
                                </div>

                                <Input type="text" placeholder="Address" className={inputStyles} />
                                <Input type="text" placeholder="Apartment, suite, etc. (optional)" className={inputStyles} />

                                <div className="grid grid-cols-3 gap-3">
                                    <Input type="text" placeholder="City" className={inputStyles} />
                                    <Select
                                        value={governorate}
                                        onChange={setGovernorate}
                                        options={governorates}
                                        placeholder="Governorate"
                                        className="bg-gray-50 border-gray-100 h-[50px] rounded-lg"
                                    />
                                    <Input type="text" placeholder="Postal code (optional)" className={inputStyles} />
                                </div>

                                <Input type="tel" placeholder="Phone" className={inputStyles} />

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:bg-[black] checked:border-[black] hover:border-[black]"
                                        />
                                        <svg
                                            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                                            width="10"
                                            height="10"
                                            viewBox="0 0 12 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M10 3L4.5 8.5L2 6"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                        Save this information for next time
                                    </span>
                                </label>
                            </div>
                        </section>

                        {/* Shipping Method */}
                        <section>
                            <h3 className="text-xl font-medium text-gray-900 mb-4">Shipping method</h3>
                            <div className="bg-gray-50 border border-gray-100 rounded-lg px-6 py-6 text-center text-sm text-gray-500">
                                Enter your shipping address to view available shipping methods.
                            </div>
                        </section>

                        {/* Payment Section */}
                        <section>
                            <h2 className="text-xl font-medium text-gray-900 mb-2">Payment</h2>
                            <p className="text-sm text-gray-500 mb-5">
                                All transactions are secure and encrypted.
                            </p>
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="px-5 py-4 bg-[#F4F7FF]/50 border-b border-gray-200">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="payment"
                                                defaultChecked
                                                className="peer h-4 w-4 appearance-none rounded-full border border-gray-300 checked:border-[black] checked:border-[4px] transition-all"
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                            Cash on Delivery (COD)
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </section>

                        {/* Billing Address */}
                        <section>
                            <h3 className="text-xl font-medium text-gray-900 mb-4">Billing address</h3>
                            <div className="space-y-3">
                                <label className={`flex items-center gap-3 cursor-pointer border rounded-lg px-5 py-4 transition-colors ${sameAddress ? 'border-[black] bg-[#F4F7FF]/30' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="billing"
                                            checked={sameAddress}
                                            onChange={() => setSameAddress(true)}
                                            className="peer h-4 w-4 appearance-none rounded-full border border-gray-300 checked:border-[black] checked:border-[4px] transition-all"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">Same as shipping address</span>
                                </label>
                                <label className={`flex items-center gap-3 cursor-pointer border rounded-lg px-5 py-4 transition-colors ${!sameAddress ? 'border-[black] bg-[#F4F7FF]/30' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="billing"
                                            checked={!sameAddress}
                                            onChange={() => setSameAddress(false)}
                                            className="peer h-4 w-4 appearance-none rounded-full border border-gray-300 checked:border-[black] checked:border-[4px] transition-all"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">Use a different billing address</span>
                                </label>
                            </div>
                        </section>

                        {/* Complete Order Button */}
                        <Button className="w-full h-12 bg-black text-white hover:bg-black/80 rounded-lg text-base font-medium transition-all shadow-sm">
                            Complete order
                        </Button>

                        {/* Refund Policy */}
                        <div className="text-center pt-6 border-t border-gray-100">
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 underline underline-offset-4">
                                Refund policy
                            </a>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="hidden lg:block lg:pl-16 border-l border-gray-100">
                        <div className="sticky top-24 space-y-8 max-w-sm">
                            {/* Cart Item */}
                            <div className="flex gap-4 items-center">
                                <div className="relative">
                                    <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden">
                                        <Image
                                            src="https://ext.same-assets.com/1322334751/3462085725.jpeg"
                                            alt="Burnt Denim Blue Women's Jorts"
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <span className="absolute -top-3 -right-3 bg-gray-500 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                                        1
                                    </span>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h3 className="text-base font-medium text-gray-900">Burnt Denim Blue Women&apos;s Jorts</h3>
                                    <p className="text-sm text-gray-500">Size: 46</p>
                                </div>
                                <p className="text-base font-medium text-gray-900">E800.00</p>
                            </div>

                            {/* Discount Code */}
                            <div>
                                <div className="flex gap-3">
                                    <Input
                                        type="text"
                                        placeholder="Discount code"
                                        className={inputStyles}
                                    />
                                    <Button className="h-[50px] px-6 bg-black text-white hover:bg-black/80 rounded-lg text-sm font-medium transition-all shadow-sm">
                                        Apply
                                    </Button>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="space-y-3 pt-6 border-t border-gray-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">E800.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-gray-400 text-xs">Calculated at next step</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-medium text-gray-900">Total</span>
                                    <span className="text-xs text-gray-500">EGP</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xs text-gray-500 font-medium">EGP</span>
                                    <span className="text-2xl font-semibold text-gray-900 px-1">800.00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
