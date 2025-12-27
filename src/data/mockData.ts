// Mock Data for TumorScan CDSS Application

export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female';
    medicalRecordNumber: string;
    dateOfBirth: string;
    address: string;
    phone: string;
    email: string;
    lastMRIDate: string;
    status: 'Active' | 'Inactive' | 'Under Review';
    diagnosis?: string;
}

export interface Case {
    caseId: string;
    patientId: string;
    patientName: string;
    examinationDate: string;
    mriType: string;
    eventType: string;
    confidence: number;
    status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
    mriImageUrl?: string;
}

export interface AnalysisResult {
    tumorDetected: boolean;
    confidence: number;
    tumorType: string;
    sizeMm2: number;
    location: string;
    severity: 'Low' | 'Moderate' | 'High';
    growthRate: string;
    recommendation: string;
}

export interface ArchiveRecord {
    id: string;
    patientName: string;
    archiveDate: string;
    reportDate: string;
    tumorType: string;
    fileStatus: string;
}

export interface ReviewItem {
    caseId: string;
    patientName: string;
    submissionDate: string;
    priority: 'Low' | 'Normal' | 'High' | 'Urgent';
    status: 'Pending' | 'In Review' | 'Approved' | 'Rejected';
    reviewer?: string;
    notes?: string;
    confidence: number;
}

// Dashboard KPI Data
export const dashboardKPIs = {
    totalCases: 910,
    detectedTumor: 87,
    pendingAnalysis: 4,
    completedReports: 106,
};

// Patients Data
export const patients: Patient[] = [
    {
        id: 'PT-001',
        name: 'John Smith',
        age: 45,
        gender: 'Male',
        medicalRecordNumber: 'MRN-2024-001',
        dateOfBirth: '1979-03-15',
        address: '123 Medical Center Drive, New York, NY',
        phone: '+1 (555) 123-4567',
        email: 'john.smith@email.com',
        lastMRIDate: '2024-01-15',
        status: 'Active',
        diagnosis: 'Glioma',
    },
    {
        id: 'PT-002',
        name: 'Maria Garcia',
        age: 38,
        gender: 'Female',
        medicalRecordNumber: 'MRN-2024-002',
        dateOfBirth: '1986-07-22',
        address: '456 Health Ave, Los Angeles, CA',
        phone: '+1 (555) 234-5678',
        email: 'maria.garcia@email.com',
        lastMRIDate: '2024-01-14',
        status: 'Active',
        diagnosis: 'Meningioma',
    },
    {
        id: 'PT-003',
        name: 'Robert Johnson',
        age: 52,
        gender: 'Male',
        medicalRecordNumber: 'MRN-2024-003',
        dateOfBirth: '1972-11-08',
        address: '789 Clinic Blvd, Chicago, IL',
        phone: '+1 (555) 345-6789',
        email: 'robert.j@email.com',
        lastMRIDate: '2024-01-13',
        status: 'Under Review',
        diagnosis: 'Pituitary',
    },
    {
        id: 'PT-004',
        name: 'Emily Brown',
        age: 29,
        gender: 'Female',
        medicalRecordNumber: 'MRN-2024-004',
        dateOfBirth: '1995-04-30',
        address: '321 Hospital Road, Houston, TX',
        phone: '+1 (555) 456-7890',
        email: 'emily.brown@email.com',
        lastMRIDate: '2024-01-12',
        status: 'Active',
        diagnosis: 'No Tumor',
    },
    {
        id: 'PT-005',
        name: 'Michael Davis',
        age: 61,
        gender: 'Male',
        medicalRecordNumber: 'MRN-2024-005',
        dateOfBirth: '1963-09-17',
        address: '654 Care Street, Phoenix, AZ',
        phone: '+1 (555) 567-8901',
        email: 'michael.d@email.com',
        lastMRIDate: '2024-01-11',
        status: 'Active',
        diagnosis: 'Glioma',
    },
    {
        id: 'PT-006',
        name: 'Sarah Wilson',
        age: 43,
        gender: 'Female',
        medicalRecordNumber: 'MRN-2024-006',
        dateOfBirth: '1981-12-05',
        address: '987 Medical Lane, Philadelphia, PA',
        phone: '+1 (555) 678-9012',
        email: 'sarah.w@email.com',
        lastMRIDate: '2024-01-10',
        status: 'Inactive',
        diagnosis: 'Meningioma',
    },
    {
        id: 'PT-007',
        name: 'David Lee',
        age: 55,
        gender: 'Male',
        medicalRecordNumber: 'MRN-2024-007',
        dateOfBirth: '1969-06-25',
        address: '147 Wellness Drive, San Antonio, TX',
        phone: '+1 (555) 789-0123',
        email: 'david.lee@email.com',
        lastMRIDate: '2024-01-09',
        status: 'Active',
        diagnosis: 'Glioma',
    },
    {
        id: 'PT-008',
        name: 'Jennifer Martinez',
        age: 36,
        gender: 'Female',
        medicalRecordNumber: 'MRN-2024-008',
        dateOfBirth: '1988-02-14',
        address: '258 Diagnosis Ave, San Diego, CA',
        phone: '+1 (555) 890-1234',
        email: 'jennifer.m@email.com',
        lastMRIDate: '2024-01-08',
        status: 'Active',
        diagnosis: 'Pituitary',
    },
    {
        id: 'PT-021',
        name: 'Sophia Clarke',
        age: 47,
        gender: 'Female',
        medicalRecordNumber: 'MRN-2024-021',
        dateOfBirth: '1977-08-12',
        address: '369 Neural Path, Boston, MA',
        phone: '+1 (555) 901-2345',
        email: 'sophia.clarke@email.com',
        lastMRIDate: '2024-01-20',
        status: 'Active',
        diagnosis: 'Glioma',
    },
];

// Cases Data
export const cases: Case[] = [
    {
        caseId: 'CS-001',
        patientId: 'PT-001',
        patientName: 'John Smith',
        examinationDate: '2024-01-15',
        mriType: 'T1-weighted',
        eventType: 'Initial Scan',
        confidence: 94.5,
        status: 'Completed',
    },
    {
        caseId: 'CS-002',
        patientId: 'PT-002',
        patientName: 'Maria Garcia',
        examinationDate: '2024-01-14',
        mriType: 'T2-FLAIR',
        eventType: 'Follow-up',
        confidence: 89.2,
        status: 'Completed',
    },
    {
        caseId: 'CS-003',
        patientId: 'PT-003',
        patientName: 'Robert Johnson',
        examinationDate: '2024-01-13',
        mriType: 'Contrast Enhanced',
        eventType: 'Initial Scan',
        confidence: 91.8,
        status: 'Processing',
    },
    {
        caseId: 'CS-004',
        patientId: 'PT-004',
        patientName: 'Emily Brown',
        examinationDate: '2024-01-12',
        mriType: 'T1-weighted',
        eventType: 'Routine Check',
        confidence: 97.3,
        status: 'Completed',
    },
    {
        caseId: 'CS-005',
        patientId: 'PT-005',
        patientName: 'Michael Davis',
        examinationDate: '2024-01-11',
        mriType: 'T2-FLAIR',
        eventType: 'Initial Scan',
        confidence: 85.6,
        status: 'Pending',
    },
    {
        caseId: 'CS-006',
        patientId: 'PT-006',
        patientName: 'Sarah Wilson',
        examinationDate: '2024-01-10',
        mriType: 'Contrast Enhanced',
        eventType: 'Follow-up',
        confidence: 92.1,
        status: 'Completed',
    },
    {
        caseId: 'CS-007',
        patientId: 'PT-007',
        patientName: 'David Lee',
        examinationDate: '2024-01-09',
        mriType: 'T1-weighted',
        eventType: 'Post-Treatment',
        confidence: 88.4,
        status: 'Processing',
    },
    {
        caseId: 'CS-008',
        patientId: 'PT-008',
        patientName: 'Jennifer Martinez',
        examinationDate: '2024-01-08',
        mriType: 'T2-FLAIR',
        eventType: 'Initial Scan',
        confidence: 93.7,
        status: 'Completed',
    },
];

// Recent Patient Scans for Dashboard
export const recentScans = [
    { caseId: 'CS-001', patientName: 'John Smith', mriType: 'T1-weighted', tumorType: 'Glioma', confidence: 94.5, status: 'Completed', date: '2024-01-15' },
    { caseId: 'CS-002', patientName: 'Maria Garcia', mriType: 'T2-FLAIR', tumorType: 'Meningioma', confidence: 89.2, status: 'Completed', date: '2024-01-14' },
    { caseId: 'CS-003', patientName: 'Robert Johnson', mriType: 'Contrast Enhanced', tumorType: 'Pituitary', confidence: 91.8, status: 'Processing', date: '2024-01-13' },
    { caseId: 'CS-004', patientName: 'Emily Brown', mriType: 'T1-weighted', tumorType: 'No Tumor', confidence: 97.3, status: 'Completed', date: '2024-01-12' },
    { caseId: 'CS-005', patientName: 'Michael Davis', mriType: 'T2-FLAIR', tumorType: 'Glioma', confidence: 85.6, status: 'Pending', date: '2024-01-11' },
    { caseId: 'CS-006', patientName: 'Sarah Wilson', mriType: 'Contrast Enhanced', tumorType: 'Meningioma', confidence: 92.1, status: 'Completed', date: '2024-01-10' },
    { caseId: 'CS-007', patientName: 'David Lee', mriType: 'T1-weighted', tumorType: 'Glioma', confidence: 88.4, status: 'Processing', date: '2024-01-09' },
    { caseId: 'CS-008', patientName: 'Jennifer Martinez', mriType: 'T2-FLAIR', tumorType: 'Pituitary', confidence: 93.7, status: 'Completed', date: '2024-01-08' },
];

// Sample Analysis Result (for Sophia Clarke - PT-021)
export const sampleAnalysisResult: AnalysisResult = {
    tumorDetected: true,
    confidence: 93.2,
    tumorType: 'Glioma',
    sizeMm2: 1320,
    location: 'Left Temporal Lobe',
    severity: 'High',
    growthRate: '3 mm/month',
    recommendation: 'Immediate consultation with a neurosurgeon is recommended due to tumor location and size. Consider biopsy for definitive diagnosis and treatment planning.',
};

// Chart Data for Analytics
export const analyticsData = {
    caseCompletionRate: [
        { month: 'Week 1', rate: 85 },
        { month: 'Week 2', rate: 88 },
        { month: 'Week 3', rate: 92 },
        { month: 'Week 4', rate: 89 },
        { month: 'Week 5', rate: 94 },
        { month: 'Week 6', rate: 96.3 },
    ],
    caseStatusDistribution: [
        { name: 'Completed', value: 106, color: '#22c55e' },
        { name: 'Processing', value: 4, color: '#eab308' },
        { name: 'Pending', value: 4, color: '#3b82f6' },
        { name: 'Failed', value: 2, color: '#ef4444' },
    ],
    tumorSizeOverTime: [
        { month: 'Jan', size: 8 },
        { month: 'Feb', size: 9 },
        { month: 'Mar', size: 8.5 },
        { month: 'Apr', size: 9.5 },
        { month: 'May', size: 10 },
        { month: 'Jun', size: 10 },
        { month: 'Jul', size: 11 },
        { month: 'Aug', size: 10 },
    ],
};

// Archive Records
export const archiveRecords: ArchiveRecord[] = [
    { id: 'CS-2023-009', patientName: 'Ellen Martin', archiveDate: '2023-06-15', reportDate: '2023-06-01', tumorType: 'No Tumor', fileStatus: 'Archived' },
    { id: 'CS-2023-007', patientName: 'Luke Turner', archiveDate: '2023-04-12', reportDate: '2023-04-01', tumorType: 'Pituitary', fileStatus: 'Archived' },
    { id: 'CS-2023-005', patientName: 'Ana Morgan', archiveDate: '2023-02-20', reportDate: '2023-02-10', tumorType: 'Glioma', fileStatus: 'Archived' },
    { id: 'CS-2022-034', patientName: 'Isabelle Perrin', archiveDate: '2022-12-18', reportDate: '2022-12-05', tumorType: 'Meningioma', fileStatus: 'Archived' },
    { id: 'CS-2022-021', patientName: 'Mike Hughes', archiveDate: '2022-09-30', reportDate: '2022-09-15', tumorType: 'No Tumor', fileStatus: 'Archived' },
];

// Review Queue Items
export const reviewQueue: ReviewItem[] = [
    {
        caseId: 'CS-2024-038',
        patientName: 'Anna White',
        submissionDate: '2024-01-18',
        priority: 'High',
        status: 'Pending',
        confidence: 89.5,
        notes: 'Tumor detected in frontal lobe. Requires senior review.',
    },
    {
        caseId: 'CS-2024-037',
        patientName: 'James Brown',
        submissionDate: '2024-01-17',
        priority: 'Normal',
        status: 'In Review',
        reviewer: 'Dr. Smith',
        confidence: 92.3,
        notes: 'Follow-up scan showing improvement.',
    },
    {
        caseId: 'CS-2024-036',
        patientName: 'Mary Johnson',
        submissionDate: '2024-01-16',
        priority: 'Urgent',
        status: 'Pending',
        confidence: 95.1,
        notes: 'Large mass detected. Immediate attention required.',
    },
    {
        caseId: 'CS-2024-035',
        patientName: 'Tom Wilson',
        submissionDate: '2024-01-15',
        priority: 'Low',
        status: 'Approved',
        reviewer: 'Dr. Jones',
        confidence: 97.8,
        notes: 'Routine scan. No abnormalities detected.',
    },
    {
        caseId: 'CS-2024-034',
        patientName: 'Lisa Davis',
        submissionDate: '2024-01-14',
        priority: 'Normal',
        status: 'Rejected',
        reviewer: 'Dr. Lee',
        confidence: 78.2,
        notes: 'Image quality insufficient. Request rescan.',
    },
];

// Processing Steps for AI Pipeline
export const processingSteps = [
    { id: 1, name: 'Validation', description: 'Validating MRI format and quality', status: 'completed' },
    { id: 2, name: 'Preprocessing', description: 'Normalizing and enhancing image', status: 'completed' },
    { id: 3, name: 'Detection', description: 'Running ResNet50 model for tumor detection', status: 'completed' },
    { id: 4, name: 'Segmentation', description: 'Running U-Net model for tumor segmentation', status: 'completed' },
    { id: 5, name: 'Classification', description: 'Running InceptionV3 for tumor classification', status: 'completed' },
    { id: 6, name: 'Quantification', description: 'Calculating tumor measurements', status: 'completed' },
];

// Medical History for Patient Profile
export const medicalHistory = [
    { condition: 'Tumor Classes', value: 'Glioma' },
    { condition: 'Blood Type', value: 'B+' },
    { condition: 'Chronic Condition', value: 'Hypertension' },
    { condition: 'Allergies', value: 'Paracetamol, Sulpha, Sulphathiazole' },
];

// Examination Timeline
export const examinationTimeline = [
    { date: '2024-01-20', event: 'Latest MRI Scan', type: 'scan' },
    { date: '2024-01-15', event: 'Follow-up Consultation', type: 'consultation' },
    { date: '2024-01-10', event: 'Initial Assessment', type: 'assessment' },
    { date: '2024-01-05', event: 'First Visit', type: 'visit' },
];
