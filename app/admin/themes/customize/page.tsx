'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Palette, Type, Layout, Save, ArrowRight, RotateCcw, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Button, Container, Stack } from '@/components/ui-library';
import { toast } from 'sonner';
import { useTenant } from '@/lib/tenant';
import { cn } from '@/lib/utils';

// Mock data for now - will be replaced with real theme config
const MOCK_THEME_CONFIG = {
    colors: {
        primary: '#FF4F0F',
        secondary: '#FF6500',
        accent: '#B4786C',
        background: '#FFEDD5',
        foreground: '#46423D',
    },
    fonts: {
        heading: 'Cairo',
        body: 'Tajawal',
    },
    layout: {
        borderRadius: '0.5rem',
        containerWidth: '1280px',
    },
    slug: '' // Optional slug for preview
};

export default function ThemeCustomizationPage() {
    const router = useRouter();
    const { tenant } = useTenant();
    const searchParams = useSearchParams();
    const themeId = searchParams.get('id');

    const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'layout'>('colors');
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [config, setConfig] = useState(MOCK_THEME_CONFIG);
    const [isDirty, setIsDirty] = useState(false);
    const [saving, setSaving] = useState(false);

    // Load theme config
    useEffect(() => {
        if (themeId) {
            fetchThemeConfig();
        }
    }, [themeId]);

    const fetchThemeConfig = async () => {
        try {
            const res = await fetch(`/api/themes/${themeId}`);
            if (res.ok) {
                const data = await res.json();
                if (data.config) {
                    // Merge with existing/mock config to ensure all properties exist
                    setConfig(prev => ({
                        ...prev,
                        ...data.config,
                        colors: {
                            ...prev.colors,
                            ...(data.config.colors || {})
                        },
                        fonts: {
                            ...prev.fonts,
                            ...(data.config.fonts || {})
                        },
                        layout: {
                            ...prev.layout,
                            ...(data.config.layout || {})
                        },
                        slug: data.slug
                    }));
                }
            } else {
                toast.error('فشل تحميل إعدادات الثيم');
            }
        } catch (error) {
            console.error('Error fetching theme:', error);
            toast.error('حدث خطأ أثناء تحميل الثيم');
        }
    };

    const handleSave = async () => {
        if (!themeId) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/themes/${themeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ config })
            });

            if (res.ok) {
                toast.success('تم حفظ التغييرات بنجاح');
                setIsDirty(false);
                // Refresh preview
                const iframe = document.querySelector('iframe');
                if (iframe) {
                    iframe.src = iframe.src;
                }
            } else {
                toast.error('فشل حفظ التغييرات');
            }
        } catch (error) {
            console.error('Error saving theme:', error);
            toast.error('حدث خطأ أثناء الحفظ');
        } finally {
            setSaving(false);
        }
    };

    const handleColorChange = (key: keyof typeof config.colors, value: string) => {
        setConfig(prev => ({
            ...prev,
            colors: { ...prev.colors, [key]: value }
        }));
        setIsDirty(true);
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
            {/* Sidebar Controls */}
            <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-sm z-10">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-1 h-8 w-8">
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                        <h1 className="font-bold text-gray-900">تخصيص الثيم</h1>
                    </div>
                    {isDirty && (
                        <div className="w-2 h-2 rounded-full bg-amber-500" title="تغييرات غير محفوظة" />
                    )}
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 bg-gray-50/50">
                    <button
                        onClick={() => setActiveTab('colors')}
                        className={cn(
                            "flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2",
                            activeTab === 'colors'
                                ? "border-primary text-primary bg-white"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        )}
                    >
                        <Palette className="w-4 h-4" />
                        الألوان
                    </button>
                    <button
                        onClick={() => setActiveTab('fonts')}
                        className={cn(
                            "flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2",
                            activeTab === 'fonts'
                                ? "border-primary text-primary bg-white"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        )}
                    >
                        <Type className="w-4 h-4" />
                        الخطوط
                    </button>
                    <button
                        onClick={() => setActiveTab('layout')}
                        className={cn(
                            "flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2",
                            activeTab === 'layout'
                                ? "border-primary text-primary bg-white"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        )}
                    >
                        <Layout className="w-4 h-4" />
                        التخطيط
                    </button>
                </div>

                {/* Controls Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {activeTab === 'colors' && (
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700">الألوان الأساسية</label>
                                {config.colors && Object.entries(config.colors).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors bg-white">
                                        <input
                                            type="color"
                                            value={value}
                                            onChange={(e) => handleColorChange(key as any, e.target.value)}
                                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                        />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-900 capitalize">{key}</div>
                                            <div className="text-xs text-gray-500 uppercase">{value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'fonts' && (
                        <div className="text-center py-8 text-gray-500">
                            <Type className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>إعدادات الخطوط قريباً</p>
                        </div>
                    )}

                    {activeTab === 'layout' && (
                        <div className="text-center py-8 text-gray-500">
                            <Layout className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>إعدادات التخطيط قريباً</p>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-200 bg-white space-y-3">
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={handleSave}
                        disabled={!isDirty || saving}
                    >
                        {saving ? (
                            <>
                                <RotateCcw className="w-4 h-4 animate-spin ml-2" />
                                جاري الحفظ...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 ml-2" />
                                حفظ التغييرات
                            </>
                        )}
                    </Button>
                    {isDirty && (
                        <Button
                            variant="ghost"
                            fullWidth
                            onClick={() => {
                                setConfig(MOCK_THEME_CONFIG);
                                setIsDirty(false);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            إلغاء التغييرات
                        </Button>
                    )}
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 flex flex-col bg-gray-100/50">
                {/* Preview Toolbar */}
                <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-center gap-4 px-4 shadow-sm">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setPreviewDevice('desktop')}
                            className={cn(
                                "p-2 rounded-md transition-all",
                                previewDevice === 'desktop' ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"
                            )}
                            title="سطح المكتب"
                        >
                            <Monitor className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPreviewDevice('tablet')}
                            className={cn(
                                "p-2 rounded-md transition-all",
                                previewDevice === 'tablet' ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"
                            )}
                            title="تابلت"
                        >
                            <Tablet className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPreviewDevice('mobile')}
                            className={cn(
                                "p-2 rounded-md transition-all",
                                previewDevice === 'mobile' ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"
                            )}
                            title="جوال"
                        >
                            <Smartphone className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Preview Frame */}
                <div className="flex-1 overflow-auto p-8 flex items-start justify-center">
                    <div
                        className={cn(
                            "bg-white shadow-xl transition-all duration-300 overflow-hidden border border-gray-200",
                            previewDevice === 'desktop' ? "w-full h-full rounded-lg" :
                                previewDevice === 'tablet' ? "w-[768px] h-[1024px] rounded-[2rem] border-8 border-gray-800" :
                                    "w-[375px] h-[812px] rounded-[2.5rem] border-8 border-gray-800"
                        )}
                    >
                        <iframe
                            src={`/?preview_theme=${config.slug || ''}`}
                            className="w-full h-full border-0 bg-white"
                            title="Theme Preview"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
