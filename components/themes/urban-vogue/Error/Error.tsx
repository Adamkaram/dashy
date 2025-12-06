'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

interface ErrorProps {
    error?: Error;
    reset?: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Error Icon */}
                <div className="mb-8">
                    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Error Message */}
                <h1 className="text-4xl font-bold font-montserrat mb-4">
                    Oops!
                </h1>
                <h2 className="text-xl font-medium text-gray-700 mb-2">
                    Something went wrong
                </h2>
                <p className="text-gray-500 mb-8">
                    {error?.message || "We couldn't load this page. Please try again."}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {reset && (
                        <button
                            onClick={reset}
                            className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 font-montserrat font-medium hover:bg-gray-800 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Try Again
                        </button>
                    )}

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 border border-gray-300 px-6 py-3 font-montserrat font-medium hover:bg-gray-50 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
