// src/resources/Resources.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar'
import ResourceModal from './ResourceModal';


function Resources() {
  // Example data structure for resources
  // Eventually this from SQL backend
  const [resources, setResources] = useState([
    {
      id: 1,
      title: 'Algebra Basics',
      type: 'math',          // e.g., "math", "science", etc.
      visibility: 'my',      // e.g., "my", "global"
      createdBy: 'mentor',   // e.g., "mentor", "mentee"
      format: 'video',       // e.g., "video", "pdf"
      date: '2025-04-01',
      url: 'https://www.youtube.com/watch?v=NybHckSEQBI'
    },
    {
      id: 2,
      title: 'Group Project Guide',
      type: 'science',
      visibility: 'global',
      createdBy: 'mentee',
      format: 'pdf',
      date: '2025-04-02',
      description: 'A comprehensive guide for collaborative student projects.'
    },
    {
      id: 3,
      title: 'Mentor Tips Document',
      type: 'general',
      visibility: 'global',
      createdBy: 'mentor',
      format: 'pdf',
      date: '2025-04-03',
      description: 'An informal guide as to how to be a better mentor.'
    },
    {
      id: 4,
      title: 'My Private Notes',
      type: 'math',
      visibility: 'my',
      createdBy: 'mentee',
      format: 'video',
      date: '2025-04-04',
      url: 'https://www.youtube.com/watch?v=BJw5tKPP1PY'
    },
    // ... add more as needed
  ]);

  const [selectedResource, setSelectedResource] = useState(null);
  const [showModal, setShowModal] = useState(false);


  const [role, setRole] = useState('');
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    setRole(storedRole || '');
  }, []);


  const [showAddForm, setShowAddForm] = useState(false);
      const [newResource, setNewResource] = useState({
        title: '',
        type: '',
        visibility: '',
        createdBy: '',
        format: '',
        url: '',
        description: '',
      });

  
      
  const handleNewResourceChange = (e) => {
    setNewResource({ ...newResource, [e.target.name]: e.target.value });
  };

  const handleAddResource = () => {
    const resourceToAdd = {
      id: resources.length + 1,
      date: new Date().toISOString().split('T')[0],
      ...newResource,
      createdBy: role,
      visibility: newResource.visibility,
    };
    setResources([...resources, resourceToAdd]);
    setNewResource({
      title: '',
      type: '',
      visibility: '',
      createdBy: '',
      format: '',
      url: '',
      description: '',
    });
    setShowAddForm(false);
  };

  const handleResourceClick = (resource) => {
    if (resource.format === 'video' && resource.url) {
      window.open(resource.url, '_blank');
    } else {
      setSelectedResource(resource);
      setShowModal(true);
    }
  };
  
    

  // State to hold the current filter selection
  const [filter, setFilter] = useState('all'); 
  // e.g., "my", "global", "math", "mentor", "mentee", "videos", etc.

  // Filter the resources based on the user's selection
  const filteredResources = resources.filter((resource) => {
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
  const mentorResources = myResources.filter(r => r.createdBy === 'mentor');
  const menteeResources = myResources.filter(r => r.createdBy === 'mentee');




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
              {(role === 'mentor' ? mentorResources : menteeResources).map((res) => (
                <div
                key={res.id}
                onClick={() => handleResourceClick(res)}
                className="border p-16 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                <div className="text-gray-800 text-lg mb-2">{res.title}</div>
                <div className="text-gray-500 text-sm">Date: {res.date}</div>
                </div>
              ))}

            {(role === 'mentor' ? mentorResources : menteeResources).length === 0 && (
              <p classname="text-gray-500">No resources found.</p>
            )}
            </div>

          <button
            className="fixed bottom-8 right-8 bg-red-600 text-white text-3xl rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-red-700 transition-all"
            onClick={() => setShowAddForm(true)}
          >
            +
          </button>


          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add New Resource</h2>

                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={newResource.title}
                  onChange={handleNewResourceChange}
                  className="w-full mb-3 p-2 border rounded"
                />

                <input
                  type="text"
                  name="type"
                  placeholder="Type (e.g., math, science)"
                  value={newResource.type}
                  onChange={handleNewResourceChange}
                  className="w-full mb-3 p-2 border rounded"
                />

                <select
                  name="visibility"
                  value={newResource.visibility}
                  onChange={handleNewResourceChange}
                  className="w-full mb-3 p-2 border rounded"
                >
                  <option value="">Select Visibility</option>
                  <option value="my">Private (My Resource)</option>
                  <option value="global">Public (Global Resource)</option>
                </select>

                <select
                  name="format"
                  value={newResource.format}
                  onChange={handleNewResourceChange}
                  className="w-full mb-3 p-2 border rounded"
                >
                  <option value="">Select Format</option>
                  <option value="video">Video</option>
                  <option value="pdf">Article</option>
                </select>

                {/* Conditional fields based on format */}
                {newResource.format === 'video' && (
                  <input
                    type="text"
                    name="url"
                    placeholder="YouTube URL"
                    value={newResource.url}
                    onChange={handleNewResourceChange}
                    className="w-full mb-3 p-2 border rounded"
                  />
                )}

                {newResource.format === 'pdf' && (
                  <textarea
                    name="description"
                    placeholder="Short description of the article"
                    value={newResource.description}
                    onChange={handleNewResourceChange}
                    className="w-full mb-3 p-2 border rounded"
                  />
                )}

                <div className="flex justify-end">
                  <button
                    onClick={handleAddResource}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="ml-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

            {showModal && selectedResource && (
              <ResourceModal
                resource={selectedResource}
                onClose={() => setShowModal(false)}
              />
            )}


            {/* </div> */}

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
