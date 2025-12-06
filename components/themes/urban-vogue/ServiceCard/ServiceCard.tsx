import { ServiceCardProps } from "@/lib/theme/component-types";
import Image from "next/image";

export default function ServiceCard({ service }: ServiceCardProps) {
    return (
        <div className="group relative overflow-hidden bg-white">
            <div className="aspect-[4/3] overflow-hidden relative">
                {service.image ? (
                    <Image
                        src={service.image}
                        alt={service.title}
                        width={600}
                        height={450}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <span>No Image</span>
                    </div>
                )}
                {/* Minimal overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            <div className="py-6">
                <h3 className="text-xl font-medium text-black uppercase tracking-wide mb-2 group-hover:text-gray-600 transition-colors">
                    {service.title}
                </h3>
                {service.description && (
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                        {service.description}
                    </p>
                )}
            </div>
        </div>
    );
}
