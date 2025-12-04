import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);



// Database types (will be generated from Supabase)
export type Database = {
    public: {
        Tables: {
            site_settings: {
                Row: {
                    id: string;
                    name: string;
                    logo: string | null;
                    description: string | null;
                    copyright: string | null;
                    powered_by: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['site_settings']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['site_settings']['Insert']>;
            };
            categories: {
                Row: {
                    id: string;
                    name: string;
                    description: string | null;
                    display_order: number;
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['categories']['Row'], 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['categories']['Insert']>;
            };
            services: {
                Row: {
                    id: string;
                    category_id: string;
                    title: string;
                    subtitle: string | null;
                    image: string | null;
                    description: string | null;
                    base_price: number;
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['services']['Insert']>;
            };
            // Add more table types as needed
        };
    };
};
