'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MdArrowBack, MdSearch } from 'react-icons/md';
import { getPatients, createCase, Patient } from '@/lib/supabase';

export default function AddCasePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedPatientId = searchParams.get('patientId') || '';

    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Generate unique Case ID
    const generateCaseId = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `CS-${year}${month}-${random}`;
    };

    const [formData, setFormData] = useState({
        patientId: preselectedPatientId,
        medicalRecordNumber: '',
        caseId: generateCaseId(), // Auto-generated
        mriDate: new Date().toISOString().split('T')[0], // Today's date
        studyDate: new Date().toISOString().split('T')[0],
        mriType: 'T1-Weighted',
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        async function loadPatients() {
            try {
                const data = await getPatients();
                setPatients(data);

                // If preselected patient, set the data
                if (preselectedPatientId) {
                    const patient = data.find(p => p.patient_id === preselectedPatientId);
                    if (patient) {
                        setSearchTerm(patient.name);
                        setFormData(prev => ({
                            ...prev,
                            patientId: patient.patient_id,
                            medicalRecordNumber: patient.medical_record_number || '',
                        }));
                    }
                }
            } catch (error) {
                console.error('Error loading patients:', error);
            }
        }
        loadPatients();
    }, [preselectedPatientId]);

    const filteredPatients = patients.filter(
        (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.patient_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePatientSelect = (patient: Patient) => {
        setFormData((prev) => ({
            ...prev,
            patientId: patient.patient_id,
            medicalRecordNumber: patient.medical_record_number || '',
        }));
        setSearchTerm(patient.name);
        setShowDropdown(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.patientId) {
            setError('Please select a patient');
            return;
        }

        if (!formData.caseId) {
            setError('Please enter a Case ID');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await createCase({
                case_id: formData.caseId,
                patient_id: formData.patientId,
                mri_date: formData.mriDate || null as any,
                study_date: formData.studyDate || null as any,
                mri_type: formData.mriType,
                status: 'Pending',
            });

            // Redirect to upload MRI
            router.push(`/mri/upload?caseId=${formData.caseId}&patientId=${formData.patientId}`);
        } catch (err) {
            console.error('Error creating case:', err);
            setError('Failed to create case. Please check if Case ID is unique.');
        } finally {
            setLoading(false);
        }
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

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {/* Patient Search */}
                    <div className="relative">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Search Patient *
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
                                            <p className="text-xs text-gray-500">{patient.patient_id}</p>
                                        </button>
                                    ))
                                ) : (
                                    <p className="px-4 py-3 text-gray-500 text-sm">No patients found. <Link href="/patients/add" className="text-primary">Add one first?</Link></p>
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
                                readOnly
                                placeholder="Auto-filled from search"
                                className="input-field bg-gray-50 text-sm"
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
                                readOnly
                                placeholder="Auto-filled from search"
                                className="input-field bg-gray-50 text-sm"
                            />
                        </div>
                    </div>

                    {/* Case ID & MRI Type Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                Case ID *
                            </label>
                            <input
                                type="text"
                                name="caseId"
                                value={formData.caseId}
                                onChange={handleChange}
                                placeholder="e.g., CS-2024-001"
                                className="input-field text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                MRI Type
                            </label>
                            <select
                                name="mriType"
                                value={formData.mriType}
                                onChange={handleChange}
                                className="input-field text-sm"
                            >
                                <option value="T1-Weighted">T1-Weighted</option>
                                <option value="T2-Weighted">T2-Weighted</option>
                                <option value="FLAIR">FLAIR</option>
                                <option value="Contrast-Enhanced">Contrast-Enhanced</option>
                            </select>
                        </div>
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
                        disabled={loading}
                        className={`w-full sm:w-auto font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${loading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-primary text-dark hover:bg-primary-dark'
                            }`}
                    >
                        {loading ? 'Creating...' : 'Add Case & Upload MRI'}
                    </button>
                </div>
            </form>
        </div>
    );
}
