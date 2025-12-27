'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    MdDashboard,
    MdPeople,
    MdFolder,
    MdArchive,
    MdRateReview,
    MdScience
} from 'react-icons/md';

const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: MdDashboard },
    { name: 'Patient', href: '/patients', icon: MdPeople },
    { name: 'Case', href: '/cases', icon: MdFolder },
    { name: 'Archive', href: '/archive', icon: MdArchive },
    { name: 'Review', href: '/review', icon: MdRateReview },
    { name: 'MRI', href: '/mri/upload', icon: MdScience },
];

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(href);
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-56 bg-dark flex flex-col z-50">
            {/* Logo */}
            <div className="p-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-dark font-bold text-sm">T</span>
                </div>
                <span className="text-white font-semibold text-lg">TumorScan</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4">
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
    );
}
