export function Footer() {
    return (
        <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-serif text-amber-500 mb-6">ELEGANT</h3>
                        <p className="text-gray-400 max-w-sm leading-relaxed">
                            نحن نؤمن بأن الأناقة ليست مجرد مظهر، بل هي أسلوب حياة. نقدم لك أفضل المنتجات المختارة بعناية فائقة.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm uppercase tracking-widest mb-6 text-gray-500">روابط سريعة</h4>
                        <ul className="space-y-4 text-gray-300">
                            <li><a href="#" className="hover:text-amber-500 transition-colors">عن المتجر</a></li>
                            <li><a href="#" className="hover:text-amber-500 transition-colors">المنتجات</a></li>
                            <li><a href="#" className="hover:text-amber-500 transition-colors">تواصل معنا</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm uppercase tracking-widest mb-6 text-gray-500">تواصل معنا</h4>
                        <p className="text-gray-300 mb-2">info@elegant.com</p>
                        <p className="text-gray-300">+966 50 000 0000</p>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-gray-600 text-sm">
                    &copy; {new Date().getFullYear()} ELEGANT. جميع الحقوق محفوظة.
                </div>
            </div>
        </footer>
    );
}
