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
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F5EBE9]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8F6B43]"></div></div>}>
          <ThemeComponentProvider>
            <TooltipProvider>
              {children}
              <Toaster
                richColors
                position="top-center"
                closeButton
                className="pointer-events-auto"
                toastOptions={{
                  style: {
                    background: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                  },
                  className: 'custom-toast',
                }}
              />
            </TooltipProvider>
          </ThemeComponentProvider>
        </Suspense>
      </TenantProvider>
    </body>
  );
}
