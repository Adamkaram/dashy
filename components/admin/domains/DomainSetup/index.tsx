"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select-shadcn"
import { Badge } from "@/components/ui/badge"
import { Check, ExternalLink, ChevronDown, Plus } from "lucide-react"
import DomainVerification from "../DomainVerification"

export default function DomainSetup({ onCancel }: { onCancel?: () => void }) {
    const [currentStep, setCurrentStep] = useState(1)
    const [domain, setDomain] = useState("")
    const [region, setRegion] = useState("eu-west-1")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [showVerification, setShowVerification] = useState(false)
    const dnsRecordsRef = useRef<HTMLDivElement>(null)

    const handleAddDomain = () => {
        if (domain) {
            setIsSubmitted(true)
            setCurrentStep(2)
            setTimeout(() => {
                dnsRecordsRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                })
            }, 800)
        }
    }

    const dkimSpfRecords = [
        {
            name: "send",
            type: "MX",
            ttl: "تلقائي",
            value: "10 feedback-smtp.eu-west-1.amazonses.com",
        },
        {
            name: "send",
            type: "TXT",
            ttl: "تلقائي",
            value: "v=spf1 include:amazonses.com ~all",
        },
        {
            name: "resend._domainkey",
            type: "TXT",
            ttl: "تلقائي",
            value: "p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDaiCa38mse...",
        },
    ]

    const dmarcRecords = [
        {
            name: "_dmarc",
            type: "TXT",
            ttl: "تلقائي",
            value: "v=DMARC1; p=none;",
        },
    ]

    if (showVerification) {
        return <DomainVerification domain={domain} region={region} />
    }

    return (
        <div className="min-h-screen bg-background text-white" dir="ltr">
            {/* Header */}
            <div className="flex flex-col items-center gap-6 md:flex-row mx-auto w-full max-w-5xl px-6 py-8" dir="rtl">
                {/* Status Icon */}
                <div className="relative shrink-0" style={{ width: "80px", height: "80px" }}>
                    <svg
                        className="absolute right-0 top-0 saturate-150 text-slate-10"
                        fill="none"
                        height="80"
                        viewBox="0 0 80 80"
                        width="80"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g clipPath="url(#a)">
                            <rect fill="#000" height="80" rx="18" width="80" style={{ fill: "rgb(0, 0, 0)", fillOpacity: 1 }}></rect>
                            <rect fill="url(#b)" fillOpacity="0.3" height="80" rx="18" width="80"></rect>
                            <mask height="80" id="d" maskUnits="userSpaceOnUse" width="80" x="0" y="0" style={{ maskType: "alpha" as const }}>
                                <path d="M0 0h80v80H0z" fill="url(#c)"></path>
                            </mask>
                            <g mask="url(#d)">
                                <path d="M1.5 1.5h13v13h-13zM14.5 1.5h13v13h-13z" stroke="#fff" strokeOpacity="0.07"></path>
                                <path d="M28 2h12v12H28z" fill="#fff" fillOpacity="0.1"></path>
                                <path d="M27.5 1.5h13v13h-13zM40.5 1.5h13v13h-13zM53.5 1.5h13v13h-13z" stroke="#fff" strokeOpacity="0.07"></path>
                                <path d="M67 2h12v12H67z" fill="#fff" fillOpacity="0.1"></path>
                                <path d="M66.5 1.5h13v13h-13zM1.5 14.5h13v13h-13z" stroke="#fff" strokeOpacity="0.07"></path>
                                <path d="M15 15h12v12H15z" fill="#fff" fillOpacity="0.06"></path>
                                <path d="M14.5 14.5h13v13h-13zM27.5 14.5h13v13h-13z" stroke="#fff" strokeOpacity="0.07"></path>
                                <path d="M41 15h12v12H41z" fill="#fff" fillOpacity="0.06"></path>
                                <path d="M40.5 14.5h13v13h-13zM53.5 14.5h13v13h-13zM66.5 14.5h13v13h-13z" stroke="#fff" strokeOpacity="0.07"></path>
                                <path d="M2 28h12v12H2z" fill="#fff" fillOpacity="0.1"></path>
                                <path d="M1.5 27.5h13v13h-13zM14.5 27.5h13v13h-13zM27.5 27.5h13v13h-13zM40.5 27.5h13v13h-13z" stroke="#fff" strokeOpacity="0.07"></path>
                                <path d="M54 28h12v12H54z" fill="#fff" fillOpacity="0.06"></path>
                                <path d="M53.5 27.5h13v13h-13zM66.5 27.5h13v13h-13zM1.5 40.5h13v13h-13zM14.5 40.5h13v13h-13zM27.5 40.5h13v13h-13zM40.5 40.5h13v13h-13zM53.5 40.5h13v13h-13z" stroke="#fff" strokeOpacity="0.07"></path>
                                <path d="M67 41h12v12H67z" fill="#fff" fillOpacity="0.1"></path>
                                <path d="M66.5 40.5h13v13h-13zM1.5 53.5h13v13h-13z" stroke="#fff" strokeOpacity="0.07"></path>
                                <path d="M15 54h12v12H15z" fill="#fff" fillOpacity="0.06"></path>
                                <path d="M14.5 53.5h13v13h-13zM27.5 53.5h13v13h-13zM40.5 53.5h13v13h-13z" stroke="#fff" strokeOpacity="0.07"></path>
                                <path d="M54 54h12v12H54z" fill="#fff" fillOpacity="0.06"></path>
                                <path d="M53.5 53.5h13v13h-13zM66.5 53.5h13v13h-13zM1.5 66.5h13v13h-13zM14.5 66.5h13v13h-13z" stroke="#fff" strokeOpacity="0.07"></path>
                                <path d="M28 67h12v12H28z" fill="#fff" fillOpacity="0.1"></path>
                                <path d="M27.5 66.5h13v13h-13zM40.5 66.5h13v13h-13zM53.5 66.5h13v13h-13zM66.5 66.5h13v13h-13z" stroke="#fff" strokeOpacity="0.07"></path>
                            </g>
                            <g filter="url(#e)">
                                <circle cx="39.5" cy="39.5" r="14" stroke="currentColor" strokeWidth="5" style={{ stroke: "currentcolor", strokeOpacity: 0 }}></circle>
                            </g>
                            <g filter="url(#f)">
                                <circle cx="39.5" cy="39.5" r="14" stroke="currentColor" strokeWidth="5" style={{ stroke: "currentcolor", strokeOpacity: 0 }}></circle>
                            </g>
                            <rect fill="currentColor" fillOpacity="0.05" height="74" rx="15" width="74" x="3" y="3"></rect>
                            <rect height="74" rx="15" stroke="#000" strokeWidth="6" width="74" x="3" y="3"></rect>
                        </g>
                        <rect height="78" rx="17" stroke="url(#h)" strokeWidth="2" width="78" x="1" y="1"></rect>
                        <defs>
                            <linearGradient gradientUnits="userSpaceOnUse" id="b" x1="40" x2="40" y1="0" y2="80">
                                <stop stopColor="#fff"></stop>
                                <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
                            </linearGradient>
                            <linearGradient gradientUnits="userSpaceOnUse" id="h" x1="40" x2="40" y1="0" y2="80">
                                <stop stopColor="#fff" stopOpacity="0.6"></stop>
                                <stop offset="1" stopColor="#fff" stopOpacity="0.3"></stop>
                            </linearGradient>
                            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="113" id="e" width="113" x="-17" y="-17">
                                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                                <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                                <feGaussianBlur result="effect1" stdDeviation="20"></feGaussianBlur>
                            </filter>
                            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="73" id="f" width="73" x="3" y="3">
                                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                                <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                                <feGaussianBlur result="effect1" stdDeviation="10"></feGaussianBlur>
                            </filter>
                            <radialGradient cx="0" cy="0" gradientTransform="matrix(0 40 -40 0 40 40)" gradientUnits="userSpaceOnUse" id="c" r="1">
                                <stop stopColor="#fff"></stop>
                                <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
                            </radialGradient>
                            <clipPath id="a">
                                <rect fill="#fff" height="80" rx="18" width="80"></rect>
                            </clipPath>
                        </defs>
                    </svg>
                    <svg
                        className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 text-slate-10"
                        fill="url(#status-icon-fill-dark)"
                        fillOpacity="0.9"
                        height="36"
                        viewBox="0 0 32 32"
                        width="36"
                    >
                        <path d="M16 1C7.729 1 1 7.72894 1 16C1 24.2711 7.729 31 16 31C24.2711 31 24.2711 24.2711 31 16C31 7.72894 24.2711 1 16 1ZM28.6963 14.8733H21.988C21.8877 10.5432 21.2114 6.65073 20.1206 3.93709C24.7925 5.53739 28.2481 9.78025 28.6963 14.8733ZM17.312 3.32042C18.6756 5.50844 19.6082 9.96837 19.7332 14.8733H12.2662C12.4017 9.35378 13.5184 5.23711 14.6917 3.31999C15.122 3.27593 15.5584 3.25325 16 3.25325C16.4429 3.25325 16.8806 3.27607 17.312 3.32042ZM11.8842 3.93537C10.7909 6.65598 10.1128 10.5503 10.012 14.8733H3.30371C3.75207 9.77853 7.20987 5.53436 11.8842 3.93537ZM3.30371 17.1267H10.012C10.1128 21.4496 10.7908 25.3439 11.8841 28.0646C7.2098 26.4655 3.75207 22.2214 3.30371 17.1267ZM14.6916 28.6799C13.5183 26.7627 12.4016 22.6461 12.2662 17.1267H19.7332C19.6082 22.0316 18.6757 26.4913 17.3122 28.6795C16.8808 28.7239 16.443 28.7467 16 28.7467C15.5584 28.7467 15.1219 28.724 14.6916 28.6799ZM20.1207 28.0628C21.2115 25.3491 21.8877 21.4567 21.988 17.1267H28.6963C28.2481 22.2197 24.7926 26.4625 20.1207 28.0628Z"></path>
                        <defs>
                            <linearGradient gradientUnits="userSpaceOnUse" id="status-icon-fill-dark" x1="0" x2="10" y1="0" y2="45">
                                <stop stopColor="white"></stop>
                                <stop offset="0.2" stopColor="white"></stop>
                                <stop offset="1" stopColor="white" stopOpacity="0"></stop>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div className="w-full overflow-hidden text-center md:text-right">
                    <h1 className="text-[28px] leading-[34px] tracking-[-0.416px] text-slate-12 font-bold">إضافة نطاق</h1>
                    <span className="text-sm text-slate-11 font-semibold">استخدم نطاقًا تمتلكه لإرسال البريد الإلكتروني</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto w-full max-w-full px-6 md:max-w-5xl" dir="rtl">
                <div className="relative max-w-[820px] py-12 sm:mr-10">
                    {/* Vertical Line with Animation */}
                    <div className="steps-gradient absolute top-0 h-full w-px right-0">
                        {/* Animated light pulse */}
                        {isSubmitted && (
                            <motion.div
                                className="absolute top-0 w-px h-32 bg-gradient-to-b from-green-400 via-green-500 to-transparent"
                                initial={{ y: 0, opacity: 0 }}
                                animate={{ y: "100vh", opacity: [0, 1, 1, 0] }}
                                transition={{
                                    duration: 1.5,
                                    ease: "easeInOut",
                                    delay: 0.2,
                                }}
                            />
                        )}
                    </div>

                    <div className="flex flex-col gap-5" dir="rtl">
                        {/* Step 1: Domain */}
                        <div className="relative pr-6 transition duration-200 ease-in-out max-w-[30rem]" dir="rtl">
                            {/* Step Indicator */}
                            <motion.div
                                className="bg-black absolute -right-[10px] top-7 z-10 h-[21px] w-[21px] flex rounded-full"
                                animate={
                                    isSubmitted
                                        ? {
                                            boxShadow: [
                                                "0 0 0 0 rgba(34, 197, 94, 0)",
                                                "0 0 0 8px rgba(34, 197, 94, 0.3)",
                                                "0 0 0 0 rgba(34, 197, 94, 0)",
                                            ],
                                        }
                                        : {}
                                }
                                transition={{ duration: 1, delay: 0.1 }}
                            >
                                <div className="m-auto h-3 w-3 rounded-full transition duration-200 ease-in-out flex items-center justify-center">
                                    {isSubmitted ? (
                                        <motion.svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-circle-dashed h-3.5 w-3.5 text-green-500"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.3, duration: 0.4 }}
                                        >
                                            <path d="M10.1 2.182a10 10 0 0 1 3.8 0"></path>
                                            <path d="M13.9 21.818a10 10 0 0 1-3.8 0"></path>
                                            <path d="M17.609 3.721a10 10 0 0 1 2.69 2.7"></path>
                                            <path d="M2.182 13.9a10 10 0 0 1 0-3.8"></path>
                                            <path d="M20.279 17.609a10 10 0 0 1-2.7 2.69"></path>
                                            <path d="M21.818 10.1a10 10 0 0 1 0 3.8"></path>
                                            <path d="M3.721 6.391a10 10 0 0 1 2.7-2.69"></path>
                                            <path d="M6.391 20.279a10 10 0 0 1-2.69-2.7"></path>
                                        </motion.svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-circle-dashed h-3.5 w-3.5 text-gray-400"
                                        >
                                            <path d="M10.1 2.182a10 10 0 0 1 3.8 0"></path>
                                            <path d="M13.9 21.818a10 10 0 0 1-3.8 0"></path>
                                            <path d="M17.609 3.721a10 10 0 0 1 2.69 2.7"></path>
                                            <path d="M2.182 13.9a10 10 0 0 1 0-3.8"></path>
                                            <path d="M20.279 17.609a10 10 0 0 1-2.7 2.69"></path>
                                            <path d="M21.818 10.1a10 10 0 0 1 0 3.8"></path>
                                            <path d="M3.721 6.391a10 10 0 0 1 2.7-2.69"></path>
                                            <path d="M6.391 20.279a10 10 0 0 1-2.69-2.7"></path>
                                        </svg>
                                    )}
                                </div>
                            </motion.div>

                            {/* Domain Card */}
                            <div
                                className={`rounded-xl p-0.5 transition duration-200 ease-in-out ${isSubmitted ? "bg-gradient-to-r from-green-7 via-root to-root" : ""
                                    }`}
                            >
                                <div className="bg-background rounded-[10px]">
                                    <motion.div
                                        className={`rounded-[10px] p-6 ${isSubmitted
                                            ? "bg-gradient-to-r from-green-4 via-green-1 to-green-1"
                                            : "bg-gradient-to-r from-black via-gray-950 to-black"
                                            }`}
                                        animate={
                                            isSubmitted
                                                ? {
                                                    scale: [1, 1.02, 1],
                                                    backgroundColor: [
                                                        "rgba(17, 24, 39, 0.5)",
                                                        "rgba(34, 197, 94, 0.1)",
                                                        "rgba(34, 197, 94, 0.05)",
                                                    ],
                                                }
                                                : {}
                                        }
                                        transition={{
                                            duration: 0.6,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl tracking-[-0.16px] font-bold mb-1">النطاق</h3>
                                            {isSubmitted && (
                                                <motion.div
                                                    className="-mt-1 brightness-75 saturate-200 dark:filter-none"
                                                    style={{ width: "16px", height: "16px" }}
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.3, duration: 0.4 }}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="text-green-500"
                                                    >
                                                        <path d="M20 6L9 17l-5-5" />
                                                    </svg>
                                                </motion.div>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-11 font-normal mb-6">اسم النطاق والمنطقة للإرسال</p>
                                        {!isSubmitted ? (
                                            <form
                                                className="flex flex-col gap-6"
                                                onSubmit={(e) => {
                                                    e.preventDefault()
                                                    handleAddDomain()
                                                }}
                                            >
                                                <div className="flex flex-col gap-2">
                                                    <Label htmlFor="domain" className="text-slate-11 text-sm flex items-center">
                                                        الاسم
                                                    </Label>
                                                    <Input
                                                        id="domain"
                                                        placeholder="updates.example.com"
                                                        value={domain}
                                                        onChange={(e) => setDomain(e.target.value)}
                                                        className="border-gray-700 bg-black text-white focus-visible:ring-gray-700 transition ease-in-out duration-200 placeholder:text-gray-500 h-8 rounded-md px-2 text-base sm:text-sm"
                                                        required
                                                        dir="ltr"
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <Label htmlFor="region" className="text-slate-11 text-sm flex items-center">
                                                        المنطقة
                                                    </Label>
                                                    <Select value={region} onValueChange={setRegion}>
                                                        <SelectTrigger className="border-gray-700 bg-black text-slate-11 h-8">
                                                            <div className="flex items-center gap-2">
                                                                <span>🇮🇪</span>
                                                                <span>
                                                                    أيرلندا <span className="text-slate-11">(eu-west-1)</span>
                                                                </span>
                                                            </div>
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-gray-800 border-gray-600">
                                                            <SelectItem value="us-east-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span>🇺🇸</span>
                                                                    <span>فيرجينيا الشمالية (us-east-1)</span>
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="eu-west-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span>🇮🇪</span>
                                                                    <span>أيرلندا (eu-west-1)</span>
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="sa-east-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span>🇧🇷</span>
                                                                    <span>ساو باولو (sa-east-1)</span>
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="ap-northeast-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span>🇯🇵</span>
                                                                    <span>طوكيو (ap-northeast-1)</span>
                                                                </div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="flex flex-col gap-4">
                                                    <details className="group">
                                                        <summary className="flex items-center gap-1 cursor-pointer">
                                                            <ChevronDown className="w-4 h-4 text-slate-11 transition-transform group-open:rotate-180" />
                                                            <span className="text-sm text-slate-11 hover:text-slate-12">خيارات متقدمة</span>
                                                        </summary>
                                                    </details>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    className="bg-white text-black hover:bg-gray-100 font-semibold h-8"
                                                    disabled={!domain}
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        if (domain) {
                                                            setIsSubmitted(true)
                                                            setCurrentStep(2)
                                                        }
                                                    }}
                                                >
                                                    <Plus className="w-4 h-4 ml-2" />
                                                    إضافة نطاق
                                                </Button>
                                            </form>
                                        ) : (
                                            <div className="relative" data-size="2" data-state="read-only">
                                                <input
                                                    className="text-slate-11 border-slate-6 bg-slate-3 focus-visible:ring-slate-7 transition ease-in-out duration-200 placeholder:text-slate-9 h-8 rounded-md px-2 text-base sm:text-sm relative w-full select-none appearance-none border outline-none focus-visible:ring-2 cursor-default"
                                                    data-state="read-only"
                                                    readOnly
                                                    type="text"
                                                    value={domain}
                                                    dir="ltr"
                                                />
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: DNS Records */}
                        <div
                            ref={dnsRecordsRef}
                            className={`relative pr-6 transition duration-200 ease-in-out ${!isSubmitted ? "pointer-events-none select-none opacity-50" : ""
                                }`}
                            dir="rtl"
                        >
                            {/* Step Indicator */}
                            <motion.div
                                className="bg-black absolute -right-[10px] top-7 z-10 h-[21px] w-[21px] flex rounded-full"
                                animate={
                                    isSubmitted
                                        ? {
                                            boxShadow: [
                                                "0 0 0 0 rgba(34, 197, 94, 0)",
                                                "0 0 0 8px rgba(34, 197, 94, 0.2)",
                                                "0 0 0 0 rgba(34, 197, 94, 0)",
                                            ],
                                        }
                                        : {}
                                }
                                transition={{ duration: 1, delay: 1.2 }}
                            >
                                <motion.div
                                    className="m-auto h-3 w-3 rounded-full border-2 transition duration-200 ease-in-out"
                                    animate={
                                        isSubmitted
                                            ? {
                                                borderColor: ["#6b7280", "#22c55e", "#22c55e"],
                                            }
                                            : {}
                                    }
                                    transition={{ duration: 0.8, delay: 1 }}
                                    style={{ borderColor: isSubmitted ? "#22c55e" : "#6b7280" }}
                                />
                            </motion.div>

                            {/* DNS Records Card */}
                            <div className="rounded-xl p-0.5 transition duration-200 ease-in-out">
                                <div className="bg-background rounded-[10px]">
                                    <div className="rounded-[10px] p-6 bg-gradient-to-r from-black via-gray-950 to-black">
                                        <div className="flex-1 flex justify-between">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xl tracking-[-0.16px] font-bold mb-1">سجلات DNS</h3>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm" className="border-gray-600 text-gray-400 hover:text-white">
                                                    <ExternalLink className="w-4 h-4 ml-2" />
                                                    كيفية إضافة السجلات
                                                </Button>
                                            </div>
                                        </div>

                                        {isSubmitted && (
                                            <div className="animate-[slideInUp_0.8s_ease-out_0.3s_both]">
                                                {/* DKIM and SPF Section */}
                                                <div className="mt-8 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.5s_both]">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h2 className="text-base font-bold flex items-center gap-2">
                                                            DKIM و SPF
                                                            <ExternalLink className="w-4 h-4 text-gray-500" />
                                                        </h2>
                                                        <Badge
                                                            variant="outline"
                                                            className="inline-flex select-none items-center font-medium truncate text-slate-9 border-slate-4 border bg-transparent text-xs h-6 px-2 rounded-sm"
                                                        >
                                                            مطلوب
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-400 mb-4">
                                                        تفعيل توقيع البريد الإلكتروني وتحديد المرسلين المصرح لهم
                                                    </p>

                                                    <div className="overflow-x-auto opacity-0 animate-[fadeInUp_0.6s_ease-out_0.7s_both]">
                                                        <table className="w-full border-separate border-spacing-0">
                                                            <thead className="h-8 rounded-md bg-slate-3">
                                                                <tr className="bg-gray-800/50">
                                                                    <th className="text-right text-xs font-semibold text-gray-400 p-3 bg-gray-800/50 first:rounded-r-md">
                                                                        اسم السجل
                                                                    </th>
                                                                    <th className="text-right text-xs font-semibold text-gray-400 p-3 bg-gray-800/50">
                                                                        النوع
                                                                    </th>
                                                                    <th className="text-right text-xs font-semibold text-gray-400 p-3 bg-gray-800/50">
                                                                        مدة التخزين
                                                                    </th>
                                                                    <th className="text-right text-xs font-semibold text-gray-400 p-3 bg-gray-800/50 last:rounded-l-md">
                                                                        القيمة
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {dkimSpfRecords.map((record, index) => (
                                                                    <tr
                                                                        key={index}
                                                                        className="opacity-0 animate-[fadeInUp_0.4s_ease-out_both]"
                                                                        style={{ animationDelay: `${0.9 + index * 0.1}s` }}
                                                                    >
                                                                        <td className="p-3 border-b border-gray-700 text-sm font-mono" dir="ltr">
                                                                            <span className="block max-w-[200px] truncate">{record.name}</span>
                                                                        </td>
                                                                        <td className="p-3 border-b border-gray-700 text-sm font-mono">{record.type}</td>
                                                                        <td className="p-3 border-b border-gray-700 text-sm font-mono">{record.ttl}</td>
                                                                        <td className="p-3 border-b border-gray-700 text-sm font-mono" dir="ltr">
                                                                            <span className="block max-w-[200px] truncate">{record.value}</span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>

                                                {/* DMARC Section */}
                                                <div className="mt-8 opacity-0 animate-[fadeInUp_0.6s_ease-out_1.2s_both]">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h2 className="text-base font-bold flex items-center gap-2">
                                                            DMARC
                                                            <ExternalLink className="w-4 h-4 text-gray-500" />
                                                        </h2>
                                                        <Badge
                                                            variant="outline"
                                                            className="inline-flex select-none items-center font-medium truncate text-slate-9 border-slate-4 border bg-transparent text-xs h-6 px-2 rounded-sm"
                                                        >
                                                            موصى به
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-400 mb-4">إعداد سياسات المصادقة واستلام التقارير</p>

                                                    <div className="overflow-x-auto opacity-0 animate-[fadeInUp_0.6s_ease-out_1.4s_both]">
                                                        <table className="w-full border-separate border-spacing-0">
                                                            <thead>
                                                                <tr className="bg-gray-800/50">
                                                                    <th className="text-right text-xs font-semibold text-gray-400 p-3 bg-gray-800/50 first:rounded-r-md">
                                                                        اسم السجل
                                                                    </th>
                                                                    <th className="text-right text-xs font-semibold text-gray-400 p-3 bg-gray-800/50">
                                                                        النوع
                                                                    </th>
                                                                    <th className="text-right text-xs font-semibold text-gray-400 p-3 bg-gray-800/50">
                                                                        مدة التخزين
                                                                    </th>
                                                                    <th className="text-right text-xs font-semibold text-gray-400 p-3 bg-gray-800/50 last:rounded-l-md">
                                                                        القيمة
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {dmarcRecords.map((record, index) => (
                                                                    <tr key={index} className="opacity-0 animate-[fadeInUp_0.4s_ease-out_1.6s_both]">
                                                                        <td className="p-3 text-sm font-mono" dir="ltr">
                                                                            <span className="block max-w-[200px] truncate">{record.name}</span>
                                                                        </td>
                                                                        <td className="p-3 text-sm font-mono">{record.type}</td>
                                                                        <td className="p-3 text-sm font-mono">{record.ttl}</td>
                                                                        <td className="p-3 text-sm font-mono" dir="ltr">
                                                                            <span className="block max-w-[200px] truncate">{record.value}</span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="mt-10 flex gap-2 opacity-0 animate-[fadeInUp_0.6s_ease-out_1.8s_both]">
                                                    <Button
                                                        className="bg-white text-black hover:bg-gray-100 font-semibold"
                                                        onClick={() => setShowVerification(true)}
                                                    >
                                                        <Check className="w-4 h-4 ml-2" />
                                                        أضفت السجلات
                                                    </Button>
                                                    <Button variant="ghost" className="text-gray-400 hover:text-white">
                                                        إرسال التعليمات
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
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
