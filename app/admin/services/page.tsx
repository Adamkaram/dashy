'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Service {
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    image: string | null;
    base_price: number;
    is_active: boolean;
    category: {
        id: string;
        name: string;
        slug: string;
    };
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/admin/services');

            if (!res.ok) {
                console.error('Failed to fetch services:', res.status, res.statusText);
                setServices([]);
                return;
            }

            const data = await res.json();

            // Ensure data is an array before setting state
            if (Array.isArray(data)) {
                setServices(data);
            } else {
                console.error('Services data is not an array:', data);
                setServices([]);
            }
        } catch (error) {
            console.error('Failed to fetch services:', error);
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;

        setDeleting(id);
        try {
            const res = await fetch(`/api/admin/services/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete');

            setServices(services.filter((service) => service.id !== id));
        } catch (error) {
            console.error('Failed to delete service:', error);
            alert('فشل في حذف الخدمة');
        } finally {
            setDeleting(null);
        }
    };

    const toggleActive = async (service: Service) => {
        try {
            const res = await fetch(`/api/admin/services/${service.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...service,
                    category_id: service.category.id,
                    is_active: !service.is_active,
                }),
            });

            if (!res.ok) throw new Error('Failed to update');

            setServices(
                services.map((s) =>
                    s.id === service.id ? { ...s, is_active: !s.is_active } : s
                )
            );
        } catch (error) {
            console.error('Failed to toggle active:', error);
            alert('فشل في تحديث الحالة');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">جاري التحميل...</div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">الخدمات</h1>
                    <p className="text-gray-600 mt-1 text-sm">إدارة الخدمات المتاحة</p>
                </div>
                <Link
                    href="/admin/services/new"
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium text-sm"
                >
                    <Plus className="w-4 h-4 text-white" />
                    <span className="text-white">إضافة خدمة</span>
                </Link>
            </div>

            {/* Services Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
                <AnimatePresence mode="popLayout">
                    {services.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200"
                        >
                            لا توجد خدمات. ابدأ بإضافة خدمة جديدة.
                        </motion.div>
                    ) : (
                        services.map((service) => (
                            <motion.div
                                layout
                                key={service.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all"
                            >
                                {/* Image */}
                                <div className="relative h-40 bg-gray-100">
                                    {service.image ? (
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                            لا توجد صورة
                                        </div>
                                    )}
                                    <button
                                        onClick={() => toggleActive(service)}
                                        className={`absolute top-2 right-2 overflow-hidden inline-flex items-center justify-center w-20 h-7 rounded-md text-xs font-medium transition-colors ${service.is_active
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-gray-600 text-white hover:bg-gray-700'
                                            }`}
                                    >
                                        <AnimatePresence mode="popLayout" initial={false}>
                                            <motion.span
                                                key={service.is_active ? 'active' : 'inactive'}
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -20, opacity: 0 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                className="absolute flex items-center gap-1"
                                            >
                                                {service.is_active ? 'نشط' : 'غير نشط'}
                                            </motion.span>
                                        </AnimatePresence>
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-base text-gray-900 mb-1 line-clamp-1">
                                        {service.title}
                                    </h3>
                                    {service.subtitle && (
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.subtitle}</p>
                                    )}
                                    <div className="flex items-center justify-between text-sm mb-4">
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                                            {service.category.name}
                                        </span>
                                        <span className="font-semibold text-gray-900">
                                            {service.base_price} د.ك
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/services/${service.id}`}
                                            className="flex-1 flex items-center justify-center gap-1.5 bg-gray-900 text-white px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
                                        >
                                            <Edit className="w-3.5 h-3.5 text-white" />
                                            <span className="text-white">تعديل</span>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            disabled={deleting === service.id}
                                            className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-colors disabled:opacity-50 text-sm font-medium"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}
