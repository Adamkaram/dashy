'use client';

import { useEffect, useState } from 'react';
import { Bell, Send, Eye, Megaphone, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { createPortal } from 'react-dom';
import FileUpload from '@/components/ui/file-upload';
import { compressImage } from '@/lib/image-compression';

interface Alert {
    id: string;
    type: string;
    title: string;
    description: string;
    image?: string;
    source: string;
    createdAt: string;
    metadata?: any;
}

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [alertImage, setAlertImage] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'info',
    });

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const res = await fetch('/api/admin/notifications?source=system');
            if (res.ok) {
                const data = await res.json();
                setAlerts(data.filter((a: Alert) => a.source === 'system'));
            }
        } catch (error) {
            console.error('Failed to fetch alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error('يرجى إدخال عنوان التنبيه');
            return;
        }

        setSending(true);

        try {
            const res = await fetch('/api/admin/notifications/broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: formData.type,
                    title: formData.title,
                    description: formData.description,
                    image: alertImage[0] || null,
                }),
            });

            if (!res.ok) throw new Error('Broadcast failed');

            const data = await res.json();
            toast.success(data.message || 'تم إرسال التنبيه بنجاح');

            // Reset form
            setFormData({
                title: '',
                description: '',
                type: 'info',
            });
            setAlertImage([]);

            // Refresh alerts list
            fetchAlerts();
        } catch (error) {
            console.error('Error broadcasting alert:', error);
            toast.error('فشل في إرسال التنبيه');
        } finally {
            setSending(false);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'warning': return <AlertCircle className="w-5 h-5 text-orange-600" />;
            case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />;
            default: return <Info className="w-5 h-5 text-violet-600" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'success': return 'bg-green-50 border-green-200';
            case 'warning': return 'bg-orange-50 border-orange-200';
            case 'error': return 'bg-red-50 border-red-200';
            default: return 'bg-violet-50 border-violet-200';
        }
    };

    // Alert Detail Modal
    const AlertModal = () => {
        if (!selectedAlert) return null;

        return createPortal(
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedAlert(null)}
                    className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
                >
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        {/* Image */}
                        {selectedAlert.image && (
                            <div className="relative h-52 bg-gray-100 rounded-t-2xl overflow-hidden">
                                <img
                                    src={selectedAlert.image}
                                    alt={selectedAlert.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <div className={`p-2.5 rounded-xl ${getTypeColor(selectedAlert.type)}`}>
                                    {getTypeIcon(selectedAlert.type)}
                                </div>
                                <div className="flex-1">
                                    <span className="text-[10px] bg-[#FF6500]/10 text-[#FF6500] px-2 py-0.5 rounded-full font-medium">
                                        إشعار نظام
                                    </span>
                                    <h2 className="text-xl font-bold text-gray-800 mt-1">
                                        {selectedAlert.title}
                                    </h2>
                                </div>
                            </div>

                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {selectedAlert.description}
                            </p>

                            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                                {new Date(selectedAlert.createdAt).toLocaleString('ar-EG', {
                                    dateStyle: 'full',
                                    timeStyle: 'short'
                                })}
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="p-4 border-t border-gray-100">
                            <button
                                onClick={() => setSelectedAlert(null)}
                                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </motion.div>
            </>,
            document.body
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6500]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">التنبيهات</h1>
                <p className="text-gray-600 mt-1">إرسال تنبيهات لجميع المستأجرين</p>
            </div>

            {/* Broadcast Form */}
            <form onSubmit={handleBroadcast} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FF6500] to-[#FF4F0F] rounded-lg flex items-center justify-center">
                        <Megaphone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-900">إرسال تنبيه جديد</h2>
                        <p className="text-sm text-gray-500">سيتم إرسال التنبيه لجميع المتاجر</p>
                    </div>
                </div>

                {/* Type Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        نوع التنبيه
                    </label>
                    <div className="inline-flex bg-gray-100 rounded-lg p-1 gap-1">
                        {[
                            { value: 'info', label: 'معلومات', icon: Info, bgActive: 'bg-violet-500', textActive: 'text-white' },
                            { value: 'success', label: 'نجاح', icon: CheckCircle, bgActive: 'bg-green-500', textActive: 'text-white' },
                            { value: 'warning', label: 'تحذير', icon: AlertCircle, bgActive: 'bg-orange-500', textActive: 'text-white' },
                            { value: 'error', label: 'خطأ', icon: AlertCircle, bgActive: 'bg-red-500', textActive: 'text-white' },
                        ].map((type) => (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${formData.type === type.value
                                    ? `${type.bgActive} ${type.textActive} shadow-sm`
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                                    }`}
                            >
                                <type.icon className="w-4 h-4" />
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        العنوان <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#FF6500]"
                        placeholder="عنوان التنبيه..."
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        الرسالة
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#FF6500] resize-none"
                        rows={4}
                        placeholder="اكتب رسالة التنبيه هنا..."
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        صورة (اختياري)
                    </label>
                    <FileUpload
                        acceptedFileTypes={["image/png", "image/jpeg", "image/webp", "image/gif"]}
                        maxFileSize={5 * 1024 * 1024}
                        previewUrls={alertImage}
                        onFilesSelect={async (files) => {
                            const file = files[0];
                            if (!file) return;

                            try {
                                // Compress
                                const compressedFile = await compressImage(file);

                                // Upload
                                const uploadFormData = new FormData();
                                uploadFormData.append('file', compressedFile);

                                const res = await fetch('/api/admin/upload', {
                                    method: 'POST',
                                    body: uploadFormData,
                                });

                                const data = await res.json();
                                if (!res.ok) throw new Error(data.error || 'Upload failed');

                                setAlertImage([data.url]);
                                toast.success('تم رفع الصورة بنجاح');
                            } catch (err) {
                                toast.error('فشل رفع الصورة');
                                console.error(err);
                            }
                        }}
                        onRemovePreview={() => {
                            setAlertImage([]);
                        }}
                        onError={(message) => {
                            toast.error(message);
                        }}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={sending || !formData.title.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF6500] to-[#FF4F0F] text-white px-6 py-3 rounded-lg font-medium hover:from-[#FF4F0F] hover:to-[#E55500] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                >
                    {sending ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            جاري الإرسال...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            إرسال لجميع المستأجرين
                        </>
                    )}
                </button>
            </form>

            {/* Sent Alerts History */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-gray-600" />
                    التنبيهات المرسلة
                </h2>

                {alerts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                        <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>لم يتم إرسال أي تنبيهات بعد</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {alerts.map((alert) => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => setSelectedAlert(alert)}
                                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all ${getTypeColor(alert.type)}`}
                            >
                                {alert.image ? (
                                    <img
                                        src={alert.image}
                                        alt=""
                                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-lg bg-white/50 flex items-center justify-center shrink-0">
                                        {getTypeIcon(alert.type)}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">{alert.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{alert.description}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {new Date(alert.createdAt).toLocaleString('ar-EG')}
                                    </p>
                                </div>
                                <button className="shrink-0 p-2 bg-white/50 rounded-lg hover:bg-white transition-colors">
                                    <Eye className="w-4 h-4 text-gray-600" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedAlert && <AlertModal />}
            </AnimatePresence>
        </div>
    );
}
