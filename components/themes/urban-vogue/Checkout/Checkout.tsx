'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Checkout() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        notes: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            toast.error('السلة فارغة');
            return;
        }

        setLoading(true);

        try {
            // Here you would typically send order to backend
            // For now, we'll just simulate success
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast.success('تم إرسال طلبك بنجاح!');
            clearCart();
            router.push('/');
        } catch (error) {
            toast.error('حدث خطأ أثناء إرسال الطلب');
        } finally {
            setLoading(false);
        }
    };

    const totalPrice = getTotalPrice();

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-3xl font-bold font-montserrat mb-8 text-black">
                    إتمام الطلب
                </h1>

                {items.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">السلة فارغة</p>
                        <button
                            onClick={() => router.push('/shop')}
                            className="bg-black text-white px-6 py-3 font-montserrat hover:bg-gray-800 transition-colors"
                        >
                            تسوق الآن
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="bg-gray-50 p-6 border border-gray-200">
                                    <h2 className="text-xl font-semibold font-montserrat mb-4">معلومات الشحن</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                الاسم الكامل *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    البريد الإلكتروني *
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    رقم الهاتف *
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                العنوان *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                المدينة *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ملاحظات إضافية
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={formData.notes}
                                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors resize-none"
                                                placeholder="أي ملاحظات خاصة بطلبك..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 p-6 border border-gray-200 sticky top-6">
                                <h2 className="text-xl font-semibold font-montserrat mb-4">ملخص الطلب</h2>

                                <div className="space-y-3 mb-6">
                                    {items.map((item) => (
                                        <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                {item.name} ({item.size}) × {item.quantity}
                                            </span>
                                            <span className="font-medium">
                                                LE {(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-300 pt-4 mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">المجموع الفرعي</span>
                                        <span>LE {totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">الشحن</span>
                                        <span>مجاني</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold font-montserrat mt-4">
                                        <span>الإجمالي</span>
                                        <span>LE {totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full bg-black text-white py-4 font-montserrat font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'جاري المعالجة...' : 'تأكيد الطلب'}
                                </button>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    بالضغط على "تأكيد الطلب"، أنت توافق على شروط الاستخدام وسياسة الخصوصية
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
