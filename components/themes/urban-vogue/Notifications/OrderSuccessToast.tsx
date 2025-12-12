import { PackageCheck } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessToast({
    orderId,
    customerName,
}: {
    orderId: string;
    customerName: string;
}) {
    return (
        <div className="flex flex-col rounded-none bg-white border border-black p-6 min-w-[380px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] duration-300">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="space-y-1">
                    <p className="text-sm font-bold uppercase tracking-widest text-black">Order Confirmed</p>
                    <p className="text-xs text-gray-500 font-light">Thank you for your purchase</p>
                </div>
                <div className="p-2 border border-black rounded-none">
                    <PackageCheck className="size-5 text-black" strokeWidth={1.5} />
                </div>
            </div>

            {/* Details */}
            <div className="space-y-3 border-t border-dashed border-gray-200 pt-4 mb-4">
                <div className="flex justify-between items-center text-xs">
                    <span className="uppercase tracking-wider text-gray-500">Order ID</span>
                    <span className="font-mono font-medium text-black">{orderId}</span>
                </div>
            </div>

            {/* Action */}
            <Link href="/" className="text-center w-full bg-black text-white text-xs uppercase tracking-widest py-3 hover:bg-gray-900 transition-colors">
                Continue Shopping
            </Link>
        </div>
    );
}
