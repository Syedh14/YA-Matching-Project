

// // src/resources/ResourceModal.jsx
// import React from 'react';

// const ResourceModal = ({ resource, onClose }) => {
//   if (!resource) return null;

//   // format upload_date into a user‑friendly string
//   const uploadedAt = resource.upload_date
//     ? new Date(resource.upload_date).toLocaleString()
//     : "Unknown";

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
//         {/* Title */}
//         <h2 className="text-2xl font-bold mb-4">{resource.title}</h2>

//         {/* Metadata */}
//         <p className="text-sm text-gray-600 mb-1">
//           <strong>Type:</strong> {resource.type}
//         </p>
//         <p className="text-sm text-gray-600 mb-1">
//           <strong>Uploaded by (user_id):</strong> {resource.user_id}
//         </p>
//         <p className="text-sm text-gray-600 mb-4">
//           <strong>Date:</strong> {uploadedAt}
//         </p>

//         {/* Description (for Articles/PDFs/etc) */}
//         {resource.description && (
//           <p className="mb-4 text-gray-800">{resource.description}</p>
//         )}

//         {/* Link */}
//         {resource.url && (
//           <a
//             href={resource.url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="
//               inline-block 
//               mb-4 
//               text-blue-600 
//               underline 
//               hover:text-blue-800
//             "
//           >
//             {resource.type === "Video"
//               ? "Watch Video"
//               : "Open Resource"}
//           </a>
//         )}

//         {/* Close */}
//         <div className="flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResourceModal;

// src/resources/ResourceModal.jsx
import React from 'react';

const ResourceModal = ({ resource, onClose }) => {
  if (!resource) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        {/* Title */}
        <h2 className="text-xl font-bold mb-2">{resource.title}</h2>

        {/* Meta */}
        <div className="text-sm text-gray-600 mb-4">
          <p>Type: <span className="font-medium">{resource.type}</span></p>
          <p>Uploaded: <span className="font-medium">{new Date(resource.date).toLocaleString()}</span></p>
          <p>Creator ID: <span className="font-medium">{resource.creatorId}</span></p>
        </div>

        {/* Description (PDFs) */}
        {resource.type === 'PDF' && resource.description && (
          <p className="mb-4">{resource.description}</p>
        )}

        {/* Video link */}
        {resource.type === 'Video' && resource.url && (
          <div className="mb-4">
            <p className="mb-2">This is a video resource. Click below to view:</p>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Open Video
            </a>
          </div>
        )}

        {/* PDF or other links */}
        {resource.type !== 'Video' && resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline block mb-4"
          >
            Open Resource
          </a>
        )}

        {/* Close button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceModal;

