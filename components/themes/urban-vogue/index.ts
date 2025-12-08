import type { Theme } from '@/lib/theme/component-types';
import Header from './Header/Header';
import Hero from './Hero/Hero';
import Footer from './Footer/Footer';
import Layout from './Layout/Layout';
import Home from './Home/Home';
import Cart from './Cart/Cart';
import ProductDetails from './ProductDetails/ProductDetails';
import Shop from './Shop/Shop';
import Checkout from './Checkout/Checkout';
import Loading from './Loading/Loading';
import Error from './Error/Error';
import NotFound from './NotFound/NotFound';
import CategoryCard from './CategoryCard/CategoryCard';
import ServiceCard from './ServiceCard/ServiceCard';
import AddToCartNotification from './Notifications/AddToCartNotification';
import config from './theme.config';

export const UrbanVogueTheme: Theme = {
    name: 'urban-vogue',
    displayName: 'Urban Vogue',
    description: 'A premium, high-fashion theme with dynamic animations.',
    version: '1.0.0',

    components: {
        Header,
        Hero,
        ServiceCard,
        CategoryCard,
        Footer,
        Layout,
        Home,
        Cart,
        Checkout,
        ProductDetails,
        Shop,
        Loading,
        Error,
        NotFound,
        AddToCartNotification,
    },

    config,

    preview: {
        thumbnail: '/themes/urban/thumbnail.jpg',
        screenshots: [],
    },
};

export default UrbanVogueTheme;
