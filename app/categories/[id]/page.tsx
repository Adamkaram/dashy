import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    getCategoryBySlug,
    getSubCategories,
    getServicesByCategory,
    getCategoryHierarchy,
    getAllCategories
} from '@/lib/data-fetching';
import ServiceCard from '@/components/ServiceCard';
import CategoryCard from '@/components/CategoryCard';
import FilterBarClient from '@/components/FilterBarClient';

// Enable ISR - revalidate every hour
export const revalidate = 3600;

// Generate static params for all categories
export async function generateStaticParams() {
    const categories = await getAllCategories();
    return categories.map((category) => ({
        id: category.slug,
    }));
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: categoryId } = await params;

    // Fetch category data server-side
    const category = await getCategoryBySlug(categoryId);
    const categoryHierarchy = category ? await getCategoryHierarchy(category.id) : [];

    if (!category) {
        notFound();
    }

    // Fetch sub-categories and services
    const subCategories = await getSubCategories(category.id);
    const services = subCategories.length === 0 ? await getServicesByCategory(category.id) : [];

    const hasSubCategories = subCategories.length > 0;
    const hasServices = services.length > 0;

    // Extract unique providers for filter
    const providers = Array.from(
        new Set(services.map(s => s.provider_name).filter(Boolean))
    ) as string[];

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#FFEDD5' }} dir="rtl">
            {/* Main Content Section */}
            <section className="sec-padding page sub-category-page py-8" style={{ backgroundColor: '#0f0e0cff' }}>
                {/* Page Header */}
                <header className="py-5 bg-gradient-burgundy mb-8 rounded-xl mx-6 md:mx-12 shadow-lg">
                    <div className="container mx-auto px-8 md:px-16">
                        <h4 className="text-base font-bold mb-2 text-[#FF6500]">
                            {category.name}
                        </h4>

                        <nav aria-label="breadcrumb">
                            <ol className="flex items-center gap-2 text-sm flex-wrap text-white/80">
                                <li>
                                    <Link href="/" className="hover:text-white transition-colors text-white/80">
                                        الرئيسية
                                    </Link>
                                </li>
                                <li>/</li>
                                {categoryHierarchy.length > 0 ? (
                                    categoryHierarchy.map((cat: any, index: number) => (
                                        <li key={cat.id} className="flex items-center gap-2">
                                            {index === categoryHierarchy.length - 1 ? (
                                                <span className="font-medium text-white" aria-current="page">
                                                    {cat.name}
                                                </span>
                                            ) : (
                                                <>
                                                    <Link href={`/categories/${cat.slug}`} className="hover:text-white transition-colors text-white/80">
                                                        {cat.name}
                                                    </Link>
                                                    <span>/</span>
                                                </>
                                            )}
                                        </li>
                                    ))
                                ) : (
                                    <li className="font-medium text-white" aria-current="page">
                                        {category.name}
                                    </li>
                                )}
                            </ol>
                        </nav>
                    </div>
                </header>

                {/* Content Grid */}
                <div className="container mx-auto px-6 md:px-12">
                    <FilterBarClient
                        initialCount={hasSubCategories ? subCategories.length : services.length}
                        initialServices={services}
                        providers={providers}
                        hasSubCategories={hasSubCategories}
                    />

                    {hasSubCategories ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subCategories.map((subCat) => (
                                <CategoryCard key={subCat.id} category={subCat} />
                            ))}
                        </div>
                    ) : hasServices ? (
                        <div id="services-grid">
                            {/* Services will be rendered by FilterBarClient */}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-[#46423D] text-lg">لا توجد محتويات متاحة حالياً</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
