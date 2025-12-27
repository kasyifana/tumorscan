'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            {/* Main content area - responsive margin */}
            <div className="flex-1 lg:ml-64 w-full">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="p-4 sm:p-6">{children}</main>
            </div>
        </div>
    );
}
