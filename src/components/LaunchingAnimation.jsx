import React, { useState, useEffect } from "react";
import { FiX, FiExternalLink, FiCheck } from "react-icons/fi";

const LaunchingAnimation = ({ isOpen, onClose, mode = "practice" }) => {
    const [stage, setStage] = useState("loading"); // loading, success
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isOpen) {
            setStage("loading");
            setProgress(0);
            return;
        }

        // Simulate loading progress
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    // When progress reaches 100%, transition to success
                    setTimeout(() => {
                        setStage("success");
                    }, 300); // Small delay for smooth transition
                    return 100;
                }
                return prev + 10;
            });
        }, 150);

        return () => {
            clearInterval(progressInterval);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const title = mode === "vr" ? "VR Practice" : "Practice";

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-[500px] relative overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                    aria-label="Close"
                >
                    <FiX size={24} />
                </button>

                {/* Content */}
                <div className="p-8">
                    {stage === "loading" && (
                        <div className="text-center">
                            {/* Animated Icon */}
                            <div className="mb-6 flex justify-center">
                                <div className="relative">
                                    {/* Outer spinning ring */}
                                    <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-spin-slow"></div>

                                    {/* Inner spinning ring */}
                                    <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>

                                    {/* Center icon */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {mode === "vr" ? (
                                            <svg
                                                className="w-10 h-10 text-blue-600"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M20.74 6H3.26C2.01 6 1 7.01 1 8.26v7.48C1 16.99 2.01 18 3.26 18h4.59l2.1 2.1c.58.58 1.52.58 2.1 0l2.1-2.1h4.59c1.25 0 2.26-1.01 2.26-2.26V8.26C23 7.01 21.99 6 20.74 6zM7.5 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm9 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="w-10 h-10 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Launching {title}
                            </h2>

                            {/* Subtitle */}
                            <p className="text-gray-600 mb-6">
                                Preparing your session...
                            </p>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>

                            {/* Progress Percentage */}
                            <p className="text-sm text-gray-500">{progress}%</p>

                            {/* Loading dots animation */}
                            <div className="flex justify-center gap-2 mt-6">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                            </div>
                        </div>
                    )}

                    {stage === "success" && (
                        <div className="text-center">
                            {/* Success Icon */}
                            <div className="mb-6 flex justify-center">
                                <div className="relative">
                                    {/* Success circle with checkmark */}
                                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
                                        <FiCheck className="w-12 h-12 text-green-600" strokeWidth={3} />
                                    </div>

                                    {/* Animated ring */}
                                    <div className="absolute inset-0 w-24 h-24 border-4 border-green-300 rounded-full animate-ping-slow"></div>
                                </div>
                            </div>

                            {/* Success Title */}
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {title} Launched Successfully!
                            </h2>

                            {/* Success Message */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center justify-center gap-2 text-blue-700">
                                    <FiCheck className="w-5 h-5" />
                                    <p className="font-medium">
                                        {mode === "vr"
                                            ? "VR application is now running"
                                            : "Practice session is now running"}
                                    </p>
                                </div>
                            </div>

                            {/* Instructions */}
                            <p className="text-gray-600 text-sm mb-6">
                                {mode === "vr"
                                    ? "Please put on your VR headset and ensure it's connected to your PC."
                                    : "The practice application should now be visible on your desktop."}
                            </p>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg"
                            >
                                Got it!
                            </button>
                        </div>
                    )}
                </div>

                {/* Decorative gradient bar at bottom */}
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            </div>
        </div>
    );
};

export default LaunchingAnimation;
