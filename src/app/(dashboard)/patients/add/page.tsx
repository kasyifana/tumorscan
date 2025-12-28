'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';
import { createPatient } from '@/lib/supabase';

export default function AddPatientPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        patientId: '',
        medicalRecordNumber: '',
        name: '',
        dateOfBirth: '',
        age: '',
        gender: '',
        phone: '',
        email: '',
        address: '',
        weight: '',
        height: '',
        diagnosis: '',
        clinicalSymptoms: '',
        medicalHistory: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Auto-calculate age from DOB
        if (name === 'dateOfBirth' && value) {
            const dob = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            setFormData((prev) => ({ ...prev, age: age.toString() }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createPatient({
                patient_id: formData.patientId,
                medical_record_number: formData.medicalRecordNumber,
                name: formData.name,
                date_of_birth: formData.dateOfBirth,
                age: parseInt(formData.age) || 0,
                gender: formData.gender as 'Male' | 'Female',
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                weight: formData.weight ? parseFloat(formData.weight) : undefined,
                height: formData.height ? parseFloat(formData.height) : undefined,
                diagnosis: formData.diagnosis,
                status: 'Active',
                clinical_symptoms: formData.clinicalSymptoms,
                medical_history: formData.medicalHistory,
            });

            router.push('/patients');
        } catch (err) {
            console.error('Error creating patient:', err);
            setError('Failed to create patient. Please check if Patient ID is unique.');
        } finally {
            setLoading(false);
        }
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
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add Patient Data</h1>
                <p className="text-sm text-gray-500">Enter patient information for a new record</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Patient Information</h2>

                    {/* ID Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                Patient ID *
                            </label>
                            <input
                                type="text"
                                name="patientId"
                                value={formData.patientId}
                                onChange={handleChange}
                                placeholder="e.g., PT-004"
                                className="input-field text-sm"
                                required
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
                                placeholder="Auto-generated or custom"
                                className="input-field text-sm"
                            />
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter patient full name"
                            className="input-field text-sm"
                            required
                        />
                    </div>

                    {/* DOB, Age, Gender Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                Date of Birth *
                            </label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="input-field text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                Age
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Auto"
                                className="input-field bg-gray-50 text-sm"
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                Gender *
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="input-field text-sm"
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>

                    {/* Contact Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+62 xxx-xxxx-xxxx"
                                className="input-field text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="patient@email.com"
                                className="input-field text-sm"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Address
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={2}
                            placeholder="Enter patient address"
                            className="input-field text-sm resize-none"
                        />
                    </div>

                    {/* Weight & Height */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                Weight (kg)
                            </label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                placeholder="e.g., 70"
                                className="input-field text-sm"
                                step="0.1"
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                Height (cm)
                            </label>
                            <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                placeholder="e.g., 170"
                                className="input-field text-sm"
                                step="0.1"
                            />
                        </div>
                    </div>
                </div>

                {/* Medical Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Medical Information</h2>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Current Diagnosis
                        </label>
                        <input
                            type="text"
                            name="diagnosis"
                            value={formData.diagnosis}
                            onChange={handleChange}
                            placeholder="e.g., Pending, Glioma, No Tumor"
                            className="input-field text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Clinical Symptoms
                        </label>
                        <textarea
                            name="clinicalSymptoms"
                            value={formData.clinicalSymptoms}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Describe patient symptoms..."
                            className="input-field text-sm resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Medical History
                        </label>
                        <textarea
                            name="medicalHistory"
                            value={formData.medicalHistory}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Previous medical conditions, surgeries, allergies..."
                            className="input-field text-sm resize-none"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full sm:w-auto font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${loading
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-primary text-dark hover:bg-primary-dark'
                            }`}
                    >
                        {loading ? 'Saving...' : 'Save Patient'}
                    </button>
                </div>
            </form>
        </div>
    );
}
