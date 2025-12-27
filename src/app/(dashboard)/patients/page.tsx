'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdSearch, MdAdd, MdFilterList } from 'react-icons/md';
import StatusBadge from '@/components/StatusBadge';
import { patients } from '@/data/mockData';

export default function PatientsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredPatients = patients.filter((patient) => {
        const matchesSearch =
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Patient List</h1>
                    <p className="text-sm text-gray-500">Manage and view all registered patients</p>
                </div>
                <Link
                    href="/patients/add"
                    className="flex items-center justify-center gap-2 bg-primary text-dark font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-primary-dark transition-colors text-sm sm:text-base"
                >
                    <MdAdd className="w-5 h-5" />
                    Add Patient
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    <div className="flex-1 relative">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by patient ID, name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <MdFilterList className="w-5 h-5 text-gray-500 hidden sm:block" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Under Review">Under Review</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Patients Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Patient ID
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Age
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Gender
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Diagnosis
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Last Date
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                                        {patient.id}
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">{patient.name}</td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">{patient.age}</td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">{patient.gender}</td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <span className={`text-xs sm:text-sm font-medium ${patient.diagnosis === 'Glioma' ? 'text-red-600' :
                                            patient.diagnosis === 'Meningioma' ? 'text-orange-600' :
                                                patient.diagnosis === 'Pituitary' ? 'text-purple-600' :
                                                    'text-green-600'
                                            }`}>
                                            {patient.diagnosis || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">{patient.lastMRIDate}</td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <StatusBadge status={patient.status} />
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/patients/${patient.id}`}
                                                className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={`/cases/add?patientId=${patient.id}`}
                                                className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
                                            >
                                                Add Case
                                            </Link>
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
