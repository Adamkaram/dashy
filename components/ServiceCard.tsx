import Link from 'next/link';
import Image from 'next/image';

interface ServiceCardProps {
    service: {
        id: string;
        slug: string;
        title: string;
        image?: string;
        base_price?: number;
        provider_name?: string;
        provider_logo?: string;
    };
}

export default function ServiceCard({ service }: ServiceCardProps) {
    return (
        <Link href={`/services/${service.slug}`} className="block group relative h-[400px] w-full overflow-hidden rounded-2xl">
            {/* Background Image */}
            <Image
                src={service.image || '/placeholder.jpg'}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={85}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#FF6500]/90 via-[#FF6500]/40 to-transparent opacity-90" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-end justify-between gap-4">
                    <div className="flex-1">
                        {/* Provider Info */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-white/90">
                                {service.provider_name || 'My Moments'}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold mb-1 leading-tight">
                            {service.title}
                        </h3>

                        {/* Price */}
                        <div className="flex flex-col">
                            <span className="text-[10px] text-white/80 uppercase tracking-wider">
                                Starting From
                            </span>
                            <span className="text-lg font-bold">
                                {service.base_price || 0} د.ك
                            </span>
                        </div>
                    </div>

                    {/* Provider Logo (Circular) */}
                    <div className="relative w-14 h-14 rounded-full border-2 border-white/20 overflow-hidden bg-white shrink-0 mb-1">
                        <Image
                            src={service.provider_logo || 'https://wgbbwrstcsizaqmvykmh.supabase.co/storage/v1/object/public/moment-bucket/log02.png'}
                            alt={service.provider_name || 'Provider'}
                            fill
                            className="object-cover"
                            sizes="56px"
                            quality={90}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
}
