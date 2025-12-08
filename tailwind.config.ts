import type { Config } from "tailwindcss";

export default {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                },
                green: {
                    '1': 'var(--green-1)',
                    '2': 'var(--green-2)',
                    '3': 'var(--green-3)',
                    '4': 'var(--green-4)',
                    '5': 'var(--green-5)',
                    '6': 'var(--green-6)',
                    '7': 'var(--green-7)',
                    '8': 'var(--green-8)',
                    '9': 'var(--green-9)',
                    '10': 'var(--green-10)',
                    '11': 'var(--green-11)',
                    '12': 'var(--green-12)',
                },
                root: 'var(--bg-primary)',
            },
        },
        borderRadius: {
            lg: 'var(--radius)',
            md: 'calc(var(--radius) - 2px)',
            sm: 'calc(var(--radius) - 4px)'
        },
        keyframes: {
            "accordion-down": {
                from: { height: "0" },
                to: { height: "var(--radix-accordion-content-height)" },
            },
            "accordion-up": {
                from: { height: "var(--radix-accordion-content-height)" },
                to: { height: "0" },
            },
            slideInUp: {
                from: {
                    opacity: "0",
                    transform: "translateY(30px)",
                },
                to: {
                    opacity: "1",
                    transform: "translateY(0)",
                },
            },
            fadeInUp: {
                from: {
                    opacity: "0",
                    transform: "translateY(20px)",
                },
                to: {
                    opacity: "1",
                    transform: "translateY(0)",
                },
            },
            slideDown: {
                from: {
                    height: "0%",
                    opacity: "0",
                },
                to: {
                    height: "100%",
                    opacity: "1",
                },
            },
            pulseLine: {
                "0%, 100%": {
                    opacity: "0.3",
                    transform: "translateX(-50%) scaleY(0.8)",
                },
                "50%": {
                    opacity: "1",
                    transform: "translateX(-50%) scaleY(1)",
                },
            },
            shine: {
                "0%": { transform: "translateX(-100%)" },
                "100%": { transform: "translateX(100%)" },
            },
            "scroll-x": {
                "0%": { transform: "translateX(0)" },
                "100%": { transform: "translateX(-100%)" },
            },
            plop: {
                "0%, 100%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.1)" },
            },
            "hero-text-slide-up-fade": {
                "0%": { opacity: "0", transform: "translateY(20px)" },
                "100%": { opacity: "1", transform: "translateY(0)" },
            },
        },
        animation: {
            "accordion-down": "accordion-down 0.2s ease-out",
            "accordion-up": "accordion-up 0.2s ease-out",
            slideInUp: "slideInUp 0.8s ease-out 0.3s both",
            fadeInUp: "fadeInUp 0.6s ease-out both",
            slideDown: "slideDown 0.3s ease-in-out",
            pulseLine: "pulseLine 2s ease-in-out infinite",
            shine: "shine 1s ease 0.8s",
            "scroll-x": "scroll-x 180s linear infinite",
            plop: "plop 1s ease-in-out 0.1s infinite",
            "hero-text-slide-up-fade": "hero-text-slide-up-fade 1s ease-in-out",
        },
        fontFamily: {
            vogue: ['Vogue', 'sans-serif'],
            montserrat: ['var(--font-montserrat)', 'sans-serif'],
            sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        },
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '2rem',
                lg: '4rem',
                xl: '5rem',
                '2xl': '6rem',
            },
            screens: {
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
                '2xl': '1536px',
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
