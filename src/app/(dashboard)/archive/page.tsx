'use client';

import { useState } from 'react';
import { MdSearch, MdFilterList, MdCloudDownload } from 'react-icons/md';
import { archiveRecords } from '@/data/mockData';

export default function ArchivePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [tumorType, setTumorType] = useState('all');

    const filteredRecords = archiveRecords.filter((record) => {
        const matchesSearch =
            record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTumorType = tumorType === 'all' || record.tumorType === tumorType;
        return matchesSearch && matchesTumorType;
    });

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Archive Management</h1>
                    <p className="text-sm text-gray-500">
                        Historical data storage for completed MRI cases
                    </p>
                </div>
                <div className="flex gap-2 sm:gap-3">
                    <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm">
                        <MdCloudDownload className="w-5 h-5" />
                        <span className="hidden sm:inline">Export</span> CSV
                    </button>
                    <button className="px-3 sm:px-4 py-2 bg-primary text-dark font-medium rounded-lg hover:bg-primary-dark transition-colors text-sm">
                        Create Archive
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
                <div className="flex flex-col gap-3">
                    {/* Search Row */}
                    <div className="flex-1 relative">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Patient ID, Name, or Case ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        />
                    </div>
                    {/* Filters Row */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 flex-1">
                            <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Date Range</span>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="flex-1 px-2 sm:px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="flex-1 px-2 sm:px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={tumorType}
                                onChange={(e) => setTumorType(e.target.value)}
                                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            >
                                <option value="all">Tumor Type: Any</option>
                                <option value="Glioma">Glioma</option>
                                <option value="Meningioma">Meningioma</option>
                                <option value="Pituitary">Pituitary</option>
                                <option value="No Tumor">No Tumor</option>
                            </select>
                            <button className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-900 text-sm">
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Archive Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Report ID
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Report Date
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Patient Name
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Tumor Type
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    File Status
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRecords.map((record) => (
                                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <input type="checkbox" className="rounded border-gray-300" />
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                                        {record.id}
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">{record.reportDate}</td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">{record.patientName}</td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <span className={`text-xs sm:text-sm font-medium ${record.tumorType === 'Glioma' ? 'text-red-600' :
                                            record.tumorType === 'Meningioma' ? 'text-orange-600' :
                                                record.tumorType === 'Pituitary' ? 'text-purple-600' :
                                                    'text-green-600'
                                            }`}>
                                            {record.tumorType}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                                            {record.fileStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                                            <button className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800">
                                                View PDF
                                            </button>
                                            <button className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800">
                                                Export
                                            </button>
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
