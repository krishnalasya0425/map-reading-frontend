import React, { useState, useEffect } from 'react';
import { FaVrCardboard, FaCheckCircle, FaClock, FaUser } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import unityProgressAPI from '../entities/unityProgress';
import ModuleProgressView from './ModuleProgressView';

const UnityProgressModal = ({ isOpen, onClose, classId, className }) => {
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        if (isOpen && classId) {
            loadProgress();
        }
    }, [isOpen, classId]);

    const loadProgress = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await unityProgressAPI.getProgressByClass(classId);
            setProgressData(response.data || []);
        } catch (err) {
            console.error('Error loading Unity progress:', err);
            setError('Failed to load progress data');
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '0m';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 80) return '#10b981'; // green
        if (percentage >= 50) return '#f59e0b'; // orange
        return '#ef4444'; // red
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-[#074F06] shadow-lg">
                            <FaVrCardboard className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">VR Session Progress</h2>
                            <p className="text-sm text-gray-600">{className || 'Class Progress'}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <FiX size={24} className="text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#074F06]"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <div className="text-red-500 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 font-semibold">{error}</p>
                            <button
                                onClick={loadProgress}
                                className="mt-4 px-6 py-2 bg-[#074F06] text-white rounded-lg hover:bg-[#053d05] transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : progressData.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="inline-block p-8 rounded-full bg-gray-100 mb-6">
                                <FaVrCardboard size={64} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No VR Sessions Yet</h3>
                            <p className="text-gray-500">Students haven't started any VR practice sessions yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                                    <div className="flex items-center gap-3">
                                        <FaUser className="text-blue-600" size={24} />
                                        <div>
                                            <p className="text-sm text-blue-600 font-semibold">Total Students</p>
                                            <p className="text-2xl font-bold text-blue-800">
                                                {new Set(progressData.map(p => p.student_id)).size}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                                    <div className="flex items-center gap-3">
                                        <FaCheckCircle className="text-green-600" size={24} />
                                        <div>
                                            <p className="text-sm text-green-600 font-semibold">Completed Sessions</p>
                                            <p className="text-2xl font-bold text-green-800">
                                                {progressData.filter(p => p.completed).length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                                    <div className="flex items-center gap-3">
                                        <FaClock className="text-purple-600" size={24} />
                                        <div>
                                            <p className="text-sm text-purple-600 font-semibold">Avg. Progress</p>
                                            <p className="text-2xl font-bold text-purple-800">
                                                {progressData.length > 0
                                                    ? Math.round(progressData.reduce((sum, p) => sum + parseFloat(p.progress_percentage || 0), 0) / progressData.length)
                                                    : 0}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Table */}
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Student</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Build Type</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Progress</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Duration</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Last Updated</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {progressData.map((progress, index) => (
                                                <tr key={progress.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-semibold text-gray-900">{progress.student_name}</div>
                                                            <div className="text-xs text-gray-500">{progress.army_no}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${progress.build_type === 'practice'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-purple-100 text-purple-800'
                                                            }`}>
                                                            {progress.build_type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                                                                <div
                                                                    className="h-2 rounded-full transition-all"
                                                                    style={{
                                                                        width: `${progress.progress_percentage}%`,
                                                                        backgroundColor: getProgressColor(progress.progress_percentage)
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-sm font-bold text-gray-700">
                                                                {Math.round(progress.progress_percentage)}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm text-gray-700 font-medium">
                                                            {formatDuration(progress.session_duration_seconds)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {progress.completed ? (
                                                            <span className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                                                                <FaCheckCircle size={14} />
                                                                Completed
                                                            </span>
                                                        ) : (
                                                            <span className="text-yellow-600 font-semibold text-sm">In Progress</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {formatDate(progress.updated_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={() => setSelectedStudent(progress)}
                                                            className="text-[#074F06] hover:text-[#053d05] font-semibold text-sm"
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    >
                        Close
                    </button>
                </div>
            </div>

            {/* Student Details Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-800">Session Details</h3>
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 font-semibold">Student Name</p>
                                    <p className="text-lg font-bold text-gray-800">{selectedStudent.student_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-semibold">Army No</p>
                                    <p className="text-lg font-bold text-gray-800">{selectedStudent.army_no}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-semibold">Build Type</p>
                                    <p className="text-lg font-bold text-gray-800 capitalize">{selectedStudent.build_type}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-semibold">Progress</p>
                                    <p className="text-lg font-bold text-gray-800">{Math.round(selectedStudent.progress_percentage)}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-semibold">Duration</p>
                                    <p className="text-lg font-bold text-gray-800">{formatDuration(selectedStudent.session_duration_seconds)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-semibold">Status</p>
                                    <p className={`text-lg font-bold ${selectedStudent.completed ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {selectedStudent.completed ? 'Completed' : 'In Progress'}
                                    </p>
                                </div>
                            </div>

                            {selectedStudent.session_data && (
                                <div className="mt-6">
                                    <p className="text-sm text-gray-500 font-semibold mb-2">Module Progress</p>
                                    <ModuleProgressView sessionData={selectedStudent.session_data} />
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="px-6 py-2 bg-[#074F06] text-white rounded-lg hover:bg-[#053d05] transition-colors font-semibold"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnityProgressModal;
