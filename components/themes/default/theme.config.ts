import type { ThemeConfig } from '@/lib/theme/component-types';

const config: ThemeConfig = {
    id: 'default',
    name: 'default',
    displayName: 'Default Theme - Sarainah',
    description: 'الثيم الافتراضي بتصميم سرينا الأنيق والفاخر',
    version: '1.0.0',
    author: 'My Moments',

    colors: {
        primary: '#53131C',
        secondary: '#8F6B43',
        accent: '#B4786C',
        background: '#F0EBE5',
        foreground: '#46423D',
        muted: '#ECE8DB',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
    },

    typography: {
        fontFamily: {
            primary: "'Almarai', sans-serif",
            secondary: "'Ithra', sans-serif",
            heading: "'Ithra', sans-serif",
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
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
    },

    shadows: {
        sm: '0 2px 8px rgba(180, 120, 108, 0.08)',
        md: '0 4px 16px rgba(180, 120, 108, 0.12)',
        lg: '0 8px 24px rgba(180, 120, 108, 0.16)',
        xl: '0 12px 32px rgba(180, 120, 108, 0.2)',
    },

    borders: {
        radius: {
            sm: '8px',
            md: '12px',
            lg: '16px',
            xl: '24px',
        },
    },

    layout: {
        containerWidth: '1400px',
        headerHeight: '80px',
        footerHeight: 'auto',
        sectionPadding: '4rem',
        gridGap: '2rem',
    },

    componentVariants: {
        header: 'default',
        hero: 'slider',
        serviceCard: 'overlay',
    },
};

export default config;
