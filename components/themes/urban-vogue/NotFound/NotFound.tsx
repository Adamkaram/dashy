import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* 404 Number */}
                <h1 className="text-9xl font-bold font-montserrat text-black mb-4">
                    404
                </h1>

                {/* Message */}
                <h2 className="text-2xl font-medium font-montserrat mb-2">
                    Page Not Found
                </h2>
                <p className="text-gray-500 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 font-montserrat font-medium hover:bg-gray-800 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>

                    <Link
                        href="/shop"
                        className="inline-flex items-center justify-center gap-2 border border-gray-300 px-6 py-3 font-montserrat font-medium hover:bg-gray-50 transition-colors"
                    >
                        <Search className="w-4 h-4" />
                        Browse Products
                    </Link>
                </div>
            </div>
        </div>
    );
}
