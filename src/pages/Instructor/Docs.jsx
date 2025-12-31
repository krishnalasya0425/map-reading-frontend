import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import classAPI from "../../entities/class";
import Modal from "../../components/FileModal";
import UploadDocs from "../../components/UploadDocs";
import { useNavigate } from "react-router-dom";


import {
  FaFilePdf,
  FaFileImage,
  FaFile,
  FaUpload,
  FaClipboardList,
  FaMagic,
  FaVrCardboard 
} from "react-icons/fa";

const Docs = () => {
  const { classId } = useParams();
  const [docs, setDocs] = useState([]);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [classData, setClassData] = useState({});
    const [showVRGuidelines, setShowVRGuidelines] = useState(false);
  const [docType, setDocType] = useState(null);
    const navigate = useNavigate()

  const role = localStorage.getItem("role")



  const [uploadDoc, setUploadDoc] = useState(false);
    const [previewId, setPreviewId] = useState(null);

  // -----------------------
  // Load Class & Docs
  // -----------------------
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

  console.log(docs)


 const getFileIcon = (mime) => {
    if (!mime) return <FaFile size={30} />;

    if (mime.includes("pdf")) return <FaFilePdf size={30} color="red" />;
    if (mime.startsWith("image")) return <FaFileImage size={30} />;

    return <FaFile size={30} />;
  };

 
 const launchUnityBuild = async () => {
  const instructorId = localStorage.getItem("id"); // current instructor

  try {
    const res = await fetch(
      `http://localhost:5000/unity/practice/${classId}/${instructorId}`
    );
    const data = await res.json();
    alert(data.message);
  } catch (err) {
    console.error(err);
    alert("Failed to launch Unity build");
  }
};


  const confirmVRLaunch = () => {
    setShowVRGuidelines(false);
    const instructorId = localStorage.getItem("id");
    const url = `http://localhost:5000/unity/practice/${classId}/${instructorId}`;
    // open in new tab
    window.open(url, "_blank");
    alert(
      "Redirecting to Unity build. Make sure your VR headset is connected to the PC."
    );
  };

 // VR practice
const launchVRPractice = async () => {
  const instructorId = localStorage.getItem("id"); // current instructor

  try {
    const res = await fetch(
      `http://localhost:5000/unity/practice/${classId}/${instructorId}`
    );
    const data = await res.json();

    // Show message on current page instead of opening new tab
    alert(data.message); // "Unity build launched successfully!"
  } catch (err) {
    console.error(err);
    alert("Failed to launch VR build");
  }
};


  return (
    <div className="p-4">

    {/* ---------------- CLASS INFO ---------------- */}
<div className="flex items-center justify-between mb-6 relative">

  {/* Centered Title */}
  <h1 className="text-3xl font-bold text-center flex-1">
    {classData.class_name}
  </h1>

  <button
  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2 shadow"
  onClick={launchUnityBuild}
>
  <FaClipboardList /> Practice
</button>
<button
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 shadow"
  onClick={launchVRPractice}
>
  <FaVrCardboard /> Practice in VR
</button>



  {/* Right Buttons (stay right, no overflow) */}
  {role !== "Student" &&
  <div className="flex items-center gap-3 shrink-0 ml-4">

    <button className="bg-purple-400 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2 shadow"  onClick={() => navigate(`/${classId}/generatetest`)}>
      <FaMagic /> Generate Test
    </button>

    <button
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 shadow"
      onClick={() => setUploadDoc(true)}
    >
      <FaUpload /> Upload
    </button>

  </div> }
  
</div>



  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
      {docs.map((doc) => (
      <div
  key={doc.id}
  className="p-3 rounded border cursor-pointer hover:bg-gray-100 flex items-center gap-3"
  onClick={() => {
    if (doc.file_type.includes("pdf") || doc.file_type.startsWith("image")) {
      setPreviewId(doc.id);
      setDocType(doc.file_type);
    } 
  }}
>
  {getFileIcon(doc.file_type)}
  <span className="font-medium">{doc.doc_title}</span>
</div>
      ))}

      {previewId && (
        <Modal fileId={previewId} docType ={docType} onClose={() => setPreviewId(null)} />
      )}
    </div>
     
 

     
  
     {uploadDoc && (
  <UploadDocs
    classId={classId}
    uploadDocs={classAPI.uploadDocs}
    onClose={() => setUploadDoc(false)}
  />
)}


{showVRGuidelines && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-[400px]">
            <h3 className="text-xl font-bold mb-4">VR Practice Guidelines</h3>
            <ul className="list-disc ml-5 mb-4 text-gray-700">
              <li>Connect your VR headset to the PC.</li>
              <li>Ensure your Unity build supports VR.</li>
              <li>Use a wired connection for best performance.</li>
              <li>Close other heavy applications to avoid lag.</li>
            </ul>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowVRGuidelines(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={confirmVRLaunch}
              >
                Launch VR
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Docs;
