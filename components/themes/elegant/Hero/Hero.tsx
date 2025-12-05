'use client';

import { useState } from 'react';
import { Play, ChevronDown } from 'lucide-react';

export function Hero() {
    const [showVideo, setShowVideo] = useState(false);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-amber-900 opacity-50" />

            {/* Animated Particles/Grid */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] animate-pulse" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-2 rounded-full mb-8 animate-fade-in">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-white/90 text-sm">جديد: إطلاق النسخة 2.0</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-500 animate-gradient">
                            حوّل أفكارك
                        </span>
                        <br />
                        <span className="text-white">
                            إلى واقع رقمي
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                        منصة متكاملة تساعدك على بناء وتطوير مشروعك الرقمي بسهولة وسرعة فائقة
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <button className="group bg-gradient-to-r from-amber-500 to-yellow-600 text-black px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-amber-500/50 transition-all hover:scale-105">
                            ابدأ مجاناً
                            <span className="inline-block group-hover:translate-x-1 transition-transform mr-2">←</span>
                        </button>
                        <button
                            onClick={() => setShowVideo(true)}
                            className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
                        >
                            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            شاهد الفيديو
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-white/10">
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 mb-2">
                                10K+
                            </div>
                            <div className="text-gray-400 text-sm">عميل نشط</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 mb-2">
                                99%
                            </div>
                            <div className="text-gray-400 text-sm">رضا العملاء</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 mb-2">
                                24/7
                            </div>
                            <div className="text-gray-400 text-sm">دعم فني</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <ChevronDown className="w-8 h-8 text-white/50" />
            </div>

            {/* Video Modal */}
            {showVideo && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowVideo(false)}
                >
                    <div className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setShowVideo(false)}
                            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full z-10"
                        >
                            ✕
                        </button>
                        <div className="absolute inset-0 flex items-center justify-center text-white">
                            <p>فيديو توضيحي</p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
