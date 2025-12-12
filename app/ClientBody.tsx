"use client";

import { useEffect, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { Toaster } from "sonner";
import { TenantProvider } from "@/lib/tenant";
import { ThemeComponentProvider } from "@/lib/theme/ThemeComponentProvider";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased";
  }, []);

  return (
    <body suppressHydrationWarning className="antialiased">
      <TenantProvider>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F5EBE9]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6500]"></div></div>}>
          <ThemeComponentProvider>
            <TooltipProvider>
              {children}
              <Toaster
                position="top-center"
                expand={false}
                richColors={false}
                closeButton
                duration={4000}
                gap={12}
                toastOptions={{
                  style: {
                    background: 'white',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    padding: '16px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    gap: '12px',
                    alignItems: 'flex-start',
                    color: '#171717',
                  },
                  classNames: {
                    toast: 'font-sans',
                    title: 'text-neutral-900 font-semibold text-sm',
                    description: 'text-neutral-500 text-sm mt-1',
                    actionButton: 'bg-[#FF6500] text-white hover:bg-[#FF4F0F] px-3 py-1.5 rounded-lg text-sm font-medium',
                    cancelButton: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 px-3 py-1.5 rounded-lg text-sm font-medium',
                    closeButton: 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100',
                    success: '!border-l-4 !border-l-[#FF6500] !bg-gradient-to-r !from-[#FF6500]/5 !to-white',
                    error: '!border-l-4 !border-l-red-500 !bg-gradient-to-r !from-red-50 !to-white',
                    warning: '!border-l-4 !border-l-amber-500 !bg-gradient-to-r !from-amber-50 !to-white',
                    info: '!border-l-4 !border-l-blue-500 !bg-gradient-to-r !from-blue-50 !to-white',
                  },
                }}
              />
            </TooltipProvider>
          </ThemeComponentProvider>
        </Suspense>
      </TenantProvider>
    </body>
  );
}
