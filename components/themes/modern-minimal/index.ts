import type { Theme } from '@/lib/theme/component-types';
import Header from './Header/Header';
import Hero from './Hero/Hero';
import CategoryCard from './CategoryCard/CategoryCard';
import Footer from './Footer/Footer';
import ServiceCard from './ServiceCard/ServiceCard';
import Layout from './Layout/Layout';
import themeConfig from './theme.config';

export const ModernMinimalTheme: Theme = {
    name: 'modern-minimal',
    displayName: 'Modern Minimal - E-Commerce',
    description: 'متجر إلكتروني متكامل بتصميم عصري',
    version: '2.0.0',

    components: {
        Header,
        Hero,
        ServiceCard,
        CategoryCard,
        Footer,
        Layout,
    },

    config: themeConfig,

    preview: {
        thumbnail: '/themes/modern/thumbnail.jpg',
        screenshots: [
            '/themes/modern/screenshot-1.jpg',
            '/themes/modern/screenshot-2.jpg',
        ],
    },
};

export default ModernMinimalTheme;
