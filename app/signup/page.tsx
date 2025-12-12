'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authClient.signUp.email({
                email,
                password,
                name,
            }, {
                onSuccess: (ctx) => {
                    // Redirect to home or admin (middleware will handle access)
                    router.push('/');
                    router.refresh();
                },
                onError: (ctx) => {
                    setError(ctx.error.message || 'فشل إنشاء الحساب. تأكد من البيانات.');
                    setLoading(false);
                }
            });
        } catch (err: any) {
            setError('حدث خطأ غير متوقع');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFEDD5]" dir="rtl">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#E6DCCF]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#FF4F0F] mb-2">إنشاء حساب جديد</h1>
                    <p className="text-[#FF6500]">انضم إلينا في ماى مومنت</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[#46423D] mb-2">
                            الاسم الكامل
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-[#E6DCCF] rounded-lg focus:ring-2 focus:ring-[#FF6500] focus:border-transparent outline-none transition-all bg-[#FAF9F7]"
                            placeholder="الاسم"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#46423D] mb-2">
                            البريد الإلكتروني
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-[#E6DCCF] rounded-lg focus:ring-2 focus:ring-[#FF6500] focus:border-transparent outline-none transition-all bg-[#FAF9F7]"
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
                            className="w-full px-4 py-3 border border-[#E6DCCF] rounded-lg focus:ring-2 focus:ring-[#FF6500] focus:border-transparent outline-none transition-all bg-[#FAF9F7]"
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
                        className="w-full bg-[#FF4F0F] text-white py-3 rounded-lg hover:bg-[#6b1a26] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center font-medium shadow-md hover:shadow-lg transform active:scale-[0.98] duration-200"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin ml-2" />
                                جاري الإنشاء...
                            </>
                        ) : (
                            'إنشاء حساب'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-[#FF6500]">
                    <p>
                        لديك حساب بالفعل؟{' '}
                        <Link href="/login" className="font-bold hover:underline hover:text-[#FF4F0F] transition-colors">
                            تسجيل الدخول
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
