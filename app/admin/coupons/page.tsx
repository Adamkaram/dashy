'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';

interface Coupon {
    id: string;
    code: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_amount: number;
    max_discount?: number;
    usage_limit?: number;
    used_count: number;
    expires_at?: string;
    is_active: boolean;
    created_at: string;
}

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        code: '',
        discount_type: 'percentage' as 'percentage' | 'fixed',
        discount_value: '',
        min_order_amount: '',
        max_discount: '',
        usage_limit: '',
        expires_at: '',
        is_active: true,
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const res = await fetch('/api/admin/coupons');
            const data = await res.json();

            if (Array.isArray(data)) {
                setCoupons(data);
            } else {
                console.error('API returned non-array data:', data);
                setCoupons([]);
            }
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
            setCoupons([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingCoupon
                ? `/api/admin/coupons/${editingCoupon.id}`
                : '/api/admin/coupons';

            const method = editingCoupon ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: formData.code,
                    discount_type: formData.discount_type,
                    discount_value: parseFloat(formData.discount_value),
                    min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : 0,
                    max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
                    usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
                    expires_at: formData.expires_at || null,
                    is_active: formData.is_active,
                }),
            });

            if (!res.ok) throw new Error('Failed to save coupon');

            toast.success(editingCoupon ? 'تم تحديث الكوبون بنجاح' : 'تم إنشاء الكوبون بنجاح');
            fetchCoupons();
            closeModal();
        } catch (error) {
            console.error('Error saving coupon:', error);
            toast.error('فشل في حفظ الكوبون');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا الكوبون؟')) return;

        try {
            const res = await fetch(`/api/admin/coupons/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete');

            toast.success('تم حذف الكوبون بنجاح');
            setCoupons(coupons.filter((c) => c.id !== id));
        } catch (error) {
            console.error('Failed to delete coupon:', error);
            toast.error('فشل في حذف الكوبون');
        }
    };

    const toggleActive = async (coupon: Coupon) => {
        try {
            const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    is_active: !coupon.is_active,
                }),
            });

            if (!res.ok) throw new Error('Failed to update');

            setCoupons(
                coupons.map((c) =>
                    c.id === coupon.id ? { ...c, is_active: !c.is_active } : c
                )
            );
        } catch (error) {
            console.error('Failed to toggle active:', error);
            toast.error('فشل في تحديث الحالة');
        }
    };

    const openModal = (coupon?: Coupon) => {
        if (coupon) {
            setEditingCoupon(coupon);
            setFormData({
                code: coupon.code,
                discount_type: coupon.discount_type,
                discount_value: coupon.discount_value.toString(),
                min_order_amount: coupon.min_order_amount.toString(),
                max_discount: coupon.max_discount?.toString() || '',
                usage_limit: coupon.usage_limit?.toString() || '',
                expires_at: coupon.expires_at ? coupon.expires_at.split('T')[0] : '',
                is_active: coupon.is_active,
            });
        } else {
            setEditingCoupon(null);
            setFormData({
                code: '',
                discount_type: 'percentage',
                discount_value: '',
                min_order_amount: '',
                max_discount: '',
                usage_limit: '',
                expires_at: '',
                is_active: true,
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCoupon(null);
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
        toast.success('تم نسخ الكود');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6500]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">الكوبونات</h1>
                    <p className="text-gray-600 mt-1">إدارة كوبونات الخصم</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    <span>إضافة كوبون</span>
                </button>
            </div>

            {/* Coupons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {coupons.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300"
                        >
                            لا توجد كوبونات حالياً. ابدأ بإضافة كوبون جديد.
                        </motion.div>
                    ) : (
                        Array.isArray(coupons) && coupons.map((coupon) => (
                            <motion.div
                                key={coupon.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all group"
                            >
                                {/* Code */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <code className="text-lg font-bold text-[#FF6500] bg-[#FFF7ED] px-3 py-1 rounded-lg">
                                            {coupon.code}
                                        </code>
                                        <button
                                            onClick={() => copyCode(coupon.code)}
                                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                        >
                                            {copiedCode === coupon.code ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => toggleActive(coupon)}
                                        disabled={!!(coupon.usage_limit && coupon.used_count >= coupon.usage_limit)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md transition-all ${coupon.usage_limit && coupon.used_count >= coupon.usage_limit
                                            ? 'bg-red-500/90 text-white shadow-md shadow-red-500/20 cursor-not-allowed'
                                            : coupon.is_active
                                                ? 'bg-green-500/90 text-white shadow-md shadow-green-500/20 hover:scale-105'
                                                : 'bg-red-500/90 text-white shadow-md shadow-red-500/20 hover:scale-105'
                                            }`}
                                    >
                                        {coupon.usage_limit && coupon.used_count >= coupon.usage_limit
                                            ? 'مكتمل'
                                            : coupon.is_active
                                                ? 'نشط'
                                                : 'غير نشط'}
                                    </button>
                                </div>

                                {/* Discount */}
                                {/* Discount */}
                                <div className="mb-4">
                                    <p className="text-2xl font-bold text-gray-900">
                                        {coupon.discount_type === 'percentage'
                                            ? `${coupon.discount_value}%`
                                            : `${coupon.discount_value} EGP`}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {coupon.discount_type === 'percentage' ? 'خصم نسبي' : 'خصم ثابت'}
                                    </p>
                                </div>

                                {/* Stats */}
                                < div className="space-y-2 mb-4 text-sm" >
                                    {
                                        coupon.min_order_amount > 0 && (
                                            <div className="flex justify-between text-gray-600">
                                                <span>الحد الأدنى:</span>
                                                <span className="font-medium">{coupon.min_order_amount} EGP</span>
                                            </div>
                                        )
                                    }
                                    {
                                        coupon.usage_limit && (
                                            <div className="flex justify-between text-gray-600">
                                                <span>الاستخدام:</span>
                                                <span className="font-medium">
                                                    {coupon.used_count} / {coupon.usage_limit}
                                                </span>
                                            </div>
                                        )
                                    }
                                    {
                                        coupon.expires_at && (
                                            <div className="flex justify-between text-gray-600">
                                                <span>ينتهي:</span>
                                                <span className="font-medium">
                                                    {new Date(coupon.expires_at).toLocaleDateString('ar-KW')}
                                                </span>
                                            </div>
                                        )
                                    }
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => openModal(coupon)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span>تعديل</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(coupon.id)}
                                        className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )
                    }
                </AnimatePresence >
            </div >

            {/* Modal */}
            <AnimatePresence>
                {
                    showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            >
                                <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {editingCoupon ? 'تعديل الكوبون' : 'إضافة كوبون جديد'}
                                    </h2>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                    {/* Code */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            كود الكوبون <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6500] focus:border-transparent outline-none"
                                            required
                                            placeholder="SUMMER2024"
                                        />
                                    </div>

                                    {/* Discount Type & Value */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                نوع الخصم <span className="text-red-600">*</span>
                                            </label>
                                            <Select
                                                value={formData.discount_type}
                                                onChange={(value) => setFormData({ ...formData, discount_type: value as 'percentage' | 'fixed' })}
                                                options={[
                                                    { value: 'percentage', label: 'نسبة مئوية (%)' },
                                                    { value: 'fixed', label: 'مبلغ ثابت (EGP)' },
                                                ]}
                                                placeholder="اختر نوع الخصم"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                قيمة الخصم <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.discount_value}
                                                onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6500] focus:border-transparent outline-none"
                                                required
                                                placeholder={formData.discount_type === 'percentage' ? '10' : '5'}
                                            />
                                        </div>
                                    </div>

                                    {/* Min Order & Max Discount */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                الحد الأدنى للطلب (EGP)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.min_order_amount}
                                                onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6500] focus:border-transparent outline-none"
                                                placeholder="0"
                                            />
                                        </div>
                                        {formData.discount_type === 'percentage' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    الحد الأقصى للخصم (EGP)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={formData.max_discount}
                                                    onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6500] focus:border-transparent outline-none"
                                                    placeholder="غير محدد"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Usage Limit & Expiry */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                حد الاستخدام
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.usage_limit}
                                                onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6500] focus:border-transparent outline-none"
                                                placeholder="غير محدد"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                تاريخ الانتهاء
                                            </label>
                                            <DatePicker
                                                value={formData.expires_at ? new Date(formData.expires_at) : undefined}
                                                onChange={(date) => setFormData({ ...formData, expires_at: date ? date.toISOString().split('T')[0] : '' })}
                                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                            />
                                        </div>
                                    </div>

                                    {/* Active Toggle */}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="w-4 h-4 text-[#FF6500] border-gray-300 rounded focus:ring-[#FF6500]"
                                        />
                                        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                                            كوبون نشط
                                        </label>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                                        >
                                            {editingCoupon ? 'تحديث' : 'إضافة'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            إلغاء
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )
                }
            </AnimatePresence >
        </div >
    );
}
