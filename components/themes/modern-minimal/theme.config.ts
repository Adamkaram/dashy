import type { ThemeConfig } from '@/lib/theme/component-types';

const config: ThemeConfig = {
    id: 'modern-minimal',
    name: 'modern-minimal',
    displayName: 'Modern Minimal',
    description: 'تصميم عصري وبسيط يركز على المحتوى والمساحات البيضاء',
    version: '1.0.0',
    author: 'My Moments',

    colors: {
        primary: '#000000',
        secondary: '#333333',
        accent: '#2563EB', // Royal Blue
        background: '#FFFFFF',
        foreground: '#111111',
        muted: '#F3F4F6',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
    },

    typography: {
        fontFamily: {
            primary: "'Tajawal', sans-serif",
            secondary: "'Inter', sans-serif",
            heading: "'Tajawal', sans-serif",
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
        },
        fontWeight: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
    },

    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2.5rem',
    },

    shadows: {
        sm: 'none',
        md: '0 1px 3px rgba(0,0,0,0.05)',
        lg: '0 4px 6px -1px rgba(0,0,0,0.05)',
        xl: '0 10px 15px -3px rgba(0,0,0,0.05)',
    },

    borders: {
        radius: {
            sm: '2px',
            md: '4px',
            lg: '6px',
            xl: '8px',
        },
    },

    layout: {
        containerWidth: '1280px',
        headerHeight: '70px',
        footerHeight: 'auto',
        sectionPadding: '5rem',
        gridGap: '2.5rem',
    },

    componentVariants: {
        header: 'minimal',
        hero: 'static',
        serviceCard: 'minimal',
    },
};

export default config;
