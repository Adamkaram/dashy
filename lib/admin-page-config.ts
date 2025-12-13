// Page configuration for admin dashboard pages
// This config is used to automatically render PageHeader with correct info

export interface PageConfig {
    title: string
    titleAr: string // Arabic title
    description: string
    descriptionAr?: string
    href?: string // Learn more link
}

export const pageConfigs: Record<string, PageConfig> = {
    '/admin': {
        title: 'Dashboard',
        titleAr: 'لوحة التحكم',
        description: 'Overview of your store performance and key metrics.',
        descriptionAr: 'نظرة عامة على أداء متجرك والمقاييس الرئيسية.',
        href: 'https://docs.panaroid.com/dashboard'
    },
    '/admin/orders': {
        title: 'Orders',
        titleAr: 'الطلبات',
        description: 'Manage and track all customer orders.',
        descriptionAr: 'إدارة وتتبع جميع طلبات العملاء.',
        href: 'https://docs.panaroid.com/orders'
    },
    '/admin/products': {
        title: 'Products',
        titleAr: 'المنتجات',
        description: 'Add, edit, and manage your product catalog.',
        descriptionAr: 'إضافة وتعديل وإدارة كتالوج المنتجات.',
        href: 'https://docs.panaroid.com/products'
    },
    '/admin/categories': {
        title: 'Categories',
        titleAr: 'التصنيفات',
        description: 'Organize your products into categories.',
        descriptionAr: 'تنظيم منتجاتك في تصنيفات.',
        href: 'https://docs.panaroid.com/categories'
    },
    '/admin/coupons': {
        title: 'Coupons',
        titleAr: 'الكوبونات',
        description: 'Create and manage discount coupons.',
        descriptionAr: 'إنشاء وإدارة كوبونات الخصم.',
        href: 'https://docs.panaroid.com/coupons'
    },
    '/admin/alerts': {
        title: 'Alerts',
        titleAr: 'التنبيهات',
        description: 'Manage store announcements and alerts.',
        descriptionAr: 'إدارة إعلانات وتنبيهات المتجر.',
        href: 'https://docs.panaroid.com/alerts'
    },
    '/admin/hero-slides': {
        title: 'Hero Slides',
        titleAr: 'شرائح Hero',
        description: 'Manage homepage hero banner slides.',
        descriptionAr: 'إدارة شرائح البانر الرئيسية.',
        href: 'https://docs.panaroid.com/hero-slides'
    },
    '/admin/themes': {
        title: 'Themes',
        titleAr: 'المظهر',
        description: 'Customize your store appearance and theme.',
        descriptionAr: 'تخصيص مظهر متجرك والثيم.',
        href: 'https://docs.panaroid.com/themes'
    },
    '/admin/domains': {
        title: 'Domains',
        titleAr: 'النطاقات',
        description: 'Add, configure, and verify custom domains.',
        descriptionAr: 'إضافة وتكوين والتحقق من النطاقات المخصصة.',
        href: 'https://docs.panaroid.com/domains'
    },
    '/admin/settings': {
        title: 'Settings',
        titleAr: 'الإعدادات',
        description: 'Configure your store settings and preferences.',
        descriptionAr: 'تكوين إعدادات وتفضيلات المتجر.',
        href: 'https://docs.panaroid.com/settings'
    },
}

// Helper function to get page config
export function getPageConfig(pathname: string): PageConfig | undefined {
    // Exact match first
    if (pageConfigs[pathname]) {
        return pageConfigs[pathname]
    }

    // Try to match parent path (e.g., /admin/products/123 -> /admin/products)
    const segments = pathname.split('/')
    while (segments.length > 2) {
        segments.pop()
        const parentPath = segments.join('/')
        if (pageConfigs[parentPath]) {
            return pageConfigs[parentPath]
        }
    }

    return undefined
}
