/**
 * Theme System Types
 * Complete type definitions for the multi-tenancy theme system
 */

// =====================================================
// CORE THEME CONFIGURATION
// =====================================================

export interface ThemeConfig {
    id: string;
    name: string;
    version: string;

    // Design Tokens
    colors: ColorPalette;
    typography: Typography;
    spacing: Spacing;
    shadows: Shadows;
    borders: Borders;

    // Layout Configuration
    layout: LayoutConfig;

    // Component Overrides
    components?: ComponentOverrides;

    // Custom CSS/JS
    customCSS?: string;
    customJS?: string;
}

// =====================================================
// COLOR PALETTE
// =====================================================

export interface ColorPalette {
    // Primary Colors
    primary: string;
    secondary: string;
    accent: string;

    // Neutrals
    background: string;
    foreground: string;
    muted: string;

    // Semantic Colors
    success: string;
    warning: string;
    error: string;
    info: string;

    // Extended (optional)
    [key: string]: string;
}

// =====================================================
// TYPOGRAPHY
// =====================================================

export interface Typography {
    fontFamily: FontFamily;
    fontSize: FontSize;
    fontWeight: FontWeight;
    lineHeight?: LineHeight;
    letterSpacing?: LetterSpacing;
}

export interface FontFamily {
    primary: string;
    secondary: string;
    heading: string;
    mono?: string;
}

export interface FontSize {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl'?: string;
    '6xl'?: string;
}

export interface FontWeight {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold?: number;
}

export interface LineHeight {
    tight: number;
    normal: number;
    relaxed: number;
    loose?: number;
}

export interface LetterSpacing {
    tight: string;
    normal: string;
    wide: string;
}

// =====================================================
// SPACING
// =====================================================

export interface Spacing {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl'?: string;
    '3xl'?: string;
    [key: string]: string | undefined;
}

// =====================================================
// SHADOWS
// =====================================================

export interface Shadows {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl'?: string;
    none?: string;
    [key: string]: string | undefined;
}

// =====================================================
// BORDERS
// =====================================================

export interface Borders {
    radius: BorderRadius;
    width?: BorderWidth;
}

export interface BorderRadius {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl'?: string;
    full?: string;
    [key: string]: string | undefined;
}

export interface BorderWidth {
    thin: string;
    base: string;
    thick: string;
}

// =====================================================
// LAYOUT CONFIGURATION
// =====================================================

export interface LayoutConfig {
    containerWidth: string;
    headerHeight: string;
    footerHeight?: string;
    sidebarWidth?: string;
    gridGap: string;
    breakpoints?: Breakpoints;
}

export interface Breakpoints {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
}

// =====================================================
// COMPONENT OVERRIDES
// =====================================================

export interface ComponentOverrides {
    button?: ButtonOverride;
    card?: CardOverride;
    header?: HeaderOverride;
    footer?: FooterOverride;
    input?: InputOverride;
    [key: string]: ComponentOverride | undefined;
}

export interface ComponentOverride {
    [key: string]: any;
}

export interface ButtonOverride {
    borderRadius?: string;
    padding?: string;
    fontSize?: string;
    fontWeight?: number;
    transition?: string;
}

export interface CardOverride {
    borderRadius?: string;
    shadow?: string;
    padding?: string;
    background?: string;
}

export interface HeaderOverride {
    height?: string;
    background?: string;
    logoSize?: string;
    navFontSize?: string;
}

export interface FooterOverride {
    background?: string;
    textColor?: string;
    padding?: string;
}

export interface InputOverride {
    borderRadius?: string;
    padding?: string;
    fontSize?: string;
    borderColor?: string;
}

// =====================================================
// TENANT & THEME SETTINGS
// =====================================================

export interface Tenant {
    id: string;
    slug: string;
    name: string;
    domain?: string;
    subdomain?: string;
    activeThemeId?: string;
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'suspended' | 'trial' | 'inactive';
    settings?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

export interface Theme {
    id: string;
    name: string;
    slug: string;
    description?: string;
    type: 'default' | 'custom' | 'marketplace';
    isPublic: boolean;
    isActive: boolean;
    previewImage?: string;
    demoUrl?: string;
    config: ThemeConfig;
    createdBy?: string;
    price?: number;
    currency?: string;
    version: string;
    tags?: string[];
    downloads?: number;
    rating?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ThemeSettings {
    id: string;
    tenantId: string;
    themeId: string;
    customizations: Partial<ThemeConfig>;
    layoutConfig?: Record<string, any>;
    activeSections?: string[];
    sectionOrder?: string[];
    customCSS?: string;
    customJS?: string;
    createdAt: Date;
    updatedAt: Date;
}

// =====================================================
// THEME CONTEXT
// =====================================================

export interface ThemeContextType {
    theme: ThemeConfig | null;
    tenant: Tenant | null;
    setTheme: (theme: ThemeConfig) => void;
    applyTheme: (theme: ThemeConfig) => void;
    updateCustomization: (path: string, value: any) => void;
    resetTheme: () => void;
    isLoading: boolean;
}

// =====================================================
// API TYPES
// =====================================================

export interface LoadThemeResponse {
    theme: Theme;
    settings?: ThemeSettings;
    tenant: Tenant;
}

export interface SaveCustomizationRequest {
    tenantId: string;
    themeId: string;
    customizations: Partial<ThemeConfig>;
}

export interface SaveCustomizationResponse {
    success: boolean;
    settings: ThemeSettings;
}
