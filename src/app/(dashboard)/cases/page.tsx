'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdSearch, MdFilterList, MdAdd } from 'react-icons/md';
import StatusBadge from '@/components/StatusBadge';
import { cases } from '@/data/mockData';

export default function CasesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredCases = cases.filter((c) => {
        const matchesSearch =
            c.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.patientName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Case Management</h1>
                    <p className="text-gray-500">Track and manage all MRI analysis cases</p>
                </div>
                <Link
                    href="/cases/add"
                    className="flex items-center gap-2 bg-primary text-dark font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors"
                >
                    <MdAdd className="w-5 h-5" />
                    Add Case
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Case ID, Patient ID, exam date, or other criteria"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <MdFilterList className="w-5 h-5 text-gray-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Cases Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Case ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Patient ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Examination Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    MRI Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Event Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Confidence
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCases.map((caseItem) => (
                                <tr key={caseItem.caseId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {caseItem.caseId}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{caseItem.patientId}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{caseItem.examinationDate}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{caseItem.mriType}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{caseItem.eventType}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{caseItem.confidence}%</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={caseItem.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {caseItem.status === 'Completed' ? (
                                                <Link
                                                    href={`/reports/${caseItem.patientId}`}
                                                    className="px-3 py-1.5 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                                                >
                                                    View Report
                                                </Link>
                                            ) : (
                                                <Link
                                                    href="/mri/processing"
                                                    className="px-3 py-1.5 text-xs font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600 transition-colors"
                                                >
                                                    View Progress
                                                </Link>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
