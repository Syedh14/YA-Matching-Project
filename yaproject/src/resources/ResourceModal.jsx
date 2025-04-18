// src/resources/ResourceModal.jsx
import React from 'react';

const ResourceModal = ({ resource, onClose }) => {
  if (!resource) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-2">{resource.title}</h2>
        <p className="text-sm text-gray-600 mb-1">Type: {resource.type}</p>
        <p className="text-sm text-gray-600 mb-1">Created by: {resource.createdBy}</p>
        <p className="text-sm text-gray-600 mb-1">Date: {resource.date}</p>
        {resource.description && (
          <p className="mt-4 mb-2">{resource.description}</p>
        )}
        {resource.format === 'pdf' && resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline block mt-2"
          >
            Open PDF
          </a>
        )}

        <div className="flex justify-end mt-4">
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
