import type { ThemeConfig } from '@/lib/theme/component-types';

const config: ThemeConfig = {
    id: 'urban-vogue',
    name: 'urban-vogue',
    displayName: 'Urban Vogue',
    description: 'A premium, high-fashion theme with dynamic animations and modern aesthetics',
    version: '1.0.0',
    author: 'My Moments',

    colors: {
        primary: '#1a1a1a', // Deep black
        secondary: '#f5f5f5', // Light gray
        accent: '#f5f5f5',
        background: '#ffffff', // Pure white
        foreground: '#2e2e2e', // Dark gray
        muted: '#f5f5f5',
        success: '#22c55e',
        warning: '#eab308',
        error: '#ef4444',
        info: '#3b82f6',
    },

    typography: {
        fontFamily: {
            primary: "'Montserrat', sans-serif",
            secondary: "'Inter', sans-serif",
            heading: "'Montserrat', sans-serif",
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
        xl: '2rem',
    },

    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    },

    borders: {
        radius: {
            sm: '0rem',
            md: '0rem',
            lg: '0rem',
            xl: '0rem',
        },
    },

    layout: {
        containerWidth: '1400px',
        headerHeight: '80px',
        footerHeight: 'auto',
        sectionPadding: '4rem',
        gridGap: '1.5rem',
    },

    componentVariants: {
        header: 'minimal',
        hero: 'static',
        serviceCard: 'minimal',
    },
};

export default config;
