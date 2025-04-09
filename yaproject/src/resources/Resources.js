// src/resources/Resources.jsx
import React, { useState } from 'react';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar'

function Resources() {
  // Example data structure for resources
  // Eventually this from SQL backend
  const allResources = [
    {
      id: 1,
      title: 'Algebra Basics',
      type: 'math',          // e.g., "math", "science", etc.
      visibility: 'my',      // e.g., "my", "global"
      createdBy: 'mentor',   // e.g., "mentor", "mentee"
      format: 'video',       // e.g., "video", "pdf"
      date: '2025-04-01',
    },
    {
      id: 2,
      title: 'Group Project Guide',
      type: 'science',
      visibility: 'global',
      createdBy: 'mentee',
      format: 'pdf',
      date: '2025-04-02',
    },
    {
      id: 3,
      title: 'Mentor Tips Document',
      type: 'general',
      visibility: 'global',
      createdBy: 'mentor',
      format: 'pdf',
      date: '2025-04-03',
    },
    {
      id: 4,
      title: 'My Private Notes',
      type: 'math',
      visibility: 'my',
      createdBy: 'mentee',
      format: 'video',
      date: '2025-04-04',
    },
    // ... add more as needed
  ];

  // State to hold the current filter selection
  const [filter, setFilter] = useState('all'); 
  // e.g., "my", "global", "math", "mentor", "mentee", "videos", etc.

  // Filter the resources based on the user's selection
  const filteredResources = allResources.filter((resource) => {
    if (filter === 'all') return true;
    if (filter === 'my' && resource.visibility === 'my') return true;
    if (filter === 'global' && resource.visibility === 'global') return true;
    if (filter === 'math' && resource.type === 'math') return true;
    if (filter === 'mentor' && resource.createdBy === 'mentor') return true;
    if (filter === 'mentee' && resource.createdBy === 'mentee') return true;
    if (filter === 'videos' && resource.format === 'video') return true;
    return false;
  });

  // Separate "my resources" from "global resources"
  // after they are filtered
  const myResources = filteredResources.filter(r => r.visibility === 'my');
  const globalResources = filteredResources.filter(r => r.visibility === 'global');

  return (
    <div className="bg-white min-h-screen">
      {/* Header at the top */}
      <Header />

      <div className="flex">
        {/* Filter bar on the left */}
        <FilterBar filter={filter} setFilter={setFilter} />

        {/* Main content on the right */}
        <div className="flex-1 p-4">
          {/* Scrollable container */}
          <div className="h-[80vh] overflow-y-auto border p-4">
            {/* MY RESOURCES */}
            <h2 className="text-xl font-bold mb-2">My Resources</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {myResources.map((res) => (
                <div 
                  key={res.id} 
                  className="border p-16 flex flex-col items-center 
                             justify-center hover:shadow-md transition-shadow"
                >
                  <div className="text-gray-800 text-lg mb-2">{res.title}</div>
                  <div className="text-gray-500 text-sm">Date: {res.date}</div>
                </div>
              ))}
              
              {myResources.length === 0 && (
                <p className="text-gray-500">No resources found.</p>
              )}
            </div>

            {/* GLOBAL RESOURCES */}
            <h2 className="text-xl font-bold mb-2">Global Resources</h2>
            <div className="grid grid-cols-3 gap-4">
              {globalResources.map((res) => (
                <div 
                  key={res.id} 
                  className="border p-16 flex flex-col items-center 
                             justify-center hover:shadow-md transition-shadow"
                >
                  <div className="text-gray-800 text-lg mb-2">{res.title}</div>
                  <div className="text-gray-500 text-sm">Date: {res.date}</div>
                </div>
              ))}
              {globalResources.length === 0 && (
                <p className="text-gray-500">No resources found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resources;
