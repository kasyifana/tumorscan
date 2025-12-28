'use client';

import Link from 'next/link';
import { useML } from '@/context/MLContext';
import Disclaimer from '@/components/Disclaimer';

export default function ResultsPage() {
    const { prediction, uploadedFile } = useML();

    // If no prediction, show fallback
    if (!prediction) {
        return (
            <div className="max-w-3xl mx-auto text-center py-12">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">No Analysis Results</h1>
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
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Analysis Results</h1>
                <p className="text-xs sm:text-sm text-gray-500">
                    Analysis completed • {new Date().toLocaleDateString()}
                </p>
            </div>

            {/* Disclaimer */}
            <Disclaimer />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* MRI Image Viewer */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Uploaded MRI Image</h2>
                    </div>
                    <div className="relative aspect-square bg-gray-900 flex items-center justify-center">
                        {uploadedFile ? (
                            <img
                                src={URL.createObjectURL(uploadedFile)}
                                alt="Uploaded MRI"
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : (
                            <div className="w-4/5 h-4/5 bg-gray-800 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500">Image preview</span>
                            </div>
                        )}

                        {/* Tumor indicator overlay */}
                        {tumorDetected && (
                            <div className="absolute top-4 right-4 px-3 py-1.5 bg-red-500/90 text-white text-xs font-medium rounded-full">
                                Tumor Detected
                            </div>
                        )}
                    </div>
                </div>

                {/* Analysis Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                    <h2 className="font-semibold text-gray-900 mb-4 sm:mb-6 text-sm sm:text-base">AI Analysis Summary</h2>

                    <div className="space-y-3 sm:space-y-4">
                        {/* Detection Status */}
                        <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Tumor Detected</span>
                            <span className={`font-semibold text-sm ${tumorDetected ? 'text-red-600' : 'text-green-600'}`}>
                                {tumorDetected ? 'Yes' : 'No'}
                            </span>
                        </div>

                        {/* Tumor Type */}
                        <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Classification</span>
                            <span className="font-semibold text-gray-900 text-sm">{prediction.displayName}</span>
                        </div>

                        {/* Confidence */}
                        <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Confidence Score</span>
                            <span className="font-semibold text-primary text-sm">{prediction.confidence.toFixed(1)}%</span>
                        </div>

                        {/* Severity */}
                        <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Severity Level</span>
                            <span className={`font-semibold text-sm ${prediction.severity === 'High' ? 'text-red-600' :
                                    prediction.severity === 'Moderate' ? 'text-orange-600' :
                                        prediction.severity === 'Low' ? 'text-yellow-600' :
                                            'text-green-600'
                                }`}>
                                {prediction.severity}
                            </span>
                        </div>

                        {/* Recommendation */}
                        <div className="py-2 sm:py-3">
                            <span className="text-sm text-gray-600 block mb-2">Recommendation</span>
                            <p className="text-sm text-gray-800 leading-relaxed">
                                {prediction.recommendation}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/mri/upload"
                            className="flex-1 text-center border border-gray-300 text-gray-700 font-semibold py-2.5 sm:py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                        >
                            Analyze Another
                        </Link>
                        <Link
                            href="/analysis"
                            className="flex-1 text-center bg-primary text-dark font-semibold py-2.5 sm:py-3 rounded-lg hover:bg-primary-dark transition-colors text-sm sm:text-base"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
