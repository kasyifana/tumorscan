'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MdArrowBack, MdSearch } from 'react-icons/md';
import { patients } from '@/data/mockData';

export default function AddCasePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedPatientId = searchParams.get('patientId') || '';

    const [formData, setFormData] = useState({
        patientId: preselectedPatientId,
        medicalRecordNumber: '',
        caseId: '',
        mriDate: '',
        studyDate: '',
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const filteredPatients = patients.filter(
        (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePatientSelect = (patient: typeof patients[0]) => {
        setFormData((prev) => ({
            ...prev,
            patientId: patient.id,
            medicalRecordNumber: patient.medicalRecordNumber,
        }));
        setSearchTerm(patient.name);
        setShowDropdown(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock save - redirect to upload
        router.push('/mri/upload');
    };

    return (
        <div className="max-w-3xl mx-auto px-0 sm:px-4">
            {/* Back Button */}
            <Link
                href="/cases"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 text-sm"
            >
                <MdArrowBack className="w-5 h-5" />
                Back to Cases
            </Link>

            {/* Page Header */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add Case MRI Tumor</h1>
                <p className="text-sm text-gray-500">Create a new MRI case for analysis</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {/* Patient Search */}
                    <div className="relative">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Search Patient
                        </label>
                        <div className="relative">
                            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Patient ID or Name..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowDropdown(true);
                                }}
                                onFocus={() => setShowDropdown(true)}
                                className="input-field pl-10 text-sm"
                            />
                        </div>
                        {showDropdown && searchTerm && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((patient) => (
                                        <button
                                            key={patient.id}
                                            type="button"
                                            onClick={() => handlePatientSelect(patient)}
                                            className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                        >
                                            <p className="font-medium text-gray-900 text-sm">{patient.name}</p>
                                            <p className="text-xs text-gray-500">{patient.id}</p>
                                        </button>
                                    ))
                                ) : (
                                    <p className="px-4 py-3 text-gray-500 text-sm">No patients found</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Patient ID & MRN Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                Patient ID
                            </label>
                            <input
                                type="text"
                                name="patientId"
                                value={formData.patientId}
                                onChange={handleChange}
                                placeholder="Auto-filled from search"
                                className="input-field bg-gray-50 text-sm"
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                Medical Record Number
                            </label>
                            <input
                                type="text"
                                name="medicalRecordNumber"
                                value={formData.medicalRecordNumber}
                                onChange={handleChange}
                                placeholder="Auto-filled from search"
                                className="input-field bg-gray-50 text-sm"
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Case ID */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Case ID
                        </label>
                        <input
                            type="text"
                            name="caseId"
                            value={formData.caseId}
                            onChange={handleChange}
                            placeholder="e.g., CS-2024-039"
                            className="input-field text-sm"
                        />
                    </div>

                    {/* Date Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                MRI Date
                            </label>
                            <input
                                type="date"
                                name="mriDate"
                                value={formData.mriDate}
                                onChange={handleChange}
                                className="input-field text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                Study Date
                            </label>
                            <input
                                type="date"
                                name="studyDate"
                                value={formData.studyDate}
                                onChange={handleChange}
                                className="input-field text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="w-full sm:w-auto bg-primary text-dark font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-primary-dark transition-colors text-sm sm:text-base"
                    >
                        Add Case
                    </button>
                </div>
            </form>
        </div>
    );
}
