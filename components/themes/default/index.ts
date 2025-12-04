import type { Theme } from '@/lib/theme/component-types';
import Header from './Header';
import Hero from './Hero';
import ServiceCard from './ServiceCard';
import CategoryCard from './CategoryCard';
import Footer from './Footer';
import Layout from './Layout';
import themeConfig from './theme.config';

export const DefaultTheme: Theme = {
    name: 'default',
    displayName: 'Default Theme - Sarainah',
    description: 'الثيم الافتراضي بتصميم سرينا الأنيق والفاخر',
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
        thumbnail: '/themes/default/thumbnail.jpg',
        screenshots: [
            '/themes/default/screenshot-1.jpg',
            '/themes/default/screenshot-2.jpg',
        ],
    },
};

export default DefaultTheme;
