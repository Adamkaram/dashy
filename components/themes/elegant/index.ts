import { Theme } from '@/lib/theme/component-types';
import { Header } from './Header/Header';
import { Hero } from './Hero/Hero';
import { Footer } from './Footer/Footer';
import { DefaultTheme } from '../default';

export const ElegantTheme: Theme = {
    name: 'elegant',
    displayName: 'Elegant Luxury',
    description: 'A sophisticated theme for luxury brands with dark aesthetics.',
    version: '1.0.0',
    components: {
        ...DefaultTheme.components, // Fallback to default components
        Header,
        Hero,
        Footer,
    },
    config: {
        ...DefaultTheme.config,
        id: 'elegant',
        name: 'elegant',
        displayName: 'Elegant Luxury',
        colors: {
            ...DefaultTheme.config.colors,
            primary: '#d4af37', // Gold
            secondary: '#000000', // Black
            background: '#1a1a1a', // Dark Gray
            foreground: '#ffffff', // White
        }
    }
};
