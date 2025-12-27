'use client';

import Link from 'next/link';
import Image from 'next/image';
import { sampleAnalysisResult } from '@/data/mockData';
import Disclaimer from '@/components/Disclaimer';

export default function ResultsPage() {
    const result = sampleAnalysisResult;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Analysis Results</h1>
                <p className="text-gray-500">
                    Patient Scan Date: Nov 18 2024 • MRI Radiology-Clinic 4 • Computed
                </p>
            </div>

            {/* Disclaimer */}
            <Disclaimer />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* MRI Image Viewer */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">MRI Image Viewer</h2>
                    </div>
                    <div className="relative aspect-square bg-gray-900">
                        {/* Placeholder MRI Image with Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-4/5 h-4/5 bg-gray-800 rounded-lg overflow-hidden">
                                {/* Mock MRI Brain Scan */}
                                <div className="absolute inset-0 bg-gradient-radial from-gray-600 via-gray-700 to-gray-900 flex items-center justify-center">
                                    <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center relative">
                                        {/* Tumor Overlay */}
                                        <div className="absolute top-1/4 left-1/3 w-16 h-16 rounded-full bg-red-500/70 border-2 border-red-400 animate-pulse" />
                                        <div className="absolute top-1/4 left-1/3 w-16 h-16 rounded-full border-2 border-yellow-400" />
                                    </div>
                                </div>
                                {/* Crosshairs */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-full h-px bg-cyan-400/50" />
                                    <div className="absolute h-full w-px bg-cyan-400/50" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analysis Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-semibold text-gray-900 mb-6">Analysis Summary</h2>

                    <div className="space-y-4">
                        {/* Detection Status */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600">Tumor Detected</span>
                            <span className={`font-semibold ${result.tumorDetected ? 'text-red-600' : 'text-green-600'}`}>
                                {result.tumorDetected ? 'Yes' : 'No'}
                            </span>
                        </div>

                        {/* Tumor Type */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600">Tumor Type</span>
                            <span className="font-semibold text-gray-900">{result.tumorType}</span>
                        </div>

                        {/* Confidence */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600">Confidence Score</span>
                            <span className="font-semibold text-primary">{result.confidence}%</span>
                        </div>

                        {/* Location */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600">Location</span>
                            <span className="font-semibold text-gray-900">{result.location}</span>
                        </div>

                        {/* Severity */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600">Severity Level</span>
                            <span className={`font-semibold ${result.severity === 'High' ? 'text-red-600' :
                                    result.severity === 'Moderate' ? 'text-orange-600' :
                                        'text-green-600'
                                }`}>
                                {result.severity}
                            </span>
                        </div>

                        {/* Size */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600">Tumor Size</span>
                            <span className="font-semibold text-gray-900">{result.sizeMm2} mm²</span>
                        </div>

                        {/* Growth Rate */}
                        <div className="flex justify-between items-center py-3">
                            <span className="text-gray-600">Growth Rate</span>
                            <span className="font-semibold text-gray-900">{result.growthRate}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-3">
                        <Link
                            href="/analysis"
                            className="flex-1 text-center bg-primary text-dark font-semibold py-3 rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            View Quantitative Analysis
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
