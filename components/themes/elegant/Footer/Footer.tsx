'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-black text-white">
            {/* Newsletter Section */}
            <div className="border-t border-b border-white/10 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h3 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">
                            انضم إلى 10,000+ مشترك
                        </h3>
                        <p className="text-gray-400 mb-8">
                            احصل على آخر التحديثات والنصائح والعروض الحصرية مباشرة في بريدك
                        </p>
                        <div className="flex gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="بريدك الإلكتروني"
                                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500"
                            />
                            <button className="bg-gradient-to-r from-amber-500 to-yellow-600 text-black px-8 py-4 rounded-full font-bold hover:shadow-lg hover:shadow-amber-500/50 transition-all whitespace-nowrap">
                                اشترك الآن
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <h4 className="text-2xl font-serif tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 mb-4">
                            ELEGANT
                        </h4>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            نحن نؤمن بقوة التصميم الأنيق والتكنولوجيا المتقدمة لتحويل الأفكار إلى واقع ملموس.
                        </p>
                        <div className="flex gap-3">
                            <Link href="#" className="bg-white/10 hover:bg-amber-500 p-3 rounded-full transition-all">
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="bg-white/10 hover:bg-amber-500 p-3 rounded-full transition-all">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="bg-white/10 hover:bg-amber-500 p-3 rounded-full transition-all">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="bg-white/10 hover:bg-amber-500 p-3 rounded-full transition-all">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h5 className="font-bold text-lg mb-4">روابط سريعة</h5>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#features" className="text-gray-400 hover:text-amber-500 transition-colors">
                                    المميزات
                                </Link>
                            </li>
                            <li>
                                <Link href="#pricing" className="text-gray-400 hover:text-amber-500 transition-colors">
                                    الأسعار
                                </Link>
                            </li>
                            <li>
                                <Link href="#about" className="text-gray-400 hover:text-amber-500 transition-colors">
                                    من نحن
                                </Link>
                            </li>
                            <li>
                                <Link href="#blog" className="text-gray-400 hover:text-amber-500 transition-colors">
                                    المدونة
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h5 className="font-bold text-lg mb-4">تواصل معنا</h5>
                        <ul className="space-y-3 text-gray-400">
                            <li className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-amber-500" />
                                <a href="mailto:info@elegant.com" className="hover:text-amber-500 transition-colors">
                                    info@elegant.com
                                </a>
                            </li>
                            <li>
                                <p>الرياض، المملكة العربية السعودية</p>
                            </li>
                            <li>
                                <p>متاح 24/7 للدعم الفني</p>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                    <p>© 2024 Elegant. جميع الحقوق محفوظة.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-amber-500 transition-colors">
                            سياسة الخصوصية
                        </Link>
                        <Link href="/terms" className="hover:text-amber-500 transition-colors">
                            الشروط والأحكام
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
