'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sampleAnalysisResult, analyticsData } from '@/data/mockData';
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

export default function AnalysisPage() {
    const router = useRouter();
    const result = sampleAnalysisResult;
    const [doctorNotes, setDoctorNotes] = useState('');

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Quantitative Analysis</h1>
                <p className="text-gray-500">
                    Detailed tumor metrics and clinical measurements
                </p>
            </div>

            {/* Disclaimer */}
            <Disclaimer />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tumor Characteristics */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-semibold text-gray-900 mb-6">Tumor Characteristics</h2>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Anomaly Detection</p>
                            <p className="font-semibold text-gray-900">Positive</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">T-positive</p>
                            <p className="font-semibold text-gray-900">Glioma</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Brain Region</p>
                            <p className="font-semibold text-gray-900">{result.location}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Tumor Class</p>
                            <p className="font-semibold text-gray-900">{result.tumorType}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Tumor Size</p>
                            <p className="font-semibold text-gray-900">{result.sizeMm2} mm²</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Confidence</p>
                            <p className="font-semibold text-primary">{result.confidence}%</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Severity</p>
                            <p className={`font-semibold ${result.severity === 'High' ? 'text-red-600' : 'text-gray-900'
                                }`}>{result.severity}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Growth Rate</p>
                            <p className="font-semibold text-gray-900">{result.growthRate}</p>
                        </div>
                    </div>
                </div>

                {/* Recommendation */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-semibold text-gray-900 mb-4">Recommendation</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {result.recommendation}
                    </p>
                </div>
            </div>

            {/* Data Visualization */}
            <div>
                <h2 className="font-semibold text-gray-900 mb-4">Data Visualization</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Tumor Size Over Time */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="mb-4">
                            <h3 className="font-medium text-gray-700">Tumor Size over Time</h3>
                            <p className="text-2xl font-bold text-gray-900">10 mm²</p>
                            <p className="text-sm text-green-600">Last Updated + 8%</p>
                        </div>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analyticsData.tumorSizeOverTime}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                    <Tooltip />
                                    <Bar dataKey="size" fill="#E5C100" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Growth Rate Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="mb-4">
                            <h3 className="font-medium text-gray-700">Tumor Growth Rate</h3>
                            <p className="text-2xl font-bold text-gray-900">3 mm²/month</p>
                            <p className="text-sm text-red-600">Last Month +18%</p>
                        </div>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analyticsData.tumorSizeOverTime}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
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

            {/* Doctor's Notes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Doctor&apos;s Notes</h2>
                <textarea
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    placeholder="Patient shows MRI scan shows 1 Glioma classification due to brain location and a high growth rate. Immediately escalated for additional therapy planning..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
                <p className="text-sm text-gray-500 mt-2">→ Neural Network Analysis</p>
            </div>

            {/* Action Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => router.push('/reports/PT-021')}
                    className="bg-primary text-dark font-semibold px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                >
                    Generate Report
                </button>
            </div>
        </div>
    );
}
