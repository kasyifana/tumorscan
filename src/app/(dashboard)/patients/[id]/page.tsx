'use client';

import Link from 'next/link';
import { MdVerified, MdCalendarToday, MdPhone, MdEmail } from 'react-icons/md';
import { patients, medicalHistory, examinationTimeline, analyticsData } from '@/data/mockData';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

export default function PatientProfilePage({ params }: { params: { id: string } }) {
    // Find patient or use default
    const patient = patients.find((p) => p.id === params.id) || patients[8]; // Sophia Clarke

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Patient Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                    {/* Avatar */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                        <span className="text-2xl sm:text-3xl font-bold text-amber-600">
                            {patient.name.charAt(0)}
                        </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{patient.name}</h1>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                                {patient.status}
                            </span>
                            <MdVerified className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-sm text-gray-500 mb-3 sm:mb-4">
                            Medical ID: {patient.medicalRecordNumber}
                        </p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                                <MdCalendarToday className="w-4 h-4" />
                                {patient.age} years • {patient.gender}
                            </span>
                            <span className="flex items-center gap-1">
                                <MdPhone className="w-4 h-4" />
                                {patient.phone}
                            </span>
                            <span className="flex items-center gap-1">
                                <MdEmail className="w-4 h-4" />
                                <span className="truncate max-w-[150px] sm:max-w-none">{patient.email}</span>
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <Link
                        href={`/cases/add?patientId=${patient.id}`}
                        className="w-full sm:w-auto text-center px-4 py-2 bg-primary text-dark font-medium rounded-lg hover:bg-primary-dark transition-colors text-sm"
                    >
                        Add New Case
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Medical History */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                    <h2 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Medical History</h2>
                    <div className="space-y-3 sm:space-y-4">
                        {medicalHistory.map((item, index) => (
                            <div key={index} className="flex justify-between py-2 sm:py-3 border-b border-gray-100 last:border-0">
                                <span className="text-sm text-gray-600">{item.condition}</span>
                                <span className="font-medium text-gray-900 text-sm">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Examination Timeline */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                    <h2 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Examination Timeline</h2>
                    <div className="space-y-3 sm:space-y-4">
                        {examinationTimeline.map((item, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">{item.event}</p>
                                    <p className="text-xs sm:text-sm text-gray-500">{item.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Data Visualization */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Data Visualization</h2>
                <div className="h-48 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData.tumorSizeOverTime}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                            <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="size"
                                stroke="#E5C100"
                                strokeWidth={2}
                                dot={{ fill: '#E5C100', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
