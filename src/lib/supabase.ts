import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types untuk database
export interface Patient {
    id: string;
    patient_id: string;
    medical_record_number: string;
    name: string;
    date_of_birth: string;
    age: number;
    gender: 'Male' | 'Female';
    phone?: string;
    email?: string;
    address?: string;
    weight?: number;
    height?: number;
    diagnosis?: string;
    status: 'Active' | 'Inactive' | 'Under Review';
    clinical_symptoms?: string;
    medical_history?: string;
    created_at: string;
    updated_at: string;
}

export interface Case {
    id: string;
    case_id: string;
    patient_id: string;
    mri_date: string;
    study_date: string;
    mri_type: string;
    status: 'Pending' | 'Processing' | 'Completed';
    created_at: string;
    updated_at: string;
}

export interface ScanResult {
    id: string;
    case_id: string;
    patient_id: string;
    tumor_detected: boolean;
    tumor_type: 'glioma' | 'meningioma' | 'pituitary' | 'notumor';
    display_name: string;
    confidence: number;
    severity: 'High' | 'Moderate' | 'Low' | 'None';
    recommendation: string;
    mri_image_url?: string;
    doctor_notes?: string;
    created_at: string;
}

// Patient Functions
export async function getPatients() {
    const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Patient[];
}

export async function getPatientById(patientId: string) {
    const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('patient_id', patientId)
        .single();

    if (error) throw error;
    return data as Patient;
}

export async function createPatient(patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
        .from('patients')
        .insert([patient])
        .select()
        .single();

    if (error) throw error;
    return data as Patient;
}

// Case Functions
export async function getCases() {
    const { data, error } = await supabase
        .from('cases')
        .select(`
      *,
      patients (name, patient_id)
    `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getCaseById(caseId: string) {
    const { data, error } = await supabase
        .from('cases')
        .select(`
      *,
      patients (*)
    `)
        .eq('case_id', caseId)
        .single();

    if (error) throw error;
    return data;
}

export async function createCase(caseData: Omit<Case, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
        .from('cases')
        .insert([caseData])
        .select()
        .single();

    if (error) throw error;
    return data as Case;
}

export async function updateCaseStatus(caseId: string, status: Case['status']) {
    const { data, error } = await supabase
        .from('cases')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('case_id', caseId)
        .select()
        .single();

    if (error) throw error;
    return data as Case;
}

// Scan Result Functions
export async function getScanResults() {
    const { data, error } = await supabase
        .from('scan_results')
        .select(`
      *,
      patients (name, patient_id),
      cases (case_id, mri_type, mri_date)
    `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getScanResultByCase(caseId: string) {
    const { data, error } = await supabase
        .from('scan_results')
        .select(`
      *,
      patients (*),
      cases (*)
    `)
        .eq('case_id', caseId)
        .single();

    if (error) throw error;
    return data;
}

export async function createScanResult(result: Omit<ScanResult, 'id' | 'created_at'>) {
    const { data, error } = await supabase
        .from('scan_results')
        .insert([result])
        .select()
        .single();

    if (error) throw error;
    return data as ScanResult;
}

export async function updateScanResultNotes(resultId: string, doctorNotes: string) {
    const { data, error } = await supabase
        .from('scan_results')
        .update({ doctor_notes: doctorNotes })
        .eq('id', resultId)
        .select()
        .single();

    if (error) throw error;
    return data as ScanResult;
}

// Dashboard Stats
export async function getDashboardStats() {
    const { data: cases, error: casesError } = await supabase
        .from('cases')
        .select('status');

    const { data: results, error: resultsError } = await supabase
        .from('scan_results')
        .select('tumor_detected');

    if (casesError || resultsError) {
        return {
            totalCases: 0,
            pendingAnalysis: 0,
            completedReports: 0,
            detectedTumor: 0
        };
    }

    return {
        totalCases: cases?.length || 0,
        pendingAnalysis: cases?.filter(c => c.status === 'Pending' || c.status === 'Processing').length || 0,
        completedReports: cases?.filter(c => c.status === 'Completed').length || 0,
        detectedTumor: results?.filter(r => r.tumor_detected).length || 0
    };
}

// Upload MRI image to Supabase Storage
export async function uploadMRIImage(file: File, patientId: string, caseId: string) {
    // Sanitize file name (remove special characters)
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${patientId}/${caseId}/${Date.now()}_${safeName}`;

    console.log('Uploading to path:', fileName);
    console.log('File size:', file.size, 'Type:', file.type);

    const { data, error } = await supabase.storage
        .from('mri-images')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true // Overwrite if exists
        });

    if (error) {
        console.error('Storage upload error:', error);
        throw error;
    }

    console.log('Upload success:', data);

    // Get public URL
    const { data: urlData } = supabase.storage
        .from('mri-images')
        .getPublicUrl(fileName);

    console.log('Public URL:', urlData.publicUrl);

    return urlData.publicUrl;
}
