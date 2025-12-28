'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdVerified, MdCalendarToday, MdPhone, MdEmail } from 'react-icons/md';
import { getPatientById, supabase, Patient } from '@/lib/supabase';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface ScanResult {
    case_id: string;
    tumor_type: string;
    display_name: string;
    confidence: number;
    created_at: string;
    cases: {
        mri_date: string;
        mri_type: string;
    };
}

export default function PatientProfilePage({ params }: { params: { id: string } }) {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [scanResults, setScanResults] = useState<ScanResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                // Load patient
                const patientData = await getPatientById(params.id);
                setPatient(patientData);

                // Load scan results for this patient
                const { data: scans } = await supabase
                    .from('scan_results')
                    .select(`
                        case_id,
                        tumor_type,
                        display_name,
                        confidence,
                        created_at,
                        cases (mri_date, mri_type)
                    `)
                    .eq('patient_id', params.id)
                    .order('created_at', { ascending: false });

                if (scans) {
                    setScanResults(scans as unknown as ScanResult[]);
                }
            } catch (error) {
                console.error('Error loading patient:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [params.id]);

    if (loading) {
        return <div className="text-center py-12 text-gray-500">Loading...</div>;
    }

    if (!patient) {
        return (
            <div className="text-center py-12">
                <h1 className="text-xl font-bold text-gray-900 mb-4">Patient Not Found</h1>
                <Link href="/patients" className="text-primary hover:text-primary-dark">
                    Back to Patients
                </Link>
            </div>
        );
    }

    // Chart data from scan results
    const chartData = scanResults.map((scan, index) => ({
        date: new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        confidence: scan.confidence,
    })).reverse();

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Patient Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                    {/* Avatar */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                        <span className="text-2xl sm:text-3xl font-bold text-amber-600">
                            {patient.name.charAt(0)}
                        </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{patient.name}</h1>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded ${patient.status === 'Active' ? 'bg-green-100 text-green-700' :
                                    patient.status === 'Under Review' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-700'
                                }`}>
                                {patient.status}
                            </span>
                            <MdVerified className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-sm text-gray-500 mb-3 sm:mb-4">
                            Medical ID: {patient.medical_record_number || patient.patient_id}
                        </p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                                <MdCalendarToday className="w-4 h-4" />
                                {patient.age} years • {patient.gender}
                            </span>
                            {patient.phone && (
                                <span className="flex items-center gap-1">
                                    <MdPhone className="w-4 h-4" />
                                    {patient.phone}
                                </span>
                            )}
                            {patient.email && (
                                <span className="flex items-center gap-1">
                                    <MdEmail className="w-4 h-4" />
                                    <span className="truncate max-w-[150px] sm:max-w-none">{patient.email}</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <Link
                        href={`/cases/add?patientId=${patient.patient_id}`}
                        className="w-full sm:w-auto text-center px-4 py-2 bg-primary text-dark font-medium rounded-lg hover:bg-primary-dark transition-colors text-sm"
                    >
                        Add New Case
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Medical Information */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                    <h2 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Medical Information</h2>
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex justify-between py-2 sm:py-3 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Current Diagnosis</span>
                            <span className="font-medium text-gray-900 text-sm">{patient.diagnosis || 'Pending'}</span>
                        </div>
                        <div className="flex justify-between py-2 sm:py-3 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Date of Birth</span>
                            <span className="font-medium text-gray-900 text-sm">
                                {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : '-'}
                            </span>
                        </div>
                        <div className="flex justify-between py-2 sm:py-3 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Weight</span>
                            <span className="font-medium text-gray-900 text-sm">{patient.weight ? `${patient.weight} kg` : '-'}</span>
                        </div>
                        <div className="flex justify-between py-2 sm:py-3 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Height</span>
                            <span className="font-medium text-gray-900 text-sm">{patient.height ? `${patient.height} cm` : '-'}</span>
                        </div>
                        {patient.clinical_symptoms && (
                            <div className="py-2 sm:py-3 border-b border-gray-100">
                                <span className="text-sm text-gray-600 block mb-1">Clinical Symptoms</span>
                                <span className="font-medium text-gray-900 text-sm">{patient.clinical_symptoms}</span>
                            </div>
                        )}
                        {patient.medical_history && (
                            <div className="py-2 sm:py-3">
                                <span className="text-sm text-gray-600 block mb-1">Medical History</span>
                                <span className="font-medium text-gray-900 text-sm">{patient.medical_history}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Scan History */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                    <h2 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Scan History</h2>
                    {scanResults.length === 0 ? (
                        <p className="text-sm text-gray-500">No scans yet for this patient.</p>
                    ) : (
                        <div className="space-y-3 sm:space-y-4">
                            {scanResults.map((scan) => (
                                <div key={scan.case_id} className="flex items-start gap-3">
                                    <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${scan.tumor_type === 'notumor' ? 'bg-green-500' : 'bg-red-500'
                                        }`} />
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{scan.display_name}</p>
                                        <p className="text-xs sm:text-sm text-gray-500">
                                            {new Date(scan.created_at).toLocaleDateString()} • {scan.confidence.toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Data Visualization */}
            {chartData.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                    <h2 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Confidence Score History</h2>
                    <div className="h-48 sm:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                                <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" domain={[0, 100]} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="confidence"
                                    stroke="#E5C100"
                                    strokeWidth={2}
                                    dot={{ fill: '#E5C100', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}
