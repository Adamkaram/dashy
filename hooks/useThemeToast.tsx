import { toast as sonnerToast } from "sonner";
import { useThemeComponents } from "@/lib/theme/ThemeComponentProvider";
import React from "react";

/**
 * Hook to use theme-aware toast notifications.
 * It resolves the Toast component from the active theme and uses it with sonner.
 */
export function useThemeToast() {
    const { Toast, OrderSuccessToast } = useThemeComponents();

    const showToast = (
        type: 'success' | 'error' | 'info' | 'warning',
        title: string,
        description?: string
    ) => {
        if (Toast) {
            sonnerToast.custom((t) => (
                <Toast
                    type={type}
                    title={title}
                    description={description}
                    onDismiss={() => sonnerToast.dismiss(t)}
                />
            ));
        } else {
            // Fallback to sonner default if theme doesn't implement Toast
            switch (type) {
                case 'success': sonnerToast.success(title, { description }); break;
                case 'error': sonnerToast.error(title, { description }); break;
                case 'info': sonnerToast.info(title, { description }); break;
                case 'warning': sonnerToast.warning(title, { description }); break;
            }
        }
    };

    return {
        success: (title: string, description?: string) => showToast('success', title, description),
        error: (title: string, description?: string) => showToast('error', title, description),
        info: (title: string, description?: string) => showToast('info', title, description),
        warning: (title: string, description?: string) => showToast('warning', title, description),

        // Specialized Toasts
        orderSuccess: (orderId: string, customerName: string) => {
            if (OrderSuccessToast) {
                sonnerToast.custom((t) => (
                    <OrderSuccessToast orderId={orderId} customerName={customerName} />
                ));
            } else {
                sonnerToast.success(`Order placed successfully: ${orderId}`);
            }
        },

        // Expose primitive if needed, but discourage direct use to enforce theme consistency
        custom: sonnerToast.custom,
        dismiss: sonnerToast.dismiss,
    };
}
