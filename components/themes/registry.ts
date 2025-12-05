/**
 * Theme Registry
 * Central registry for all available themes
 * Import and register new themes here
 */

import type { ThemeRegistry } from '@/lib/theme/component-types';
import { DefaultTheme } from './default';

// Import themes (will be created)
import { ModernMinimalTheme } from './modern-minimal';
import { ElegantTheme } from './elegant';
import { UrbanVogueTheme } from './urban-vogue';

/**
 * Registry of all available themes
 * Add new themes here to make them available in the system
 */
export const THEME_REGISTRY: ThemeRegistry = {
    'default': DefaultTheme,
    'modern-minimal': ModernMinimalTheme,
    'elegant': ElegantTheme,
    'urban-vogue': UrbanVogueTheme,
};

/**
 * Get theme by name
 */
export function getTheme(themeName: string) {
    const theme = THEME_REGISTRY[themeName];

    if (!theme) {
        console.warn(`Theme "${themeName}" not found, falling back to default`);
        return THEME_REGISTRY['default'];
    }

    return theme;
}

/**
 * Get all available theme names
 */
export function getAvailableThemes(): string[] {
    return Object.keys(THEME_REGISTRY);
}

/**
 * Check if theme exists
 */
export function themeExists(themeName: string): boolean {
    return themeName in THEME_REGISTRY;
}
