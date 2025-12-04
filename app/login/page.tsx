'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authClient.signIn.email({
                email,
                password,
            }, {
                onSuccess: (ctx) => {
                    // Redirect based on role or default to home
                    // Since we can't easily check role here without another call, 
                    // we'll redirect to admin and let middleware handle it, or home.
                    // For this specific user, we know they want admin access.
                    router.push('/admin');
                },
                onError: (ctx) => {
                    setError(ctx.error.message || 'فشل تسجيل الدخول. تأكد من البيانات.');
                    setLoading(false);
                }
            });
        } catch (err: any) {
            setError('حدث خطأ غير متوقع');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F0EBE5]" dir="rtl">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#E6DCCF]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#53131C] mb-2">تسجيل الدخول</h1>
                    <p className="text-[#8F6B43]">مرحباً بك في لوحة التحكم</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[#46423D] mb-2">
                            البريد الإلكتروني
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-[#E6DCCF] rounded-lg focus:ring-2 focus:ring-[#8F6B43] focus:border-transparent outline-none transition-all bg-[#FAF9F7]"
                            placeholder="name@example.com"
                            required
                            dir="ltr"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#46423D] mb-2">
                            كلمة المرور
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-[#E6DCCF] rounded-lg focus:ring-2 focus:ring-[#8F6B43] focus:border-transparent outline-none transition-all bg-[#FAF9F7]"
                            placeholder="••••••••"
                            required
                            dir="ltr"
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center border border-red-100">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#53131C] text-white py-3 rounded-lg hover:bg-[#6b1a26] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center font-medium shadow-md hover:shadow-lg transform active:scale-[0.98] duration-200"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin ml-2" />
                                جاري الدخول...
                            </>
                        ) : (
                            'تسجيل الدخول'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-[#8F6B43]">
                    <Link href="/" className="hover:underline hover:text-[#53131C] transition-colors">
                        العودة للصفحة الرئيسية
                    </Link>
                </div>
            </div>
        </div>
    );
}
