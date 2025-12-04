import type { Theme } from '@/lib/theme/component-types';
import Header from './Header/Header';
import Hero from './Hero/Hero';
import ServiceCard from './ServiceCard/ServiceCard';
import CategoryCard from './CategoryCard/CategoryCard';
import Footer from './Footer/Footer';
import Layout from './Layout/Layout';
import themeConfig from './theme.config';

export const ModernMinimalTheme: Theme = {
    name: 'modern-minimal',
    displayName: 'Modern Minimal',
    description: 'تصميم عصري وبسيط يركز على المحتوى والمساحات البيضاء',
    version: '1.0.0',

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
