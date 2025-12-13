"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { Store, ChevronDown, Plus } from "lucide-react"

interface StoreData {
    id: string
    name: string
    slug: string
    tenant_id: string
    is_active: boolean
}

interface StoreContextType {
    stores: StoreData[]
    currentStore: StoreData | null
    setCurrentStore: (store: StoreData) => void
    loading: boolean
    refetch: () => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function useStore() {
    const context = useContext(StoreContext)
    if (!context) {
        throw new Error("useStore must be used within a StoreProvider")
    }
    return context
}

export function StoreProvider({ children }: { children: ReactNode }) {
    const [stores, setStores] = useState<StoreData[]>([])
    const [currentStore, setCurrentStoreState] = useState<StoreData | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchStores = async () => {
        try {
            const res = await fetch('/api/admin/stores')
            const data = await res.json()
            setStores(Array.isArray(data) ? data : [])

            // Set default store from localStorage or first store
            const savedStoreId = localStorage.getItem('currentStoreId')
            const saved = data.find((s: StoreData) => s.id === savedStoreId)
            setCurrentStoreState(saved || data[0] || null)
        } catch (error) {
            console.error('Failed to fetch stores:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStores()
    }, [])

    const setCurrentStore = (store: StoreData) => {
        setCurrentStoreState(store)
        localStorage.setItem('currentStoreId', store.id)
    }

    return (
        <StoreContext.Provider value={{ stores, currentStore, setCurrentStore, loading, refetch: fetchStores }}>
            {children}
        </StoreContext.Provider>
    )
}

export function StoreSelector() {
    const { stores, currentStore, setCurrentStore, loading } = useStore()
    const [isOpen, setIsOpen] = useState(false)

    if (loading) {
        return (
            <div className="h-9 w-40 bg-neutral-100 rounded-lg animate-pulse" />
        )
    }

    if (stores.length === 0) {
        return null
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors min-w-[180px]"
            >
                <Store className="w-4 h-4 text-neutral-500" />
                <span className="text-sm font-medium text-neutral-700 truncate flex-1 text-left">
                    {currentStore?.name || 'Select Store'}
                </span>
                <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 overflow-hidden">
                        <div className="max-h-60 overflow-y-auto">
                            {stores.map((store) => (
                                <button
                                    key={store.id}
                                    onClick={() => {
                                        setCurrentStore(store)
                                        setIsOpen(false)
                                    }}
                                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-neutral-50 transition-colors ${currentStore?.id === store.id ? 'bg-orange-50 text-orange-700' : 'text-neutral-700'
                                        }`}
                                >
                                    <Store className="w-4 h-4" />
                                    <span className="text-sm font-medium truncate">{store.name}</span>
                                    {!store.is_active && (
                                        <span className="text-[10px] px-1.5 py-0.5 bg-neutral-200 text-neutral-500 rounded">Inactive</span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="border-t border-neutral-100">
                            <a
                                href="/admin/stores"
                                className="flex items-center gap-2 px-3 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Manage Stores
                            </a>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
