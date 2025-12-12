"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/Select";
import { useCart } from "@/context/CartContext";
import { useThemeToast } from "@/hooks/useThemeToast";

export default function Checkout() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const toast = useThemeToast();

    // Form State
    const [email, setEmail] = useState("");
    const [emailOffers, setEmailOffers] = useState(false);
    const [country, setCountry] = useState("Egypt");
    const [fullName, setFullName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [governorate, setGovernorate] = useState("");
    const [phone, setPhone] = useState("");
    const [saveInfo, setSaveInfo] = useState(false);

    // Coupon State
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
    const [validatingCoupon, setValidatingCoupon] = useState(false);

    // Payment/Billing State
    const [paymentMethod, setPaymentMethod] = useState("cod"); // Default COD
    const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

    const inputStyles = "h-[50px] px-4 bg-gray-50 border-gray-100 rounded-lg text-[#46423D] text-sm focus-visible:ring-2 focus-visible:ring-[black]/20 focus-visible:border-[black] outline-none transition-all placeholder:text-gray-400 w-full";

    const governorates = [
        { value: "Cairo", label: "Cairo" },
        { value: "Giza", label: "Giza" },
        { value: "Alexandria", label: "Alexandria" },
        { value: "Dakahlia", label: "Dakahlia" },
        { value: "Sharqia", label: "Sharqia" },
        { value: "Monufia", label: "Monufia" },
        { value: "Qalubia", label: "Qalubia" },
        { value: "Gharbia", label: "Gharbia" },
        { value: "Beheira", label: "Beheira" },
        { value: "Damietta", label: "Damietta" },
        { value: "Port Said", label: "Port Said" },
        { value: "Ismailia", label: "Ismailia" },
        { value: "Suez", label: "Suez" },
        { value: "Sharkia", label: "Sharkia" },
        { value: "Beni Suef", label: "Beni Suef" },
        { value: "Fayoum", label: "Fayoum" },
        { value: "Minya", label: "Minya" },
        { value: "Assiut", label: "Assiut" },
        { value: "Sohag", label: "Sohag" },
        { value: "Qena", label: "Qena" },
        { value: "Luxor", label: "Luxor" },
        { value: "Aswan", label: "Aswan" },
        { value: "Red Sea", label: "Red Sea" },
        { value: "New Valley", label: "New Valley" },
        { value: "Matrouh", label: "Matrouh" },
        { value: "North Sinai", label: "North Sinai" },
        { value: "South Sinai", label: "South Sinai" },
    ];

    const subtotal = getTotalPrice();
    const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
    const total = Math.max(0, subtotal - discountAmount);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setValidatingCoupon(true);
        try {
            const res = await fetch('/api/store/coupons/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode.trim(), order_amount: subtotal })
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Invalid coupon');
            }

            setAppliedCoupon({
                code: data.coupon.code, // Use canonical code from DB
                discount: data.discount
            });
            setCouponCode(data.coupon.code); // Update input to match
            toast.success("Coupon Applied", `Saved EGP ${data.discount}`);
        } catch (error: any) {
            toast.error("Coupon Error", error.message);
            setAppliedCoupon(null);
        } finally {
            setValidatingCoupon(false);
        }
    };

    const handleCompleteOrder = async () => {
        if (!fullName || !address || !city || !governorate || !phone) {
            toast.error("Missing Info", "Please fill in all required delivery fields.");
            return;
        }

        if (items.length === 0) {
            toast.error("Empty Cart", "Your cart is empty.");
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                customerName: fullName,
                customerEmail: email || null,
                customerPhone: phone,
                address,
                city,
                governorate,
                country,
                items,
                totalAmount: total,
                notes: "",
                couponCode: appliedCoupon?.code || null,
                discount: appliedCoupon?.discount || 0
            };

            const response = await fetch('/api/store/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to place order");
            }

            toast.orderSuccess(result.order.id.slice(0, 8).toUpperCase(), fullName);

            clearCart();
            router.push('/');
        } catch (error: any) {
            console.error("Order Error:", error);
            toast.error("Something went wrong", error.message || "Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
                <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                <Link href="/">
                    <Button>Return to Shop</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-[#46423D]">
            {/* Header handled by Layout */}

            <div className="container mx-auto px-4 lg:px-32 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left: Form */}
                    <div className="space-y-8 max-w-lg mx-auto lg:mx-0 w-full">
                        {/* Contact Section */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-medium text-gray-900">Contact</h2>
                            </div>
                            <Input
                                type="email"
                                placeholder="Email (Optional)"
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

                                {/* Merged Name Input */}
                                <Input
                                    type="text"
                                    placeholder="Full name"
                                    className={inputStyles}
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />

                                <Input
                                    type="text"
                                    placeholder="Address"
                                    className={inputStyles}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        type="text"
                                        placeholder="City"
                                        className={inputStyles}
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                    <Select
                                        value={governorate}
                                        onChange={setGovernorate}
                                        options={governorates}
                                        placeholder="Governorate"
                                        className="bg-gray-50 border-gray-100 h-[50px] rounded-lg"
                                    />
                                </div>

                                <Input
                                    type="tel"
                                    placeholder="Phone"
                                    className={inputStyles}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={saveInfo}
                                            onChange={(e) => setSaveInfo(e.target.checked)}
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
                                                checked={paymentMethod === 'cod'}
                                                onChange={() => setPaymentMethod('cod')}
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
                                <label className={`flex items-center gap-3 cursor-pointer border rounded-lg px-5 py-4 transition-colors ${billingSameAsShipping ? 'border-[black] bg-[#F4F7FF]/30' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="billing"
                                            checked={billingSameAsShipping}
                                            onChange={() => setBillingSameAsShipping(true)}
                                            className="peer h-4 w-4 appearance-none rounded-full border border-gray-300 checked:border-[black] checked:border-[4px] transition-all"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">Same as shipping address</span>
                                </label>
                                <label className={`flex items-center gap-3 cursor-pointer border rounded-lg px-5 py-4 transition-colors ${!billingSameAsShipping ? 'border-[black] bg-[#F4F7FF]/30' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="billing"
                                            checked={!billingSameAsShipping}
                                            onChange={() => setBillingSameAsShipping(false)}
                                            className="peer h-4 w-4 appearance-none rounded-full border border-gray-300 checked:border-[black] checked:border-[4px] transition-all"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">Use a different billing address</span>
                                </label>
                            </div>
                        </section>

                        {/* Complete Order Button */}
                        <Button
                            className="w-full h-12 bg-black text-white hover:bg-black/80 rounded-lg text-base font-medium transition-all shadow-sm"
                            onClick={handleCompleteOrder}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Complete order"}
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
                            {/* Real Cart Items */}
                            {items.map((item, index) => (
                                <div key={`${item.id}-${index}`} className="flex gap-4 items-center">
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden relative">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                            )}
                                        </div>
                                        <span className="absolute -top-3 -right-3 bg-gray-500 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                                        <div className="flex flex-wrap gap-1">
                                            {item.selectedOptions && Object.entries(item.selectedOptions).map(([key, val]) => (
                                                <span key={key} className="text-sm text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                                                    {val}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-base font-medium text-gray-900">EGP {(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}

                            {/* Discount Code */}
                            <div>
                                <div className="flex gap-3">
                                    <Input
                                        type="text"
                                        placeholder="Discount code"
                                        className={inputStyles}
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        disabled={!!appliedCoupon}
                                    />
                                    {appliedCoupon ? (
                                        <Button
                                            onClick={() => {
                                                setAppliedCoupon(null);
                                                setCouponCode("");
                                                toast.info("Coupon Removed");
                                            }}
                                            variant="destructive"
                                            className="h-[50px] px-6 rounded-lg text-sm font-medium transition-all shadow-sm"
                                        >
                                            Remove
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleApplyCoupon}
                                            disabled={validatingCoupon || !couponCode}
                                            className="h-[50px] px-6 bg-black text-white hover:bg-black/80 rounded-lg text-sm font-medium transition-all shadow-sm"
                                        >
                                            {validatingCoupon ? '...' : 'Apply'}
                                        </Button>
                                    )}
                                </div>
                                {appliedCoupon && (
                                    <p className="text-green-600 text-sm mt-2 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                        Coupon <strong>{appliedCoupon.code}</strong> applied: -EGP {appliedCoupon.discount}
                                    </p>
                                )}
                            </div>

                            {/* Summary */}
                            <div className="space-y-3 pt-6 border-t border-gray-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">EGP {subtotal.toFixed(2)}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Discount ({appliedCoupon.code})</span>
                                        <span className="font-medium">-EGP {appliedCoupon.discount.toFixed(2)}</span>
                                    </div>
                                )}
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
                                    <span className="text-2xl font-semibold text-gray-900 px-1">{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
