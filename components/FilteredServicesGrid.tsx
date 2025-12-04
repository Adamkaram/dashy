'use client';

import { useState } from 'react';
import ServiceCard from './ServiceCard';

interface FilteredServicesGridProps {
    services: any[];
}

export default function FilteredServicesGrid({ services }: FilteredServicesGridProps) {
    const [filteredServices, setFilteredServices] = useState(services);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
            ))}
        </div>
    );
}
