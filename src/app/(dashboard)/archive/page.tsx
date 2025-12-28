'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdSearch, MdFilterList, MdDownload, MdArchive } from 'react-icons/md';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/lib/supabase';

interface ArchiveRecord {
    id: string;
    case_id: string;
    patient_id: string;
    tumor_type: string;
    display_name: string;
    confidence: number;
    severity: string;
    created_at: string;
    patients: {
        name: string;
    };
    cases: {
        mri_date: string;
        mri_type: string;
    };
}

export default function ArchivePage() {
    const [records, setRecords] = useState<ArchiveRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    useEffect(() => {
        async function loadArchive() {
            try {
                const { data, error } = await supabase
                    .from('scan_results')
                    .select(`
                        *,
                        patients (name),
                        cases (mri_date, mri_type)
                    `)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setRecords(data as unknown as ArchiveRecord[]);
            } catch (error) {
                console.error('Error loading archive:', error);
            } finally {
                setLoading(false);
            }
        }
        loadArchive();
    }, []);

    const filteredRecords = records.filter((record) => {
        const matchesSearch =
            record.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.patients?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || record.tumor_type === typeFilter;
        return matchesSearch && matchesType;
    });

    const handleExportCSV = () => {
        const csvContent = [
            ['Case ID', 'Patient', 'Tumor Type', 'Confidence', 'Severity', 'MRI Date'].join(','),
            ...filteredRecords.map(r => [
                r.case_id,
                r.patients?.name || '',
                r.display_name,
                r.confidence.toFixed(1) + '%',
                r.severity,
                r.cases?.mri_date || ''
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tumorscan-archive-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Archive</h1>
                    <p className="text-sm text-gray-500">Historical MRI analysis results</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button
                        onClick={handleExportCSV}
                        className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                        <MdDownload className="w-5 h-5" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-500">Total Records</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{records.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-500">Glioma</p>
                    <p className="text-xl sm:text-2xl font-bold text-red-600">
                        {records.filter(r => r.tumor_type === 'glioma').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-500">Meningioma</p>
                    <p className="text-xl sm:text-2xl font-bold text-orange-600">
                        {records.filter(r => r.tumor_type === 'meningioma').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-500">No Tumor</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-600">
                        {records.filter(r => r.tumor_type === 'notumor').length}
                    </p>
                </div>
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
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white text-sm"
                    >
                        <option value="all">All Types</option>
                        <option value="glioma">Glioma</option>
                        <option value="meningioma">Meningioma</option>
                        <option value="pituitary">Pituitary</option>
                        <option value="notumor">No Tumor</option>
                    </select>
                </div>
            </div>

            {/* Archive Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Case ID</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tumor Type</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Confidence</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Severity</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading...</td>
                                </tr>
                            ) : filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        {searchTerm || typeFilter !== 'all'
                                            ? 'No records found matching your search.'
                                            : 'No archived records yet. Complete an MRI analysis to see results here.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">{record.case_id}</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">{record.patients?.name || '-'}</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <span className={`text-xs sm:text-sm font-medium ${record.tumor_type === 'glioma' ? 'text-red-600' :
                                                    record.tumor_type === 'meningioma' ? 'text-orange-600' :
                                                        record.tumor_type === 'pituitary' ? 'text-purple-600' :
                                                            'text-green-600'
                                                }`}>
                                                {record.display_name}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-primary font-medium">
                                            {record.confidence.toFixed(1)}%
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <StatusBadge status={record.severity} />
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">
                                            {new Date(record.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <Link
                                                href={`/reports/${record.case_id}`}
                                                className="text-xs sm:text-sm text-primary hover:text-primary-dark font-medium"
                                            >
                                                View Report
                                            </Link>
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
