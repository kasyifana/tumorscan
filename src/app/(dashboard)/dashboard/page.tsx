'use client';

import { useEffect, useState } from 'react';
import { MdTrendingUp, MdScience, MdPending, MdCheckCircle } from 'react-icons/md';
import KPICard from '@/components/KPICard';
import StatusBadge from '@/components/StatusBadge';
import { getDashboardStats, supabase } from '@/lib/supabase';
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

interface RecentScan {
    case_id: string;
    mri_date: string;
    mri_type: string;
    status: string;
    patients: {
        name: string;
        patient_id: string;
    };
    scan_results: Array<{
        tumor_type: string;
        confidence: number;
    }>;
}

const analyticsData = {
    caseCompletionRate: [
        { month: 'Jan', rate: 92 },
        { month: 'Feb', rate: 88 },
        { month: 'Mar', rate: 95 },
        { month: 'Apr', rate: 91 },
        { month: 'May', rate: 96 },
        { month: 'Jun', rate: 94 },
    ],
    caseStatusDistribution: [
        { name: 'Completed', value: 45 },
        { name: 'Processing', value: 12 },
        { name: 'Pending', value: 8 },
    ],
};

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalCases: 0,
        pendingAnalysis: 0,
        completedReports: 0,
        detectedTumor: 0
    });
    const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                // Load dashboard stats
                const dashboardStats = await getDashboardStats();
                setStats(dashboardStats);

                // Load recent scans
                const { data: scans } = await supabase
                    .from('cases')
                    .select(`
                        case_id,
                        mri_date,
                        mri_type,
                        status,
                        patients (name, patient_id),
                        scan_results (tumor_type, confidence)
                    `)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (scans) {
                    setRecentScans(scans as unknown as RecentScan[]);
                }
            } catch (error) {
                console.error('Error loading dashboard:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const getTumorTypeColor = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'glioma': return 'text-red-600';
            case 'meningioma': return 'text-orange-600';
            case 'pituitary': return 'text-purple-600';
            default: return 'text-green-600';
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Overview</h1>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <KPICard
                    title="Total Cases"
                    value={loading ? '...' : stats.totalCases}
                    icon={<MdTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />}
                />
                <KPICard
                    title="Detected Tumor"
                    value={loading ? '...' : stats.detectedTumor}
                    icon={<MdScience className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />}
                />
                <KPICard
                    title="Pending"
                    value={loading ? '...' : stats.pendingAnalysis}
                    icon={<MdPending className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />}
                />
                <KPICard
                    title="Completed"
                    value={loading ? '...' : stats.completedReports}
                    icon={<MdCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />}
                />
            </div>

            {/* Recent Patient Scans Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Patient Scans</h2>
                    <p className="text-xs sm:text-sm text-gray-500">View and analyze the latest MRI cases</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Case ID</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Patient Name</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">MRI Type</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tumor Type</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading...</td>
                                </tr>
                            ) : recentScans.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No cases yet. Start by adding a patient and case.</td>
                                </tr>
                            ) : (
                                recentScans.map((scan) => (
                                    <tr key={scan.case_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">{scan.case_id}</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">{scan.patients?.name || '-'}</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">{scan.mri_type}</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <span className={`text-xs sm:text-sm font-medium ${getTumorTypeColor(scan.scan_results?.[0]?.tumor_type)}`}>
                                                {scan.scan_results?.[0]?.tumor_type || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <StatusBadge status={scan.status} />
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">
                                            {scan.mri_date ? new Date(scan.mri_date).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Analytics Summary */}
            <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Analytics Summary</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <div className="mb-3 sm:mb-4">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Case Completion Rate</h3>
                            <p className="text-xl sm:text-2xl font-bold text-primary">
                                {stats.totalCases > 0 ? Math.round((stats.completedReports / stats.totalCases) * 100) : 0}%
                            </p>
                        </div>
                        <div className="h-40 sm:h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analyticsData.caseCompletionRate}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" domain={[80, 100]} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="rate" stroke="#E5C100" strokeWidth={2} dot={{ fill: '#E5C100' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <div className="mb-3 sm:mb-4">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Case Status Distribution</h3>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalCases}</p>
                            <p className="text-xs sm:text-sm text-gray-500">Total Cases</p>
                        </div>
                        <div className="h-40 sm:h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'Completed', value: stats.completedReports },
                                    { name: 'Pending', value: stats.pendingAnalysis },
                                    { name: 'Tumor', value: stats.detectedTumor }
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
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
