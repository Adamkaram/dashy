"use client"

import useSWR from 'swr'
import { useMemo } from 'react'

export interface Domain {
    id: string
    domain: string
    type: 'subdomain' | 'custom'
    verified: boolean
    verification_token?: string
    is_primary: boolean
    ssl_issued: boolean
    archived?: boolean
    redirect_url?: string
    clicks?: number
    created_at: string
    updated_at: string
    verified_at?: string
}

interface DomainsResponse {
    domains: Domain[]
    total: number
}

const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error('Failed to fetch domains')
    }
    return res.json()
}

export function useDomains(options?: {
    archived?: boolean
    search?: string
}) {
    const { data, error, isLoading, mutate } = useSWR<DomainsResponse>(
        '/api/admin/domains',
        fetcher,
        {
            dedupingInterval: 60000,
            revalidateOnFocus: false,
        }
    )

    // Map API response to consistent format
    const domains = useMemo(() => {
        if (!data?.domains) return []

        return data.domains.map(d => ({
            ...d,
            // Map API status to frontend status
            status: d.verified ? 'verified' as const : 'pending' as const,
        }))
    }, [data])

    // Filter by archived status
    const filteredDomains = useMemo(() => {
        let result = domains

        if (options?.archived !== undefined) {
            result = result.filter(d => d.archived === options.archived)
        }

        if (options?.search) {
            const search = options.search.toLowerCase()
            result = result.filter(d => d.domain.toLowerCase().includes(search))
        }

        return result
    }, [domains, options?.archived, options?.search])

    // Active (non-archived) domains
    const activeDomains = useMemo(() =>
        domains.filter(d => !d.archived),
        [domains]
    )

    // Primary domain
    const primaryDomain = useMemo(() =>
        activeDomains.find(d => d.is_primary) || activeDomains[0],
        [activeDomains]
    )

    return {
        domains: filteredDomains,
        allDomains: domains,
        activeDomains,
        primaryDomain,
        total: data?.total || 0,
        loading: isLoading,
        error,
        mutate,
    }
}

// Hook for single domain operations
export function useDomainActions() {
    const { mutate } = useDomains()

    const createDomain = async (domain: string, type?: string) => {
        const res = await fetch('/api/admin/domains', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain, type }),
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || 'Failed to create domain')
        }

        await mutate()
        return res.json()
    }

    const deleteDomain = async (id: string) => {
        const res = await fetch(`/api/admin/domains/${id}`, {
            method: 'DELETE',
        })

        if (!res.ok) {
            throw new Error('Failed to delete domain')
        }

        await mutate()
    }

    const verifyDomain = async (id: string) => {
        const res = await fetch(`/api/admin/domains/${id}/verify`, {
            method: 'POST',
        })

        if (!res.ok) {
            throw new Error('Failed to verify domain')
        }

        const data = await res.json()
        await mutate()
        return data
    }

    const setPrimaryDomain = async (id: string) => {
        const res = await fetch(`/api/admin/domains/${id}/primary`, {
            method: 'POST',
        })

        if (!res.ok) {
            throw new Error('Failed to set primary domain')
        }

        await mutate()
        return res.json()
    }

    const updateDomain = async (id: string, updates: {
        redirect_url?: string
        archived?: boolean
    }) => {
        const res = await fetch(`/api/admin/domains/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        })

        if (!res.ok) {
            throw new Error('Failed to update domain')
        }

        await mutate()
        return res.json()
    }

    return {
        createDomain,
        deleteDomain,
        verifyDomain,
        setPrimaryDomain,
        updateDomain,
    }
}

export default useDomains
