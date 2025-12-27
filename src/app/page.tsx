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
        <div className="min-h-screen flex">
            {/* Left Panel - Dark with Branding */}
            <div className="w-1/2 bg-dark flex flex-col justify-center px-16 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 left-10 w-64 h-64 rounded-full border border-white"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full border border-white"></div>
                </div>

                {/* Logo */}
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-dark font-bold">T</span>
                    </div>
                    <span className="text-white font-semibold text-xl">TumorScan</span>
                </div>

                {/* Heading */}
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                        Precision Diagnostics.<br />
                        Secure Access.
                    </h1>
                    <p className="text-gray-400 text-lg max-w-md">
                        AI-Powered Brain MRI Analysis Platform.<br />
                        Classification Results. Personalized before you at all<br />
                        times.
                    </p>
                </div>

                {/* Footer Links */}
                <div className="absolute bottom-8 left-16 flex gap-6 text-sm text-gray-500">
                    <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-400 transition-colors">Help Center</a>
                </div>
            </div>

            {/* Right Panel - White with Form */}
            <div className="w-1/2 bg-white flex flex-col justify-center px-16">
                <div className="max-w-md mx-auto w-full">
                    {/* Form Header */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Clinical Decision<br />Support System
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Secure access for medical professionals
                    </p>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email/Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                HOSPITAL OR USERNAME
                            </label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="e.g., dr.smith"
                            />
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Select your role
                            </label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole('radiologist')}
                                    className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all ${role === 'radiologist'
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    Radiologist
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('superintendent')}
                                    className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all ${role === 'superintendent'
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
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pr-10"
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
                            className="w-full bg-primary text-dark font-semibold py-3.5 rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            Login
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-3 py-3.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <FcGoogle className="w-5 h-5" />
                            <span className="text-gray-700 font-medium">Sign in with Google</span>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 flex items-center justify-center gap-4 text-sm">
                        <a href="#" className="text-gray-500 hover:text-gray-700">
                            ✓ HIPAA Compliant
                        </a>
                        <span className="text-gray-300">|</span>
                        <a href="#" className="text-gray-500 hover:text-gray-700">
                            ✕ No AI-Generated Diagnoses
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
