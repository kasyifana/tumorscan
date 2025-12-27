'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';

export default function AddPatientPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        patientId: '',
        medicalRecordNumber: '',
        fullName: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        weight: '',
        height: '',
        clinicalSymptoms: '',
        priorMedicalHistory: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock save - just redirect
        alert('Patient saved successfully (mock)');
        router.push('/patients');
    };

    return (
        <div className="max-w-3xl mx-auto px-0 sm:px-4">
            {/* Back Button */}
            <Link
                href="/patients"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 text-sm"
            >
                <MdArrowBack className="w-5 h-5" />
                Back to Patients
            </Link>

            {/* Page Header */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add New Patient</h1>
                <p className="text-sm text-gray-500">Register a new patient in the system</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {/* Patient ID */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Patient ID
                        </label>
                        <input
                            type="text"
                            name="patientId"
                            value={formData.patientId}
                            onChange={handleChange}
                            placeholder="e.g., PT-022"
                            className="input-field text-sm"
                        />
                    </div>

                    {/* Medical Record Number */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Medical Record Number
                        </label>
                        <input
                            type="text"
                            name="medicalRecordNumber"
                            value={formData.medicalRecordNumber}
                            onChange={handleChange}
                            placeholder="e.g., MRN-2024-022"
                            className="input-field text-sm"
                        />
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Patient Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            className="input-field text-sm"
                        />
                    </div>

                    {/* Date of Birth & Gender Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="input-field text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="input-field text-sm"
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter address"
                            className="input-field text-sm"
                        />
                    </div>

                    {/* Weight & Height Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                Weight (kg)
                            </label>
                            <input
                                type="text"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                placeholder="e.g., 70"
                                className="input-field text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                Height (cm)
                            </label>
                            <input
                                type="text"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                placeholder="e.g., 170"
                                className="input-field text-sm"
                            />
                        </div>
                    </div>

                    {/* Clinical Symptoms */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Clinical Symptoms
                        </label>
                        <textarea
                            name="clinicalSymptoms"
                            value={formData.clinicalSymptoms}
                            onChange={handleChange}
                            placeholder="Describe symptoms..."
                            rows={3}
                            className="input-field resize-none text-sm"
                        />
                    </div>

                    {/* Prior Medical History */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Prior Medical History
                        </label>
                        <textarea
                            name="priorMedicalHistory"
                            value={formData.priorMedicalHistory}
                            onChange={handleChange}
                            placeholder="Prior conditions & relevant history..."
                            rows={3}
                            className="input-field resize-none text-sm"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="w-full sm:w-auto bg-primary text-dark font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-primary-dark transition-colors text-sm sm:text-base"
                    >
                        Save Patient
                    </button>
                </div>
            </form>
        </div>
    );
}
