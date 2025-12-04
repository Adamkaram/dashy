'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

export interface TenantData {
    id: string;
    name: string;
    slug: string;
    domain?: string | null;
    subdomain?: string | null;
    activeTheme: string;
    plan?: string;
    status?: string;
    settings?: any;
}

interface TenantContextType {
    tenant: TenantData | null;
    loading: boolean;
    refetch: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
    children: ReactNode;
}

/**
 * TenantProvider
 * Loads tenant data based on hostname and provides it to the app
 */
export function TenantProvider({ children }: TenantProviderProps) {
    const [tenant, setTenant] = useState<TenantData | null>(null);
    const [loading, setLoading] = useState(true);

    const loadTenant = async () => {
        try {
            setLoading(true);

            // Get hostname from window (client-side only)
            const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

            // Fetch tenant data from API
            const response = await fetch(`/api/tenant?hostname=${hostname}`);
            const data = await response.json();

            if (data && data.id) {
                setTenant(data);
            } else {
                console.warn('No tenant found, using default');
                // Set a default tenant if none found
                setTenant({
                    id: 'default',
                    name: 'ماى مومنت',
                    slug: 'default',
                    activeTheme: 'default',
                });
            }
        } catch (error) {
            console.error('Failed to load tenant:', error);
            // Fallback to default tenant
            setTenant({
                id: 'default',
                name: 'ماى مومنت',
                slug: 'default',
                activeTheme: 'default',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTenant();
    }, []);

    return (
        <TenantContext.Provider value={{ tenant, loading, refetch: loadTenant }}>
            {children}
        </TenantContext.Provider>
    );
}

/**
 * Hook to access tenant data
 */
export function useTenant(): TenantContextType {
    const context = useContext(TenantContext);

    if (!context) {
        throw new Error('useTenant must be used within TenantProvider');
    }

    return context;
}
