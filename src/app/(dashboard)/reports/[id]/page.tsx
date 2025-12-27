'use client';

import { sampleAnalysisResult, patients, analyticsData } from '@/data/mockData';
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

export default function ReportPage({ params }: { params: { id: string } }) {
    const patient = patients.find((p) => p.id === params.id) || patients[8];
    const result = sampleAnalysisResult;

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        alert('PDF download initiated (mock)');
    };

    return (
        <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Diagnostic Report</h1>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Report ID: RPT-{patient.id}-001 • Generated: {new Date().toLocaleDateString()}
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
                        <p className="font-medium text-gray-900 text-sm">{patient.id}</p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-900 text-sm">{patient.name}</p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">Gender</p>
                        <p className="font-medium text-gray-900 text-sm">{patient.gender}</p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">Date of Birth</p>
                        <p className="font-medium text-gray-900 text-sm">{patient.dateOfBirth}</p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">Medical Record</p>
                        <p className="font-medium text-gray-900 text-sm">{patient.medicalRecordNumber}</p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">Procedure</p>
                        <p className="font-medium text-gray-900 text-sm">MRI Brain Analysis</p>
                    </div>
                </div>
            </div>

            {/* MRI Scans */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">MRI Scans</h2>
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="relative w-3/4 h-3/4 bg-gradient-radial from-gray-600 via-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                            <div className="w-2/3 h-2/3 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 relative">
                                <div className="absolute top-1/4 left-1/3 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500/70 border-2 border-red-400" />
                                <div className="absolute top-1/4 left-1/3 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analysis Result */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Analysis Result</h2>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">Tumor Detected</p>
                        <p className={`font-medium text-sm ${result.tumorDetected ? 'text-red-600' : 'text-green-600'}`}>
                            {result.tumorDetected ? 'Yes' : 'No'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">Tumor Classification</p>
                        <p className="font-medium text-gray-900 text-sm">{result.tumorType}</p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">Confidence Score</p>
                        <p className="font-medium text-primary text-sm">{result.confidence}%</p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">Tumor Size</p>
                        <p className="font-medium text-gray-900 text-sm">{result.sizeMm2} mm²</p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">Location</p>
                        <p className="font-medium text-gray-900 text-sm">{result.location}</p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500">Severity</p>
                        <p className={`font-medium text-sm ${result.severity === 'High' ? 'text-red-600' : 'text-gray-900'}`}>
                            {result.severity}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-xs sm:text-sm text-gray-500">AI Confidence & Explanation</p>
                        <p className="font-medium text-gray-900 text-sm">
                            {result.recommendation}
                        </p>
                    </div>
                </div>
            </div>

            {/* Data Visualization */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Data Visualization</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                        <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Tumor Size over Time</h3>
                        <p className="text-lg sm:text-xl font-bold text-gray-900 mb-2">10 mm²</p>
                        <div className="h-32 sm:h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analyticsData.tumorSizeOverTime}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" tick={{ fontSize: 9 }} stroke="#9ca3af" />
                                    <YAxis tick={{ fontSize: 9 }} stroke="#9ca3af" />
                                    <Tooltip />
                                    <Bar dataKey="size" fill="#E5C100" radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Growth Rate</h3>
                        <p className="text-lg sm:text-xl font-bold text-gray-900 mb-2">3 mm²/month</p>
                        <div className="h-32 sm:h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analyticsData.tumorSizeOverTime}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" tick={{ fontSize: 9 }} stroke="#9ca3af" />
                                    <YAxis tick={{ fontSize: 9 }} stroke="#9ca3af" />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="size" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Doctor's Notes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Doctor&apos;s Notes</h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                    Patient shows MRI scan shows 1 Glioma classification due to brain location and a high growth rate.
                    Immediately escalated for additional therapy planning.
                </p>
                <p className="text-xs sm:text-sm text-primary mt-3">→ Neural Network Analysis</p>
            </div>
        </div>
    );
}
