import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Info } from 'lucide-react';
import {
    getServiceBySlug,
    getCategoryForService,
    getCategoryHierarchy,
    getServiceImages,
    getServiceOptions,
    getKuwaitAreas,
    getAllServices
} from '@/lib/data-fetching';
import ImageCarousel from '@/components/ImageCarousel';
import BookingForm from '@/components/BookingForm';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";

// Enable ISR - revalidate every hour
export const revalidate = 3600;

// Generate static params for all services
export async function generateStaticParams() {
    const services = await getAllServices();
    return services.map((service) => ({
        id: service.slug,
    }));
}

export default async function ServiceDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id: serviceId } = await params;

    // Fetch all data server-side
    const service = await getServiceBySlug(serviceId);

    if (!service) {
        notFound();
    }

    const category = service.category_id ? await getCategoryForService(service.category_id) : null;
    const categoryHierarchy = service.category_id ? await getCategoryHierarchy(service.category_id) : [];
    const serviceImages = await getServiceImages(service.id);
    const serviceOptions = await getServiceOptions(service.id);
    const kuwaitAreas = await getKuwaitAreas();

    // Prepare images array
    const images = serviceImages.length > 0 ? serviceImages : [];
    if (service.image) {
        images.unshift(service.image);
    }
    const finalImages = images.length > 0 ? images : ['/placeholder.jpg'];

    const serviceTitle = service.title || '';
    const basePrice = service.base_price || 0;

    return (
        <div dir="rtl" className="min-h-screen" style={{ backgroundColor: 'var(--color-beige)' }}>
            {/* Page Header */}
            <section className="sec-padding page service-details-page py-8" style={{ backgroundColor: '#FFEDD5' }}>
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
                                {categoryHierarchy.map((cat: any) => (
                                    <li key={cat.id} className="flex items-center gap-2">
                                        <Link href={`/categories/${cat.slug}`} className="hover:text-white transition-colors text-white/80">
                                            {cat.name}
                                        </Link>
                                        <span>/</span>
                                    </li>
                                ))}
                                <li className="font-medium text-white" aria-current="page">
                                    {serviceTitle}
                                </li>
                            </ol>
                        </nav>
                    </div>
                </header>

                <div className="container mx-auto px-4 md:px-8 lg:px-16">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 service-layout items-start">
                        {/* Gallery Section - Client Component */}
                        <ImageCarousel images={finalImages} />

                        {/* Content Section */}
                        <div className="content-section w-full lg:w-1/2 order-2">
                            {/* Title & Provider Info */}
                            <div className="mb-6 px-2">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                                        <Image
                                            src={service.provider_logo || '/placeholder-logo.png'}
                                            alt={service.provider_name || 'My Moments'}
                                            fill
                                            className="object-cover"
                                            sizes="40px"
                                            quality={90}
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

                            {/* Booking Form - Client Component */}
                            <BookingForm
                                serviceId={service.id}
                                basePrice={basePrice}
                                serviceOptions={serviceOptions}
                                kuwaitAreas={kuwaitAreas}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
