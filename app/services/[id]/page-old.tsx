'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Share2, Calendar, Clock, Heart, Info } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderSuccessToast } from '@/components/ui/CustomToast';
import { DatePicker } from '@/components/ui/DatePicker';
import { Select } from '@/components/ui/Select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";

export default function ServiceDetails() {
  const params = useParams();
  const serviceId = params.id as string;

  const [service, setService] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [serviceOptions, setServiceOptions] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<any>({});
  const [images, setServiceImages] = useState<string[]>([]);
  const [kuwaitAreas, setKuwaitAreas] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
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

  // Swipe handlers state
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Service - try slug first, then fall back to ID
        let serviceData = null;
        let serviceError = null;

        // Try slug first
        const slugResult = await supabase
          .from('services')
          .select('*')
          .eq('slug', serviceId)
          .eq('is_active', true)
          .single();

        if (slugResult.data) {
          serviceData = slugResult.data;
        } else {
          // Fallback to ID lookup
          const idResult = await supabase
            .from('services')
            .select('*')
            .eq('id', serviceId)
            .eq('is_active', true)
            .single();

          serviceData = idResult.data;
          serviceError = idResult.error;
        }

        if (serviceError) throw serviceError;
        setService(serviceData);

        // Fetch Category
        if (serviceData.category_id) {
          const { data: categoryData } = await supabase
            .from('categories')
            .select('id, name, slug')
            .eq('id', serviceData.category_id)
            .single();

          if (categoryData) setCategory(categoryData);
        }

        // Fetch Service Images
        const { data: imagesData } = await supabase
          .from('service_images')
          .select('image_url')
          .eq('service_id', serviceId)
          .order('display_order');

        const images = imagesData ? imagesData.map((img: any) => img.image_url) : [];
        if (serviceData.image) images.unshift(serviceData.image);
        setServiceImages(images.length > 0 ? images : ['/placeholder.jpg']);

        // Fetch Service Options
        const { data: optionsData } = await supabase
          .from('service_options')
          .select('*')
          .eq('service_id', serviceId)
          .order('display_order');

        if (optionsData) {
          setServiceOptions(optionsData);
          // Initialize selected options
          const initialOptions: any = {};
          optionsData.forEach((opt: any) => {
            if (opt.type === 'checkbox') {
              initialOptions[opt.id] = [];
            } else if (opt.is_required && opt.options && opt.options.length > 0) {
              // Select first option by default if required
              initialOptions[opt.id] = opt.options[0];
            }
          });
          setSelectedOptions(initialOptions);
        }

        // Fetch Kuwait Areas
        const { data: areasData } = await supabase
          .from('kuwait_areas')
          .select('*')
          .order('display_order');

        // Group areas by governorate
        const groupedAreas: any = {};
        areasData?.forEach((area: any) => {
          if (!groupedAreas[area.governorate]) {
            groupedAreas[area.governorate] = [];
          }
          groupedAreas[area.governorate].push(area.area_name);
        });
        setKuwaitAreas(groupedAreas);

      } catch (error) {
        console.error('Error fetching service details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) fetchData();
  }, [serviceId]);

  // Derived state
  const serviceTitle = service?.title || '';
  const basePrice = service?.base_price || 0;
  const additionalPrice = 0; // Placeholder if needed

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5ebe5]">
        <div className="text-[#FF6500] text-xl">جاري التحميل...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5ebe5]">
        <div className="text-red-500 text-xl">الخدمة غير موجودة</div>
      </div>
    );
  }

  const calculateTotal = () => {
    let total = basePrice;

    // Add options price
    Object.keys(selectedOptions).forEach(key => {
      const selection = selectedOptions[key];
      if (Array.isArray(selection)) {
        // Checkbox (array of selected choices)
        selection.forEach((item: any) => {
          total += (item.price || 0);
        });
      } else if (selection && typeof selection === 'object') {
        // Radio/Select (single choice object)
        total += (selection.price || 0);
      }
    });

    return total + additionalPrice - discount;
  };

  const handleOptionChange = (optionId: string, type: string, choice: any, checked?: boolean) => {
    setSelectedOptions((prev: any) => {
      const newOptions = { ...prev };

      if (type === 'checkbox') {
        const currentList = newOptions[optionId] || [];
        if (checked) {
          // Add
          newOptions[optionId] = [...currentList, choice];
        } else {
          // Remove
          newOptions[optionId] = currentList.filter((item: any) => item.label !== choice.label);
        }
      } else {
        // Radio / Select
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

      // Set order submitted state to collapse form
      setOrderSubmitted(true);

      toast.custom((t) => (
        <OrderSuccessToast
          orderId={data.order.id.slice(0, 8)}
          customerName={formData.customer_name}
        />
      ), {
        duration: 6000,
      });

      // Reset form after animation
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

  // Swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;

    // Check if horizontal swipe is dominant (to allow vertical scrolling)
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (isLeftSwipe) {
        // Swipe Left -> Next Image (standard behavior)
        nextImage();
      } else if (isRightSwipe) {
        // Swipe Right -> Previous Image
        prevImage();
      }
    }
  };

  return (
    <div dir="rtl" className="min-h-screen" style={{ backgroundColor: 'var(--color-beige)' }}>
      {/* Page Header and Main Content - Combined Section */}
      <section className="sec-padding page service-details-page py-8" style={{ backgroundColor: '#FFEDD5' }}>
        {/* Page Header */}
        <header className="py-5 bg-gradient-burgundy mb-8 rounded-xl mx-6 md:mx-12 shadow-lg">
          <div className="container mx-auto px-8 md:px-16">
            <h4 className="text-base font-bold mb-2 text-[#FF6500]">
              {serviceTitle}
            </h4>

            <nav aria-label="breadcrumb">
              <ol className="flex items-center gap-2 text-sm flex-wrap text-white/80">
                <li>
                  <Link href="/" className="hover:text-white transition-colors text-white/80">
                    الرئيسية
                  </Link>
                </li>
                <li>/</li>
                {category && (
                  <>
                    <li>
                      <Link href={`/categories/${category.slug}`} className="hover:text-white transition-colors text-white/80">
                        {category.name}
                      </Link>
                    </li>
                    <li>/</li>
                  </>
                )}
                <li className="font-medium text-white" aria-current="page">
                  {serviceTitle}
                </li>
              </ol>
            </nav>
          </div>
        </header>

        {/* Mobile Image Block Removed - Using Unified Layout */}

        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 service-layout items-start">
            {/* Gallery Section - Left in RTL, Right in LTR */}
            <div className="gallery-section w-full lg:w-1/2 lg:sticky lg:top-8 order-1">
              <div className="gallery-single-image">
                <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl shadow-black/5">
                  <div
                    className="relative h-[300px] md:h-[450px] lg:h-[600px] touch-pan-y"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                  >
                    <Image
                      src={images[currentImage] || images[0]}
                      alt="صورة الخدمة"
                      fill
                      className="object-cover select-none"
                      draggable={false}
                      unoptimized
                    />

                    {/* Navigation Buttons */}
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-lg transition-all z-10"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="h-5 w-5 text-[#6b5448]" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-lg transition-all z-10"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="h-5 w-5 text-[#6b5448]" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium z-10">
                      {currentImage + 1}/{images.length}
                    </div>

                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImage(index)}
                          className={`h-2 rounded-full transition-all ${index === currentImage ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
                            }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section - Right in RTL, Left in LTR */}
            <div className="content-section w-full lg:w-1/2 order-2">


              {/* Title */}
              {/* Title & Provider Info */}
              <div className="mb-6 px-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                    <Image
                      src={service.provider_logo || 'https://wgbbwrstcsizaqmvykmh.supabase.co/storage/v1/object/public/moment-bucket/log02.png'} // Fallback to default logo
                      alt={service.provider_name || 'My Moments'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {service.provider_name || 'My Moments'}
                  </span>
                </div>
                <h1 className="single-title text-2xl md:text-3xl font-bold text-[#FF6500] tracking-tight leading-tight mt-4">
                  {serviceTitle}
                </h1>
              </div>
              <div className="h-px bg-gradient-to-r from-[#FF6500]/20 to-transparent my-6" />

              {/* Payment Options */}
              <div className="payment-options mb-8">
                <div className="payment-option">
                  <input
                    type="radio"
                    name="payment_type"
                    id="payment_full"
                    value="full"
                    defaultChecked
                    className="hidden"
                  />
                  <label
                    htmlFor="payment_full"
                    className="cursor-pointer block bg-white border border-[#E6D2CE] rounded-2xl p-5 transition-all hover:border-[#966428] hover:shadow-lg hover:shadow-[#966428]/5 group"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h6 className="text-gray-500 mb-1 text-sm font-medium group-hover:text-[#966428] transition-colors">دفع كامل المبلغ</h6>
                        <strong className="text-[#46423D] text-2xl font-bold">
                          {basePrice}.000 د.ك
                        </strong>
                      </div>
                      <div className="w-6 h-6 border-2 border-[#E6D2CE] rounded-full flex items-center justify-center group-hover:border-[#966428] transition-colors">
                        <div className="w-3 h-3 bg-[#966428] rounded-full"></div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Seller Policy */}
              <div className="mb-8 px-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-2 text-[#FF6500] hover:text-[#FF4F0F] transition-colors text-sm font-medium group">
                      <Info className="w-4 h-4" />
                      <span className="border-b border-dashed border-[#FF6500] group-hover:border-[#FF4F0F]">
                        سياسة البائع
                      </span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]" dir="rtl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-[#46423D] mb-4">سياسة البائع</DialogTitle>
                    </DialogHeader>
                    <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {service.policy || `سياسة الحجز : يجب أن لا تقل مدة الحجز عن أسبوعين من تاريخ المناسبة.

سياسة الإلغاء : يتم خصم 50 % من المبلغ الإجمالي في حال الإلغاء قبل موعد المناسبة ب 72 ساعة ، وأما في حال التأجيل يتم توفير كوبون مفتوح لمدة سنة .`}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Policy Button - Temporarily Hidden */}
              {/* <div className="report-btn mb-6">
                <button className="w-full bg-gray-900 hover:bg-gray-800 text-white border-0 py-4 text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transition-all">
                  <Info className="h-4 w-4 inline-block ml-2" />
                  سياسة البائع
                </button>
              </div> */}

              <hr className="border-gray-200 my-6" />

              {/* Service Description */}
              <div className="text-strip mb-10 bg-white/50 p-6 rounded-2xl border border-white shadow-sm">
                <h4 className="text-[#46423D] text-lg font-bold mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#966428]" />
                  وصف الخدمة
                </h4>
                <div
                  className="text-gray-600 text-base leading-relaxed prose prose-sm max-w-none rich-text prose-headings:text-[#46423D] prose-a:text-[#966428]"
                  dangerouslySetInnerHTML={{ __html: service.description || 'لا يوجد وصف متاح لهذه الخدمة.' }}
                />
              </div>

              <hr className="border-gray-200 my-6" />

              {/* Booking Form */}
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
                      {
                        serviceOptions.map((option) => (
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
                        ))
                      }

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

                        {/* Error Message */}
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
                                <div className="text-[#46423D] font-semibold text-base" id="coupon_name">
                                  {formData.couponCode}
                                </div>
                              </div>
                              <div>
                                <span className="text-[#666] text-sm">الخصم:</span>
                                <div className="text-[#FF4F0F] font-semibold text-base" id="discount_amount">
                                  {discount}.000 د.ك
                                </div>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="inline-block bg-[#FF6500] text-white px-5 py-2 rounded-[25px] font-semibold text-base">
                                <i className="bi bi-gift ml-2"></i>المبلغ المحفوظ: <span id="savings_amount">{discount}.000 د.ك</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      <div className="form-group">
                        <label className="block text-gray-500 text-xs font-bold mb-2 uppercase tracking-wider">ملاحظات (اختياري)</label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          rows={4}
                          placeholder="أضف أي ملاحظات إضافية هنا..."
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-[#46423D] text-sm focus:bg-white focus:ring-2 focus:ring-[#966428]/20 focus:border-[#966428] outline-none resize-none transition-all"
                        />
                      </div>

                      {/* Prices Summary */}
                      <div className="prices flex flex-col sm:flex-row bg-gray-50 border border-dashed border-gray-300 rounded-2xl overflow-hidden mb-6">
                        <div className="p-6 flex-1 text-center border-b sm:border-b-0 sm:border-l border-dashed border-gray-300">
                          <p className="mb-1 text-gray-500 text-sm font-medium uppercase tracking-wider">الإجمالي</p>
                          <strong className="text-[#46423D] text-3xl font-bold">{calculateTotal()}.000 <span className="text-lg font-normal text-gray-400">د.ك</span></strong>
                        </div>
                        <div className="p-6 flex-1 text-center bg-[#46423D]/5">
                          <p className="mb-1 text-gray-500 text-sm font-medium uppercase tracking-wider">الدفع الآن</p>
                          <strong className="text-[#966428] text-3xl font-bold">{calculateTotal()}.000 <span className="text-lg font-normal text-gray-400">د.ك</span></strong>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center flex-wrap gap-4">
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-[#46423D] to-[#2C2A26] hover:shadow-lg hover:shadow-[#46423D]/20 text-white w-full h-[60px] text-lg font-bold rounded-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                          <span>احجز الآن</span>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                        {/* Temporarily Hidden - Favorite and Share buttons */}
                        {/* <button
                      type="button"
                      className="text-gray-700 text-base font-medium p-3 ml-5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Heart className="h-5 w-5 ml-2 inline-block" />
                      إضافة للمفضلة
                    </button>
                    <button
                      type="button"
                      className="text-gray-700 text-base font-medium p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Share2 className="h-5 w-5 ml-2 inline-block" />
                      مشاركة
                    </button> */}
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success-message"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="py-16 px-8"
                    >
                      <div className="max-w-md mx-auto">
                        {/* Success Icon */}
                        <div className="relative mb-6">
                          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] flex items-center justify-center border-4 border-[#FF6500]/20 shadow-lg">
                            <svg className="w-12 h-12 text-[#FF6500]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          {/* Decorative circles */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#FF6500]/5 rounded-full -z-10 animate-pulse"></div>
                        </div>

                        {/* Success Message */}
                        <div className="text-center space-y-3">
                          <h3 className="text-2xl font-bold text-[#46423D]">
                            تم استلام طلبك بنجاح! 🎉
                          </h3>
                          <p className="text-sm text-[#46423D]/70 leading-relaxed">
                            شكراً لثقتك بنا. سيتواصل معك فريقنا قريباً لتأكيد تفاصيل الحجز وإتمام الترتيبات.
                          </p>
                        </div>

                        {/* Decorative divider */}
                        <div className="flex items-center gap-3 my-6">
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#FF6500]/30 to-transparent"></div>
                          <div className="w-2 h-2 rounded-full bg-[#FF6500]/30"></div>
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#FF6500]/30 to-transparent"></div>
                        </div>

                        {/* Action hint */}
                        <div className="text-center">
                          <p className="text-xs text-[#46423D]/50 mb-4">
                            يمكنك حجز خدمة أخرى الآن أو تصفح المزيد من خدماتنا
                          </p>
                          <div className="flex gap-2 justify-center">
                            <div className="w-2 h-2 rounded-full bg-[#FF6500] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-[#FF6500] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-[#FF6500] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div >
        </div>
      </section >

      <style jsx>{`
        /* RTL Layout - Arabic: Content on left, Gallery on right */
        /* In RTL, flex-direction: row reverses the visual order */
        /* So content (order: 2) appears on left, gallery (order: 1) appears on right */
        [dir='rtl'] .service-layout .content-section {
          order: 2;
        }
        [dir='rtl'] .service-layout .gallery-section {
          order: 1;
        }

        /* LTR Layout - English: Gallery on left, Content on right */
        /* In LTR, flex-direction: row is normal */
        /* So gallery (order: 1) appears on left, content (order: 2) appears on right */
        [dir='ltr'] .service-layout .gallery-section {
          order: 1;
        }
        [dir='ltr'] .service-layout .content-section {
          order: 2;
        }

        /* Mobile: Always show Gallery first, then Content */
        @media (max-width: 1023px) {
          .service-layout .gallery-section {
            order: 1;
          }
          .service-layout .content-section {
            order: 2;
          }
        }
      `}</style>
    </div >
  );
}
