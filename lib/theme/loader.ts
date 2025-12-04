import { ThemeConfig, LoadThemeResponse, SaveCustomizationRequest, SaveCustomizationResponse } from './types';

/**
 * Load theme for a specific tenant by slug
 */
export async function loadTenantTheme(tenantSlug: string): Promise<LoadThemeResponse> {
    const response = await fetch(`/api/themes/tenant/${tenantSlug}`);

    if (!response.ok) {
        throw new Error(`Failed to load theme for tenant: ${tenantSlug}`);
    }

    return response.json();
}

/**
 * Load theme by ID
 */
export async function loadThemeById(themeId: string): Promise<ThemeConfig> {
    const response = await fetch(`/api/themes/${themeId}`);

    if (!response.ok) {
        throw new Error(`Failed to load theme: ${themeId}`);
    }

    const data = await response.json();
    return data.config;
}

/**
 * Load default theme
 */
export async function loadDefaultTheme(): Promise<ThemeConfig> {
    const response = await fetch('/themes/default.json');

    if (!response.ok) {
        throw new Error('Failed to load default theme');
    }

    return response.json();
}

/**
 * Save theme customizations for a tenant
 */
export async function saveThemeCustomizations(
    request: SaveCustomizationRequest
): Promise<SaveCustomizationResponse> {
    const response = await fetch(`/api/themes/customize`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to save customizations');
    }

    return response.json();
}

/**
 * Get all available themes
 */
export async function getAvailableThemes(includeMarketplace = false) {
    const params = new URLSearchParams();
    if (includeMarketplace) {
        params.append('marketplace', 'true');
    }

    const response = await fetch(`/api/themes?${params.toString()}`);

    if (!response.ok) {
        throw new Error('Failed to load available themes');
    }

    return response.json();
}

/**
 * Apply theme to a tenant
 */
export async function applyThemeToTenant(tenantId: string, themeId: string) {
    const response = await fetch(`/api/tenants/${tenantId}/theme`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeId }),
    });

    if (!response.ok) {
        throw new Error('Failed to apply theme');
    }

    return response.json();
}

/**
 * Merge theme config with customizations
 */
export function mergeThemeWithCustomizations(
    baseTheme: ThemeConfig,
    customizations: Partial<ThemeConfig>
): ThemeConfig {
    return {
        ...baseTheme,
        colors: {
            ...baseTheme.colors,
            ...(customizations.colors || {}),
        },
        typography: {
            ...baseTheme.typography,
            ...(customizations.typography || {}),
            fontFamily: {
                ...baseTheme.typography.fontFamily,
                ...(customizations.typography?.fontFamily || {}),
            },
            fontSize: {
                ...baseTheme.typography.fontSize,
                ...(customizations.typography?.fontSize || {}),
            },
            fontWeight: {
                ...baseTheme.typography.fontWeight,
                ...(customizations.typography?.fontWeight || {}),
            },
        },
        spacing: {
            ...baseTheme.spacing,
            ...(customizations.spacing || {}),
        },
        shadows: {
            ...baseTheme.shadows,
            ...(customizations.shadows || {}),
        },
        borders: {
            ...baseTheme.borders,
            radius: {
                ...baseTheme.borders.radius,
                ...(customizations.borders?.radius || {}),
            },
            width: {
                ...baseTheme.borders.width,
                ...(customizations.borders?.width || {}),
            },
        },
        layout: {
            ...baseTheme.layout,
            ...(customizations.layout || {}),
        },
        components: {
            ...baseTheme.components,
            ...(customizations.components || {}),
        },
        customCSS: customizations.customCSS || baseTheme.customCSS,
        customJS: customizations.customJS || baseTheme.customJS,
    };
}

/**
 * Validate theme configuration
 */
export function validateThemeConfig(config: Partial<ThemeConfig>): boolean {
    // Basic validation
    if (!config.colors || !config.typography || !config.spacing) {
        return false;
    }

    // Validate required color properties
    const requiredColors = ['primary', 'secondary', 'background', 'foreground'];
    for (const color of requiredColors) {
        if (!config.colors[color]) {
            return false;
        }
    }

    return true;
}

/**
 * Generate CSS variables string from theme config
 */
export function generateCSSVariables(theme: ThemeConfig): string {
    let css = ':root {\n';

    // Colors
    Object.entries(theme.colors).forEach(([key, value]) => {
        css += `  --color-${key}: ${value};\n`;
    });

    // Typography
    if (theme.typography.fontFamily) {
        Object.entries(theme.typography.fontFamily).forEach(([key, value]) => {
            css += `  --font-${key}: ${value};\n`;
        });
    }

    if (theme.typography.fontSize) {
        Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
            css += `  --font-size-${key}: ${value};\n`;
        });
    }

    // Spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
        if (value) {
            css += `  --spacing-${key}: ${value};\n`;
        }
    });

    // Shadows
    Object.entries(theme.shadows).forEach(([key, value]) => {
        if (value) {
            css += `  --shadow-${key}: ${value};\n`;
        }
    });

    // Borders
    if (theme.borders.radius) {
        Object.entries(theme.borders.radius).forEach(([key, value]) => {
            if (value) {
                css += `  --radius-${key}: ${value};\n`;
            }
        });
    }

    css += '}\n';

    return css;
}
