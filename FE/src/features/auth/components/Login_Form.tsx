'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { setCookie } from '@/src/utils/cookies';
import { loginApi } from '@/src/services/auth-service';
//import { saveAuth } from '@/src/utils/auth-storage';

export const LoginForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'learner' | 'expert'>('learner');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill in all required fields');
            return;
        }

        /*
         * Solve authentication here 
         */
        try {
            const data = await loginApi(email, password);

            // optional: check role
            // if (data.role.toLowerCase() !== selectedRole) {
            //     setError('You have selected the wrong role. Please choose the correct role and try again.');
            //     return;
            // }

            const accessDays = 1;
            const refreshDays = rememberMe ? 30 : 1;

            setCookie('isLoggedIn', 'true', { days: refreshDays });
            setCookie('accessToken', data.accessToken, { days: accessDays });
            setCookie('accessTokenExpiresAt', data.accessTokenExpiresAt, { days: accessDays });
            setCookie('refreshToken', data.refreshToken, { days: refreshDays });
            setCookie('refreshTokenExpiresAt', data.refreshTokenExpiresAt, { days: refreshDays });
            setCookie('userEmail', email, { days: refreshDays });
            setCookie('userId', data.userId, { days: refreshDays });
            setCookie('username', data.username, { days: refreshDays });
            setCookie('role', data.role, { days: refreshDays });
            setCookie('isRemembered', rememberMe ? 'true' : 'false', { days: refreshDays });

            setError('');
            if(data.role.toLowerCase() === 'expert') {
                router.push('/expert')
            }
            router.push('/home');

        } catch (err) {
            setError('Wrong email or password');
        }
    };

    return (
        <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
            <div className="w-full max-w-xl bg-white rounded-[10px] shadow-lg p-8 border border-gray-100">
                {/* Tabs Role Selection */}
                <div className="flex gap-2 mb-8">
                    {(['learner', 'expert'] as const).map((role) => (
                        <button
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            className={`w-1/2 py-3 font-bold text-base rounded-[10px] transition-all capitalize ${selectedRole === role
                                ? 'bg-linear-to-r from-[#235697] to-[#1BA7D9] text-white'
                                : 'bg-gray-200 text-gray-400'
                                }`}
                            style={{
                                boxShadow: selectedRole === role
                                    ? 'inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)'
                                    : 'inset 0 2px 4px rgba(0,0,0,0.05)'
                            }}
                        >
                            {role}
                        </button>
                    ))}
                </div>

                <h1 className="text-3xl font-lato-heavy-i text-gray-800 mb-6">LOGIN</h1>

                {error && (
                    <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <label className="block text-[#235697] font-semibold mb-2 text-md">User Name</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nguyentu@hcumut.edu.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#235697] bg-white placeholder-gray-400"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-[#235697] font-semibold mb-2 text-md">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Fill your password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#235697] bg-white placeholder-gray-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-gray-600"
                            >
                                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Checkbox & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-[#235697] border-gray-300 rounded focus:ring-[#235697]"
                            />
                            <label htmlFor="remember" className="text-gray-700 text-sm cursor-pointer">Remember me</label>
                        </div>
                        <a href="#" className="text-[#235697] text-sm underline hover:text-blue-800 transition-colors">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-linear-to-r from-[#235697] to-[#1BA7D9] text-white font-bold py-3 rounded-lg hover:shadow-lg transition duration-200"
                    >
                        LOGIN
                    </button>
                </form>

                {/* <div className="text-center mt-6">
                    <span className="text-gray-600 text-sm">
                        Dont have an account? <a href="#" className="text-[#235697] font-bold hover:underline">Register now!</a>
                    </span>
                </div> */}
            </div>
        </div>
    );
};