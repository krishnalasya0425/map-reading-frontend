import React from 'react';
import { FaCheckCircle, FaClock, FaBook } from 'react-icons/fa';

/**
 * Component to display module-based progress from Unity VR sessions
 * Expects session_data in format:
 * {
 *   userId: "USER_001",
 *   userName: "raj",
 *   modules: [
 *     {
 *       moduleId: "MODULE_01",
 *       moduleName: "title",
 *       completionPercentage: 100.0,
 *       isCompleted: true,
 *       timeSpentSeconds: 600,
 *       completedAt: "2026-01-31T09:54:57Z"
 *     }
 *   ]
 * }
 */
const ModuleProgressView = ({ sessionData }) => {
    if (!sessionData || typeof sessionData === 'string') {
        try {
            sessionData = JSON.parse(sessionData);
        } catch (e) {
            return <p className="text-sm text-gray-500">Invalid session data</p>;
        }
    }

    const modules = sessionData?.modules || [];

    if (modules.length === 0) {
        return (
            <div className="text-center py-4">
                <p className="text-sm text-gray-500">No module data available</p>
            </div>
        );
    }

    // Calculate overall statistics
    const totalModules = modules.length;
    const completedModules = modules.filter(m => m.isCompleted).length;
    const totalTimeSpent = modules.reduce((sum, m) => sum + (m.timeSpentSeconds || 0), 0);
    const avgCompletion = modules.reduce((sum, m) => sum + (m.completionPercentage || 0), 0) / totalModules;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 80) return '#10b981'; // green
        if (percentage >= 50) return '#f59e0b'; // orange
        return '#ef4444'; // red
    };

    return (
        <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                        <FaBook className="text-blue-600" size={16} />
                        <p className="text-xs text-blue-600 font-semibold">Total Modules</p>
                    </div>
                    <p className="text-xl font-bold text-blue-800">{totalModules}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                        <FaCheckCircle className="text-green-600" size={16} />
                        <p className="text-xs text-green-600 font-semibold">Completed</p>
                    </div>
                    <p className="text-xl font-bold text-green-800">{completedModules}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-1">
                        <FaClock className="text-purple-600" size={16} />
                        <p className="text-xs text-purple-600 font-semibold">Total Time</p>
                    </div>
                    <p className="text-xl font-bold text-purple-800">{formatTime(totalTimeSpent)}</p>
                </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
                    <span className="text-sm font-bold text-gray-800">{Math.round(avgCompletion)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="h-3 rounded-full transition-all"
                        style={{
                            width: `${avgCompletion}%`,
                            backgroundColor: getProgressColor(avgCompletion)
                        }}
                    ></div>
                </div>
            </div>

            {/* Module List */}
            <div className="space-y-2">
                <h4 className="text-sm font-bold text-gray-700 mb-2">Module Breakdown</h4>
                {modules.map((module, index) => (
                    <div
                        key={module.moduleId || index}
                        className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h5 className="font-semibold text-gray-800 text-sm">
                                        {module.moduleName || `Module ${index + 1}`}
                                    </h5>
                                    {module.isCompleted && (
                                        <FaCheckCircle className="text-green-500" size={14} />
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    ID: {module.moduleId}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-800">
                                    {Math.round(module.completionPercentage || 0)}%
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatTime(module.timeSpentSeconds || 0)}
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                                className="h-2 rounded-full transition-all"
                                style={{
                                    width: `${module.completionPercentage || 0}%`,
                                    backgroundColor: getProgressColor(module.completionPercentage || 0)
                                }}
                            ></div>
                        </div>

                        {/* Completion Date */}
                        {module.completedAt && (
                            <p className="text-xs text-gray-500">
                                Last activity: {formatDate(module.completedAt)}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* User Info */}
            {sessionData.userName && (
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-4">
                    <p className="text-xs text-gray-600">
                        <span className="font-semibold">User:</span> {sessionData.userName}
                        {sessionData.userId && ` (${sessionData.userId})`}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ModuleProgressView;
