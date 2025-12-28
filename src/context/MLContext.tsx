'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { MLPredictionResult } from '@/lib/mlService';

interface MLContextType {
    uploadedFile: File | null;
    setUploadedFile: (file: File | null) => void;
    prediction: MLPredictionResult | null;
    setPrediction: (result: MLPredictionResult | null) => void;
    isProcessing: boolean;
    setIsProcessing: (processing: boolean) => void;
    processingProgress: number;
    setProcessingProgress: (progress: number) => void;
}

const MLContext = createContext<MLContextType | undefined>(undefined);

export function MLProvider({ children }: { children: ReactNode }) {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [prediction, setPrediction] = useState<MLPredictionResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingProgress, setProcessingProgress] = useState(0);

    return (
        <MLContext.Provider
            value={{
                uploadedFile,
                setUploadedFile,
                prediction,
                setPrediction,
                isProcessing,
                setIsProcessing,
                processingProgress,
                setProcessingProgress,
            }}
        >
            {children}
        </MLContext.Provider>
    );
}

export function useML() {
    const context = useContext(MLContext);
    if (context === undefined) {
        throw new Error('useML must be used within a MLProvider');
    }
    return context;
}
