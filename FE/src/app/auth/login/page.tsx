'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Login_Header from '@/src/components/layout/Login_Header';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Image from 'next/image';
import { setCookie } from '@/src/utils/cookies';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'learner' | 'expert'>('learner');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email || !password) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }
        
        console.log('🔐 Đăng nhập với:', email);
        
        // LƯU VÀO COOKIE (1 ngày)
        setCookie('isLoggedIn', 'true', 1);
        setCookie('userEmail', email, 1);
        
        console.log('✅ Đã lưu cookie');
        
        setError('');
        
        // REDIRECT VỀ TRANG CHỦ
        router.push('/home');
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Login_Header />
            <div className="flex flex-1 w-full">
                
                {/* Left Section */}
                <div className="hidden lg:flex lg:w-1/2 bg-white flex-col justify-center items-start pl-20 pr-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4 italic">Lavender Teeducation</h2>
                    <p className="text-2xl text-gray-700 mb-8 leading-relaxed text-left">
                        Enhancing Critical Thinking and Diagnostic Skills through Realistic Simulated Scenarios !
                    </p>
                    <div className="w-full relative" style={{aspectRatio: '1/1', maxHeight: '500px'}}>
                        <Image 
                            src="/images/loginbg2.png" 
                            alt="Background ITS" 
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                            className="object-contain object-left" 
                            priority
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
                    <div className="w-full max-w-xl bg-white rounded-[10px] shadow-lg p-8 border border-gray-100">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-8">
                            <button
                                    onClick={() => setSelectedRole('learner')}
                                    className={`w-1/2 py-3 font-bold text-base rounded-[10px] transition-all ${selectedRole === 'learner'
                                        ? 'bg-linear-to-r from-[#235697] to-[#1BA7D9] text-white'
                                        : 'bg-gray-200 text-gray-400'
                                        }`}
                                    style={{ boxShadow: selectedRole === 'learner' ? 'inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)' : 'inset 0 2px 4px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.05)' }}
                                >
                                    Learner
                                </button>
                                <button
                                    onClick={() => setSelectedRole('expert')}
                                    className={`w-1/2 py-3 font-bold text-base rounded-[10px] transition-all ${selectedRole === 'expert'
                                        ? 'bg-linear-to-r from-[#235697] to-[#1BA7D9] text-white'
                                        : 'bg-gray-200 text-gray-400'
                                        }`}
                                    style={{ boxShadow: selectedRole === 'expert' ? 'inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)' : 'inset 0 2px 4px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.05)' }}
                                >
                                    Expert
                                </button>
                        </div>

                        {/* Form Title */}
                        <h1 className="text-3xl font-lato-heavy-i text-gray-800 mb-6">ĐĂNG NHẬP</h1>

                        {/* Error */}
                        {error && (
                            <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label className="block text-[#235697] font-semibold mb-2 text-md">
                                    Tên đăng nhập
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nguyentu@hcumut.edu.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#235697] bg-white placeholder-gray-400"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-[#235697] font-semibold mb-2 text-md">Mật khẩu</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="xinchaoLatee123*"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#235697] bg-white placeholder-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3.5 text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="w-5 h-5" />
                                        ) : (
                                            <EyeIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        id="remember"
                                        className="w-4 h-4 text-[#235697] border-gray-300 rounded focus:ring-[#235697] focus:ring-2"
                                    />
                                    <label htmlFor="remember" className="text-gray-700 text-sm cursor-pointer">
                                        Ghi nhớ đăng nhập
                                    </label>
                                </div>
                                <a href="#" className="text-[#235697] text-sm underline hover:text-blue-800 transition-colors">
                                    Quên mật khẩu?
                                </a>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                className="w-full bg-linear-to-r from-[#235697] to-[#1BA7D9] text-white font-bold py-3 rounded-lg hover:shadow-lg transition duration-200"
                            >
                                ĐĂNG NHẬP
                            </button>
                        </form>

                        {/* Sign up */}
                        <div className="text-center mt-6">
                            <span className="text-gray-600 text-sm">
                                Chưa có tài khoản?{' '}
                                <a href="#" className="text-[#235697] font-bold hover:underline">
                                    Đăng ký ngay!
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}