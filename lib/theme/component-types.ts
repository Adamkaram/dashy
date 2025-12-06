/**
 * Theme Component Types
 * Defines the structure for component-based themes
 */

import { ComponentType } from 'react';

// =====================================================
// THEME COMPONENT PROPS
// =====================================================

export interface HeaderProps {
    tenant?: any;
    user?: any;
}

export interface HeroProps {
    slides?: HeroSlide[];
    type?: 'slider' | 'video' | 'static';
}

export interface HeroSlide {
    id: number | string;
    image: string;
    title: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    cta?: {
        text: string;
        href: string;
    };
}

export interface ServiceCardProps {
    service: Service;
    variant?: 'default' | 'compact' | 'detailed';
}

export interface Service {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    image: string;
    slug: string;
    basePrice?: number;
}

export interface CategoryCardProps {
    category: Category;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
    description?: string;
}

export interface FooterProps {
    tenant?: any;
}

export interface LayoutProps {
    children: React.ReactNode;
    tenant?: any;
}

// =====================================================
// THEME COMPONENTS STRUCTURE
// =====================================================

export interface ThemeComponents {
    Header: ComponentType<HeaderProps>;
    Hero: ComponentType<HeroProps>;
    ServiceCard: ComponentType<ServiceCardProps>;
    CategoryCard: ComponentType<CategoryCardProps>;
    Footer: ComponentType<FooterProps>;
    Layout: ComponentType<LayoutProps>;
    Home?: ComponentType<any>;
    Cart?: ComponentType<any>;
    Checkout?: ComponentType<any>;
    ProductDetails?: ComponentType<any>;
    Shop?: ComponentType<any>;
    Loading?: ComponentType<any>;
    Error?: ComponentType<any>;
    NotFound?: ComponentType<any>;
}

// =====================================================
// THEME CONFIGURATION
// =====================================================

export interface ThemeConfig {
    // Theme Identity
    id: string;
    name: string;
    displayName: string;
    description?: string;
    version: string;
    author?: string;

    // Visual Configuration
    colors: ColorPalette;
    typography: Typography;
    spacing: Spacing;
    shadows: Shadows;
    borders: Borders;

    // Layout Settings
    layout: LayoutConfig;

    // Component Variants (optional overrides)
    componentVariants?: {
        header?: 'default' | 'minimal' | 'centered';
        hero?: 'slider' | 'video' | 'static';
        serviceCard?: 'overlay' | 'card' | 'minimal';
    };
}

export interface ColorPalette {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    [key: string]: string;
}

export interface Typography {
    fontFamily: {
        primary: string;
        secondary: string;
        heading: string;
        mono?: string;
    };
    fontSize: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
    };
    fontWeight: {
        light: number;
        normal: number;
        medium: number;
        semibold: number;
        bold: number;
    };
}

export interface Spacing {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    [key: string]: string;
}

export interface Shadows {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    [key: string]: string;
}

export interface Borders {
    radius: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        [key: string]: string;
    };
}

export interface LayoutConfig {
    containerWidth: string;
    headerHeight: string;
    footerHeight?: string;
    sectionPadding: string;
    gridGap: string;
}

// =====================================================
// COMPLETE THEME STRUCTURE
// =====================================================

export interface Theme {
    // Theme Metadata
    name: string;
    displayName: string;
    description?: string;
    version: string;

    // Theme Components
    components: ThemeComponents;

    // Theme Configuration
    config: ThemeConfig;

    // Preview
    preview?: {
        thumbnail: string;
        screenshots: string[];
    };
}

// =====================================================
// THEME REGISTRY
// =====================================================

export type ThemeRegistry = Record<string, Theme>;

export type ThemeName = string;
