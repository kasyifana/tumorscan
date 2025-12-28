'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdCloudUpload, MdCheckCircle, MdDescription } from 'react-icons/md';
import { useML } from '@/context/MLContext';
import { analyzeMRIImage } from '@/lib/mlService';
import { createScanResult, updateCaseStatus, uploadMRIImage, supabase } from '@/lib/supabase';

export default function MRIUploadPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const caseId = searchParams.get('caseId') || '';
    const patientId = searchParams.get('patientId') || '';

    const { setUploadedFile, setPrediction, setIsProcessing } = useML();

    const [isDragging, setIsDragging] = useState(false);
    const [localFile, setLocalFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [caseInfo, setCaseInfo] = useState<any>(null);

    // Load case info if caseId provided
    useEffect(() => {
        if (caseId) {
            supabase
                .from('cases')
                .select('*, patients(name)')
                .eq('case_id', caseId)
                .single()
                .then(({ data }) => setCaseInfo(data));
        }
    }, [caseId]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileUpload(file);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleFileUpload = (file: File) => {
        setLocalFile(file);
        setError(null);
        setIsUploading(true);
        setUploadProgress(0);

        // Simulate upload progress
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    return 100;
                }
                return prev + 10;
            });
        }, 150);
    };

    const handleStartAnalysis = async () => {
        if (!localFile) return;

        setIsAnalyzing(true);
        setError(null);
        setIsProcessing(true);
        setUploadedFile(localFile);

        try {
            // Call the real ML API
            const result = await analyzeMRIImage(localFile);
            setPrediction(result);

            // Save to database if we have case info
            if (caseId && patientId) {
                // Update case status
                await updateCaseStatus(caseId, 'Completed');

                // Upload MRI image to storage (optional)
                let imageUrl = '';
                try {
                    imageUrl = await uploadMRIImage(localFile, patientId, caseId);
                } catch (uploadError) {
                    console.log('Image upload skipped:', uploadError);
                }

                // Create scan result
                await createScanResult({
                    case_id: caseId,
                    patient_id: patientId,
                    tumor_detected: result.tumorType !== 'notumor',
                    tumor_type: result.tumorType,
                    display_name: result.displayName,
                    confidence: result.confidence,
                    severity: result.severity,
                    recommendation: result.recommendation,
                    mri_image_url: imageUrl,
                });
            }

            setIsProcessing(false);
            router.push('/mri/results');
        } catch (err) {
            console.error('Analysis error:', err);
            setError('Failed to analyze image. Please try again.');
            setIsAnalyzing(false);
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-0 sm:px-4">
            {/* Page Header */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Upload Patient MRI Data</h1>
                <p className="text-sm text-gray-500">
                    Supported formats: PNG, JPG, JPEG. Max file size: 50MB
                </p>
                {caseInfo && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                            <strong>Case:</strong> {caseId} • <strong>Patient:</strong> {caseInfo.patients?.name || patientId}
                        </p>
                    </div>
                )}
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
                {/* Upload Zone */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all ${isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                >
                    {!localFile ? (
                        <>
                            <MdCloudUpload className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                            <p className="text-sm sm:text-base text-gray-600 mb-2">
                                Drag & drop MRI files here
                            </p>
                            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">or</p>
                            <label className="inline-block">
                                <input
                                    type="file"
                                    accept=".png,.jpg,.jpeg"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <span className="cursor-pointer bg-primary text-dark font-semibold px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-primary-dark transition-colors text-sm sm:text-base">
                                    Browse Files
                                </span>
                            </label>
                        </>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                            <MdDescription className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                            <div className="text-center sm:text-left">
                                <p className="font-medium text-gray-900 text-sm sm:text-base break-all">{localFile.name}</p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                    {(localFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            {uploadProgress === 100 && (
                                <MdCheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                            )}
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                {isUploading && (
                    <div className="mt-4 sm:mt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs sm:text-sm text-gray-600">Uploading...</span>
                            <span className="text-xs sm:text-sm text-gray-600">{uploadProgress}%</span>
                        </div>
                        <div className="w-full h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-200"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}
            </div>

            {/* Analysis Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                    {isAnalyzing ? 'Analyzing with AI...' : 'Ready for AI Analysis'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                    {isAnalyzing
                        ? 'Our AI model is processing your MRI scan. This may take a few seconds...'
                        : 'Real-time AI analysis using deep learning model to classify brain tumors (Glioma, Meningioma, Pituitary, No Tumor).'
                    }
                </p>

                {/* Analyzing Progress */}
                {isAnalyzing && (
                    <div className="mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm text-gray-600">Processing MRI scan...</span>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleStartAnalysis}
                        disabled={!localFile || uploadProgress < 100 || isAnalyzing}
                        className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base ${localFile && uploadProgress === 100 && !isAnalyzing
                            ? 'bg-primary text-dark hover:bg-primary-dark'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
                    </button>
                </div>
            </div>
        </div>
    );
}
