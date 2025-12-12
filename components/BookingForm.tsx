'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { OrderSuccessToast } from '@/components/ui/CustomToast';
import { DatePicker } from '@/components/ui/DatePicker';
import { Select } from '@/components/ui/Select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { Checkbox } from '@/components/ui/Checkbox';

interface BookingFormProps {
    serviceId: string;
    basePrice: number;
    serviceOptions: any[];
    kuwaitAreas: Record<string, string[]>;
}

export default function BookingForm({
    serviceId,
    basePrice,
    serviceOptions,
    kuwaitAreas
}: BookingFormProps) {
    const [selectedOptions, setSelectedOptions] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSubmitted, setOrderSubmitted] = useState(false);
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponError, setCouponError] = useState('');
    const [discount, setDiscount] = useState(0);
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        date: '',
        time: '',
        area: '',
        couponCode: '',
        notes: ''
    });

    // Initialize selected options
    useState(() => {
        const initialOptions: any = {};
        serviceOptions.forEach((opt: any) => {
            if (opt.type === 'checkbox') {
                initialOptions[opt.id] = [];
            } else if (opt.is_required && opt.options && opt.options.length > 0) {
                initialOptions[opt.id] = opt.options[0];
            }
        });
        setSelectedOptions(initialOptions);
    });

    const calculateTotal = () => {
        let total = basePrice;

        Object.keys(selectedOptions).forEach(key => {
            const selection = selectedOptions[key];
            if (Array.isArray(selection)) {
                selection.forEach((item: any) => {
                    total += (item.price || 0);
                });
            } else if (selection && typeof selection === 'object') {
                total += (selection.price || 0);
            }
        });

        return total - discount;
    };

    const handleOptionChange = (optionId: string, type: string, choice: any, checked?: boolean) => {
        setSelectedOptions((prev: any) => {
            const newOptions = { ...prev };

            if (type === 'checkbox') {
                const currentList = newOptions[optionId] || [];
                if (checked) {
                    newOptions[optionId] = [...currentList, choice];
                } else {
                    newOptions[optionId] = currentList.filter((item: any) => item.label !== choice.label);
                }
            } else {
                newOptions[optionId] = choice;
            }
            return newOptions;
        });
    };

    const applyCoupon = async () => {
        if (!formData.couponCode.trim()) {
            setCouponError('يرجى إدخال كود الكوبون');
            return;
        }

        setCouponError('');

        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: formData.couponCode,
                    order_amount: calculateTotal(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setCouponError(data.error || 'كود الكوبون غير صحيح');
                setCouponApplied(false);
                setDiscount(0);
                return;
            }

            setDiscount(data.discount);
            setCouponApplied(true);
            setCouponError('');
            toast.success(`تم تطبيق الخصم: ${data.discount} د.ك`);
        } catch (error) {
            console.error('Coupon validation error:', error);
            setCouponError('فشل في التحقق من الكوبون');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.customer_name || !formData.customer_phone || !formData.date || !formData.time || !formData.area) {
            toast.error('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: serviceId,
                    customer_name: formData.customer_name,
                    customer_phone: formData.customer_phone,
                    date: formData.date,
                    time: formData.time,
                    area: formData.area,
                    coupon_code: formData.couponCode,
                    discount,
                    total_amount: calculateTotal(),
                    notes: formData.notes,
                    selected_options: selectedOptions
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'فشل في إرسال الطلب');

            setOrderSubmitted(true);

            toast.custom((t) => (
                <OrderSuccessToast
                    orderId={data.order.id.slice(0, 8)}
                    customerName={formData.customer_name}
                />
            ), {
                duration: 6000,
            });

            setTimeout(() => {
                setFormData({
                    customer_name: '',
                    customer_phone: '',
                    date: '',
                    time: '',
                    area: '',
                    couponCode: '',
                    notes: ''
                });
                setSelectedOptions({});
                setCouponApplied(false);
                setDiscount(0);
                setOrderSubmitted(false);
            }, 2000);

        } catch (error: any) {
            console.error('Booking error:', error);
            toast.error(error.message || 'حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="boking bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-[#46423D]/5 border border-white/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#46423D] via-[#966428] to-[#46423D] opacity-20"></div>
            <h4 className="text-[#46423D] text-2xl font-bold mb-8 text-center relative">
                <span className="relative z-10 bg-white px-4">تفاصيل المناسبة</span>
                <div className="absolute top-1/2 left-0 w-full h-px bg-gray-100 -z-0"></div>
            </h4>

            <AnimatePresence mode="wait">
                {!orderSubmitted ? (
                    <motion.form
                        key="booking-form"
                        className="space-y-5"
                        onSubmit={handleSubmit}
                        initial={{ opacity: 1, height: 'auto' }}
                        exit={{
                            opacity: 0,
                            height: 0,
                            transition: { duration: 0.5, ease: 'easeInOut' }
                        }}
                    >
                        {/* Customer Details */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="block text-[#54595F] text-sm mb-2 capitalize">
                                    الاسم<span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.customer_name}
                                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                    className="w-full h-[60px] p-3 bg-gray-50 border border-gray-100 rounded-xl text-[#46423D] text-sm focus:bg-white focus:ring-2 focus:ring-[#966428]/20 focus:border-[#966428] outline-none transition-all"
                                    required
                                    placeholder="الاسم بالكامل"
                                />
                            </div>
                            <div className="form-group">
                                <label className="block text-[#54595F] text-sm mb-2 capitalize">
                                    رقم الهاتف<span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.customer_phone}
                                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                                    className="w-full h-[60px] p-3 bg-gray-50 border border-gray-100 rounded-xl text-[#46423D] text-sm focus:bg-white focus:ring-2 focus:ring-[#966428]/20 focus:border-[#966428] outline-none transition-all"
                                    required
                                    placeholder="965xxxxxxxx"
                                />
                            </div>
                        </div>

                        {/* Date and Time */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="block text-[#54595F] text-sm mb-2 capitalize">
                                    اختر تاريخ<span className="text-red-600">*</span>
                                </label>
                                <DatePicker
                                    value={formData.date ? new Date(formData.date) : undefined}
                                    onChange={(date) => setFormData({ ...formData, date: date ? date.toISOString().split('T')[0] : '' })}
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                />
                            </div>
                            <div className="form-group">
                                <label className="block text-[#54595F] text-sm mb-2 capitalize">
                                    اختر الوقت<span className="text-red-600">*</span>
                                </label>
                                <div className="control-with-icon relative">
                                    <Select
                                        value={formData.time}
                                        onChange={(value) => setFormData({ ...formData, time: value })}
                                        options={[
                                            { value: '10:00 AM', label: '10:00 AM' },
                                            { value: '10:30 AM', label: '10:30 AM' },
                                            { value: '11:00 AM', label: '11:00 AM' },
                                            { value: '11:30 AM', label: '11:30 AM' },
                                            { value: '12:00 PM', label: '12:00 PM' },
                                            { value: '12:30 PM', label: '12:30 PM' },
                                            { value: '1:00 PM', label: '1:00 PM' },
                                            { value: '1:30 PM', label: '1:30 PM' },
                                            { value: '2:00 PM', label: '2:00 PM' },
                                            { value: '2:30 PM', label: '2:30 PM' },
                                            { value: '3:00 PM', label: '3:00 PM' },
                                            { value: '3:30 PM', label: '3:30 PM' },
                                            { value: '4:00 PM', label: '4:00 PM' },
                                            { value: '4:30 PM', label: '4:30 PM' },
                                            { value: '5:00 PM', label: '5:00 PM' },
                                            { value: '5:30 PM', label: '5:30 PM' },
                                            { value: '6:00 PM', label: '6:00 PM' },
                                            { value: '6:30 PM', label: '6:30 PM' },
                                            { value: '7:00 PM', label: '7:00 PM' },
                                            { value: '7:30 PM', label: '7:30 PM' },
                                            { value: '8:00 PM', label: '8:00 PM' },
                                            { value: '8:30 PM', label: '8:30 PM' },
                                            { value: '9:00 PM', label: '9:00 PM' },
                                            { value: '9:30 PM', label: '9:30 PM' },
                                            { value: '10:00 PM', label: '10:00 PM' },
                                        ]}
                                        placeholder="اختر الوقت"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B4786C] pointer-events-none">
                                        <Clock className="h-5 w-5" />
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Area Selection */}
                        <div className="form-group">
                            <label className="block text-gray-500 text-xs font-bold mb-2 uppercase tracking-wider">
                                اختر المنطقة<span className="text-red-500">*</span>
                            </label>
                            <Select
                                value={formData.area}
                                onChange={(value) => setFormData({ ...formData, area: value })}
                                options={Object.entries(kuwaitAreas).flatMap(([region, areas]: [string, any]) =>
                                    areas.map((area: string) => ({
                                        value: area,
                                        label: `${area} (${region})`
                                    }))
                                )}
                                placeholder="اختر المنطقة"
                            />
                        </div>

                        {/* Service Options */}
                        {serviceOptions.map((option) => (
                            <div key={option.id} className="form-group">
                                <label className="block text-gray-500 text-xs font-bold mb-2 uppercase tracking-wider">
                                    {option.title}
                                    {option.is_required && <span className="text-red-500">*</span>}
                                </label>

                                {option.type === 'select' && (
                                    <Select
                                        value={selectedOptions[option.id]?.label || ''}
                                        onChange={(value) => {
                                            const selected = option.options.find((o: any) => o.label === value);
                                            handleOptionChange(option.id, 'select', selected);
                                        }}
                                        options={option.options?.map((choice: any) => ({
                                            value: choice.label,
                                            label: `${choice.label}${choice.price > 0 ? ` (+${choice.price} د.ك)` : ''}`
                                        })) || []}
                                        placeholder={`اختر ${option.title}`}
                                    />
                                )}

                                {option.type === 'radio' && (
                                    <RadioGroup
                                        value={selectedOptions[option.id]?.label || ''}
                                        onValueChange={(value) => {
                                            const choice = option.options.find((o: any) => o.label === value);
                                            handleOptionChange(option.id, 'radio', choice);
                                        }}
                                        className="flex flex-col gap-2"
                                        dir="rtl"
                                    >
                                        {option.options?.map((choice: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <RadioGroupItem value={choice.label} id={`option_${option.id}_${idx}`} />
                                                <label
                                                    htmlFor={`option_${option.id}_${idx}`}
                                                    className="text-[#46423D] text-sm font-medium cursor-pointer"
                                                >
                                                    {choice.label} {choice.price > 0 && `(+${choice.price} د.ك)`}
                                                </label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                )}

                                {option.type === 'checkbox' && (
                                    <div className="flex flex-col gap-2" dir="rtl">
                                        {option.options?.map((choice: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`option_${option.id}_${idx}`}
                                                    checked={selectedOptions[option.id]?.some((item: any) => item.label === choice.label)}
                                                    onCheckedChange={(checked) => handleOptionChange(option.id, 'checkbox', choice, checked === true)}
                                                />
                                                <label
                                                    htmlFor={`option_${option.id}_${idx}`}
                                                    className="text-[#46423D] text-sm font-medium cursor-pointer"
                                                >
                                                    {choice.label} {choice.price > 0 && `(+${choice.price} د.ك)`}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        <hr className="border-[#54595F] opacity-14" />

                        {/* Coupon Section */}
                        <div className="form-group coupon-section">
                            <label className="block text-gray-500 text-xs font-bold mb-2 uppercase tracking-wider">
                                <i className="bi bi-ticket-perforated ml-2"></i>كود الكوبون (اختياري)
                            </label>
                            <div className="grid md:grid-cols-3 gap-3">
                                <div className="md:col-span-2">
                                    <input
                                        type="text"
                                        value={formData.couponCode}
                                        onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                                        placeholder="أدخل كود الكوبون"
                                        className="w-full h-[60px] p-3 bg-gray-50 border border-gray-100 rounded-xl text-[#46423D] text-base focus:bg-white focus:ring-2 focus:ring-[#966428]/20 focus:border-[#966428] outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        onClick={applyCoupon}
                                        className="w-full h-[60px] bg-[#46423D] hover:bg-[#363533] text-white text-base font-bold rounded-xl transition-colors shadow-md shadow-[#46423D]/10"
                                    >
                                        <i className="bi bi-check-circle ml-2"></i>تطبيق
                                    </button>
                                </div>
                            </div>

                            {couponError && (
                                <div className="mt-3 p-3 bg-[#FF4F0F]/10 border border-[#FF4F0F]/30 rounded-lg flex items-start gap-2">
                                    <svg className="w-5 h-5 text-[#FF4F0F] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-[#FF4F0F] font-medium">{couponError}</p>
                                </div>
                            )}

                            {couponApplied && (
                                <div className="mt-4 p-5 bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] border-2 border-[#FF6500] rounded-[15px] shadow-lg">
                                    <div className="flex items-center mb-3">
                                        <i className="bi bi-check-circle-fill text-[#FF6500] text-xl ml-2"></i>
                                        <strong className="text-[#FF4F0F] text-lg">تم تطبيق الكوبون</strong>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <span className="text-[#666] text-sm">اسم الكوبون:</span>
                                            <div className="text-[#46423D] font-semibold text-base">
                                                {formData.couponCode}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-[#666] text-sm">الخصم:</span>
                                            <div className="text-[#FF4F0F] font-semibold text-base">
                                                {discount}.000 د.ك
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <hr className="border-[#54595F] opacity-14" />

                        {/* Notes */}
                        <div className="form-group">
                            <label className="block text-gray-500 text-xs font-bold mb-2 uppercase tracking-wider">
                                ملاحظات إضافية (اختياري)
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full min-h-[100px] p-3 bg-gray-50 border border-gray-100 rounded-xl text-[#46423D] text-sm focus:bg-white focus:ring-2 focus:ring-[#966428]/20 focus:border-[#966428] outline-none transition-all resize-none"
                                placeholder="أي ملاحظات أو طلبات خاصة..."
                            />
                        </div>

                        {/* Total and Submit */}
                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-[#54595F] text-lg font-medium">المجموع الكلي:</span>
                                <span className="text-[#46423D] text-3xl font-bold">{calculateTotal()}.000 د.ك</span>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-14 bg-gradient-to-r from-[#46423D] to-[#966428] hover:from-[#363533] hover:to-[#FF4F0F] text-white text-lg font-bold rounded-xl transition-all shadow-lg shadow-[#46423D]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الحجز'}
                            </button>
                        </div>
                    </motion.form>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
