'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdSearch, MdFilterList, MdCheck, MdClose } from 'react-icons/md';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/lib/supabase';

interface ReviewItem {
    id: string;
    case_id: string;
    patient_id: string;
    tumor_type: string;
    display_name: string;
    confidence: number;
    severity: string;
    recommendation: string;
    doctor_notes: string | null;
    created_at: string;
    patients: {
        name: string;
    };
    cases: {
        mri_date: string;
        mri_type: string;
        status: string;
    };
}

export default function ReviewPage() {
    const [items, setItems] = useState<ReviewItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<ReviewItem | null>(null);
    const [noteText, setNoteText] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadReviewItems();
    }, []);

    async function loadReviewItems() {
        try {
            const { data, error } = await supabase
                .from('scan_results')
                .select(`
                    *,
                    patients (name),
                    cases (mri_date, mri_type, status)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setItems(data as unknown as ReviewItem[]);
        } catch (error) {
            console.error('Error loading review items:', error);
        } finally {
            setLoading(false);
        }
    }

    // Filter for items that need review (high severity or no doctor notes)
    const pendingReview = items.filter(item =>
        item.severity === 'High' || !item.doctor_notes
    );

    const filteredItems = items.filter((item) => {
        const matchesSearch =
            item.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.patients?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = priorityFilter === 'all' ||
            (priorityFilter === 'high' && item.severity === 'High') ||
            (priorityFilter === 'moderate' && item.severity === 'Moderate') ||
            (priorityFilter === 'pending' && !item.doctor_notes);
        return matchesSearch && matchesPriority;
    });

    const openNoteModal = (item: ReviewItem) => {
        setEditingItem(item);
        setNoteText(item.doctor_notes || '');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setNoteText('');
    };

    const handleSaveNote = async () => {
        if (!editingItem) return;

        setSaving(true);
        try {
            await supabase
                .from('scan_results')
                .update({ doctor_notes: noteText })
                .eq('id', editingItem.id);

            await loadReviewItems();
            closeModal();
        } catch (error) {
            console.error('Error updating notes:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Review Queue</h1>
                <p className="text-sm text-gray-500">Review and approve AI-generated findings</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-500">Total Findings</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{items.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-500">Pending Review</p>
                    <p className="text-xl sm:text-2xl font-bold text-yellow-600">{pendingReview.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-500">High Priority</p>
                    <p className="text-xl sm:text-2xl font-bold text-red-600">
                        {items.filter(i => i.severity === 'High').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-500">Reviewed</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-600">
                        {items.filter(i => i.doctor_notes).length}
                    </p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Case ID or Patient Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                </div>
                <div className="relative">
                    <MdFilterList className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white text-sm"
                    >
                        <option value="all">All Findings</option>
                        <option value="pending">Pending Review</option>
                        <option value="high">High Priority</option>
                        <option value="moderate">Moderate Priority</option>
                    </select>
                </div>
            </div>

            {/* Review Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Case ID</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">AI Finding</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Confidence</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Priority</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading...</td>
                                </tr>
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        {searchTerm || priorityFilter !== 'all'
                                            ? 'No findings match your search.'
                                            : 'No findings to review yet. Complete an MRI analysis to see results here.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">{item.case_id}</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">{item.patients?.name || '-'}</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <span className={`text-xs sm:text-sm font-medium ${item.tumor_type === 'glioma' ? 'text-red-600' :
                                                    item.tumor_type === 'meningioma' ? 'text-orange-600' :
                                                        item.tumor_type === 'pituitary' ? 'text-purple-600' :
                                                            'text-green-600'
                                                }`}>
                                                {item.display_name}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-primary font-medium">
                                            {item.confidence.toFixed(1)}%
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <StatusBadge status={item.severity} />
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            {item.doctor_notes ? (
                                                <span className="inline-flex items-center gap-1 text-green-600 text-xs sm:text-sm">
                                                    <MdCheck className="w-4 h-4" />
                                                    Reviewed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-yellow-600 text-xs sm:text-sm">
                                                    <MdClose className="w-4 h-4" />
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/reports/${item.case_id}`}
                                                    className="text-xs sm:text-sm text-primary hover:text-primary-dark font-medium"
                                                >
                                                    View
                                                </Link>
                                                <span className="text-gray-300">|</span>
                                                <button
                                                    onClick={() => openNoteModal(item)}
                                                    className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 font-medium"
                                                >
                                                    {item.doctor_notes ? 'Edit Note' : 'Add Note'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Note Modal */}
            {showModal && editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-fade-in">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingItem.doctor_notes ? 'Edit Doctor Note' : 'Add Doctor Note'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <MdClose className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Case Info */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                <strong>Case:</strong> {editingItem.case_id} •
                                <strong className="ml-2">Patient:</strong> {editingItem.patients?.name}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                <strong>Finding:</strong> {editingItem.display_name} ({editingItem.confidence.toFixed(1)}%)
                            </p>
                        </div>

                        {/* Text Area */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Doctor&apos;s Notes
                            </label>
                            <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                rows={5}
                                placeholder="Enter clinical observations, recommendations, or follow-up instructions..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveNote}
                                disabled={saving}
                                className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors ${saving
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-primary text-dark hover:bg-primary-dark'
                                    }`}
                            >
                                {saving ? 'Saving...' : 'Save Note'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
