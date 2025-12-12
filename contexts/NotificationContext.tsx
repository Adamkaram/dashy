'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { ShoppingCart, CheckCircle, AlertCircle, Trash2, Package, Edit, LucideIcon, Info, Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Notification types matching DB schema
export interface Notification {
    id: string;
    type: 'order' | 'success' | 'alert' | 'delete' | 'product' | 'edit' | 'info' | 'warning' | 'error';
    source: 'system' | 'tenant'; // system = broadcast, tenant = specific
    title: string;
    description: string;
    image?: string; // Image URL for rich notifications
    time: string;
    read: boolean;
    icon: LucideIcon;
    actionUrl?: string;
    actionLabel?: string;
    metadata?: any;
    createdAt?: string;
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
    order: ShoppingCart,
    success: CheckCircle,
    alert: AlertCircle,
    warning: AlertCircle,
    error: AlertCircle,
    delete: Trash2,
    product: Package,
    edit: Edit,
    info: Info,
    default: Bell,
};

// Calculate relative time
function getRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'الآن';
    if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
    if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
    return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
}

// Context type
interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    hasSystemUnread: boolean; // For bell indicator
    lastSystemType: 'info' | 'success' | 'warning' | 'error' | null; // Type of last unread system notification
    addNotification: (type: Notification['type'], title: string, description: string, metadata?: any) => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    clearAll: () => void;
    refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/notifications');
            if (res.ok) {
                const data = await res.json();
                const mappedNotifications = data.map((n: any) => ({
                    id: n.id,
                    type: n.type,
                    source: n.source || 'tenant', // Default to tenant if not set
                    title: n.title,
                    description: n.description,
                    image: n.image, // Image URL for rich notifications
                    time: getRelativeTime(n.createdAt), // Calculate relative time
                    read: n.read,
                    icon: iconMap[n.type] || iconMap.default,
                    actionUrl: n.actionUrl,
                    actionLabel: n.actionLabel,
                    metadata: n.metadata,
                    createdAt: n.createdAt
                }));
                setNotifications(mappedNotifications);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }, []);

    // Initial fetch and realtime subscription
    useEffect(() => {
        let currentTenantId: string | null = null;

        // Fetch notifications and extract tenant_id from first notification
        const initializeAndSubscribe = async () => {
            try {
                const res = await fetch('/api/admin/notifications');
                if (res.ok) {
                    const data = await res.json();
                    // Get tenant_id from first notification (they all have same tenant)
                    if (data.length > 0) {
                        currentTenantId = data[0].tenantId;
                    }
                    const mappedNotifications = data.map((n: any) => ({
                        id: n.id,
                        type: n.type,
                        source: n.source || 'tenant',
                        title: n.title,
                        description: n.description,
                        image: n.image,
                        time: getRelativeTime(n.createdAt),
                        read: n.read,
                        icon: iconMap[n.type] || iconMap.default,
                        actionUrl: n.actionUrl,
                        actionLabel: n.actionLabel,
                        metadata: n.metadata,
                        createdAt: n.createdAt
                    }));
                    setNotifications(mappedNotifications);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        initializeAndSubscribe();

        // Subscribe to realtime INSERT events
        const channel = supabase
            .channel('notifications-realtime')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                },
                (payload) => {
                    const n = payload.new as any;

                    // Only add if belongs to current tenant
                    if (currentTenantId && n.tenant_id !== currentTenantId) {
                        console.log('Ignoring notification for different tenant:', n.tenant_id);
                        return;
                    }

                    console.log('Realtime notification received:', payload);
                    const newNotification: Notification = {
                        id: n.id,
                        type: n.type,
                        source: n.source || 'tenant',
                        title: n.title,
                        description: n.description,
                        image: n.image,
                        time: 'الآن',
                        read: n.read || false,
                        icon: iconMap[n.type] || iconMap.default,
                        actionUrl: n.action_url,
                        actionLabel: n.action_label,
                        metadata: n.metadata,
                        createdAt: n.created_at
                    };
                    // Check for duplicate before adding
                    setNotifications(prev => {
                        if (prev.some(existing => existing.id === n.id)) {
                            return prev; // Already exists
                        }
                        return [newNotification, ...prev];
                    });
                }
            )
            .subscribe();

        // Fallback poll every 2 minutes
        const interval = setInterval(() => {
            // Re-fetch to sync with server
            fetch('/api/admin/notifications')
                .then(res => res.ok ? res.json() : [])
                .then(data => {
                    if (data.length > 0 && !currentTenantId) {
                        currentTenantId = data[0].tenantId;
                    }
                    const mappedNotifications = data.map((n: any) => ({
                        id: n.id,
                        type: n.type,
                        source: n.source || 'tenant',
                        title: n.title,
                        description: n.description,
                        image: n.image,
                        time: getRelativeTime(n.createdAt),
                        read: n.read,
                        icon: iconMap[n.type] || iconMap.default,
                        actionUrl: n.actionUrl,
                        actionLabel: n.actionLabel,
                        metadata: n.metadata,
                        createdAt: n.createdAt
                    }));
                    setNotifications(mappedNotifications);
                })
                .catch(err => console.error('Error polling notifications:', err));
        }, 120000);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(interval);
        };
    }, []);

    const addNotification = useCallback(async (type: Notification['type'], title: string, description: string, metadata?: any) => {
        // Optimistic update
        const tempId = Date.now().toString();
        const newNotification: Notification = {
            id: tempId,
            type,
            source: 'tenant', // Local notifications are always tenant-specific
            title,
            description,
            time: 'الآن',
            read: false,
            icon: iconMap[type] || iconMap.default,
            metadata
        };

        setNotifications(prev => [newNotification, ...prev]);

        try {
            // Send to API
            await fetch('/api/admin/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    title,
                    description,
                    metadata
                }),
            });
            // Refresh to get real ID and data
            fetchNotifications();
        } catch (error) {
            console.error('Error adding notification:', error);
            // Revert optimistic update if needed, or just let it be replaced on next fetch
        }
    }, [fetchNotifications]);

    const markAsRead = useCallback(async (id: string) => {
        // Optimistic update
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );

        try {
            await fetch('/api/admin/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));

        try {
            await fetch('/api/admin/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ all: true }),
            });
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    }, []);

    const clearAll = useCallback(() => {
        // For now clear only locally, or implement delete API
        setNotifications([]);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Get the most recent unread notification (first in array since sorted by newest)
    const latestUnread = notifications.find(n => !n.read);

    // Only show system colors if the LATEST unread notification is from system
    const hasSystemUnread = latestUnread?.source === 'system';
    const lastSystemType = hasSystemUnread
        ? (latestUnread?.type as 'info' | 'success' | 'warning' | 'error' | null)
        : null;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            hasSystemUnread,
            lastSystemType,
            addNotification,
            markAsRead,
            markAllAsRead,
            clearAll,
            refresh: fetchNotifications,
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
}
