'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { FooterProps } from '@/lib/theme/component-types';

export default function ModernFooter({ tenant }: FooterProps) {
    return (
        <footer className="bg-gray-50 border-t border-gray-200">


            {/* Main Footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h4 className="font-bold text-lg mb-4">{tenant?.name || 'المتجر'}</h4>
                        <p className="text-gray-600 text-sm mb-4">
                            متجرك الموثوق للتسوق الإلكتروني. نوفر أفضل المنتجات بأسعار تنافسية مع خدمة عملاء متميزة.
                        </p>
                        <div className="flex gap-3">
                            <Link href="#" className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-colors">
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-colors">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="font-bold text-lg mb-4">تسوق</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/new-arrivals" className="text-gray-600 hover:text-black">وصل حديثاً</Link></li>
                            <li><Link href="/best-sellers" className="text-gray-600 hover:text-black">الأكثر مبيعاً</Link></li>
                            <li><Link href="/deals" className="text-gray-600 hover:text-black">العروض الخاصة</Link></li>
                            <li><Link href="/categories" className="text-gray-600 hover:text-black">جميع الفئات</Link></li>
                            <li><Link href="/gift-cards" className="text-gray-600 hover:text-black">بطاقات الهدايا</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="font-bold text-lg mb-4">خدمة العملاء</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/contact" className="text-gray-600 hover:text-black">اتصل بنا</Link></li>
                            <li><Link href="/shipping" className="text-gray-600 hover:text-black">الشحن والتوصيل</Link></li>
                            <li><Link href="/returns" className="text-gray-600 hover:text-black">الإرجاع والاستبدال</Link></li>
                            <li><Link href="/track-order" className="text-gray-600 hover:text-black">تتبع الطلب</Link></li>
                            <li><Link href="/faq" className="text-gray-600 hover:text-black">الأسئلة الشائعة</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-lg mb-4">تواصل معنا</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2 text-gray-600">
                                <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-black">الهاتف</p>
                                    <p>+966 50 123 4567</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2 text-gray-600">
                                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-black">البريد</p>
                                    <p>info@shop.com</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2 text-gray-600">
                                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-black">العنوان</p>
                                    <p>الرياض، المملكة العربية السعودية</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Payment Methods & Bottom Bar */}
            <div className="border-t border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Payment Methods */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">طرق الدفع:</span>
                            <div className="flex gap-2">
                                <div className="bg-white border border-gray-200 px-3 py-1 rounded text-xs font-medium">VISA</div>
                                <div className="bg-white border border-gray-200 px-3 py-1 rounded text-xs font-medium">Mastercard</div>
                                <div className="bg-white border border-gray-200 px-3 py-1 rounded text-xs font-medium">MADA</div>
                                <div className="bg-white border border-gray-200 px-3 py-1 rounded text-xs font-medium">Apple Pay</div>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="text-sm text-gray-600">
                            © 2024 {tenant?.name || 'المتجر'}. جميع الحقوق محفوظة.
                        </div>

                        {/* Legal Links */}
                        <div className="flex gap-4 text-sm">
                            <Link href="/privacy" className="text-gray-600 hover:text-black">سياسة الخصوصية</Link>
                            <Link href="/terms" className="text-gray-600 hover:text-black">الشروط والأحكام</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}