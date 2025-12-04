'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { ThemeComponents } from './component-types';
import { THEME_REGISTRY } from '@/components/themes/registry';
import { useTenant } from '@/lib/tenant';

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

    useEffect(() => {
        if (tenant) {
            const activeTheme = tenant.activeTheme || 'default';
            setThemeName(activeTheme);

            // Load theme components from registry
            const theme = THEME_REGISTRY[activeTheme];

            if (theme) {
                setComponents(theme.components);
                console.log(`Loaded theme: ${activeTheme}`);
            } else {
                console.warn(`Theme "${activeTheme}" not found, falling back to default`);
                setComponents(THEME_REGISTRY['default'].components);
                setThemeName('default');
            }
        }
    }, [tenant]);

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
            {children}
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
