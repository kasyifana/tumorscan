-- TumorScan Database Schema
-- Run this in Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Patients Table
CREATE TABLE patients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id VARCHAR(20) UNIQUE NOT NULL,
  medical_record_number VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  age INTEGER,
  gender VARCHAR(10) CHECK (gender IN ('Male', 'Female')),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  diagnosis VARCHAR(100),
  status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Under Review')),
  clinical_symptoms TEXT,
  medical_history TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cases Table
CREATE TABLE cases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_id VARCHAR(20) UNIQUE NOT NULL,
  patient_id VARCHAR(20) REFERENCES patients(patient_id) ON DELETE CASCADE,
  mri_date DATE,
  study_date DATE,
  mri_type VARCHAR(50) DEFAULT 'T1-Weighted',
  status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scan Results Table
CREATE TABLE scan_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_id VARCHAR(20) REFERENCES cases(case_id) ON DELETE CASCADE,
  patient_id VARCHAR(20) REFERENCES patients(patient_id) ON DELETE CASCADE,
  tumor_detected BOOLEAN DEFAULT FALSE,
  tumor_type VARCHAR(20) CHECK (tumor_type IN ('glioma', 'meningioma', 'pituitary', 'notumor')),
  display_name VARCHAR(50),
  confidence DECIMAL(5,2),
  severity VARCHAR(20) CHECK (severity IN ('High', 'Moderate', 'Low', 'None')),
  recommendation TEXT,
  mri_image_url TEXT,
  doctor_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_patients_patient_id ON patients(patient_id);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_cases_patient_id ON cases(patient_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_scan_results_case_id ON scan_results(case_id);
CREATE INDEX idx_scan_results_patient_id ON scan_results(patient_id);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (for development)
-- For production, you should add proper authentication policies
CREATE POLICY "Allow all operations on patients" ON patients FOR ALL USING (true);
CREATE POLICY "Allow all operations on cases" ON cases FOR ALL USING (true);
CREATE POLICY "Allow all operations on scan_results" ON scan_results FOR ALL USING (true);

-- Insert some sample data
INSERT INTO patients (patient_id, medical_record_number, name, date_of_birth, age, gender, phone, email, diagnosis, status) VALUES
('PT-001', 'MRN-2024-001', 'John Smith', '1985-03-15', 39, 'Male', '+62 812-3456-7890', 'john.smith@email.com', 'Pending', 'Active'),
('PT-002', 'MRN-2024-002', 'Sarah Johnson', '1990-07-22', 34, 'Female', '+62 812-3456-7891', 'sarah.j@email.com', 'Glioma', 'Under Review'),
('PT-003', 'MRN-2024-003', 'Michael Chen', '1978-11-08', 46, 'Male', '+62 812-3456-7892', 'm.chen@email.com', 'No Tumor', 'Active');

-- Create storage bucket for MRI images (run separately in Storage section)
-- Go to Storage -> Create new bucket -> Name: "mri-images" -> Public: Yes
