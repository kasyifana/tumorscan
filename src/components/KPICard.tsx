import { ReactNode } from 'react';

interface KPICardProps {
    title: string;
    value: number | string;
    icon?: ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    bgColor?: string;
}

export default function KPICard({ title, value, icon, trend, bgColor = 'bg-white' }: KPICardProps) {
    return (
        <div className={`${bgColor} rounded-xl p-6 shadow-sm border border-gray-100`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="p-3 rounded-lg bg-gray-50">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}
