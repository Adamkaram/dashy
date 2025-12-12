import Link from 'next/link';
import Image from 'next/image';

interface CategoryCardProps {
    category: {
        id: string;
        slug: string;
        name: string;
        image?: string;
    };
}

export default function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link href={`/categories/${category.slug}`} className="block group relative h-[400px] w-full overflow-hidden rounded-2xl">
            {/* Background Image */}
            <Image
                src={category.image || '/placeholder.jpg'}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={85}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#FF6500]/90 via-[#FF6500]/40 to-transparent opacity-90" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center">
                {/* Title */}
                <h3 className="text-2xl font-bold mb-2 leading-tight">
                    {category.name}
                </h3>

                <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30 hover:bg-white/30 transition-colors">
                    استعراض
                </span>
            </div>
        </Link>
    );
}
