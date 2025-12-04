# Sidebar Implementation - Complete Guide

## Overview
This document contains all the files and code needed to implement a responsive sidebar that works on both desktop and mobile devices, similar to app.dub.co.

## File Structure

### 1. Main Layout Component
**File:** `components/dashboard-layout.tsx`

```tsx
'use client'

import { useState, useEffect, createContext, Dispatch, SetStateAction } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  LayoutDashboard, 
  Globe, 
  Key, 
  CreditCard, 
  Users, 
  Settings,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  HelpCircle,
  Gift,
  BookOpen,
  LifeBuoy,
  MessageCircle,
  TrendingUp,
  Activity,
  Clock,
  Zap,
  BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/lib/hooks/use-media-query'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

// Context for sidebar state
type SideNavContext = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const SideNavContext = createContext<SideNavContext>({
  isOpen: false,
  setIsOpen: () => {},
});

// Navigation items
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Sites', href: '/dashboard/sites', icon: Globe },
  { name: 'Domains', href: '/dashboard/domains', icon: Globe },
  { name: 'API Keys', href: '/dashboard/api-keys', icon: Key },
  { name: 'Purchases', href: '/dashboard/purchases', icon: CreditCard },
  { name: 'Sessions', href: '/dashboard/sessions', icon: Users },
]

// Grouped navigation for right column
const navigationGroups = [
  {
    title: 'General',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
      { name: 'Sites', href: '/dashboard/sites', icon: Globe, badge: 12 },
    ],
  },
  {
    title: 'Management',
    items: [
      { name: 'Domains', href: '/dashboard/domains', icon: Globe, badge: 3 },
      { name: 'API Keys', href: '/dashboard/api-keys', icon: Key, badge: 'New' },
      { name: 'Purchases', href: '/dashboard/purchases', icon: CreditCard, badge: 47 },
      { name: 'Sessions', href: '/dashboard/sessions', icon: Users, badge: 3 },
    ],
  },
]

// Mock usage data - replace with real data
const usageData = {
  events: { used: 2847, limit: 10000 },
  sites: { used: 12, limit: 25 },
  resetDate: 'Jul 30, 2025'
}

// User dropdown component
function UserDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-12 w-12 rounded-full p-0"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Sidebar component
function Sidebar({ toolContent }: { toolContent?: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-[304px] flex-row shadow-lg rounded-r-xl overflow-hidden">
      {/* Icon group (left column) - 64px */}
      <div className="flex flex-col items-center justify-between w-16 py-4 border-r border-neutral-200">
        <div className="flex flex-col items-center gap-4">
          <Link href="/dashboard" className="mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
              <Globe className="h-5 w-5 text-white" />
            </div>
          </Link>
          <TooltipProvider>
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Tooltip key={item.name} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex h-10 w-10 items-center justify-center rounded-lg transition-all",
                        isActive ? "bg-neutral-200" : "hover:bg-neutral-200",
                        "outline-none focus-visible:ring-2 focus-visible:ring-black/50"
                      )}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-neutral-900" : "text-neutral-600 group-hover:text-neutral-900"
                      )} />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs font-medium">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </div>
        <div className="flex flex-col items-center gap-3 pb-2">
          {toolContent}
          <div className="flex h-12 w-12 items-center justify-center">
            <UserDropdown />
          </div>
        </div>
      </div>
      {/* Main nav area (right column) - 240px */}
      <div className="flex-1 flex flex-col justify-between py-2 pr-2 w-[240px]">
        <div className="scrollbar-hide relative flex h-full w-[calc(240px-0.5rem)] flex-col overflow-y-auto overflow-x-hidden rounded-xl bg-neutral-100">
          <div className="relative flex grow flex-col p-3 text-neutral-500">
            <nav className="flex-1 space-y-6">
              {navigationGroups.map((group) => (
                <div key={group.title}>
                  <div className="mb-2 px-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    {group.title}
                  </div>
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                            pathname === item.href
                              ? 'bg-neutral-200 text-neutral-900'
                              : 'text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900'
                          )}
                        >
                          {item.icon && <item.icon className="w-4 h-4 mr-1 text-neutral-500" />}
                          <span>{item.name}</span>
                          {item.badge && (
                            <span className={cn(
                              "ml-auto text-xs px-2 py-0.5 rounded font-semibold",
                              typeof item.badge === 'number' 
                                ? "bg-blue-100 text-blue-700" 
                                : "bg-purple-100 text-purple-700"
                            )}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          {/* Fixed bottom sections */}
          <div className="flex flex-col gap-2">
            {/* Usage Widget */}
            <div className="border-t border-neutral-300/80 p-3">
              <div className="flex items-center gap-0.5 text-sm font-normal text-neutral-500">
                Usage
                <ChevronRight className="size-3 text-neutral-400" />
              </div>
              
              <div className="mt-4 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Activity className="size-3.5 text-neutral-600" />
                    <span className="text-xs font-medium text-neutral-700">Events</span>
                  </div>
                  <span className="text-xs font-medium text-neutral-600">
                    {usageData.events.used.toLocaleString()} of {usageData.events.limit.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Globe className="size-3.5 text-neutral-600" />
                    <span className="text-xs font-medium text-neutral-700">Sites</span>
                  </div>
                  <span className="text-xs font-medium text-neutral-600">
                    {usageData.sites.used} of {usageData.sites.limit}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-xs text-neutral-900/40">
                  Usage will reset {usageData.resetDate}
                </p>
              </div>

              <Button className="mt-4 w-full h-9 rounded-md border px-4 text-sm bg-black text-white hover:bg-neutral-800">
                Get Panaroid Pro
              </Button>
            </div>

            {/* Quick Links Widget */}
            <div className="px-3 pb-2">
              <div className="rounded-lg bg-white p-3 shadow-sm border border-neutral-200">
                <div className="font-semibold text-neutral-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-500" /> Quick Links
                </div>
                <div className="space-y-2">
                  <a href="https://docs.panaroid.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-purple-700 text-xs text-neutral-600">
                    <BookOpen className="w-4 h-4" /> Documentation
                  </a>
                  <a href="mailto:support@panaroid.com" className="flex items-center gap-2 hover:text-purple-700 text-xs text-neutral-600">
                    <LifeBuoy className="w-4 h-4" /> Support
                  </a>
                  <a href="https://feedback.panaroid.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-purple-700 text-xs text-neutral-600">
                    <MessageCircle className="w-4 h-4" /> Feedback
                  </a>
                </div>
              </div>
            </div>

            {/* Recent Activity Widget */}
            <div className="px-3 pb-2">
              <div className="rounded-lg bg-white p-3 shadow-sm border border-neutral-200">
                <div className="font-semibold text-neutral-800 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" /> Recent Activity
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>New feedback received</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Site "Support" created</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>API key generated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Toolbar component
function Toolbar() {
  return (
    <div className="fixed bottom-0 right-0 z-40 m-5">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="h-10 w-10 rounded-full p-0 shadow-lg bg-white hover:bg-neutral-100 border-neutral-200"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-10 w-10 rounded-full p-0 shadow-lg bg-white hover:bg-neutral-100 border-neutral-200"
        >
          <Zap className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Main layout component
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)

  // Prevent body scroll when side nav is open
  useEffect(() => {
    document.body.style.overflow = isOpen && isMobile ? "hidden" : "auto"
  }, [isOpen, isMobile])

  // Close side nav when pathname changes
  const pathname = usePathname()
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <div className="min-h-screen w-full bg-white">
        <div className="min-h-screen md:grid md:grid-cols-[min-content_minmax(0,1fr)]">
          {/* Side nav backdrop */}
          <div
            className={cn(
              "fixed left-0 top-0 z-50 h-dvh w-screen transition-[background-color,backdrop-filter] md:sticky md:z-auto md:w-full md:bg-transparent",
              isOpen
                ? "bg-black/20 backdrop-blur-sm"
                : "bg-transparent max-md:pointer-events-none",
            )}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                e.stopPropagation()
                setIsOpen(false)
              }
            }}
          >
            {/* Side nav */}
            <div
              className={cn(
                "relative h-full w-min max-w-full bg-neutral-200 transition-transform md:translate-x-0",
                !isOpen && "-translate-x-full",
              )}
            >
              <Sidebar 
                toolContent={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 rounded-lg p-0"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                }
              />
            </div>
          </div>

          {/* Main content */}
          <div className="bg-neutral-200 md:pt-2">
            <div className="relative min-h-full bg-neutral-100 pt-px md:rounded-tl-xl md:bg-white">
              <SideNavContext.Provider value={{ isOpen, setIsOpen }}>
                {/* Mobile header */}
                <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-neutral-200 bg-white px-4 shadow-sm md:hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(true)}
                    className="md:hidden"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                  <div className="flex-1 text-sm font-semibold leading-6 text-neutral-900">
                    Dashboard
                  </div>
                </div>
                {/* Page content - children rendered directly, not inside <main> or extra container */}
                {children}
              </SideNavContext.Provider>
            </div>
          </div>
        </div>
      </div>
      <Toolbar />
    </>
  )
}
```

### 2. Media Query Hook
**File:** `lib/hooks/use-media-query.ts`

```tsx
import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    window.addEventListener('resize', listener)
    return () => window.removeEventListener('resize', listener)
  }, [matches, query])

  return matches
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)')
}
```

### 3. Layout Sidebar Icon
**File:** `components/LayoutSidebar.tsx`

```tsx
import { SVGProps } from "react";

export function LayoutSidebar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      height="18"
      width="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="currentColor">
        <path
          d="M4,2.75H14.25c1.105,0,2,.895,2,2V13.25c0,1.105-.895,2-2,2H4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <rect
          height="12.5"
          width="4.5"
          fill="none"
          rx="2"
          ry="2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x="1.75"
          y="2.75"
        />
      </g>
    </svg>
  );
}
```

### 4. NavButton Component (Optional)
**File:** `components/NavButton.tsx`

```tsx
import { LayoutSidebar } from './LayoutSidebar';

export function NavButton() {
  return (
    <button
      type="button"
      className="h-auto w-fit p-1 md:hidden border border-neutral-200 rounded bg-white hover:bg-neutral-100 transition-colors"
      aria-label="Open sidebar"
    >
      <LayoutSidebar className="h-5 w-5 text-neutral-600" />
    </button>
  );
}
```

### 5. Utility Functions
**File:** `lib/utils.ts`

```tsx
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 6. Global CSS
**File:** `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom scrollbar for sidebar */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Animation for slide up fade */
@keyframes slide-up-fade {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up-fade {
  animation: slide-up-fade 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 7. UI Components (Required)
**File:** `components/ui/button.tsx`

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

**File:** `components/ui/tooltip.tsx`

```tsx
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
```

**File:** `components/ui/avatar.tsx`

```tsx
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
```

**File:** `components/ui/dropdown-menu.tsx`

```tsx
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
```

### 8. Usage Example
**File:** `app/dashboard/page.tsx`

```tsx
'use client'

import DashboardLayout from '@/components/dashboard-layout'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome to your dashboard!</p>
      </div>
    </DashboardLayout>
  )
}
```

## Key Features

### Desktop Behavior:
- Sidebar is always visible on the left
- Fixed width of 304px total (64px icons + 240px content)
- Smooth transitions and hover effects
- Tooltips for icon navigation

### Mobile Behavior:
- Sidebar is hidden by default
- Mobile header with hamburger menu button
- Overlay backdrop when sidebar is open
- Touch-friendly navigation
- Prevents body scroll when sidebar is open

### Responsive Design:
- Uses CSS Grid for layout
- Media queries for mobile detection
- Smooth animations and transitions
- Proper z-index management

### Context Management:
- SideNavContext for state management
- Automatic sidebar closing on route changes
- Body scroll prevention on mobile

## Dependencies Required

```json
{
  "dependencies": {
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tooltip": "^1.0.7",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "framer-motion": "^10.16.4",
    "lucide-react": "^0.263.1",
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18",
    "tailwind-merge": "^1.14.0"
  }
}
```

## Tailwind CSS Classes Used

### Layout:
- `min-h-screen`, `h-full`, `w-[304px]`, `w-16`, `w-[240px]`
- `md:grid`, `md:grid-cols-[min-content_minmax(0,1fr)]`
- `fixed`, `sticky`, `relative`, `absolute`

### Responsive:
- `md:hidden`, `md:block`, `md:translate-x-0`
- `max-md:pointer-events-none`

### Animations:
- `transition-all`, `transition-transform`, `transition-colors`
- `animate-in`, `fade-in-0`, `zoom-in-95`

### Styling:
- `bg-neutral-100`, `bg-white`, `bg-neutral-200`
- `border-neutral-200`, `border-r`
- `shadow-lg`, `rounded-r-xl`, `rounded-lg`
- `text-neutral-600`, `text-neutral-900`

This implementation provides a complete, responsive sidebar solution that works seamlessly across all device sizes. 