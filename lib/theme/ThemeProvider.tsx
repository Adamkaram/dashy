'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ThemeConfig, ThemeContextType, Tenant } from './types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: React.ReactNode;
    initialTheme?: ThemeConfig;
    tenant?: Tenant;
}

export function ThemeProvider({ children, initialTheme, tenant }: ThemeProviderProps) {
    const [theme, setTheme] = useState<ThemeConfig | null>(initialTheme || null);
    const [currentTenant, setCurrentTenant] = useState<Tenant | null>(tenant || null);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Apply theme to the DOM
     */
    const applyTheme = useCallback((themeConfig: ThemeConfig) => {
        const root = document.documentElement;

        // Apply Colors as CSS Variables
        if (themeConfig.colors) {
            Object.entries(themeConfig.colors).forEach(([key, value]) => {
                root.style.setProperty(`--color-${key}`, value);
            });
        }

        // Apply Typography
        if (themeConfig.typography) {
            const { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } = themeConfig.typography;

            // Font Families
            if (fontFamily) {
                root.style.setProperty('--font-primary', fontFamily.primary);
                root.style.setProperty('--font-secondary', fontFamily.secondary);
                root.style.setProperty('--font-heading', fontFamily.heading);
                if (fontFamily.mono) {
                    root.style.setProperty('--font-mono', fontFamily.mono);
                }
            }

            // Font Sizes
            if (fontSize) {
                Object.entries(fontSize).forEach(([key, value]) => {
                    root.style.setProperty(`--font-size-${key}`, value);
                });
            }

            // Font Weights
            if (fontWeight) {
                Object.entries(fontWeight).forEach(([key, value]) => {
                    root.style.setProperty(`--font-weight-${key}`, value.toString());
                });
            }

            // Line Heights
            if (lineHeight) {
                Object.entries(lineHeight).forEach(([key, value]) => {
                    root.style.setProperty(`--line-height-${key}`, value.toString());
                });
            }

            // Letter Spacing
            if (letterSpacing) {
                Object.entries(letterSpacing).forEach(([key, value]) => {
                    root.style.setProperty(`--letter-spacing-${key}`, value);
                });
            }
        }

        // Apply Spacing
        if (themeConfig.spacing) {
            Object.entries(themeConfig.spacing).forEach(([key, value]) => {
                if (value) {
                    root.style.setProperty(`--spacing-${key}`, value);
                }
            });
        }

        // Apply Shadows
        if (themeConfig.shadows) {
            Object.entries(themeConfig.shadows).forEach(([key, value]) => {
                if (value) {
                    root.style.setProperty(`--shadow-${key}`, value);
                }
            });
        }

        // Apply Borders
        if (themeConfig.borders) {
            if (themeConfig.borders.radius) {
                Object.entries(themeConfig.borders.radius).forEach(([key, value]) => {
                    if (value) {
                        root.style.setProperty(`--radius-${key}`, value);
                    }
                });
            }

            if (themeConfig.borders.width) {
                Object.entries(themeConfig.borders.width).forEach(([key, value]) => {
                    root.style.setProperty(`--border-width-${key}`, value);
                });
            }
        }

        // Apply Layout
        if (themeConfig.layout) {
            Object.entries(themeConfig.layout).forEach(([key, value]) => {
                if (value) {
                    root.style.setProperty(`--layout-${key}`, value);
                }
            });
        }

        // Apply Custom CSS
        if (themeConfig.customCSS) {
            let styleEl = document.getElementById('custom-theme-css') as HTMLStyleElement;
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'custom-theme-css';
                document.head.appendChild(styleEl);
            }
            styleEl.textContent = themeConfig.customCSS;
        }

        // Apply Custom JS (with caution)
        if (themeConfig.customJS) {
            let scriptEl = document.getElementById('custom-theme-js') as HTMLScriptElement;
            if (!scriptEl) {
                scriptEl = document.createElement('script');
                scriptEl.id = 'custom-theme-js';
                document.head.appendChild(scriptEl);
            }
            scriptEl.textContent = themeConfig.customJS;
        }

        setTheme(themeConfig);
    }, []);

    /**
     * Update a specific customization path
     */
    const updateCustomization = useCallback((path: string, value: any) => {
        if (!theme) return;

        const pathParts = path.split('.');
        const updatedTheme = { ...theme };

        let current: any = updatedTheme;
        for (let i = 0; i < pathParts.length - 1; i++) {
            current = current[pathParts[i]];
        }
        current[pathParts[pathParts.length - 1]] = value;

        applyTheme(updatedTheme);
    }, [theme, applyTheme]);

    /**
     * Reset to initial theme
     */
    const resetTheme = useCallback(() => {
        if (initialTheme) {
            applyTheme(initialTheme);
        }
    }, [initialTheme, applyTheme]);

    // Apply initial theme on mount
    useEffect(() => {
        if (initialTheme) {
            applyTheme(initialTheme);
        }
    }, [initialTheme, applyTheme]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                tenant: currentTenant,
                setTheme,
                applyTheme,
                updateCustomization,
                resetTheme,
                isLoading,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * Hook to use theme context
 */
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
