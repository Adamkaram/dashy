"use client"

interface StatusIconProps {
    color?: "slate" | "yellow" | "green"
    size?: number
}

export function StatusIcon({ color = "slate", size = 80 }: StatusIconProps) {
    const colorClass = {
        slate: "text-slate-500",
        yellow: "text-yellow-500",
        green: "text-green-500"
    }[color]

    return (
        <div className="relative shrink-0" style={{ width: `${size}px`, height: `${size}px` }}>
            <svg
                className={`absolute left-0 top-0 saturate-150 ${colorClass}`}
                fill="none"
                height={size}
                viewBox="0 0 80 80"
                width={size}
                xmlns="http://www.w3.org/2000/svg"
            >
                <g clipPath="url(#status-clip)">
                    <rect className="fill-white dark:fill-black" height="80" rx="18" width="80" />
                    <rect fill="url(#status-grad-b)" fillOpacity="0.3" height="80" rx="18" width="80" />
                    <mask height="80" id="status-mask" maskUnits="userSpaceOnUse" width="80" x="0" y="0" style={{ maskType: "alpha" }}>
                        <path d="M0 0h80v80H0z" fill="url(#status-grad-c)" />
                    </mask>
                    <g mask="url(#status-mask)">
                        {/* Grid pattern */}
                        <path d="M1.5 1.5h13v13h-13zM14.5 1.5h13v13h-13z" stroke="currentColor" strokeOpacity="0.07" />
                        <path d="M28 2h12v12H28z" fill="currentColor" fillOpacity="0.1" />
                        <path d="M27.5 1.5h13v13h-13zM40.5 1.5h13v13h-13zM53.5 1.5h13v13h-13z" stroke="currentColor" strokeOpacity="0.07" />
                        <path d="M67 2h12v12H67z" fill="currentColor" fillOpacity="0.1" />
                        <path d="M66.5 1.5h13v13h-13zM1.5 14.5h13v13h-13z" stroke="currentColor" strokeOpacity="0.07" />
                        <path d="M15 15h12v12H15z" fill="currentColor" fillOpacity="0.06" />
                        <path d="M14.5 14.5h13v13h-13zM27.5 14.5h13v13h-13z" stroke="currentColor" strokeOpacity="0.07" />
                        <path d="M41 15h12v12H41z" fill="currentColor" fillOpacity="0.06" />
                        <path d="M40.5 14.5h13v13h-13zM53.5 14.5h13v13h-13zM66.5 14.5h13v13h-13z" stroke="currentColor" strokeOpacity="0.07" />
                        <path d="M2 28h12v12H2z" fill="currentColor" fillOpacity="0.1" />
                        <path d="M1.5 27.5h13v13h-13zM14.5 27.5h13v13h-13zM27.5 27.5h13v13h-13zM40.5 27.5h13v13h-13z" stroke="currentColor" strokeOpacity="0.07" />
                        <path d="M54 28h12v12H54z" fill="currentColor" fillOpacity="0.06" />
                        <path d="M53.5 27.5h13v13h-13zM66.5 27.5h13v13h-13zM1.5 40.5h13v13h-13zM14.5 40.5h13v13h-13zM27.5 40.5h13v13h-13zM40.5 40.5h13v13h-13zM53.5 40.5h13v13h-13z" stroke="currentColor" strokeOpacity="0.07" />
                        <path d="M67 41h12v12H67z" fill="currentColor" fillOpacity="0.1" />
                        <path d="M66.5 40.5h13v13h-13zM1.5 53.5h13v13h-13z" stroke="currentColor" strokeOpacity="0.07" />
                        <path d="M15 54h12v12H15z" fill="currentColor" fillOpacity="0.06" />
                        <path d="M14.5 53.5h13v13h-13zM27.5 53.5h13v13h-13zM40.5 53.5h13v13h-13z" stroke="currentColor" strokeOpacity="0.07" />
                        <path d="M54 54h12v12H54z" fill="currentColor" fillOpacity="0.06" />
                        <path d="M53.5 53.5h13v13h-13zM66.5 53.5h13v13h-13zM1.5 66.5h13v13h-13zM14.5 66.5h13v13h-13z" stroke="currentColor" strokeOpacity="0.07" />
                        <path d="M28 67h12v12H28z" fill="currentColor" fillOpacity="0.1" />
                        <path d="M27.5 66.5h13v13h-13zM40.5 66.5h13v13h-13zM53.5 66.5h13v13h-13zM66.5 66.5h13v13h-13z" stroke="currentColor" strokeOpacity="0.07" />
                    </g>
                    {/* Glow effects */}
                    <g filter="url(#status-blur-e)">
                        <circle cx="39.5" cy="39.5" r="14" stroke="currentColor" strokeWidth="5" strokeOpacity="0" />
                    </g>
                    <g filter="url(#status-blur-f)">
                        <circle cx="39.5" cy="39.5" r="14" stroke="currentColor" strokeWidth="5" strokeOpacity="0" />
                    </g>
                    <rect fill="currentColor" fillOpacity="0.05" height="74" rx="15" width="74" x="3" y="3" />
                    <rect height="74" rx="15" className="stroke-white dark:stroke-black" strokeWidth="6" width="74" x="3" y="3" />
                </g>
                <rect height="78" rx="17" stroke="url(#status-grad-h)" strokeWidth="2" width="78" x="1" y="1" />
                <defs>
                    <linearGradient gradientUnits="userSpaceOnUse" id="status-grad-b" x1="40" x2="40" y1="0" y2="80">
                        <stop stopColor="currentColor" />
                        <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient gradientUnits="userSpaceOnUse" id="status-grad-h" x1="40" x2="40" y1="0" y2="80">
                        <stop stopColor="currentColor" stopOpacity="0.6" />
                        <stop offset="1" stopColor="currentColor" stopOpacity="0.3" />
                    </linearGradient>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="113" id="status-blur-e" width="113" x="-17" y="-17">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur result="effect1" stdDeviation="20" />
                    </filter>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="73" id="status-blur-f" width="73" x="3" y="3">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur result="effect1" stdDeviation="10" />
                    </filter>
                    <radialGradient cx="0" cy="0" gradientTransform="matrix(0 40 -40 0 40 40)" gradientUnits="userSpaceOnUse" id="status-grad-c" r="1">
                        <stop stopColor="currentColor" />
                        <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                    </radialGradient>
                    <clipPath id="status-clip">
                        <rect fill="currentColor" height="80" rx="18" width="80" />
                    </clipPath>
                </defs>
            </svg>
            {/* Globe Icon */}
            <svg
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${colorClass}`}
                fill="url(#status-icon-fill)"
                fillOpacity="0.9"
                height={size * 0.45}
                viewBox="0 0 32 32"
                width={size * 0.45}
            >
                <path d="M16 1C7.729 1 1 7.72894 1 16C1 24.2711 7.729 31 16 31C24.2711 31 31 24.2711 31 16C31 7.72894 24.2711 1 16 1ZM28.6963 14.8733H21.988C21.8877 10.5432 21.2114 6.65073 20.1206 3.93709C24.7925 5.53739 28.2481 9.78025 28.6963 14.8733ZM17.312 3.32042C18.6756 5.50844 19.6082 9.96837 19.7332 14.8733H12.2662C12.4017 9.35378 13.5184 5.23711 14.6917 3.31999C15.122 3.27593 15.5584 3.25325 16 3.25325C16.4429 3.25325 16.8806 3.27607 17.312 3.32042ZM11.8842 3.93537C10.7909 6.65598 10.1128 10.5503 10.012 14.8733H3.30371C3.75207 9.77853 7.20987 5.53436 11.8842 3.93537ZM3.30371 17.1267H10.012C10.1128 21.4496 10.7908 25.3439 11.8841 28.0646C7.2098 26.4655 3.75207 22.2214 3.30371 17.1267ZM14.6916 28.6799C13.5183 26.7627 12.4016 22.6461 12.2662 17.1267H19.7332C19.6082 22.0316 18.6757 26.4913 17.3122 28.6795C16.8808 28.7239 16.443 28.7467 16 28.7467C15.5584 28.7467 15.1219 28.724 14.6916 28.6799ZM20.1207 28.0628C21.2115 25.3491 21.8877 21.4567 21.988 17.1267H28.6963C28.2481 22.2197 24.7926 26.4625 20.1207 28.0628Z" />
                <defs>
                    <linearGradient gradientUnits="userSpaceOnUse" id="status-icon-fill" x1="0" x2="10" y1="0" y2="45">
                        <stop stopColor="currentColor" />
                        <stop offset="0.2" stopColor="currentColor" />
                        <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    )
}
