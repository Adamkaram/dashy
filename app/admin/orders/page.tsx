'use client';

import { useEffect, useState } from 'react';
import { Search, Eye, X, Calendar, Clock, MapPin, Phone, User, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Order {
    id: string;
    customer_name: string;
    customer_phone: string;
    date: string;
    time: string;
    area: string;
    total_amount: number;
    status: string;
    created_at: string;
    notes?: string;
    coupon_code?: string;
    discount?: number;
    selected_options?: any;
    services?: {
        title: string;
        image: string;
    };
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders');
            const data = await res.json();

            // Ensure data is an array before setting state
            if (Array.isArray(data)) {
                setOrders(data);
            } else {
                console.error('API returned non-array data:', data);
                setOrders([]);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setOrders([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    // Ensure orders is always an array before filtering
    const filteredOrders = Array.isArray(orders) ? orders.filter(order =>
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_phone.includes(searchTerm) ||
        order.id.includes(searchTerm)
    ) : [];

    const toggleStatus = async (order: Order) => {
        const newStatus = order.status === 'completed' ? 'pending' : 'completed';

        try {
            // Optimistic update
            setOrders(orders.map(o =>
                o.id === order.id ? { ...o, status: newStatus } : o
            ));

            const res = await fetch(`/api/admin/orders/${order.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error('Failed to update status');

        } catch (error) {
            console.error('Failed to update status:', error);
            // Revert on error
            setOrders(orders.map(o =>
                o.id === order.id ? { ...o, status: order.status } : o
            ));
            alert('فشل في تحديث الحالة');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'قيد الانتظار';
            case 'confirmed': return 'مؤكد';
            case 'completed': return 'تم الطلب';
            case 'cancelled': return 'ملغي';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8F6B43]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">الطلبات</h1>
                    <p className="text-gray-600 mt-1">إدارة ومتابعة حجوزات العملاء</p>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="بحث برقم الطلب أو الاسم..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8F6B43] focus:border-transparent outline-none w-64"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">رقم الطلب</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">العميل</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">الخدمة</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">الموعد</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">المبلغ</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">الحالة</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        لا توجد طلبات مطابقة للبحث
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                            #{order.id.slice(0, 8)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{order.customer_name}</span>
                                                <span className="text-xs text-gray-500">{order.customer_phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {order.services?.title || 'خدمة محذوفة'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <div className="flex flex-col">
                                                <span>{order.date}</span>
                                                <span className="text-xs text-gray-500">{order.time}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#8F6B43]">
                                            {order.total_amount} د.ك
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => toggleStatus(order)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md transition-all hover:scale-105 ${order.status === 'completed'
                                                    ? 'bg-green-500/90 text-white shadow-md shadow-green-500/20'
                                                    : 'bg-yellow-500/90 text-white shadow-md shadow-yellow-500/20'
                                                    }`}
                                            >
                                                {getStatusText(order.status)}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-gray-600 hover:text-[#8F6B43] transition-colors p-2 hover:bg-gray-100 rounded-full"
                                                title="عرض التفاصيل"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                                <h2 className="text-xl font-bold text-gray-800">تفاصيل الطلب #{selectedOrder.id.slice(0, 8)}</h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Status Banner */}
                                <div className={`p-4 rounded-xl flex items-center justify-between ${getStatusColor(selectedOrder.status)} bg-opacity-20`}>
                                    <span className="font-bold">حالة الطلب: {getStatusText(selectedOrder.status)}</span>
                                    <span className="text-sm opacity-75">{new Date(selectedOrder.created_at).toLocaleDateString('ar-KW')}</span>
                                </div>

                                {/* Customer Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                                            <User className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase">العميل</span>
                                        </div>
                                        <p className="font-medium text-gray-900">{selectedOrder.customer_name}</p>
                                        <p className="text-sm text-gray-600 mt-1" dir="ltr">{selectedOrder.customer_phone}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                                            <MapPin className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase">الموقع</span>
                                        </div>
                                        <p className="font-medium text-gray-900">{selectedOrder.area}</p>
                                    </div>
                                </div>

                                {/* Appointment Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase">التاريخ</span>
                                        </div>
                                        <p className="font-medium text-gray-900">{selectedOrder.date}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase">الوقت</span>
                                        </div>
                                        <p className="font-medium text-gray-900">{selectedOrder.time}</p>
                                    </div>
                                </div>

                                {/* Service & Options */}
                                <div className="border border-gray-200 rounded-xl p-4">
                                    <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">تفاصيل الخدمة</h3>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="font-bold text-[#8F6B43]">{selectedOrder.services?.title}</p>
                                        </div>
                                        <p className="font-bold">{selectedOrder.total_amount} د.ك</p>
                                    </div>

                                    {selectedOrder.selected_options && Object.keys(selectedOrder.selected_options).length > 0 && (
                                        <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-2">
                                            {Object.entries(selectedOrder.selected_options).map(([key, value]: [string, any]) => (
                                                <div key={key} className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        {Array.isArray(value)
                                                            ? value.map(v => v.label).join(', ')
                                                            : value.label}
                                                    </span>
                                                    {(value.price || (Array.isArray(value) && value.reduce((a, b) => a + b.price, 0) > 0)) && (
                                                        <span className="text-gray-900 font-medium">
                                                            +{Array.isArray(value)
                                                                ? value.reduce((a: number, b: any) => a + (b.price || 0), 0)
                                                                : value.price} د.ك
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {selectedOrder.coupon_code && (
                                        <div className="mt-4 flex justify-between text-sm text-green-600 bg-green-50 p-2 rounded">
                                            <span>كود الخصم: {selectedOrder.coupon_code}</span>
                                            <span>-{selectedOrder.discount} د.ك</span>
                                        </div>
                                    )}
                                </div>

                                {/* Notes */}
                                {selectedOrder.notes && (
                                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-yellow-700 mb-2">
                                            <FileText className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase">ملاحظات العميل</span>
                                        </div>
                                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{selectedOrder.notes}</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    إغلاق
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
