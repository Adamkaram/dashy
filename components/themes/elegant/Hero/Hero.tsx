import Link from 'next/link';

export function Hero() {
    return (
        <section className="relative h-[600px] bg-neutral-900 flex items-center justify-center text-center overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="relative z-10 container mx-auto px-4">
                <span className="block text-amber-500 text-sm uppercase tracking-[0.3em] mb-6">
                    مجموعة حصرية
                </span>
                <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
                    الفخامة في<br />أدق التفاصيل
                </h1>
                <p className="text-gray-400 max-w-lg mx-auto mb-10 text-lg font-light">
                    اكتشف تشكيلتنا الجديدة المصممة خصيصاً لأصحاب الذوق الرفيع.
                </p>
                <Link
                    href="/products"
                    className="inline-block border border-amber-500 text-amber-500 px-10 py-4 uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all duration-300"
                >
                    تسوق الآن
                </Link>
            </div>
        </section>
    );
}
