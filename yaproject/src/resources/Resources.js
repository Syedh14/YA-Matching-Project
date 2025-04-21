// // src/resources/Resources.jsx
// import React, { useState, useEffect } from 'react';
// import Header from '../components/Header';
// import FilterBar from '../components/FilterBar';
// import ResourceModal from './ResourceModal';
// import axios from 'axios';

// function Resources() {
//   const [userId, setUserId] = useState(null);
//   const [role, setRole] = useState('');
//   const [resources, setResources] = useState([]);
//   const [filter, setFilter] = useState('all');

//   const [selectedResource, setSelectedResource] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const [showRedirectModal, setShowRedirectModal] = useState(false);
//   const [pendingVideoUrl, setPendingVideoUrl] = useState(null);

//   const [showAddForm, setShowAddForm] = useState(false);
//   const [newResource, setNewResource] = useState({
//     title: '',
//     type: '',
//     url: '',
//     description: '',
//   });

//   // 1️⃣ Fetch current session (userId + role)
//   useEffect(() => {
//     axios
//       .get('http://localhost:5001/auth/me', { withCredentials: true })
//       .then(res => {
//         setUserId(res.data.id);
//         setRole(res.data.role.toLowerCase());
//       })
//       .catch(console.error);
//   }, []);

//   // 2️⃣ Fetch all resources
//   useEffect(() => {
//     axios
//       .get('http://localhost:5001/resources', { withCredentials: true })
//       .then(res => {
//         // map backend fields into our UI shape
//         const mapped = res.data.map(r => ({
//           id: r.resource_id,
//           creatorId: r.user_id,
//           title: r.title,
//           description: r.description,
//           type: r.resource_type === 'video' ? 'Video' : 'PDF',
//           date: r.upload_date,
//           url: r.url,
//         }));
//         setResources(mapped);
//       })
//       .catch(console.error);
//   }, []);

//   // normalize whatever FilterBar sent us
//   const activeFilter = React.useMemo(() => {
//     switch (filter.toLowerCase()) {
//       case 'my resources':    return 'my'
//       case 'global resources':return 'global'
//       case 'videos':          return 'videos'
//       case 'mentor resources':return 'mentor'
//       case 'mentee resources':return 'mentee'
//       case 'all': 
//       default:                return 'all'
//     }
//   }, [filter])

//   // inside Resources.jsx, after your other useState(...) calls:
// const [mentorIds, setMentorIds] = useState(new Set());
// const [menteeIds, setMenteeIds] = useState(new Set());

// // 3️⃣ Fetch all mentors and mentees IDs
// useEffect(() => {
//   axios
//     .get('http://localhost:5001/mentors', { withCredentials: true })
//     .then(res => {
//       // assume res.data is [{ mentor_id: 2 }, { mentor_id: 3 }, …]
//       setMentorIds(new Set(res.data.map(m => m.mentor_id)));
//     })
//     .catch(console.error);

//   axios
//     .get('http://localhost:5001/mentees', { withCredentials: true })
//     .then(res => {
//       setMenteeIds(new Set(res.data.map(m => m.mentee_id)));
//     })
//     .catch(console.error);
// }, []);

// // 4️⃣ Replace the stub filters with real membership tests:
// const mentorResources = resources.filter(r => mentorIds.has(r.creatorId));
// const menteeResources = resources.filter(r => menteeIds.has(r.creatorId));


//   // Filtered lists
//   const myResources = resources
//     .filter(r => r.creatorId === userId)
//     .filter(r => filter === 'all' || r.type === filter);

//   const globalResources = resources
//     .filter(r => r.creatorId !== userId)
//     .filter(r => filter === 'all' || r.type === filter);

//   const videoResources = resources.filter(r => r.type === 'Video')

//   // Handlers
//   const handleResourceClick = resource => {
//     if (resource.type === 'video' && resource.url) {
//       setPendingVideoUrl(resource.url);
//       setShowRedirectModal(true);
//     } else {
//       setSelectedResource(resource);
//       setShowModal(true);
//     }
//   };

//   const confirmRedirect = () => {
//     window.open(pendingVideoUrl, '_blank');
//     setShowRedirectModal(false);
//     setPendingVideoUrl(null);
//   };
//   const cancelRedirect = () => {
//     setShowRedirectModal(false);
//     setPendingVideoUrl(null);
//   };

//   const handleNewResourceChange = e =>
//     setNewResource({ ...newResource, [e.target.name]: e.target.value });

//   const handleAddResource = () => {
//     // build payload to match your Resources table
//     const payload = {
//       title: newResource.title,
//       description: newResource.description || "",
//       resource_type: newResource.type === 'video' ? 'Video' : 'PDF',
//       url: newResource.url || "",
//     };
      
//     axios
//       .post('http://localhost:5001/resources', payload, {
//         withCredentials: true,
//       })
//       .then(() => {
//         // refresh list
//         return axios.get('http://localhost:5001/resources', {
//           withCredentials: true,
//         });
//       })
//       .then(res => {
//         const mapped = res.data.map(r => ({
//           id: r.resource_id,
//           creatorId: r.user_id,
//           title: r.title,
//           description: r.description,
//           type:  r.resource_type === 'video' ? 'Video' : 'PDF',
//           date: r.upload_date,
//           url: r.url,
//         }));
//         setResources(mapped);
//         setShowAddForm(false);
//         setNewResource({
//           title: '',
//           type: '',
//           url: '',
//           description: '',
//         });
//       })
//       .catch(console.error);
//   };

//   // return (
//   //   <div className="bg-white min-h-screen">
//   //     <Header />

//   //     <div className="flex">
//   //       <FilterBar filter={filter} setFilter={setFilter} />

//   //       <div className="flex-1 p-4">
//   //         <div className="h-[80vh] overflow-y-auto border p-4">
//   //           {/* My Resources */}
//   //           <h2 className="text-xl font-bold mb-2">My Resources</h2>
//   //           <div className="grid grid-cols-3 gap-4 mb-6">
//   //             {myResources.map(res => (
//   //               <div
//   //                 key={res.id}
//   //                 onClick={() => handleResourceClick(res)}
//   //                 className="border p-16 flex flex-col items-center justify-center hover:shadow-md transition-shadow cursor-pointer"
//   //               >
//   //                 <div className="text-gray-800 text-lg mb-2">{res.title}</div>
//   //                 <div className="text-gray-500 text-sm">Date: {res.date}</div>
//   //               </div>
//   //             ))}
//   //             {myResources.length === 0 && (
//   //               <p className="text-gray-500">No resources found.</p>
//   //             )}
//   //           </div>

//   //           {/* Global Resources */}
//   //           <h2 className="text-xl font-bold mb-4">Global Resources</h2>
//   //           <div className="grid grid-cols-3 gap-4 mb-10">
//   //             {globalResources.map(res => (
//   //               <div
//   //                 key={res.id}
//   //                 onClick={() => handleResourceClick(res)}
//   //                 className="border p-16 flex flex-col items-center justify-center hover:shadow-md transition-shadow cursor-pointer"
//   //               >
//   //                 <div className="text-gray-800 text-lg mb-2">{res.title}</div>
//   //                 <div className="text-gray-500 text-sm">Date: {res.date}</div>
//   //               </div>
//   //             ))}
//   //             {globalResources.length === 0 && (
//   //               <p className="text-gray-500">No global resources found.</p>
//   //             )}
//   //           </div>

//   //           <button
//   //             className="fixed bottom-8 right-8 bg-red-600 text-white text-3xl rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-red-700 transition-all"
//   //             onClick={() => setShowAddForm(true)}
//   //           >
//   //             +
//   //           </button>

//   //           {showAddForm && (
//   //             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//   //               <div className="bg-white rounded-lg p-6 w-full max-w-md">
//   //                 <h2 className="text-xl font-bold mb-4">Add New Resource</h2>

//   //                 <input
//   //                   type="text"
//   //                   name="title"
//   //                   placeholder="Title"
//   //                   value={newResource.title}
//   //                   onChange={handleNewResourceChange}
//   //                   className="w-full mb-3 p-2 border rounded"
//   //                 />

//   //                 <select
//   //                   name="type"
//   //                   value={newResource.type}
//   //                   onChange={handleNewResourceChange}
//   //                   className="w-full mb-3 p-2 border rounded"
//   //                 >
//   //                   <option value="">Select Format</option>
//   //                   <option value="video">Video</option>
//   //                   <option value="pdf">Article</option>
//   //                 </select>

//   //                 {newResource.type === 'video' && (
//   //                   <input
//   //                     type="text"
//   //                     name="url"
//   //                     placeholder="YouTube URL"
//   //                     value={newResource.url}
//   //                     onChange={handleNewResourceChange}
//   //                     className="w-full mb-3 p-2 border rounded"
//   //                   />
//   //                 )}

//   //                 {newResource.type === 'pdf' && (
//   //                   <textarea
//   //                     name="description"
//   //                     placeholder="Short description"
//   //                     value={newResource.description}
//   //                     onChange={handleNewResourceChange}
//   //                     className="w-full mb-3 p-2 border rounded"
//   //                   />
//   //                 )}

//   //                 <div className="flex justify-end gap-2">
//   //                   <button
//   //                     onClick={handleAddResource}
//   //                     className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
//   //                   >
//   //                     Add
//   //                   </button>
//   //                   <button
//   //                     onClick={() => setShowAddForm(false)}
//   //                     className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
//   //                   >
//   //                     Cancel
//   //                   </button>
//   //                 </div>
//   //               </div>
//   //             </div>
//   //           )}
//   //         </div>

//   //         {showModal && selectedResource && (
//   //           <ResourceModal
//   //             resource={selectedResource}
//   //             onClose={() => {
//   //               setShowModal(false);
//   //               setSelectedResource(null);
//   //             }}
//   //           />
//   //         )}

//   //         {showRedirectModal && (
//   //           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//   //             <div className="bg-white rounded-lg p-6 w-full max-w-sm">
//   //               <h3 className="text-lg font-semibold mb-4">You’re being redirected</h3>
//   //               <p className="mb-6">This will open a YouTube video in a new tab.</p>
//   //               <div className="flex justify-end gap-3">
//   //                 <button
//   //                   className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
//   //                   onClick={cancelRedirect}
//   //                 >
//   //                   Cancel
//   //                 </button>
//   //                 <button
//   //                   className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
//   //                   onClick={confirmRedirect}
//   //                 >
//   //                   Yes
//   //                 </button>
//   //               </div>
//   //             </div>
//   //           </div>
//   //         )}
//   //       </div>
//   //     </div>
//   //   </div>
//   // );

//   return (
//     <div className="bg-white min-h-screen">
//       <Header />
//       <div className="flex">
//         <FilterBar filter={filter} setFilter={setFilter} />

//         <div className="flex-1 p-4">
//           <div className="h-[80vh] overflow-y-auto border p-4">
//             {/* ─── ALL / MY / GLOBAL ─────────────────────────────────────────── */}
//             {(activeFilter === 'all' || activeFilter === 'my') && (
//               <>
//                 <h2 className="text-xl font-bold mb-2">My Resources</h2>
//                 <div className="grid grid-cols-3 gap-4 mb-6">
//                   {myResources.length > 0
//                     ? myResources.map(r => (
//                         <div key={r.id}
//                           onClick={() => handleResourceClick(r)}
//                           className="border p-16 flex flex-col items-center justify-center hover:shadow-md cursor-pointer"
//                         >
//                           <div className="text-gray-800 text-lg mb-2">{r.title}</div>
//                           <div className="text-gray-500 text-sm">Date: {r.date}</div>
//                         </div>
//                       ))
//                     : <p className="text-gray-500">No resources found.</p>}
//                 </div>
//               </>
//             )}

//             {(activeFilter === 'all' || activeFilter === 'global') && (
//               <>
//                 <h2 className="text-xl font-bold mb-2">Global Resources</h2>
//                 <div className="grid grid-cols-3 gap-4 mb-10">
//                   {globalResources.length > 0
//                     ? globalResources.map(r => (
//                         <div key={r.id}
//                           onClick={() => handleResourceClick(r)}
//                           className="border p-16 flex flex-col items-center justify-center hover:shadow-md cursor-pointer"
//                         >
//                           <div className="text-gray-800 text-lg mb-2">{r.title}</div>
//                           <div className="text-gray-500 text-sm">Date: {r.date}</div>
//                         </div>
//                       ))
//                     : <p className="text-gray-500">No global resources found.</p>}
//                 </div>
//               </>
//             )}

//             {/* ─── SINGLE‑LIST FILTERS ───────────────────────────────────────── */}
//             {activeFilter === 'videos' && (
//               <>
//                 <h2 className="text-xl font-bold mb-4">All Videos</h2>
//                 <div className="grid grid-cols-3 gap-4 mb-10">
//                   {videoResources.length > 0
//                     ? videoResources.map(r => (
//                         <div key={r.id}
//                           onClick={() => handleResourceClick(r)}
//                           className="border p-16 flex flex-col items-center justify-center hover:shadow-md cursor-pointer"
//                         >
//                           <div className="text-gray-800 text-lg mb-2">{r.title}</div>
//                           <div className="text-gray-500 text-sm">Date: {r.date}</div>
//                         </div>
//                       ))
//                     : <p className="text-gray-500">No videos found.</p>}
//                 </div>
//               </>
//             )}

//             {activeFilter === 'mentor' && (
//               <>
//                 <h2 className="text-xl font-bold mb-4">Mentor‑Created Resources</h2>
//                 <div className="grid grid-cols-3 gap-4 mb-10">
//                   {/* requires creatorRole from backend */}
//                   {mentorResources.length > 0
//                     ? mentorResources.map(/* … */)
//                     : <p className="text-gray-500">No mentor resources found.</p>}
//                 </div>
//               </>
//             )}

//             {activeFilter === 'mentee' && (
//               <>
//                 <h2 className="text-xl font-bold mb-4">Mentee‑Created Resources</h2>
//                 <div className="grid grid-cols-3 gap-4 mb-10">
//                   {/* requires creatorRole from backend */}
//                   {menteeResources.length > 0
//                     ? menteeResources.map(/* … */)
//                     : <p className="text-gray-500">No mentee resources found.</p>}
//                 </div>
//               </>
//             )}


//             {/* ─── ADD BUTTON & FORM ─────────────────────────────────────────── */}
//             <button
//               className="fixed bottom-8 right-8 bg-red-600 text-white text-3xl rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-red-700 transition-all"
//               onClick={() => setShowAddForm(true)}
//             >
//               +
//             </button>

//             {showAddForm && (
//               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                 <div className="bg-white rounded-lg p-6 w-full max-w-md">
//                   <h2 className="text-xl font-bold mb-4">Add New Resource</h2>
//                   <input
//                     type="text" name="title" placeholder="Title"
//                     value={newResource.title}
//                     onChange={handleNewResourceChange}
//                     className="w-full mb-3 p-2 border rounded"
//                   />

//                   <select
//                     name="type" value={newResource.type}
//                     onChange={handleNewResourceChange}
//                     className="w-full mb-3 p-2 border rounded"
//                   >
//                     <option value="">Select Format</option>
//                     <option value="video">Video</option>
//                     <option value="pdf">Article</option>
//                   </select>

//                   {newResource.type === 'video' && (
//                     <input
//                       type="text" name="url" placeholder="YouTube URL"
//                       value={newResource.url}
//                       onChange={handleNewResourceChange}
//                       className="w-full mb-3 p-2 border rounded"
//                     />
//                   )}
//                   {newResource.type === 'pdf' && (
//                     <textarea
//                       name="description" placeholder="Short description"
//                       value={newResource.description}
//                       onChange={handleNewResourceChange}
//                       className="w-full mb-3 p-2 border rounded"
//                     />
//                   )}

//                   <div className="flex justify-end gap-2">
//                     <button
//                       onClick={handleAddResource}
//                       className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
//                     >
//                       Add
//                     </button>
//                     <button
//                       onClick={() => setShowAddForm(false)}
//                       className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {showModal && selectedResource && (
//             <ResourceModal
//               resource={selectedResource}
//               onClose={() => {
//                 setShowModal(false)
//                 setSelectedResource(null)
//               }}
//             />
//           )}
//           {showRedirectModal && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className="bg-white rounded-lg p-6 w-full max-w-sm">
//                 <h3 className="text-lg font-semibold mb-4">You’re being redirected</h3>
//                 <p className="mb-6">This will open a YouTube video in a new tab.</p>
//                 <div className="flex justify-end gap-3">
//                   <button
//                     className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
//                     onClick={cancelRedirect}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
//                     onClick={confirmRedirect}
//                   >
//                     Yes
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );



// }

// export default Resources;

// src/resources/Resources.jsx
import React, { useState, useEffect, useMemo } from 'react';
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

  // 1️⃣ Fetch current session (userId + role)
  useEffect(() => {
    axios
      .get('http://localhost:5001/auth/me', { withCredentials: true })
      .then(res => {
        setUserId(res.data.id);
        setRole(res.data.role.toLowerCase());
      })
      .catch(console.error);
  }, []);

  // 2️⃣ Load all resources
  useEffect(() => {
    axios
      .get('http://localhost:5001/resources', { withCredentials: true })
      .then(res => {
        const mapped = res.data.map(r => ({
          id:          r.resource_id,
          creatorId:   r.user_id,
          title:       r.title,
          description: r.description,
          type:        r.resource_type === 'Video' ? 'Video' : 'PDF',
          date:        r.upload_date,
          url:         r.url,
        }));
        setResources(mapped);
      })
      .catch(console.error);
  }, []);

  // 3️⃣ Fetch mentor & mentee IDs for role‑based filters
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

  // // 4️⃣ Normalize your filter string
  // const activeFilter = useMemo(() => {
  //   switch (filter) {
  //     case 'my resources':    return 'my';
  //     case 'global resources':return 'global';
  //     case 'mentor resources':return 'mentor';
  //     case 'mentee resources':return 'mentee';
  //     case 'videos':          return 'videos';
  //     case 'all':
  //     default:                return 'all';
  //   }
  // }, [filter]);

    // the FilterBar already gives us exactly the strings we need:
    const activeFilter = filter;  // 'all' | 'my' | 'global' | 'mentor' | 'mentee' | 'videos'


  // ── your four buckets ───────────────────────────────────────────
  const myResources     = resources.filter(r => r.creatorId === userId);
  const globalResources = resources.filter(r => r.creatorId !== userId);
  const videoResources  = resources.filter(r => r.type === 'Video');
  const mentorResources = resources.filter(r => mentorIds.has(r.creatorId));
  const menteeResources = resources.filter(r => menteeIds.has(r.creatorId));

  // ── click / redirect handlers ───────────────────────────────────
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

  // ── new‑resource form ────────────────────────────────────────────
  const handleNewResourceChange = e =>
    setNewResource({ ...newResource, [e.target.name]: e.target.value });

  const handleAddResource = () => {
    const payload = {
      title:         newResource.title,
      description:   newResource.description || '',
      resource_type: newResource.type === 'video' ? 'Video' : 'PDF',
      url:           newResource.url || '',
    };

    axios
      .post('http://localhost:5001/resources', payload, { withCredentials: true })
      .then(() => axios.get('http://localhost:5001/resources', { withCredentials: true }))
      .then(res => {
        const mapped = res.data.map(r => ({
          id:          r.resource_id,
          creatorId:   r.user_id,
          title:       r.title,
          description: r.description,
          type:        r.resource_type === 'Video' ? 'Video' : 'PDF',
          date:        r.upload_date,
          url:         r.url,
        }));
        setResources(mapped);
        setShowAddForm(false);
        setNewResource({ title: '', type: '', url: '', description: '' });
      })
      .catch(console.error);
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="flex">
        <FilterBar filter={filter} setFilter={setFilter} />

        <div className="flex-1 p-4">
          <div className="h-[80vh] overflow-y-auto border p-4">
            {/* ─── ALL / MY / GLOBAL ─────────────────────────────── */}
            {(activeFilter === 'all' || activeFilter === 'my') && (
              <>
                <h2 className="text-xl font-bold mb-2">My Resources</h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {myResources.length > 0
                    ? myResources.map(r => (
                        <div
                          key={r.id}
                          onClick={() => handleResourceClick(r)}
                          className="border p-16 flex flex-col items-center justify-center hover:shadow-md cursor-pointer"
                        >
                          <div className="text-gray-800 text-lg mb-2">{r.title}</div>
                          <div className="text-gray-500 text-sm">Date: {r.date}</div>
                        </div>
                      ))
                    : <p className="text-gray-500">No resources found.</p>}
                </div>
              </>
            )}

            {(activeFilter === 'all' || activeFilter === 'global') && (
              <>
                <h2 className="text-xl font-bold mb-2">Global Resources</h2>
                <div className="grid grid-cols-3 gap-4 mb-10">
                  {globalResources.length > 0
                    ? globalResources.map(r => (
                        <div
                          key={r.id}
                          onClick={() => handleResourceClick(r)}
                          className="border p-16 flex flex-col items-center justify-center hover:shadow-md cursor-pointer"
                        >
                          <div className="text-gray-800 text-lg mb-2">{r.title}</div>
                          <div className="text-gray-500 text-sm">Date: {r.date}</div>
                        </div>
                      ))
                    : <p className="text-gray-500">No global resources found.</p>}
                </div>
              </>
            )}

            {/* ─── VIDEOS ONLY ──────────────────────────────────────── */}
            {activeFilter === 'videos' && (
              <>
                <h2 className="text-xl font-bold mb-4">All Videos</h2>
                <div className="grid grid-cols-3 gap-4 mb-10">
                  {videoResources.length > 0
                    ? videoResources.map(r => (
                        <div
                          key={r.id}
                          onClick={() => handleResourceClick(r)}
                          className="border p-16 flex flex-col items-center justify-center hover:shadow-md cursor-pointer"
                        >
                          <div className="text-gray-800 text-lg mb-2">{r.title}</div>
                          <div className="text-gray-500 text-sm">Date: {r.date}</div>
                        </div>
                      ))
                    : <p className="text-gray-500">No videos found.</p>}
                </div>
              </>
            )}

            {/* ─── MENTOR‑CREATED ─────────────────────────────────── */}
            {activeFilter === 'mentor' && (
              <>
                <h2 className="text-xl font-bold mb-4">Mentor‑Created Resources</h2>
                <div className="grid grid-cols-3 gap-4 mb-10">
                  {mentorResources.length > 0
                    ? mentorResources.map(r => (
                        <div
                          key={r.id}
                          onClick={() => handleResourceClick(r)}
                          className="border p-16 flex flex-col items-center justify-center hover:shadow-md cursor-pointer"
                        >
                          <div className="text-gray-800 text-lg mb-2">{r.title}</div>
                          <div className="text-gray-500 text-sm">Date: {r.date}</div>
                        </div>
                      ))
                    : <p className="text-gray-500">No mentor resources found.</p>}
                </div>
              </>
            )}

            {/* ─── MENTEE‑CREATED ─────────────────────────────────── */}
            {activeFilter === 'mentee' && (
              <>
                <h2 className="text-xl font-bold mb-4">Mentee‑Created Resources</h2>
                <div className="grid grid-cols-3 gap-4 mb-10">
                  {menteeResources.length > 0
                    ? menteeResources.map(r => (
                        <div
                          key={r.id}
                          onClick={() => handleResourceClick(r)}
                          className="border p-16 flex flex-col items-center justify-center hover:shadow-md cursor-pointer"
                        >
                          <div className="text-gray-800 text-lg mb-2">{r.title}</div>
                          <div className="text-gray-500 text-sm">Date: {r.date}</div>
                        </div>
                      ))
                    : <p className="text-gray-500">No mentee resources found.</p>}
                </div>
              </>
            )}

            {/* ─── ADD NEW RESOURCE ─────────────────────────────────── */}
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
                    <option value="pdf">Article</option>
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

                  {newResource.type === 'pdf' && (
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

