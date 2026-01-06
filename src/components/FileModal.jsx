import React from "react";

const FileModal = ({ fileId, docType, fileData, onClose }) => {
  const token = localStorage.getItem("token");
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const hasData = fileData && fileData.length > 0;
  const fileURL = hasData
    ? `data:${docType};base64,${fileData}`
    : `${BASE_URL}/classes/docs/file/${fileId}${token ? `?token=${token}` : ''}`;

  const isPDF = docType.includes("pdf");
  const isImage = docType.startsWith("image");
  const isVideo = docType.startsWith("video");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 backdrop-blur-md">
      <button
        className="absolute top-5 right-5 bg-red-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow-2xl hover:bg-red-700 transition-all z-[60] hover:scale-110 active:scale-95"
        onClick={onClose}
      >
        ✕
      </button>

      <div className="w-full h-full flex items-center justify-center relative">
        {/* PDF VIEW */}
        {isPDF && (
          <iframe
            src={fileURL}
            className="w-full h-full rounded-xl shadow-2xl border border-white/10"
            title="PDF Preview"
          ></iframe>
        )}

        {/* IMAGE VIEW */}
        {isImage && (
          <div className="relative group">
            <img
              src={fileURL}
              alt="preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl transition-transform duration-300"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/800x600?text=Preview+Error";
              }}
            />
          </div>
        )}

        {/* VIDEO VIEW */}
        {isVideo && (
          <video
            src={fileURL}
            controls
            autoPlay
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
          />
        )}

        {!isPDF && !isImage && !isVideo && (
          <div className="bg-white p-10 rounded-2xl text-center">
            <p className="text-gray-800 font-bold">Preview not available for this file type</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileModal;
