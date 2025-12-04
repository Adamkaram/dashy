import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';

export function CustomToast({
    type = 'success',
    title,
    description,
}: {
    type?: 'success' | 'error' | 'info' | 'warning';
    title: string;
    description?: string;
}) {
    const icons = {
        success: CheckCircle2,
        error: XCircle,
        info: Info,
        warning: AlertTriangle,
    };

    const colors = {
        success: {
            bg: 'bg-gradient-to-br from-[#ECE8DB] to-[#F0EBE5]',
            icon: 'text-[#8F6B43]',
            border: 'border-[#8F6B43]/20',
        },
        error: {
            bg: 'bg-gradient-to-br from-red-50 to-red-100',
            icon: 'text-[#53131C]',
            border: 'border-[#53131C]/20',
        },
        info: {
            bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
            icon: 'text-blue-600',
            border: 'border-blue-600/20',
        },
        warning: {
            bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
            icon: 'text-yellow-700',
            border: 'border-yellow-700/20',
        },
    };

    const Icon = icons[type];
    const style = colors[type];

    return (
        <div
            className={`flex items-start gap-3 rounded-xl ${style.bg} ${style.border} border-2 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-sm min-w-[320px]`}
        >
            <Icon className={`size-5 shrink-0 ${style.icon} mt-0.5`} />
            <div className="flex-1 space-y-1">
                <p className="text-sm font-bold text-[#46423D]">{title}</p>
                {description && (
                    <p className="text-xs text-[#46423D]/70 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

export function OrderSuccessToast({
    orderId,
    customerName,
}: {
    orderId: string;
    customerName: string;
}) {
    return (
        <div className="flex flex-col gap-3 rounded-xl bg-gradient-to-br from-[#ECE8DB] to-[#F0EBE5] border-2 border-[#8F6B43]/30 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-sm min-w-[360px]">
            <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-full bg-[#8F6B43]">
                    <CheckCircle2 className="size-5 text-white" />
                </div>
                <div>
                    <p className="font-bold text-[#46423D]">تم استلام طلبك بنجاح! 🎉</p>
                    <p className="text-xs text-[#46423D]/60">سنتواصل معك قريباً</p>
                </div>
            </div>

            <div className="rounded-lg bg-white/60 p-3 space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-[#46423D]/60">رقم الطلب</span>
                    <span className="text-sm font-mono font-bold text-[#8F6B43]">#{orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-[#46423D]/60">العميل</span>
                    <span className="text-sm font-medium text-[#46423D]">{customerName}</span>
                </div>
            </div>
        </div>
    );
}
