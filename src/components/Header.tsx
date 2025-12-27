'use client';

import { MdNotifications, MdPerson, MdMenu } from 'react-icons/md';

interface HeaderProps {
    title?: string;
    onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
    return (
        <header className="h-14 sm:h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
            {/* Left Section - Menu Button & Title */}
            <div className="flex items-center gap-3">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <MdMenu className="w-6 h-6" />
                </button>
                {/* Page Title */}
                {title && <h1 className="text-base sm:text-lg font-semibold text-gray-800">{title}</h1>}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Notification Bell */}
                <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <MdNotifications className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                        <MdPerson className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                    </div>
                </div>
            </div>
        </header>
    );
}
