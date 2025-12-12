import { ArrowRight, X, AlertCircle, Info, Check } from 'lucide-react';

export default function Toast({
    type = 'success',
    title,
    description,
    onDismiss,
}: {
    type?: 'success' | 'error' | 'info' | 'warning';
    title: string;
    description?: string;
    onDismiss?: () => void;
}) {
    const icons = {
        success: Check,
        error: X,
        info: Info,
        warning: AlertCircle,
    };

    const styles = {
        success: 'border-black bg-white text-black',
        error: 'border-black bg-white text-black', // Changed from red to black
        info: 'border-black bg-white text-black',
        warning: 'border-black bg-white text-black',
    };

    const Icon = icons[type];
    const style = styles[type];

    return (
        <div
            className={`flex items-start gap-4 rounded-none border ${style} p-5 min-w-[340px] shadow-none`}
        >
            <div className={`p-1 border border-current rounded-none`}>
                <Icon className="size-3.5" strokeWidth={1.5} />
            </div>
            <div className="flex-1 space-y-1 pt-0.5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#46423D]">{title}</p>
                {description && (
                    <p className="text-xs text-gray-500 font-light leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
            {onDismiss && (
                <button onClick={onDismiss} className="text-gray-400 hover:text-black transition-colors">
                    <X className="size-4" />
                </button>
            )}
        </div>
    );
}
