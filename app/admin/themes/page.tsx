'use client';

import { useState, useEffect } from 'react';
import { Palette, Check, Layout, Type, MousePointerClick, Loader2, Sparkles } from 'lucide-react';
import { Button, Container, Stack } from '@/components/ui-library';
import { toast } from 'sonner';
import { useTenant } from '@/lib/tenant';
import Image from 'next/image';

interface Theme {
    id: string;
    name: string;
    slug: string;
    description: string;
    isActive: boolean; // Available in system
    previewImage?: string;
    tags?: string[];
    config?: any;
}

export default function ThemesPage() {
    const { tenant, refetch: refetchTenant } = useTenant();
    const [themes, setThemes] = useState<Theme[]>([]);
    const [loading, setLoading] = useState(true);
    const [activating, setActivating] = useState<string | null>(null);

    // Fetch themes from API
    useEffect(() => {
        fetchThemes();
    }, []);

    const fetchThemes = async () => {
        try {
            const res = await fetch('/api/themes');
            const data = await res.json();
            // Ensure data is an array
            setThemes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch themes:', error);
            toast.error('فشل تحميل الثيمات');
            setThemes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleActivateTheme = async (themeId: string) => {
        if (!tenant) {
            toast.error('لم يتم العثور على بيانات المستأجر');
            return;
        }

        setActivating(themeId);
        try {
            const res = await fetch('/api/themes/activate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    themeId,
                    tenantId: tenant.id
                })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(`تم تفعيل ثيم ${data.themeName || ''} بنجاح!`);

                // Refresh tenant data to update UI immediately
                await refetchTenant();

                // Reload page to apply new theme resources completely
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                toast.error(data.error || 'فشل تفعيل الثيم');
            }
        } catch (error) {
            console.error('Failed to activate theme:', error);
            toast.error('حدث خطأ أثناء تفعيل الثيم');
        } finally {
            setActivating(null);
        }
    };

    // Find the active theme object based on tenant's activeTheme slug
    const activeTheme = themes.find(t => t.slug === tenant?.activeTheme);

    if (loading) {
        return (
            <Container maxWidth="full" className="py-8">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
            </Container>
        );
    }

    return (
        <Container maxWidth="full" className="py-8">
            <Stack spacing="lg">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">المظهر والثيمات</h1>
                        <p className="text-gray-500 mt-1">اختر وتخصيص مظهر متجرك الإلكتروني</p>
                    </div>
                    <Button variant="primary" disabled>
                        تخصيص الثيم الحالي (قريباً)
                    </Button>
                </div>

                {/* Active Theme Section */}
                {activeTheme && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                            <div className="bg-green-100 p-1 rounded-full">
                                <Check className="w-4 h-4 text-green-600" />
                            </div>
                            الثيم النشط حالياً
                        </h2>

                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Preview Image */}
                            <div className="w-full md:w-1/2 lg:w-2/5 aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg relative overflow-hidden border border-gray-200 group">
                                {activeTheme.previewImage ? (
                                    <Image
                                        src={activeTheme.previewImage}
                                        alt={activeTheme.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-50">
                                        <div className="text-center">
                                            <Layout className="w-16 h-16 mx-auto mb-3 opacity-20" />
                                            <span className="text-sm font-medium opacity-60">صورة المعاينة</span>
                                        </div>
                                    </div>
                                )}

                                {/* Overlay Badge */}
                                <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                    نشط
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-2xl font-bold text-gray-900">{activeTheme.name}</h3>
                                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-mono">v{activeTheme.config?.version || '1.0.0'}</span>
                                    </div>

                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {activeTheme.description || 'ثيم احترافي مصمم خصيصاً لتلبية احتياجات متجرك.'}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                        {/* Colors */}
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2 text-sm text-gray-700 font-medium">
                                                <Palette className="w-4 h-4 text-primary" />
                                                <span>الألوان الرئيسية</span>
                                            </div>
                                            <div className="flex gap-2">
                                                {activeTheme.config?.colors && Object.entries(activeTheme.config.colors).map(([key, color]: [string, any]) => (
                                                    <div key={key} className="flex flex-col items-center gap-1">
                                                        <div
                                                            className="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
                                                            style={{ backgroundColor: color }}
                                                            title={`${key}: ${color}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Fonts */}
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2 text-sm text-gray-700 font-medium">
                                                <Type className="w-4 h-4 text-primary" />
                                                <span>الخطوط المستخدمة</span>
                                            </div>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                {activeTheme.config?.fonts?.heading && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">العناوين:</span>
                                                        <span className="font-medium">{activeTheme.config.fonts.heading}</span>
                                                    </div>
                                                )}
                                                {activeTheme.config?.fonts?.body && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">النصوص:</span>
                                                        <span className="font-medium">{activeTheme.config.fonts.body}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-gray-100">
                                    <Button
                                        variant="outline"
                                        onClick={() => window.open('/', '_blank')}
                                        className="flex-1 md:flex-none"
                                    >
                                        معاينة المتجر
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="flex-1 md:flex-none"
                                        onClick={() => window.location.href = `/admin/themes/customize?id=${activeTheme.id}`}
                                    >
                                        تخصيص الثيم
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Available Themes Grid */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">مكتبة الثيمات</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {themes.map((theme) => {
                            const isCurrentlyActive = theme.slug === tenant?.activeTheme;
                            const isActivatingThis = activating === theme.id;

                            // Skip if not active in system (unless it's the currently active one for this tenant)
                            if (!theme.isActive && !isCurrentlyActive) return null;

                            return (
                                <div
                                    key={theme.id}
                                    className={`bg-white rounded-xl border transition-all duration-200 hover:shadow-lg flex flex-col h-full ${isCurrentlyActive ? 'border-primary ring-1 ring-primary shadow-sm' : 'border-gray-200'
                                        }`}
                                >
                                    {/* Thumbnail */}
                                    <div className="aspect-video bg-gray-100 rounded-t-xl relative overflow-hidden border-b border-gray-100 group">
                                        {theme.previewImage ? (
                                            <Image
                                                src={theme.previewImage}
                                                alt={theme.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-50">
                                                <div className="text-center">
                                                    <Palette className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                                    <span className="text-xs opacity-70">{theme.name}</span>
                                                </div>
                                            </div>
                                        )}

                                        {isCurrentlyActive && (
                                            <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                                نشط
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-900 text-lg">{theme.name}</h3>
                                        </div>

                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                                            {theme.description || 'ثيم مميز يضيف لمسة جمالية لمتجرك.'}
                                        </p>

                                        {/* Tags/Features */}
                                        {theme.tags && theme.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {theme.tags.slice(0, 3).map((tag, idx) => (
                                                    <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-auto pt-4 flex gap-2">
                                            {isCurrentlyActive ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    fullWidth
                                                    className="bg-gray-50"
                                                    disabled
                                                >
                                                    مفعّل حالياً
                                                </Button>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        fullWidth
                                                        onClick={() => handleActivateTheme(theme.id)}
                                                        disabled={isActivatingThis}
                                                    >
                                                        {isActivatingThis ? (
                                                            <>
                                                                <Loader2 className="w-3 h-3 animate-spin ml-2" />
                                                                جاري التفعيل...
                                                            </>
                                                        ) : (
                                                            'تطبيق'
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="px-2"
                                                        title="معاينة وتخصيص"
                                                        onClick={() => window.location.href = `/admin/themes/customize?id=${theme.id}`}
                                                    >
                                                        <MousePointerClick className="w-4 h-4" />
                                                        <span className="mr-2">معاينة</span>
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Coming Soon Card */}
                        <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center min-h-[300px] hover:bg-gray-100 transition-colors">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                                <Sparkles className="w-5 h-5 text-gray-400" />
                            </div>
                            <h3 className="font-medium text-gray-900 mb-1">المزيد قريباً</h3>
                            <p className="text-sm text-gray-500 max-w-[200px]">
                                نعمل باستمرار على إضافة ثيمات جديدة ومميزة لمتجرك
                            </p>
                        </div>
                    </div>
                </div>
            </Stack>
        </Container>
    );
}
