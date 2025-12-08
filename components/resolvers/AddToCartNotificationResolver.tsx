"use client";

import { useThemeComponents } from '@/lib/theme/ThemeComponentProvider';
import { AddToCartNotificationProps } from '@/lib/theme/component-types';

export default function AddToCartNotificationResolver(props: AddToCartNotificationProps) {
    const { AddToCartNotification } = useThemeComponents();

    if (!AddToCartNotification) {
        return null; // Or a default fallback if desired
    }

    return <AddToCartNotification {...props} />;
}
