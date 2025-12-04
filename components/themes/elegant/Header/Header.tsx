import Link from 'next/link';
import { ShoppingBag, Search, Menu } from 'lucide-react';

export function Header() {
    return (
        <header className="bg-black text-white py-6 border-b border-white/10">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-serif tracking-widest text-amber-500">
                        ELEGANT
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-wider text-gray-300">
                        <Link href="/" className="hover:text-amber-500 transition-colors">الرئيسية</Link>
                        <Link href="/products" className="hover:text-amber-500 transition-colors">المجموعة</Link>
                        <Link href="/about" className="hover:text-amber-500 transition-colors">قصتنا</Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                        <button className="hover:text-amber-500 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="hover:text-amber-500 transition-colors relative">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
                        </button>
                        <button className="md:hidden hover:text-amber-500 transition-colors">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
