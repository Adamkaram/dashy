import { unstable_cache } from 'next/cache';
import { supabase } from './supabase';

// Cache tags for revalidation
export const CACHE_TAGS = {
    categories: 'categories',
    services: 'services',
    category: (slug: string) => `category-${slug}`,
    service: (slug: string) => `service-${slug}`,
    subCategories: (parentId: string) => `subcategories-${parentId}`,
    categoryServices: (categoryId: string) => `services-category-${categoryId}`,
    serviceImages: (serviceId: string) => `service-images-${serviceId}`,
    serviceOptions: (serviceId: string) => `service-options-${serviceId}`,
    kuwaitAreas: 'kuwait-areas',
};

// Revalidation time in seconds (1 hour)
const REVALIDATE_TIME = 3600;

/**
 * Get all categories for static params generation
 */
export const getAllCategories = unstable_cache(
    async () => {
        const { data, error } = await supabase
            .from('categories')
            .select('slug')
            .eq('is_active', true);

        if (error) {
            console.error('Error fetching categories:', error);
            return [];
        }

        return data || [];
    },
    ['all-categories'],
    { tags: [CACHE_TAGS.categories], revalidate: REVALIDATE_TIME }
);

/**
 * Get all services for static params generation
 */
export const getAllServices = unstable_cache(
    async () => {
        const { data, error } = await supabase
            .from('services')
            .select('slug')
            .eq('is_active', true);

        if (error) {
            console.error('Error fetching services:', error);
            return [];
        }

        return data || [];
    },
    ['all-services'],
    { tags: [CACHE_TAGS.services], revalidate: REVALIDATE_TIME }
);

/**
 * Get category by slug or ID with fallback
 */
export const getCategoryBySlug = unstable_cache(
    async (slugOrId: string) => {
        // Try slug first
        let { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('slug', slugOrId)
            .single();

        // Fallback to ID if slug didn't return data
        if (!data) {
            const result = await supabase
                .from('categories')
                .select('*')
                .eq('id', slugOrId)
                .single();

            data = result.data;
            error = result.error;
        }

        if (error && !data) {
            console.error('Error fetching category:', error);
            return null;
        }

        return data;
    },
    ['category-by-slug'],
    { revalidate: REVALIDATE_TIME }
);

/**
 * Get service by slug or ID with fallback
 */
export const getServiceBySlug = unstable_cache(
    async (slugOrId: string) => {
        // Try slug first
        let { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('slug', slugOrId)
            .eq('is_active', true)
            .single();

        // Fallback to ID if slug didn't return data
        if (!data) {
            const result = await supabase
                .from('services')
                .select('*')
                .eq('id', slugOrId)
                .eq('is_active', true)
                .single();

            data = result.data;
            error = result.error;
        }

        if (error && !data) {
            console.error('Error fetching service:', error);
            return null;
        }

        return data;
    },
    ['service-by-slug'],
    { revalidate: REVALIDATE_TIME }
);

/**
 * Get sub-categories for a parent category
 */
export const getSubCategories = unstable_cache(
    async (parentId: string) => {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('parent_id', parentId)
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching sub-categories:', error);
            return [];
        }

        return data || [];
    },
    ['sub-categories'],
    { revalidate: REVALIDATE_TIME }
);

/**
 * Get services for a category
 */
export const getServicesByCategory = unstable_cache(
    async (categoryId: string) => {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('category_id', categoryId)
            .eq('is_active', true);

        if (error) {
            console.error('Error fetching services:', error);
            return [];
        }

        return data || [];
    },
    ['services-by-category'],
    { revalidate: REVALIDATE_TIME }
);

/**
 * Get category for a service (for breadcrumb)
 */
export const getCategoryForService = unstable_cache(
    async (categoryId: string) => {
        const { data, error } = await supabase
            .from('categories')
            .select('id, name, slug')
            .eq('id', categoryId)
            .single();

        if (error) {
            console.error('Error fetching category:', error);
            return null;
        }

        return data;
    },
    ['category-for-service'],
    { revalidate: REVALIDATE_TIME }
);

/**
 * Get service images
 */
export const getServiceImages = unstable_cache(
    async (serviceId: string) => {
        const { data, error } = await supabase
            .from('service_images')
            .select('image_url')
            .eq('service_id', serviceId)
            .order('display_order');

        if (error) {
            console.error('Error fetching service images:', error);
            return [];
        }

        return data?.map((img: any) => img.image_url) || [];
    },
    ['service-images'],
    { revalidate: REVALIDATE_TIME }
);

/**
 * Get service options
 */
export const getServiceOptions = unstable_cache(
    async (serviceId: string) => {
        const { data, error } = await supabase
            .from('service_options')
            .select('*')
            .eq('service_id', serviceId)
            .order('display_order');

        if (error) {
            console.error('Error fetching service options:', error);
            return [];
        }

        return data || [];
    },
    ['service-options'],
    { revalidate: REVALIDATE_TIME }
);

/**
 * Get Kuwait areas grouped by governorate
 */
export const getKuwaitAreas = unstable_cache(
    async () => {
        const { data, error } = await supabase
            .from('kuwait_areas')
            .select('*')
            .order('display_order');

        if (error) {
            console.error('Error fetching Kuwait areas:', error);
            return {};
        }

        // Group by governorate
        const grouped: Record<string, string[]> = {};
        data?.forEach((area: any) => {
            if (!grouped[area.governorate]) {
                grouped[area.governorate] = [];
            }
            grouped[area.governorate].push(area.area_name);
        });

        return grouped;
    },
    ['kuwait-areas'],
    { tags: [CACHE_TAGS.kuwaitAreas], revalidate: REVALIDATE_TIME }
);

/**
 * Get category hierarchy (path from root to current category)
 */
export const getCategoryHierarchy = unstable_cache(
    async (categoryId: string) => {
        const hierarchy: any[] = [];
        let currentId = categoryId;

        // Safety limit to prevent infinite loops
        let depth = 0;
        const MAX_DEPTH = 5;

        while (currentId && depth < MAX_DEPTH) {
            const { data, error } = await supabase
                .from('categories')
                .select('id, name, slug, parent_id')
                .eq('id', currentId)
                .single();

            if (error || !data) break;

            hierarchy.unshift(data); // Add to beginning of array
            currentId = data.parent_id;
            depth++;
        }

        return hierarchy;
    },
    ['category-hierarchy'],
    { revalidate: REVALIDATE_TIME }
);
