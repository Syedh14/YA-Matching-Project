

// src/resources/ResourceModal.jsx
import React from 'react';

const ResourceModal = ({ resource, onClose }) => {
  if (!resource) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        
        <h2 className="text-xl font-bold mb-2">{resource.title}</h2>

        
        <div className="text-sm text-gray-600 mb-4">
          <p>Type: <span className="font-medium">{resource.type}</span></p>
          <p>Uploaded: <span className="font-medium">{new Date(resource.date).toLocaleString()}</span></p>
          <p>Creator ID: <span className="font-medium">{resource.creatorId}</span></p>
        </div>

        
        {resource.type === 'PDF' && resource.description && (
          <p className="mb-4">{resource.description}</p>
        )}

        
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

