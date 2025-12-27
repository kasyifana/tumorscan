'use client';

import { MdNotifications, MdPerson } from 'react-icons/md';

interface HeaderProps {
    title?: string;
}

export default function Header({ title }: HeaderProps) {
    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40">
            {/* Page Title */}
            <div>
                {title && <h1 className="text-lg font-semibold text-gray-800">{title}</h1>}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <MdNotifications className="w-6 h-6" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                        <MdPerson className="w-6 h-6 text-orange-500" />
                    </div>
                </div>
            </div>
        </header>
    );
}
