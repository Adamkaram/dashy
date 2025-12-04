"use client";

import { useEffect } from "react";
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
      </TenantProvider>
    </body>
  );
}
