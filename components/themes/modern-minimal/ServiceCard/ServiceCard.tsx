'use client';

import { ServiceCardProps } from '@/lib/theme/component-types';
import CategoryCard from '../CategoryCard/CategoryCard';

export default function ServiceCard(props: ServiceCardProps) {
    // Convert service to category format for the product card
    return <CategoryCard category={props.service as any} />;
}
