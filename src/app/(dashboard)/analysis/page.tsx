'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useML } from '@/context/MLContext';
import Disclaimer from '@/components/Disclaimer';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

// Mock analytics data
const mockTumorData = [
    { month: 'Jan', size: 5 },
    { month: 'Feb', size: 6 },
    { month: 'Mar', size: 7 },
    { month: 'Apr', size: 7.5 },
    { month: 'May', size: 8 },
    { month: 'Jun', size: 10 },
];

export default function AnalysisPage() {
    const router = useRouter();
    const { prediction, uploadedFile } = useML();
    const [doctorNotes, setDoctorNotes] = useState('');

    // If no prediction, show fallback
    if (!prediction) {
        return (
            <div className="max-w-3xl mx-auto text-center py-12">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">No Analysis Data</h1>
                <p className="text-gray-500 mb-6">Please upload and analyze an MRI image first.</p>
                <Link
                    href="/mri/upload"
                    className="inline-block bg-primary text-dark font-semibold px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                >
                    Upload MRI
                </Link>
            </div>
        );
    }

    const tumorDetected = prediction.tumorType !== 'notumor';

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Quantitative Analysis</h1>
                <p className="text-sm text-gray-500">
                    Detailed tumor metrics and clinical measurements
                </p>
            </div>

            {/* Disclaimer */}
            <Disclaimer />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Tumor Characteristics */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                    <h2 className="font-semibold text-gray-900 mb-4 sm:mb-6 text-sm sm:text-base">AI Detection Results</h2>

                    <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-3 sm:gap-y-4">
                        <div>
                            <p className="text-xs sm:text-sm text-gray-500">Anomaly Detection</p>
                            <p className={`font-semibold text-sm sm:text-base ${tumorDetected ? 'text-red-600' : 'text-green-600'}`}>
                                {tumorDetected ? 'Positive' : 'Negative'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-gray-500">Classification</p>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">{prediction.displayName}</p>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-gray-500">Tumor Class</p>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">{prediction.tumorType.toUpperCase()}</p>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-gray-500">Confidence</p>
                            <p className="font-semibold text-primary text-sm sm:text-base">{prediction.confidence.toFixed(1)}%</p>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-gray-500">Severity</p>
                            <p className={`font-semibold text-sm sm:text-base ${prediction.severity === 'High' ? 'text-red-600' :
                                    prediction.severity === 'Moderate' ? 'text-orange-600' :
                                        'text-gray-900'
                                }`}>{prediction.severity}</p>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-gray-500">Analysis Date</p>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {/* Recommendation */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                    <h2 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Recommendation</h2>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {prediction.recommendation}
                    </p>
                </div>
            </div>

            {/* Data Visualization - Only show if tumor detected */}
            {tumorDetected && (
                <div>
                    <h2 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Data Visualization (Sample)</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {/* Tumor Size Over Time */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                            <div className="mb-3 sm:mb-4">
                                <h3 className="font-medium text-gray-700 text-sm">Tumor Size over Time (Sample)</h3>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">10 mm²</p>
                                <p className="text-xs sm:text-sm text-gray-500">Sample historical data</p>
                            </div>
                            <div className="h-40 sm:h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={mockTumorData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                                        <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
                                        <Tooltip />
                                        <Bar dataKey="size" fill="#E5C100" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Growth Rate Chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                            <div className="mb-3 sm:mb-4">
                                <h3 className="font-medium text-gray-700 text-sm">Growth Rate Trend (Sample)</h3>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">+1 mm²/month</p>
                                <p className="text-xs sm:text-sm text-gray-500">Sample growth projection</p>
                            </div>
                            <div className="h-40 sm:h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={mockTumorData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                                        <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="size"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Doctor's Notes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Doctor&apos;s Notes</h2>
                <textarea
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    placeholder={`AI Classification: ${prediction.displayName} with ${prediction.confidence.toFixed(1)}% confidence. Add your clinical observations here...`}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Link
                    href="/mri/results"
                    className="text-center px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                    Back to Results
                </Link>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="bg-primary text-dark font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-primary-dark transition-colors text-sm sm:text-base"
                >
                    Complete Analysis
                </button>
            </div>
        </div>
    );
}
