import { CategoryCardProps } from "@/lib/theme/component-types";
import Link from "next/link";
import Image from "next/image";

export default function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link href={`/shop?category=${category.slug}`} className="group block relative overflow-hidden">
            <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                {category.image ? (
                    <Image
                        src={category.image}
                        alt={category.name}
                        width={400}
                        height={600}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <span>No Image</span>
                    </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <h3 className="text-white text-2xl font-bold uppercase tracking-widest mb-2 opacity-90 group-hover:opacity-100 transition-opacity">
                        {category.name}
                    </h3>
                    <div className="w-0 h-0.5 bg-white mx-auto group-hover:w-12 transition-all duration-300" />
                    {category.description && (
                        <p className="text-white/80 text-sm mt-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            {category.description}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
