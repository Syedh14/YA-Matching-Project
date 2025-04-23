import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar';
import ResourceModal from './ResourceModal';
import axios from 'axios';

function Resources() {
  const [userId, setUserId]           = useState(null);
  const [role, setRole]               = useState('');
  const [resources, setResources]     = useState([]);
  const [filter, setFilter]           = useState('all');
  const [mentorIds, setMentorIds]     = useState(new Set());
  const [menteeIds, setMenteeIds]     = useState(new Set());

  const [selectedResource, setSelectedResource] = useState(null);
  const [showModal, setShowModal]               = useState(false);

  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [pendingVideoUrl, setPendingVideoUrl]     = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    type: '',
    url: '',
    description: '',
  });

  
  useEffect(() => {
    axios
      .get('http://localhost:5001/auth/me', { withCredentials: true })
      .then(res => {
        setUserId(res.data.id);
        setRole(res.data.role.toLowerCase());
      })
      .catch(console.error);
  }, []);

  
  const fetchAll = () => {
    axios
      .get('http://localhost:5001/resources', { withCredentials: true })
      .then(res => {
        const mapped = res.data.map(r => ({
          id:          r.resource_id,
          creatorId:   r.user_id,
          creatorRole: r.creator_role.toLowerCase(),    
          title:       r.title,
          description: r.description,
          type:        r.resource_type,                  
          date:        r.upload_date,
          url:         r.url,
        }));
        setResources(mapped);
      })
      .catch(console.error);
  };

  useEffect(fetchAll, []);

  
  useEffect(() => {
    axios
      .get('http://localhost:5001/mentors', { withCredentials: true })
      .then(res => setMentorIds(new Set(res.data.map(m => m.mentor_id))))
      .catch(console.error);

    axios
      .get('http://localhost:5001/mentees', { withCredentials: true })
      .then(res => setMenteeIds(new Set(res.data.map(m => m.mentee_id))))
      .catch(console.error);
  }, []);

  
  const myResources     = resources.filter(r => r.creatorId === userId);
  const globalResources = resources.filter(r => r.creatorId !== userId);
  const videoResources  = resources.filter(r => r.type === 'Video');
  const mentorResources = resources.filter(r => r.creatorRole === 'mentor');
  const menteeResources = resources.filter(r => r.creatorRole === 'mentee');

  
  const handleResourceClick = r => {
    if (r.type === 'Video' && r.url) {
      setPendingVideoUrl(r.url);
      setShowRedirectModal(true);
    } else {
      setSelectedResource(r);
      setShowModal(true);
    }
  };
  const confirmRedirect = () => {
    window.open(pendingVideoUrl, '_blank');
    setShowRedirectModal(false);
    setPendingVideoUrl(null);
  };
  const cancelRedirect = () => {
    setShowRedirectModal(false);
    setPendingVideoUrl(null);
  };

  
  const handleNewResourceChange = e =>
    setNewResource({ ...newResource, [e.target.name]: e.target.value });

  const handleAddResource = () => {
    const payload = {
      title:         newResource.title,
      description:   newResource.description || '',
      resource_type: newResource.type === 'video' ? 'Video' : 'Article',
      url:           newResource.url || '',
    };

    axios
      .post('http://localhost:5001/resources', payload, { withCredentials: true })
      .then(fetchAll)     
      .then(() => {
        setShowAddForm(false);
        setNewResource({ title: '', type: '', url: '', description: '' });
      })
      .catch(console.error);
  };

  const activeFilter = filter;  

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="flex">
        <FilterBar filter={filter} setFilter={setFilter} />

        <div className="flex-1 p-4">
          <div className="h-[80vh] overflow-y-auto border p-4">
            {(activeFilter === 'all' || activeFilter === 'my') && (
              <>
                <h2 className="text-xl font-bold mb-2">My Resources</h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {myResources.length ? myResources.map(r => (
                    <div
                      key={r.id}
                      onClick={() => handleResourceClick(r)}
                      className="border p-16 flex flex-col items-center justify-center hover:shadow-md cursor-pointer"
                    >
                      <div className="text-gray-800 text-lg mb-2">{r.title}</div>
                      <div className="text-gray-500 text-sm">Date: {r.date}</div>
                    </div>
                  )) : <p className="text-gray-500">No resources found.</p>}
                </div>
              </>
            )}

            {(activeFilter === 'all' || activeFilter === 'global') && (
              <>
                <h2 className="text-xl font-bold mb-2">Global Resources</h2>
                <div className="grid grid-cols-3 gap-4 mb-10">
                  {globalResources.length ? globalResources.map(r => (
                    <div
                      key={r.id}
                      onClick={() => handleResourceClick(r)}
                      className="border p-16 flex flex-col items-center justify-center hover:shadow-md cursor-pointer"
                    >
                      <div className="text-gray-800 text-lg mb-2">{r.title}</div>
                      <div className="text-gray-500 text-sm">Date: {r.date}</div>
                    </div>
                  )) : <p className="text-gray-500">No global resources found.</p>}
                </div>
              </>
            )}

            {activeFilter === 'videos' && (
              <>
                <h2 className="text-xl font-bold mb-4">All Videos</h2>
                <div className="grid grid-cols-3 gap-4 mb-10">
                  {videoResources.length ? videoResources.map(r => (
                    <div
                      key={r.id}
                      onClick={() => handleResourceClick(r)}
                      className="border p-16 flex flex-col items-center justify-center hover:shadow-md cursor-pointer"
                    >
                      <div className="text-gray-800 text-lg mb-2">{r.title}</div>
                      <div className="text-gray-500 text-sm">Date: {r.date}</div>
                    </div>
                  )) : <p className="text-gray-500">No videos found.</p>}
                </div>
              </>
            )}

            {activeFilter === 'mentor' && (
              <>
                <h2 className="text-xl font-bold mb-4">Mentor-Created Resources</h2>
                <div className="grid grid-cols-3 gap-4 mb-10">
                  {mentorResources.length ? mentorResources.map(r => (
                    <div
                      key={r.id}
                      onClick={() => handleResourceClick(r)}
                      className="border p-16 flex flex-col items-center justify-center hover:shadow-md cursor-pointer"
                    >
                      <div className="text-gray-800 text-lg mb-2">{r.title}</div>
                      <div className="text-gray-500 text-sm">Date: {r.date}</div>
                    </div>
                  )) : <p className="text-gray-500">No mentor resources found.</p>}
                </div>
              </>
            )}

            {activeFilter === 'mentee' && (
              <>
                <h2 className="text-xl font-bold mb-4">Mentee-Created Resources</h2>
                <div className="grid grid-cols-3 gap-4 mb-10">
                  {menteeResources.length ? menteeResources.map(r => (
                    <div
                      key={r.id}
                      onClick={() => handleResourceClick(r)}
                      className="border p-16 flex flex-col items-center justify-center hover:shadow-md cursor-pointer"
                    >
                      <div className="text-gray-800 text-lg mb-2">{r.title}</div>
                      <div className="text-gray-500 text-sm">Date: {r.date}</div>
                    </div>
                  )) : <p className="text-gray-500">No mentee resources found.</p>}
                </div>
              </>
            )}

            
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

                  <select
                    name="type"
                    value={newResource.type}
                    onChange={handleNewResourceChange}
                    className="w-full mb-3 p-2 border rounded"
                  >
                    <option value="">Select Format</option>
                    <option value="video">Video</option>
                    <option value="article">Article</option>
                  </select>

                  {newResource.type === 'video' && (
                    <input
                      type="text"
                      name="url"
                      placeholder="YouTube URL"
                      value={newResource.url}
                      onChange={handleNewResourceChange}
                      className="w-full mb-3 p-2 border rounded"
                    />
                  )}

                  {newResource.type === 'article' && (
                    <textarea
                      name="description"
                      placeholder="Short description"
                      value={newResource.description}
                      onChange={handleNewResourceChange}
                      className="w-full mb-3 p-2 border rounded"
                    />
                  )}

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleAddResource}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {showModal && selectedResource && (
            <ResourceModal
              resource={selectedResource}
              onClose={() => {
                setShowModal(false);
                setSelectedResource(null);
              }}
            />
          )}

          {showRedirectModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                <h3 className="text-lg font-semibold mb-4">
                  You’re being redirected
                </h3>
                <p className="mb-6">
                  This will open a YouTube video in a new tab.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                    onClick={cancelRedirect}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                    onClick={confirmRedirect}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Resources;
