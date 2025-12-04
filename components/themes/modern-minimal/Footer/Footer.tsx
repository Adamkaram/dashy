'use client';

import { FooterProps } from '@/lib/theme/component-types';
import { Container } from '@/components/ui-library';
import Link from 'next/link';
import { Instagram, Twitter, Facebook } from 'lucide-react';

export default function ModernFooter({ tenant }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <Container maxWidth="xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="text-3xl font-bold tracking-tighter text-black mb-6 block">
                            {tenant?.name || 'MODERN.'}
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            تصميم عصري وبسيط يركز على المحتوى والمساحات البيضاء. نقدم تجربة مستخدم فريدة وسلسة.
                        </p>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h4 className="font-bold text-black mb-6">الشركة</h4>
                        <ul className="space-y-4 text-sm text-gray-600">
                            <li><Link href="/about" className="hover:text-black transition-colors">من نحن</Link></li>
                            <li><Link href="/careers" className="hover:text-black transition-colors">وظائف</Link></li>
                            <li><Link href="/press" className="hover:text-black transition-colors">الصحافة</Link></li>
                            <li><Link href="/contact" className="hover:text-black transition-colors">اتصل بنا</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 className="font-bold text-black mb-6">المساعدة</h4>
                        <ul className="space-y-4 text-sm text-gray-600">
                            <li><Link href="/faq" className="hover:text-black transition-colors">الأسئلة الشائعة</Link></li>
                            <li><Link href="/shipping" className="hover:text-black transition-colors">الشحن والتوصيل</Link></li>
                            <li><Link href="/returns" className="hover:text-black transition-colors">الإرجاع والاستبدال</Link></li>
                            <li><Link href="/privacy" className="hover:text-black transition-colors">سياسة الخصوصية</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-black mb-6">النشرة البريدية</h4>
                        <p className="text-sm text-gray-500 mb-4">اشترك للحصول على آخر الأخبار والعروض.</p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="بريدك الإلكتروني"
                                className="flex-1 bg-gray-50 border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                            />
                            <button className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                                اشتراك
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-400">
                        © {currentYear} {tenant?.name || 'Modern Minimal'}. جميع الحقوق محفوظة.
                    </p>

                    <div className="flex gap-6">
                        <a href="#" className="text-gray-400 hover:text-black transition-colors"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-black transition-colors"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-black transition-colors"><Facebook className="w-5 h-5" /></a>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
