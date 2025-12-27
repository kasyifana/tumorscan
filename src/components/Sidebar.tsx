'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    MdDashboard,
    MdPeople,
    MdFolder,
    MdArchive,
    MdRateReview,
    MdScience,
    MdClose
} from 'react-icons/md';

const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: MdDashboard },
    { name: 'Patient', href: '/patients', icon: MdPeople },
    { name: 'Case', href: '/cases', icon: MdFolder },
    { name: 'Archive', href: '/archive', icon: MdArchive },
    { name: 'Review', href: '/review', icon: MdRateReview },
    { name: 'MRI', href: '/mri/upload', icon: MdScience },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(href);
    };

    // Close sidebar on route change (mobile)
    useEffect(() => {
        onClose();
    }, [pathname]);

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-screen w-64 bg-dark flex flex-col z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Logo & Close Button */}
                <div className="p-4 sm:p-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-dark font-bold text-sm">T</span>
                        </div>
                        <span className="text-white font-semibold text-lg">TumorScan</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <MdClose className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto">
                    <ul className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${active
                                                ? 'bg-primary text-dark font-medium'
                                                : 'text-gray-400 hover:bg-dark-lighter hover:text-white'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800">
                    <p className="text-gray-500 text-xs text-center">
                        TumorScan CDSS v1.0
                    </p>
                </div>
            </aside>
        </>
    );
}
