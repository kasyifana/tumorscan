'use client';

import { useState } from 'react';
import { MdFilterList, MdCheck, MdClose, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { reviewQueue } from '@/data/mockData';

export default function ReviewPage() {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredItems = reviewQueue.filter((item) => {
        const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesPriority && matchesStatus;
    });

    const pendingCount = reviewQueue.filter((r) => r.status === 'Pending').length;
    const approvedCount = reviewQueue.filter((r) => r.status === 'Approved').length;

    const handleApprove = (caseId: string) => {
        alert(`Case ${caseId} approved (mock)`);
    };

    const handleReject = (caseId: string) => {
        alert(`Case ${caseId} rejected (mock)`);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Urgent': return 'bg-red-100 text-red-700';
            case 'High': return 'bg-orange-100 text-orange-700';
            case 'Normal': return 'bg-blue-100 text-blue-700';
            case 'Low': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'In Review': return 'bg-blue-100 text-blue-700';
            case 'Approved': return 'bg-green-100 text-green-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 sm:gap-0">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Approval Queue</h1>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Review and approve AI-generated findings for pending MRI cases.
                    </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                    <span className="text-gray-600">
                        <span className="font-medium">{pendingCount} pending</span>
                    </span>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                    <span className="text-gray-600">Reviewed:</span>
                    <span className="font-semibold">{approvedCount}/{reviewQueue.length}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-gray-600">Pass Score:</span>
                    <span className="font-semibold text-green-600">+92%</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-gray-600">Avg. Confidence:</span>
                    <span className="font-semibold">90.3%</span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                    <MdFilterList className="w-5 h-5 text-gray-500" />
                    <span className="text-xs sm:text-sm text-gray-600">Filter:</span>
                </div>
                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="all">Priority: All</option>
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="all">Status: All</option>
                    <option value="Pending">Pending</option>
                    <option value="In Review">In Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            {/* Review Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    AI
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Case ID
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Patient
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Priority
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Confidence
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredItems.map((item) => (
                                <>
                                    <tr key={item.caseId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <button
                                                onClick={() => setExpandedRow(expandedRow === item.caseId ? null : item.caseId)}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                {expandedRow === item.caseId ? (
                                                    <MdExpandLess className="w-5 h-5 text-gray-500" />
                                                ) : (
                                                    <MdExpandMore className="w-5 h-5 text-gray-500" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                                            {item.caseId}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">{item.submissionDate}</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">{item.patientName}</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(item.priority)}`}>
                                                {item.priority}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">{item.confidence}%</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            {item.status === 'Pending' || item.status === 'In Review' ? (
                                                <div className="flex items-center gap-1 sm:gap-2">
                                                    <button
                                                        onClick={() => handleApprove(item.caseId)}
                                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                        title="Approve"
                                                    >
                                                        <MdCheck className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(item.caseId)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                        title="Reject"
                                                    >
                                                        <MdClose className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs sm:text-sm text-gray-400">
                                                    {item.status === 'Approved' ? '✓ Approved' : '✕ Rejected'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                    {/* Expanded Details Row */}
                                    {expandedRow === item.caseId && (
                                        <tr className="bg-gray-50">
                                            <td colSpan={8} className="px-4 sm:px-6 py-3 sm:py-4">
                                                <div className="pl-8 sm:pl-12 space-y-2">
                                                    <p className="text-xs sm:text-sm">
                                                        <span className="font-medium text-gray-700">Notes:</span>{' '}
                                                        <span className="text-gray-600">{item.notes}</span>
                                                    </p>
                                                    {item.reviewer && (
                                                        <p className="text-xs sm:text-sm">
                                                            <span className="font-medium text-gray-700">Reviewer:</span>{' '}
                                                            <span className="text-gray-600">{item.reviewer}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="text-center text-xs sm:text-sm text-gray-500 py-2 sm:py-4">
                Draft in Review/Draft
            </div>
        </div>
    );
}
