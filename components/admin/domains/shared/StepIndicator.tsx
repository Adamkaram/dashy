"use client"

import { motion } from "framer-motion"
import { CircleDashed } from "lucide-react"

interface StepIndicatorProps {
    step: number
    isCompleted: boolean
    isActive: boolean
}

export function StepIndicator({ step, isCompleted, isActive }: StepIndicatorProps) {
    return (
        <motion.div
            className="bg-white dark:bg-black absolute -right-[10px] top-7 z-10 h-[21px] w-[21px] flex rounded-full border border-slate-200 dark:border-transparent"
            animate={
                isCompleted
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
                {isCompleted ? (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                    >
                        <CircleDashed className="h-3.5 w-3.5 text-green-500" />
                    </motion.div>
                ) : (
                    <CircleDashed className={`h-3.5 w-3.5 ${isActive ? "text-slate-600" : "text-slate-400"}`} />
                )}
            </div>
        </motion.div>
    )
}
