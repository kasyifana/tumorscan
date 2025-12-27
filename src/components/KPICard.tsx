interface KPICardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
}

export default function KPICard({ title, value, icon }: KPICardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">{title}</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                    {icon}
                </div>
            </div>
        </div>
    );
}
