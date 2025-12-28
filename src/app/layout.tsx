import type { Metadata } from 'next';
import './globals.css';
import { MLProvider } from '@/context/MLContext';

export const metadata: Metadata = {
    title: 'TumorScan - Clinical Decision Support System',
    description: 'Brain tumor detection, segmentation, and classification from MRI images',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="antialiased">
                <MLProvider>{children}</MLProvider>
            </body>
        </html>
    );
}
