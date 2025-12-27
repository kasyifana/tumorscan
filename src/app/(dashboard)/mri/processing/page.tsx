'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdCheckCircle, MdHourglassEmpty } from 'react-icons/md';
import { processingSteps } from '@/data/mockData';

export default function ProcessingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState(
        processingSteps.map((step) => ({ ...step, status: 'pending' }))
    );

    useEffect(() => {
        // Simulate processing steps
        const interval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev < steps.length) {
                    setSteps((prevSteps) =>
                        prevSteps.map((step, index) => ({
                            ...step,
                            status: index <= prev ? 'completed' : 'pending',
                        }))
                    );
                    return prev + 1;
                }
                clearInterval(interval);
                return prev;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const isComplete = currentStep >= steps.length;

    return (
        <div className="max-w-3xl mx-auto px-0 sm:px-4">
            {/* Page Header */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">AI Processing Status</h1>
                <p className="text-sm text-gray-500">
                    Track the progress of MRI Analysis pipeline
                </p>
            </div>

            {/* Processing Steps */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-3 sm:space-y-4">
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className={`border rounded-lg p-3 sm:p-4 transition-all ${step.status === 'completed'
                            ? 'border-green-200 bg-green-50'
                            : index === currentStep
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-100 bg-gray-50'
                            }`}
                    >
                        <div className="flex items-start sm:items-center justify-between gap-3">
                            <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                                {step.status === 'completed' ? (
                                    <MdCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                                ) : index === currentStep ? (
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-primary border-t-transparent animate-spin flex-shrink-0 mt-0.5 sm:mt-0" />
                                ) : (
                                    <MdHourglassEmpty className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 flex-shrink-0 mt-0.5 sm:mt-0" />
                                )}
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{step.name}</h3>
                                    <p className="text-xs sm:text-sm text-gray-500 truncate">{step.description}</p>
                                </div>
                            </div>
                            <span
                                className={`text-xs sm:text-sm font-medium whitespace-nowrap ${step.status === 'completed'
                                    ? 'text-green-600'
                                    : index === currentStep
                                        ? 'text-primary'
                                        : 'text-gray-400'
                                    }`}
                            >
                                {step.status === 'completed'
                                    ? 'Done'
                                    : index === currentStep
                                        ? 'Processing...'
                                        : 'Pending'}
                            </span>
                        </div>

                        {/* Progress bar for current step */}
                        {index === currentStep && step.status !== 'completed' && (
                            <div className="mt-3">
                                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary animate-pulse" style={{ width: '60%' }} />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Action Button */}
            <div className="mt-4 sm:mt-6 flex justify-end">
                <button
                    onClick={() => router.push('/mri/results')}
                    disabled={!isComplete}
                    className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base ${isComplete
                        ? 'bg-primary text-dark hover:bg-primary-dark'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    View Analysis Result
                </button>
            </div>
        </div>
    );
}
