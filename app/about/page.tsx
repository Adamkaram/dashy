'use client';

import Link from 'next/link';
import { ChevronRight, Award, Users, Heart, Sparkles } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#F0EBE5]" dir="rtl">
            {/* Page Header */}
            <header className="py-5 bg-gradient-burgundy mb-8 rounded-xl mx-6 md:mx-12 shadow-lg mt-8">
                <div className="container mx-auto px-8 md:px-16">
                    <h4 className="text-base font-bold mb-2 text-[#8F6B43]">
                        عن ماى مومنت
                    </h4>

                    <nav aria-label="breadcrumb">
                        <ol className="flex items-center gap-2 text-sm flex-wrap text-white/80">
                            <li>
                                <Link href="/" className="hover:text-white transition-colors text-white/80">
                                    الرئيسية
                                </Link>
                            </li>
                            <li>/</li>
                            <li className="font-medium text-white" aria-current="page">
                                عن الموقع
                            </li>
                        </ol>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold text-[#53131C] mb-6">عن ماى مومنت</h1>
                    <p className="text-xl text-[#46423D] max-w-3xl mx-auto leading-relaxed">
                        نحن نؤمن بأن كل لحظة تستحق أن تُحفظ بأرقى الطرق. ماى مومنت هي وجهتكم المثالية لتنسيق أجمل المناسبات والاحتفالات
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-4xl font-bold text-[#53131C]">قصتنا</h2>
                            <p className="text-lg text-[#46423D] leading-relaxed">
                                بدأت ماى مومنت من حلم بسيط: أن نجعل كل مناسبة لا تُنسى. منذ تأسيسنا، عملنا على تقديم أفضل الخدمات في مجال تنسيق الفعاليات والمناسبات في الكويت.
                            </p>
                            <p className="text-lg text-[#46423D] leading-relaxed">
                                نحن نجمع بين الإبداع والجودة العالية لنقدم لكم تجربة فريدة تعكس ذوقكم الرفيع وتحقق أحلامكم. فريقنا من المحترفين يعمل بشغف لضمان أن كل تفصيلة في مناسبتكم تكون مثالية.
                            </p>
                            <p className="text-lg text-[#46423D] leading-relaxed">
                                من تنسيق الأعراس إلى حفلات العشاء الفاخرة، من خدمات التصوير إلى الديكورات الراقية، نحن هنا لنحول رؤيتكم إلى واقع ملموس.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://ext.same-assets.com/2944172014/4039253469.jpeg"
                                    alt="ماى مومنت"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-[#8F6B43] rounded-2xl -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-[#53131C] mb-12 text-center">قيمنا</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow border border-[#8F6B43]/10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#53131C] rounded-full mb-4">
                                <Award className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-[#53131C] mb-3">الجودة</h3>
                            <p className="text-[#46423D]">
                                نلتزم بأعلى معايير الجودة في كل ما نقدمه
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow border border-[#8F6B43]/10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#53131C] rounded-full mb-4">
                                <Heart className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-[#53131C] mb-3">الشغف</h3>
                            <p className="text-[#46423D]">
                                نعمل بحب وشغف لإسعاد عملائنا
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow border border-[#8F6B43]/10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#53131C] rounded-full mb-4">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-[#53131C] mb-3">الإبداع</h3>
                            <p className="text-[#46423D]">
                                نبتكر تصاميم فريدة تعكس شخصيتكم
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow border border-[#8F6B43]/10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#53131C] rounded-full mb-4">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-[#53131C] mb-3">الاحترافية</h3>
                            <p className="text-[#46423D]">
                                فريق محترف ومتخصص في كل المجالات
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Overview */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-[#53131C] mb-12 text-center">ما نقدمه</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'تنسيق الأعراس', desc: 'نصمم أعراساً فاخرة بكل التفاصيل من المسكة إلى الديكورات' },
                            { title: 'حفلات العشاء', desc: 'تنسيق طاولات عشاء راقية مع أجمل الديكورات' },
                            { title: 'التصوير الاحترافي', desc: 'توثيق لحظاتكم الثمينة بأعلى جودة احترافية' },
                            { title: 'الديكورات الفاخرة', desc: 'تصاميم ديكور مبتكرة تناسب جميع المناسبات' },
                            { title: 'خدمات الضيافة', desc: 'ضيافة راقية مع أفضل المأكولات والمشروبات' },
                            { title: 'التوزيعات والهدايا', desc: 'توزيعات وهدايا مميزة تترك انطباعاً رائعاً' }
                        ].map((service, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-r-4 border-[#8F6B43]">
                                <h3 className="text-xl font-bold text-[#53131C] mb-3">{service.title}</h3>
                                <p className="text-[#46423D]">
                                    {service.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-[#ECE8DB]">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-[#53131C] mb-6">هل أنتم مستعدون لخلق ذكريات لا تُنسى؟</h2>
                    <p className="text-xl text-[#46423D] mb-8 max-w-2xl mx-auto">
                        تواصلوا معنا اليوم ودعونا نساعدكم في تحقيق حلم مناسبتكم المثالية
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link
                            href="/"
                            className="bg-[#53131C] hover:bg-[#8F6B43] text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors"
                        >
                            تصفح خدماتنا
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-transparent border-2 border-[#53131C] hover:bg-[#53131C] hover:text-white text-[#53131C] px-8 py-4 rounded-lg text-lg font-medium transition-colors"
                        >
                            اتصل بنا
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
