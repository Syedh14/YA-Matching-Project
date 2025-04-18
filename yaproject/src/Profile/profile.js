
// import React, { useEffect, useState } from 'react';
// import Header from '../components/Header';

// function Profile() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const stored = localStorage.getItem('loggedInUser');
//     if (stored) {
//       setUser(JSON.parse(stored));
//     }
//   }, []);

//   if (!user) {
//     return (
//       <>
//         <Header />
//         <div className="min-h-screen flex items-center justify-center bg-primary text-white">
//           <p>Loading profile...</p>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Header />
//       <div className="min-h-screen flex items-center justify-center bg-primary">
//         <div className="bg-white shadow-md rounded p-10 max-w-lg w-full">

//           {/* Edit Button */}
//           <div className="flex justify-end mb-6">
//             <button className="bg-gray-300 text-black font-bold py-1 px-3 rounded">
//               Edit
//             </button>
//           </div>

//           {/* Profile Info */}
//           <div className="flex flex-col items-center mb-4">
//             <div className="w-40 h-40 rounded-full border border-gray-400 mb-4 bg-gray-200" />
//             <h2 className="text-xl font-semibold">
//               {user.firstName} {user.lastName}
//             </h2>
//             <p className="text-gray-600 text-sm capitalize">{user.role}</p>
//           </div>

//           {/* Contact Info */}
//           <div className="space-y-3 text-left">
//             <p className="text-md font-medium">Username: {user.userId}</p>

//             <div>
//               <p className="text-md font-medium">Phone(s):</p>
//               {user.phones.map((p, i) => (
//                 <p key={i} className="text-sm">{p}</p>
//               ))}
//             </div>

//             <div>
//               <p className="text-md font-medium">Email(s):</p>
//               {user.emails.map((e, i) => (
//                 <p key={i} className="text-sm">{e}</p>
//               ))}
//             </div>

//             <p className="text-md font-medium">Goal: {user.goal}</p>
//             <p className="text-md font-medium">Skill: {user.skill}</p>

//             {/* Role-specific attributes */}
//             {user.role === 'mentor' && (
//               <>
//                 <p className="text-md font-medium">Academic Status: {user.mentorAcademicStatus}</p>
//                 <p className="text-md font-medium">Active Status: {user.mentorActiveStatus}</p>
//               </>
//             )}

//             {user.role === 'mentee' && (
//               <>
//                 <p className="text-md font-medium">Institution: {user.menteeInstitution}</p>
//                 <p className="text-md font-medium">Academic Status: {user.menteeAcademicStatus}</p>
//               </>
//             )}
//           </div>

//           {/* Contact Button */}
//           <div className="mt-6 flex justify-center">
//             <button className="bg-gray-300 text-black font-semibold py-2 px-4 rounded">
//               Contact Youth Achieve
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Profile;

// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="bg-white shadow-md rounded p-10 max-w-lg w-full">

          {/* Header with Edit Button */}
          <div className="flex justify-end mb-6">
            <button className="bg-gray-300 text-black font-bold py-1 px-3 rounded">
              Edit
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-40 h-40 rounded-full border border-gray-400 mb-4" />
            <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 text-left">
            <p className="text-md font-medium">📞 Phone(s): {user.phones?.join(', ')}</p>
            <p className="text-md font-medium">📧 Email(s): {user.emails?.join(', ')}</p>

            {/* Shared attributes */}
            <p className="text-md font-medium">🎯 Goal: {user.goal}</p>
            <p className="text-md font-medium">🛠 Skill: {user.skill}</p>

            {/* Role-specific fields */}
            {user.role === 'mentor' && (
              <>
                <p className="text-md font-medium">🎓 Academic Status: {user.mentorAcademicStatus}</p>
                <p className="text-md font-medium">✅ Active Status: {user.mentorActiveStatus}</p>
              </>
            )}
            {user.role === 'mentee' && (
              <>
                <p className="text-md font-medium">🏫 Institution: {user.menteeInstitution}</p>
                <p className="text-md font-medium">🎓 Academic Status: {user.menteeAcademicStatus}</p>
              </>
            )}
          </div>

          {/* Contact Button */}
          <div className="mt-6 flex justify-center">
            <button className="bg-gray-300 text-black font-semibold py-2 px-4 rounded">
              contact youth achieve
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
