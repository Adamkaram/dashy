'use client';

import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white">
            {children}
        </div>
    );
}
