# Component-Based Theme Architecture

## المفهوم الأساسي

الثيمات في هذا النظام ليست مجرد تخصيص ألوان - بل هي **مكونات كاملة** مثل Shopify تماماً!

### كل ثيم يحتوي على:

```
components/themes/[theme-name]/
├── Header/
│   ├── Header.tsx           # مكون Header الخاص بالثيم
│   ├── Header.module.css    # Styles خاصة
│   └── index.ts
├── Hero/
│   ├── HeroSlider.tsx       # نوع Hero (Slider, Video, Static)
│   ├── HeroVideo.tsx
│   ├── HeroStatic.tsx
│   └── index.ts
├── ServiceCard/
│   ├── ServiceCard.tsx      # تصميم كارت الخدمة
│   └── index.ts
├── CategoryCard/
│   ├── CategoryCard.tsx
│   └── index.ts
├── Footer/
│   ├── Footer.tsx
│   └── index.ts
├── Layout/
│   ├── MainLayout.tsx       # التخطيط العام
│   └── index.ts
└── theme.config.ts          # تكوين الثيم (ألوان، خطوط، إلخ)
```

---

## كيف يعمل النظام

### 1. Theme Registry

كل ثيم يسجل نفسه في Registry:

```typescript
// components/themes/registry.ts
import { DefaultTheme } from './default';
import { ModernMinimalTheme } from './modern-minimal';

export const THEME_REGISTRY = {
  'default': DefaultTheme,
  'modern-minimal': ModernMinimalTheme,
};

export type ThemeName = keyof typeof THEME_REGISTRY;
```

### 2. Theme Structure

كل ثيم يصدّر مكوناته:

```typescript
// components/themes/default/index.ts
import Header from './Header';
import Hero from './Hero';
import ServiceCard from './ServiceCard';
import Footer from './Footer';
import Layout from './Layout';
import themeConfig from './theme.config';

export const DefaultTheme = {
  name: 'default',
  displayName: 'Default Theme - Sarainah',
  components: {
    Header,
    Hero,
    ServiceCard,
    Footer,
    Layout,
  },
  config: themeConfig,
};
```

### 3. Theme Provider

يوفر المكونات للصفحات:

```typescript
// lib/theme/ThemeComponentProvider.tsx
'use client';

import { createContext, useContext } from 'react';
import { THEME_REGISTRY } from '@/components/themes/registry';

const ThemeComponentContext = createContext(null);

export function ThemeComponentProvider({ themeName, children }) {
  const theme = THEME_REGISTRY[themeName];
  
  return (
    <ThemeComponentContext.Provider value={theme}>
      {children}
    </ThemeComponentContext.Provider>
  );
}

export function useThemeComponents() {
  const theme = useContext(ThemeComponentContext);
  if (!theme) throw new Error('useThemeComponents must be used within ThemeComponentProvider');
  return theme.components;
}
```

### 4. استخدام المكونات في الصفحات

```typescript
// app/page.tsx
'use client';

import { useThemeComponents } from '@/lib/theme/ThemeComponentProvider';

export default function HomePage() {
  const { Header, Hero, ServiceCard, Footer } = useThemeComponents();
  
  return (
    <>
      <Header />
      <Hero slides={heroSlides} />
      <div className="services-grid">
        {services.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
      <Footer />
    </>
  );
}
```

---

## مثال: Default Theme

### Header Component

```typescript
// components/themes/default/Header/Header.tsx
'use client';

import { useTheme } from '@/lib/theme';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const { theme } = useTheme();
  
  return (
    <header 
      className="sarainah-header"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
      }}
    >
      <div className="container">
        <nav className="header-nav">
          <Link href="/about">عن الموقع</Link>
          <Link href="/services">الخدمات</Link>
        </nav>
        
        <div className="navbar-brand">
          <Image src="/logo/Logo.png" alt="Logo" width={100} height={100} />
        </div>
        
        <div className="header-actions">
          <Link href="/login" className="login-link">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </header>
  );
}
```

### Hero Component

```typescript
// components/themes/default/Hero/HeroSlider.tsx
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';

interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  return (
    <section className="hero-section">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        loop
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="hero-slide">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="hero-image"
              />
              <div className="hero-content">
                <h1>{slide.title}</h1>
                {slide.subtitle && <p>{slide.subtitle}</p>}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
```

### ServiceCard Component

```typescript
// components/themes/default/ServiceCard/ServiceCard.tsx
'use client';

import { useTheme } from '@/lib/theme';
import Image from 'next/image';
import Link from 'next/link';

interface Service {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  slug: string;
}

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { theme } = useTheme();
  
  return (
    <Link href={`/services/${service.slug}`} className="service-card">
      <div className="service-image-wrapper">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="service-image"
        />
        <div 
          className="service-overlay"
          style={{
            background: `linear-gradient(to bottom, transparent, ${theme.colors.primary}90)`,
          }}
        >
          <div className="service-content">
            <h3>{service.title}</h3>
            {service.subtitle && <p>{service.subtitle}</p>}
          </div>
        </div>
      </div>
    </Link>
  );
}
```

---

## مثال: Modern Minimal Theme

نفس المكونات لكن بتصميم مختلف تماماً:

### Header (Modern Minimal)

```typescript
// components/themes/modern-minimal/Header/Header.tsx
export default function Header() {
  return (
    <header className="modern-header">
      {/* تصميم مختلف تماماً - بسيط وعصري */}
      <div className="container">
        <div className="logo">Logo</div>
        <nav className="minimal-nav">
          <a href="/about">About</a>
          <a href="/services">Services</a>
        </nav>
      </div>
    </header>
  );
}
```

### ServiceCard (Modern Minimal)

```typescript
// components/themes/modern-minimal/ServiceCard/ServiceCard.tsx
export default function ServiceCard({ service }) {
  return (
    <div className="minimal-card">
      {/* تصميم كارت بسيط جداً */}
      <div className="card-image">
        <Image src={service.image} alt={service.title} fill />
      </div>
      <div className="card-content">
        <h4>{service.title}</h4>
        <p>{service.subtitle}</p>
      </div>
    </div>
  );
}
```

---

## Theme Configuration

كل ثيم له ملف config للألوان والخطوط:

```typescript
// components/themes/default/theme.config.ts
export default {
  colors: {
    primary: '#53131C',
    secondary: '#8F6B43',
    accent: '#B4786C',
    background: '#F0EBE5',
    foreground: '#46423D',
  },
  typography: {
    fontFamily: {
      primary: 'Almarai, sans-serif',
      heading: 'Ithra, sans-serif',
    },
  },
  spacing: {
    containerWidth: '1400px',
    sectionPadding: '4rem',
  },
};
```

---

## المزايا

✅ **تخصيص كامل** - كل ثيم له مكوناته الخاصة  
✅ **سهولة التبديل** - تغيير الثيم = تغيير كل المكونات  
✅ **قابلية إعادة الاستخدام** - المكونات معزولة  
✅ **Marketplace Ready** - يمكن بيع/شراء ثيمات كاملة  
✅ **Type-Safe** - TypeScript يضمن توافق المكونات  

---

## الخطوات التالية

1. إنشاء Default Theme Components
2. إنشاء Modern Minimal Theme Components
3. بناء Theme Registry
4. تحديث ThemeProvider
5. إنشاء Theme Switcher UI
6. بناء Theme Preview System
