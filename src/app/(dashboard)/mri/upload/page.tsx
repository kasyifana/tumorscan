'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MdCloudUpload, MdCheckCircle, MdDescription } from 'react-icons/md';

export default function MRIUploadPage() {
    const router = useRouter();
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

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
        setUploadedFile(file);
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
        }, 200);
    };

    const handleStartAnalysis = () => {
        router.push('/mri/processing');
    };

    return (
        <div className="max-w-3xl mx-auto px-0 sm:px-4">
            {/* Page Header */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Upload Patient MRI Data</h1>
                <p className="text-sm text-gray-500">
                    Supported formats: DICOM (.dcm), PNG, JPG. Max file size: 50MB
                </p>
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
                    {!uploadedFile ? (
                        <>
                            <MdCloudUpload className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                            <p className="text-sm sm:text-base text-gray-600 mb-2">
                                Drag & drop MRI files here
                            </p>
                            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">or</p>
                            <label className="inline-block">
                                <input
                                    type="file"
                                    accept=".dcm,.png,.jpg,.jpeg"
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
                                <p className="font-medium text-gray-900 text-sm sm:text-base break-all">{uploadedFile.name}</p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
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
            </div>

            {/* Validation Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Waiting for file to validate</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                    Real-time AI Validation validates MRI files to identify format or scan inconsistencies
                </p>

                {/* Action Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleStartAnalysis}
                        disabled={!uploadedFile || uploadProgress < 100}
                        className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base ${uploadedFile && uploadProgress === 100
                            ? 'bg-primary text-dark hover:bg-primary-dark'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Start Analysis
                    </button>
                </div>
            </div>
        </div>
    );
}
