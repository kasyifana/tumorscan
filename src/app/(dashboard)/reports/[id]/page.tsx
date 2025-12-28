'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getScanResultByCase, supabase } from '@/lib/supabase';
import Disclaimer from '@/components/Disclaimer';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface ReportData {
    id: string;
    case_id: string;
    patient_id: string;
    tumor_detected: boolean;
    tumor_type: string;
    display_name: string;
    confidence: number;
    severity: string;
    recommendation: string;
    mri_image_url: string;
    doctor_notes: string;
    created_at: string;
    patients: {
        name: string;
        patient_id: string;
        gender: string;
        date_of_birth: string;
        medical_record_number: string;
    };
    cases: {
        case_id: string;
        mri_date: string;
        mri_type: string;
    };
}

export default function ReportPage({ params }: { params: { id: string } }) {
    const [report, setReport] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadReport() {
            try {
                const data = await getScanResultByCase(params.id);
                setReport(data as unknown as ReportData);
            } catch (error) {
                console.error('Error loading report:', error);
            } finally {
                setLoading(false);
            }
        }
        loadReport();
    }, [params.id]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        alert('PDF download feature coming soon!');
    };

    if (loading) {
        return <div className="text-center py-12 text-gray-500">Loading report...</div>;
    }

    if (!report) {
        return (
            <div className="text-center py-12">
                <h1 className="text-xl font-bold text-gray-900 mb-4">Report Not Found</h1>
                <p className="text-gray-500 mb-4">No analysis result found for case: {params.id}</p>
                <Link href="/cases" className="text-primary hover:text-primary-dark">
                    Back to Cases
                </Link>
            </div>
        );
    }

    // Chart data (using confidence as example data points)
    const chartData = [
        { month: 'Current', value: report.confidence },
    ];

    return (
        <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Diagnostic Report</h1>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Report ID: RPT-{report.case_id} • Generated: {new Date(report.created_at).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex gap-2 sm:gap-3">
                    <button
                        onClick={handleDownload}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-primary text-dark font-medium rounded-lg hover:bg-primary-dark transition-colors text-sm"
                    >
                        Download PDF
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                        Print
                    </button>
                </div>
            </div>

            {/* Disclaimer */}
            <Disclaimer />

            {/* Patient Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Patient Information</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">Patient ID</p>
                        <p className="font-medium text-gray-900 text-sm">{report.patients?.patient_id || report.patient_id}</p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-900 text-sm">{report.patients?.name || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">Gender</p>
                        <p className="font-medium text-gray-900 text-sm">{report.patients?.gender || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">Date of Birth</p>
                        <p className="font-medium text-gray-900 text-sm">
                            {report.patients?.date_of_birth
                                ? new Date(report.patients.date_of_birth).toLocaleDateString()
                                : '-'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">Medical Record</p>
                        <p className="font-medium text-gray-900 text-sm">{report.patients?.medical_record_number || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">MRI Type</p>
                        <p className="font-medium text-gray-900 text-sm">{report.cases?.mri_type || 'MRI Brain Analysis'}</p>
                    </div>
                </div>
            </div>

            {/* MRI Scans */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">MRI Scan</h2>
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    {report.mri_image_url ? (
                        <img
                            src={report.mri_image_url}
                            alt="MRI Scan"
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="relative w-3/4 h-3/4 bg-gradient-radial from-gray-600 via-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                                <div className="w-2/3 h-2/3 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 relative">
                                    {report.tumor_detected && (
                                        <>
                                            <div className="absolute top-1/4 left-1/3 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500/70 border-2 border-red-400" />
                                            <div className="absolute top-1/4 left-1/3 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400" />
                                        </>
                                    )}
                                </div>
                                <p className="absolute bottom-4 text-gray-400 text-sm">
                                    {report.mri_image_url ? '' : 'Image not available'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Analysis Result */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Analysis Result</h2>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">Tumor Detected</p>
                        <p className={`font-medium text-sm ${report.tumor_detected ? 'text-red-600' : 'text-green-600'}`}>
                            {report.tumor_detected ? 'Yes' : 'No'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">Tumor Classification</p>
                        <p className="font-medium text-gray-900 text-sm">{report.display_name}</p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">Confidence Score</p>
                        <p className="font-medium text-primary text-sm">{report.confidence.toFixed(1)}%</p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">Severity</p>
                        <p className={`font-medium text-sm ${report.severity === 'High' ? 'text-red-600' : report.severity === 'Moderate' ? 'text-orange-600' : 'text-green-600'}`}>
                            {report.severity}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">MRI Date</p>
                        <p className="font-medium text-gray-900 text-sm">
                            {report.cases?.mri_date
                                ? new Date(report.cases.mri_date).toLocaleDateString()
                                : new Date(report.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">Analysis Date</p>
                        <p className="font-medium text-gray-900 text-sm">
                            {new Date(report.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-xs sm:text-sm text-gray-500">AI Recommendation</p>
                        <p className="font-medium text-gray-900 text-sm">
                            {report.recommendation}
                        </p>
                    </div>
                </div>
            </div>

            {/* Data Visualization */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Confidence Analysis</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                        <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">AI Confidence Score</h3>
                        <p className="text-lg sm:text-xl font-bold text-primary mb-2">{report.confidence.toFixed(1)}%</p>
                        <div className="h-32 sm:h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[{ name: 'Confidence', value: report.confidence }]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#9ca3af" />
                                    <YAxis tick={{ fontSize: 9 }} stroke="#9ca3af" domain={[0, 100]} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#E5C100" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Classification Distribution</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">{report.display_name}</span>
                                <span className="text-sm font-medium text-primary">{report.confidence.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3">
                                <div
                                    className="bg-primary h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${report.confidence}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Doctor's Notes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Doctor&apos;s Notes</h2>
                {report.doctor_notes ? (
                    <p className="text-sm text-gray-700 leading-relaxed">{report.doctor_notes}</p>
                ) : (
                    <p className="text-sm text-gray-400 italic">No doctor notes added yet.</p>
                )}
                <Link
                    href="/review"
                    className="inline-block text-xs sm:text-sm text-primary mt-3 hover:text-primary-dark"
                >
                    → Add/Edit Notes in Review Queue
                </Link>
            </div>
        </div>
    );
}
