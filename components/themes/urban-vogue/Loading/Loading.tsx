export default function Loading() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                {/* Spinner */}
                <div className="relative w-16 h-16 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>

                {/* Loading Text */}
                <h2 className="text-xl font-montserrat font-medium text-black mb-2">
                    Loading
                </h2>
                <p className="text-sm text-gray-500">
                    Please wait...
                </p>
            </div>
        </div>
    );
}
