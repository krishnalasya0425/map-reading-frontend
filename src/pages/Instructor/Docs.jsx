import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import classAPI from "../../entities/class";
import Modal from "../../components/FileModal";
import UploadDocs from "../../components/UploadDocs";
import {
  FaFilePdf,
  FaFileImage,
  FaFile,
  FaUpload,
  FaClipboardList,
  FaMagic,
  FaFolderOpen,
  FaDownload,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import { FiGrid, FiList } from "react-icons/fi";

const Docs = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [classData, setClassData] = useState({});
  const [docType, setDocType] = useState(null);
  const [uploadDoc, setUploadDoc] = useState(false);
  const [previewId, setPreviewId] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const role = localStorage.getItem("role");

  const loadDocs = async () => {
    try {
      const classInfo = await classAPI.getClassInfo(classId);
      setClassData(classInfo);

      const res = await classAPI.getDocs(classId);
      setDocs(res.docs);
    } catch (err) {
      console.error("Failed to load docs", err.message);
    }
  };

  useEffect(() => {
    loadDocs();
  }, [classId, uploadDoc]);

  const getFileIcon = (mime) => {
    if (!mime) return <FaFile size={40} className="text-gray-500" />;
    if (mime.includes("pdf")) return <FaFilePdf size={40} className="text-red-500" />;
    if (mime.startsWith("image")) return <FaFileImage size={40} className="text-blue-500" />;
    return <FaFile size={40} className="text-gray-500" />;
  };

  const getFileTypeLabel = (mime) => {
    if (!mime) return "Unknown";
    if (mime.includes("pdf")) return "PDF Document";
    if (mime.startsWith("image")) return "Image";
    return "File";
  };

  const handleDeleteDoc = async (docId, docTitle) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${docTitle}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      await classAPI.deleteDoc(classId, docId);
      // Refresh the documents list
      loadDocs();
      alert("Document deleted successfully!");
    } catch (err) {
      console.error("Failed to delete document", err.message);
      alert("Failed to delete document. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="mb-8">
          {/* Title and Actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#074F06' }}>
                  <FaFolderOpen className="text-white" size={28} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold" style={{ color: '#074F06' }}>
                    {classData.class_name || 'Class Documents'}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {docs.length} {docs.length === 1 ? 'document' : 'documents'} available
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {role !== "Student" && (
                <>
                  <button
                    className="flex items-center gap-2 px-5 py-3 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    style={{ backgroundColor: '#8B5CF6' }}
                    onClick={() => navigate(`/${classId}/generatetest`)}
                  >
                    <FaMagic size={18} />
                    <span className="hidden sm:inline">Generate Test</span>
                  </button>

                  <button
                    className="flex items-center gap-2 px-5 py-3 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    style={{ backgroundColor: '#074F06' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#053d05'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#074F06'}
                    onClick={() => setUploadDoc(true)}
                  >
                    <FaUpload size={18} />
                    <span className="hidden sm:inline">Upload</span>
                  </button>
                </>
              )}

              <button
                className="flex items-center gap-2 px-5 py-3 rounded-lg font-semibold shadow-lg transition-all"
                style={{ backgroundColor: '#9FCF9F', color: '#074F06' }}
              >
                <FaClipboardList size={18} />
                <span className="hidden sm:inline">Practice</span>
              </button>
            </div>
          </div>

          {/* View Mode Toggle and Stats */}
          <div className="flex items-center justify-between p-4 rounded-xl"
            style={{
              backgroundColor: 'rgba(159, 207, 159, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'white' }}>
                <FaFilePdf className="text-red-500" size={20} />
                <span className="font-semibold" style={{ color: '#074F06' }}>
                  {docs.filter(d => d.file_type?.includes('pdf')).length} PDFs
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'white' }}>
                <FaFileImage className="text-blue-500" size={20} />
                <span className="font-semibold" style={{ color: '#074F06' }}>
                  {docs.filter(d => d.file_type?.startsWith('image')).length} Images
                </span>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 p-1 rounded-lg" style={{ backgroundColor: 'white' }}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'text-white' : 'text-gray-600'}`}
                style={viewMode === 'grid' ? { backgroundColor: '#074F06' } : {}}
                title="Grid View"
              >
                <FiGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all ${viewMode === 'list' ? 'text-white' : 'text-gray-600'}`}
                style={viewMode === 'list' ? { backgroundColor: '#074F06' } : {}}
                title="List View"
              >
                <FiList size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Documents Display */}
        {docs.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 rounded-full mb-6"
              style={{
                backgroundColor: 'rgba(159, 207, 159, 0.7)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}>
              <FaFolderOpen size={64} style={{ color: '#074F06' }} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Documents Yet</h3>
            <p className="text-gray-500 mb-6">
              {role !== "Student"
                ? "Upload your first document to get started"
                : "No documents have been uploaded for this class yet"}
            </p>
            {role !== "Student" && (
              <button
                onClick={() => setUploadDoc(true)}
                className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                style={{ backgroundColor: '#074F06' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#053d05'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#074F06'}
              >
                <FaUpload size={18} />
                Upload Document
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="group cursor-pointer rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border relative"
                    style={{
                      backgroundColor: 'rgba(159, 207, 159, 0.7)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      borderColor: 'rgba(7, 79, 6, 0.2)',
                      boxShadow: '0 8px 32px 0 rgba(7, 79, 6, 0.1)'
                    }}
                    onClick={() => {
                      if (doc.file_type.includes("pdf") || doc.file_type.startsWith("image")) {
                        setPreviewId(doc.id);
                        setDocType(doc.file_type);
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#074F06';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.backgroundColor = 'rgba(159, 207, 159, 0.9)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(7, 79, 6, 0.2)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.backgroundColor = 'rgba(159, 207, 159, 0.7)';
                    }}
                  >
                    {/* Delete Button - Only for non-students */}
                    {role !== "Student" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          handleDeleteDoc(doc.id, doc.doc_title);
                        }}
                        className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-white hover:bg-red-50 shadow-md transition-all opacity-0 group-hover:opacity-100"
                        style={{ color: '#dc2626' }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#fee2e2';
                          e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.transform = 'scale(1)';
                        }}
                        title="Delete document"
                      >
                        <FaTrash size={16} />
                      </button>
                    )}

                    {/* Icon/Preview */}
                    <div className="flex items-center justify-center p-8 bg-white bg-opacity-50">
                      {getFileIcon(doc.file_type)}
                    </div>

                    {/* Document Info */}
                    <div className="p-4 bg-white bg-opacity-80">
                      <h3 className="font-semibold text-gray-800 mb-2 truncate" title={doc.doc_title}>
                        {doc.doc_title}
                      </h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{getFileTypeLabel(doc.file_type)}</span>
                        <div className="flex items-center gap-2 text-gray-400 group-hover:text-green-600 transition-colors">
                          <FaEye size={16} />
                          <span>View</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-3">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="group cursor-pointer rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border"
                    style={{
                      backgroundColor: 'rgba(159, 207, 159, 0.7)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      borderColor: 'rgba(7, 79, 6, 0.2)'
                    }}
                    onClick={() => {
                      if (doc.file_type.includes("pdf") || doc.file_type.startsWith("image")) {
                        setPreviewId(doc.id);
                        setDocType(doc.file_type);
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#074F06';
                      e.currentTarget.style.backgroundColor = 'rgba(159, 207, 159, 0.9)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(7, 79, 6, 0.2)';
                      e.currentTarget.style.backgroundColor = 'rgba(159, 207, 159, 0.7)';
                    }}
                  >
                    <div className="flex items-center gap-4 p-4">
                      <div className="flex-shrink-0">
                        {getFileIcon(doc.file_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">{doc.doc_title}</h3>
                        <p className="text-sm text-gray-600">{getFileTypeLabel(doc.file_type)}</p>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400 group-hover:text-green-600 transition-colors">
                        <FaEye size={20} />
                        <span className="font-medium">View</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Preview Modal */}
        {previewId && (
          <Modal fileId={previewId} docType={docType} onClose={() => setPreviewId(null)} />
        )}

        {/* Upload Modal */}
        {uploadDoc && (
          <UploadDocs
            classId={classId}
            uploadDocs={classAPI.uploadDocs}
            onClose={() => setUploadDoc(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Docs;
