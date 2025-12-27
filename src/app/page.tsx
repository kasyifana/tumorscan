'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('radiologist');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock login - redirect to dashboard
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Panel - Dark with Branding */}
            <div className="w-full lg:w-1/2 bg-dark flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-10 lg:py-0 relative overflow-hidden min-h-[40vh] lg:min-h-screen">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 left-10 w-48 sm:w-64 h-48 sm:h-64 rounded-full border border-white"></div>
                    <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 rounded-full border border-white"></div>
                </div>

                {/* Logo */}
                <div className="flex items-center gap-3 mb-8 lg:mb-12">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-dark font-bold text-sm sm:text-base">T</span>
                    </div>
                    <span className="text-white font-semibold text-lg sm:text-xl">TumorScan</span>
                </div>

                {/* Heading */}
                <div className="relative z-10">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                        Precision Diagnostics.<br />
                        Secure Access.
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-md">
                        AI-Powered Brain MRI Analysis Platform.<br className="hidden sm:block" />
                        Classification Results. Personalized before you at all<br className="hidden sm:block" />
                        times.
                    </p>
                </div>

                {/* Footer Links - Hidden on mobile */}
                <div className="hidden lg:flex absolute bottom-8 left-16 gap-6 text-sm text-gray-500">
                    <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-400 transition-colors">Help Center</a>
                </div>
            </div>

            {/* Right Panel - White with Form */}
            <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-8 lg:py-0">
                <div className="max-w-md mx-auto w-full">
                    {/* Form Header */}
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        Clinical Decision<br />Support System
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8">
                        Secure access for medical professionals
                    </p>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
                        {/* Email/Username */}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                HOSPITAL OR USERNAME
                            </label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field text-sm sm:text-base"
                                placeholder="e.g., dr.smith"
                            />
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                Select your role
                            </label>
                            <div className="flex gap-2 sm:gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole('radiologist')}
                                    className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border text-xs sm:text-sm font-medium transition-all ${role === 'radiologist'
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    Radiologist
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('superintendent')}
                                    className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border text-xs sm:text-sm font-medium transition-all ${role === 'superintendent'
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    Superintendent
                                </button>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pr-10 text-sm sm:text-base"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <MdVisibilityOff className="w-5 h-5" /> : <MdVisibility className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full bg-primary text-dark font-semibold py-3 sm:py-3.5 rounded-lg hover:bg-primary-dark transition-colors text-sm sm:text-base"
                        >
                            Login
                        </button>

                        {/* Divider */}
                        <div className="relative my-4 sm:my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-3 py-3 sm:py-3.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <FcGoogle className="w-5 h-5" />
                            <span className="text-gray-700 font-medium text-sm sm:text-base">Sign in with Google</span>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <a href="#" className="text-gray-500 hover:text-gray-700">
                            ✓ HIPAA Compliant
                        </a>
                        <span className="text-gray-300 hidden sm:inline">|</span>
                        <a href="#" className="text-gray-500 hover:text-gray-700">
                            ✕ No AI-Generated Diagnoses
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
