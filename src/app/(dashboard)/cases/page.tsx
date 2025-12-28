'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdSearch, MdAdd, MdFilterList } from 'react-icons/md';
import StatusBadge from '@/components/StatusBadge';
import { getCases, supabase } from '@/lib/supabase';

interface CaseWithPatient {
    id: string;
    case_id: string;
    patient_id: string;
    mri_date: string;
    study_date: string;
    mri_type: string;
    status: 'Pending' | 'Processing' | 'Completed';
    patients: {
        name: string;
    };
}

export default function CasesPage() {
    const [cases, setCases] = useState<CaseWithPatient[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        async function loadCases() {
            try {
                const data = await getCases();
                setCases(data as unknown as CaseWithPatient[]);
            } catch (error) {
                console.error('Error loading cases:', error);
            } finally {
                setLoading(false);
            }
        }
        loadCases();
    }, []);

    const filteredCases = cases.filter((caseItem) => {
        const matchesSearch =
            caseItem.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            caseItem.patients?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Case List</h1>
                <Link
                    href="/cases/add"
                    className="inline-flex items-center justify-center gap-2 bg-primary text-dark font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm"
                >
                    <MdAdd className="w-5 h-5" />
                    Add Case
                </Link>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Case ID or Patient Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                </div>
                <div className="relative">
                    <MdFilterList className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white text-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Cases Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Case ID</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">MRI Type</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">MRI Date</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading...</td>
                                </tr>
                            ) : filteredCases.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        {searchTerm || statusFilter !== 'all'
                                            ? 'No cases found matching your search.'
                                            : 'No cases yet. Add a patient first, then create a case.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredCases.map((caseItem) => (
                                    <tr key={caseItem.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">{caseItem.case_id}</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">{caseItem.patients?.name || '-'}</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">{caseItem.mri_type}</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">
                                            {caseItem.mri_date ? new Date(caseItem.mri_date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <StatusBadge status={caseItem.status} />
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            {caseItem.status === 'Completed' ? (
                                                <Link
                                                    href={`/reports/${caseItem.case_id}`}
                                                    className="text-xs sm:text-sm text-primary hover:text-primary-dark font-medium"
                                                >
                                                    View Report
                                                </Link>
                                            ) : caseItem.status === 'Pending' ? (
                                                <Link
                                                    href={`/mri/upload?caseId=${caseItem.case_id}&patientId=${caseItem.patient_id}`}
                                                    className="text-xs sm:text-sm text-primary hover:text-primary-dark font-medium"
                                                >
                                                    Upload MRI
                                                </Link>
                                            ) : (
                                                <span className="text-xs sm:text-sm text-gray-400">Processing...</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
