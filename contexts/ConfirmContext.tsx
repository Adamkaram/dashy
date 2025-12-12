'use client';

import { useState, useCallback, createContext, useContext, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2, AlertCircle, CheckCircle, LucideIcon } from 'lucide-react';

// Types
interface ConfirmOptions {
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    icon?: LucideIcon;
}

interface ConfirmContextType {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

// Provider Component
export function ConfirmProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions | null>(null);
    const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

    const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
        setOptions(opts);
        setIsOpen(true);
        return new Promise((resolve) => {
            setResolver(() => resolve);
        });
    }, []);

    const handleConfirm = useCallback(() => {
        setIsOpen(false);
        resolver?.(true);
        setResolver(null);
    }, [resolver]);

    const handleCancel = useCallback(() => {
        setIsOpen(false);
        resolver?.(false);
        setResolver(null);
    }, [resolver]);

    const getVariantStyles = (variant: ConfirmOptions['variant'] = 'danger') => {
        switch (variant) {
            case 'danger':
                return {
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    buttonBg: 'bg-red-600 hover:bg-red-700',
                    Icon: Trash2,
                };
            case 'warning':
                return {
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-600',
                    buttonBg: 'bg-amber-600 hover:bg-amber-700',
                    Icon: AlertTriangle,
                };
            case 'info':
                return {
                    iconBg: 'bg-[#FF6500]/10',
                    iconColor: 'text-[#FF6500]',
                    buttonBg: 'bg-[#FF6500] hover:bg-[#FF4F0F]',
                    Icon: AlertCircle,
                };
            default:
                return {
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    buttonBg: 'bg-red-600 hover:bg-red-700',
                    Icon: Trash2,
                };
        }
    };

    const variantStyles = options ? getVariantStyles(options.variant) : getVariantStyles();
    const IconComponent = options?.icon || variantStyles.Icon;

    // Modal content to be portaled
    const modalContent = (
        <AnimatePresence>
            {isOpen && options && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCancel}
                        className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                            {/* Header */}
                            <div className="p-6 pb-0">
                                <div className="flex items-start gap-4">
                                    <div className={`shrink-0 p-3 rounded-full ${variantStyles.iconBg}`}>
                                        <IconComponent className={`w-6 h-6 ${variantStyles.iconColor}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-lg font-semibold text-neutral-900">
                                            {options.title}
                                        </h2>
                                        {options.description && (
                                            <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                                                {options.description}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleCancel}
                                        className="shrink-0 p-2 hover:bg-neutral-100 rounded-lg transition-colors -m-2"
                                    >
                                        <X className="w-5 h-5 text-neutral-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 p-6">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2.5 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                                >
                                    {options.cancelText || 'إلغاء'}
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className={`px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors ${variantStyles.buttonBg}`}
                                >
                                    {options.confirmText || 'تأكيد'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {typeof document !== 'undefined' && createPortal(modalContent, document.body)}
        </ConfirmContext.Provider>
    );
}

// Hook
export function useConfirm() {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within ConfirmProvider');
    }
    return context;
}
