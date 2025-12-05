"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { ThemeComponents } from './component-types';
import { THEME_REGISTRY } from '@/components/themes/registry';
import { useTenant } from '@/lib/tenant';
import { useSearchParams } from 'next/navigation';
import { CartProvider } from '@/context/CartContext';

interface ThemeComponentContextType {
    components: ThemeComponents;
    themeName: string;
    loading: boolean;
}

const ThemeComponentContext = createContext<ThemeComponentContextType | undefined>(undefined);

interface ThemeComponentProviderProps {
    children: ReactNode;
}

/**
 * Provider for theme components
 * Automatically loads theme based on tenant's activeTheme
 */
export function ThemeComponentProvider({ children }: ThemeComponentProviderProps) {
    const { tenant, loading: tenantLoading } = useTenant();
    const [components, setComponents] = useState<ThemeComponents | null>(null);
    const [themeName, setThemeName] = useState<string>('default');

    const searchParams = useSearchParams();
    const previewTheme = searchParams?.get('preview_theme');

    useEffect(() => {
        if (tenant) {
            // Use preview theme if available, otherwise fallback to tenant's active theme
            const activeTheme = previewTheme || tenant.activeTheme || 'default';
            setThemeName(activeTheme);

            // Apply theme configuration (CSS Variables)
            // Only apply tenant config if we are NOT previewing another theme
            // Or if we are previewing, we might want to reset/clear them or apply default?
            // For now, let's keep applying tenant config but maybe the preview page handles its own config injection?
            // Actually, if we are previewing, we probably want the DEFAULT config of that theme, 
            // unless we are customizing it. 
            // The customization page uses postMessage or similar to update styles dynamically.
            // But for initial load, we should probably stick to tenant config or default.

            if (activeTheme) {
                document.documentElement.setAttribute('data-theme', activeTheme);
            }

            if (tenant.activeThemeConfig && !previewTheme) {
                const config = tenant.activeThemeConfig as any;
                const root = document.documentElement;

                // Apply Colors
                if (config.colors) {
                    Object.entries(config.colors).forEach(([key, value]) => {
                        root.style.setProperty(`--color-${key}`, value as string);
                        // Also set standard Tailwind-like variables if needed
                        if (key === 'primary') root.style.setProperty('--primary', value as string);
                        if (key === 'secondary') root.style.setProperty('--secondary', value as string);
                        if (key === 'background') root.style.setProperty('--background', value as string);
                        if (key === 'foreground') root.style.setProperty('--foreground', value as string);
                    });
                }

                // Apply Fonts
                if (config.fonts) {
                    if (config.fonts.heading) {
                        root.style.setProperty('--font-heading', config.fonts.heading);
                    }
                    if (config.fonts.body) {
                        root.style.setProperty('--font-body', config.fonts.body);
                        // Override global layout fonts
                        root.style.setProperty('--font-family-ar', config.fonts.body);
                        root.style.setProperty('--font-family-en', config.fonts.body);
                    }
                }
            }

            // Load theme components from registry
            const theme = THEME_REGISTRY[activeTheme];

            if (theme) {
                setComponents(theme.components);
                console.log(`Loaded theme: ${activeTheme} ${previewTheme ? '(Preview Mode)' : ''}`);
            } else {
                console.warn(`Theme "${activeTheme}" not found, falling back to default`);
                setComponents(THEME_REGISTRY['default'].components);
                setThemeName('default');
            }
        }
    }, [tenant, previewTheme]);

    // Show loading state while tenant or theme is loading
    if (tenantLoading || !components) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5EBE9]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8F6B43]"></div>
            </div>
        );
    }

    return (
        <ThemeComponentContext.Provider value={{ components, themeName, loading: false }}>
            <CartProvider>
                {children}
            </CartProvider>
        </ThemeComponentContext.Provider>
    );
}

/**
 * Hook to access theme components
 * Returns the components for the active theme
 */
export function useThemeComponents(): ThemeComponents {
    const context = useContext(ThemeComponentContext);

    if (!context) {
        throw new Error('useThemeComponents must be used within ThemeComponentProvider');
    }

    return context.components;
}

/**
 * Hook to get the current theme name
 */
export function useCurrentThemeName(): string {
    const context = useContext(ThemeComponentContext);

    if (!context) {
        throw new Error('useCurrentThemeName must be used within ThemeComponentProvider');
    }

    return context.themeName;
}

/**
 * Hook to check if theme is loading
 */
export function useThemeLoading(): boolean {
    const context = useContext(ThemeComponentContext);

    if (!context) {
        throw new Error('useThemeLoading must be used within ThemeComponentProvider');
    }

    return context.loading;
}
