'use client';

import { MdTrendingUp, MdScience, MdPending, MdCheckCircle } from 'react-icons/md';
import KPICard from '@/components/KPICard';
import StatusBadge from '@/components/StatusBadge';
import { dashboardKPIs, recentScans, analyticsData } from '@/data/mockData';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Total Cases"
                    value={dashboardKPIs.totalCases}
                    icon={<MdTrendingUp className="w-6 h-6 text-blue-500" />}
                />
                <KPICard
                    title="Detected Tumor"
                    value={dashboardKPIs.detectedTumor}
                    icon={<MdScience className="w-6 h-6 text-red-500" />}
                />
                <KPICard
                    title="Pending"
                    value={dashboardKPIs.pendingAnalysis}
                    icon={<MdPending className="w-6 h-6 text-yellow-500" />}
                />
                <KPICard
                    title="Completed"
                    value={dashboardKPIs.completedReports}
                    icon={<MdCheckCircle className="w-6 h-6 text-green-500" />}
                />
            </div>

            {/* Recent Patient Scans Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Patient Scans</h2>
                    <p className="text-sm text-gray-500">View and analyze the latest MRI cases on scan</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Case ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Patient Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    MRI Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Tumor Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Confidence
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentScans.map((scan) => (
                                <tr key={scan.caseId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {scan.caseId}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{scan.patientName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{scan.mriType}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm font-medium ${scan.tumorType === 'Glioma' ? 'text-red-600' :
                                                scan.tumorType === 'Meningioma' ? 'text-orange-600' :
                                                    scan.tumorType === 'Pituitary' ? 'text-purple-600' :
                                                        'text-green-600'
                                            }`}>
                                            {scan.tumorType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{scan.confidence}%</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={scan.status} />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{scan.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Analytics Summary */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics Summary</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Case Completion Rate Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="mb-4">
                            <h3 className="font-semibold text-gray-900">Case Completion Rate</h3>
                            <p className="text-2xl font-bold text-primary">96.3%</p>
                            <p className="text-sm text-gray-500">Cases All Time Rate</p>
                        </div>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analyticsData.caseCompletionRate}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" domain={[80, 100]} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="rate"
                                        stroke="#E5C100"
                                        strokeWidth={2}
                                        dot={{ fill: '#E5C100', strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Case Status Distribution Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="mb-4">
                            <h3 className="font-semibold text-gray-900">Case Status Distribution</h3>
                            <p className="text-2xl font-bold text-gray-900">100%</p>
                            <p className="text-sm text-gray-500">Total Cases Processed</p>
                        </div>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analyticsData.caseStatusDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#E5C100" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
