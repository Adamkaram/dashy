'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useThemeComponents } from '@/lib/theme/ThemeComponentProvider';

export default function Home() {
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { Hero, CategoryCard } = useThemeComponents();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [slidesRes, categoriesRes] = await Promise.all([
          supabase
            .from('hero_slides')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true }),
          supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true })
        ]);

        if (slidesRes.data) setHeroSlides(slidesRes.data);
        if (categoriesRes.data) {
          console.log('Categories fetched:', categoriesRes.data);
          setCategories(categoriesRes.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F5EBE9]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8F6B43]"></div>
    </div>;
  }

  return (
    <div className="bg-[#F5EBE9]" dir="rtl">
      {/* Hero Section - Using Theme Component */}
      <Hero slides={heroSlides} />

      {/* Categories Grid Section */}
      <section className="py-12 bg-[#F0EBE5]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#53131C] mb-2">
              الخدمات التى نقدمها لك
            </h2>
            <p className="text-gray-600">اكتشف مجموعة واسعة من الخدمات المميزة</p>
          </div>

          {/* Categories Grid - Using Theme Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.filter(c => !c.parent_id).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
