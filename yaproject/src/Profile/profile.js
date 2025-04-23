
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [emails, setEmails] = useState([]);
  const [phones, setPhones] = useState([]);
  const [goal, setGoal] = useState("");
  const [skill, setSkill] = useState("");
  const [academicStatus, setAcademicStatus] = useState("");
  const [activeStatus, setActiveStatus] = useState(true);
  const [institution, setInstitution] = useState("");


  useEffect(() => {
    axios.get("http://localhost:5001/auth/profile", { withCredentials: true })
      .then(res => {
        setUser(res.data);  
      })
      .catch(err => {
        console.error("Failed to fetch profile data", err);
        setUser(null);
      });
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role === "mentor") {
        setEditFirstName(user.firstName || "");
        setEditLastName(user.lastName || "");
        setEditUsername(user.username || "");
        setEditPassword(user.password || "");
        setEmails(user.emails || "");
        setPhones(user.phones || "");
        setGoal(user.goal || "");
        setSkill(user.skill || "");
        setAcademicStatus(user.mentorAcademicStatus || "");
        setActiveStatus(user.mentorActiveStatus || "");
      } else if (user.role === "mentee") {
        setEditFirstName(user.firstName || "");
        setEditLastName(user.lastName || "");
        setEditUsername(user.username || "");
        setEditPassword(user.password || "");
        setEmails(user.emails || "");
        setPhones(user.phones || "");
        setGoal(user.goal || "");
        setSkill(user.skill || "");
        setAcademicStatus(user.menteeAcademicStatus || "");
        setInstitution(user.menteeInstitution || "");
      } else {
        setEditFirstName(user.firstName || "");
        setEditLastName(user.lastName || "");
        setEditUsername(user.username || "");
        setEditPassword(user.password || "");
        setEmails(user.emails || "");
        setPhones(user.phones || "");
      }
    }
  }, [user]); 


  if (!user) {
    return <div>Loading...</div>; 
  }

  
  const emailHelpers = {
    update: (i, val) => setEmails(prev => {
      const updated = [...prev];
      updated[i] = val;
      return updated;
    }),
    add: () => setEmails(prev => [...prev, ""]),
    remove: (i) => setEmails(prev => prev.filter((_, index) => index !== i))
  };

  const phoneHelpers = {
    update: (i, val) => setPhones(prev => {
      const updated = [...prev];
      updated[i] = val;
      return updated;
    }),
    add: () => setPhones(prev => [...prev, ""]),
    remove: (i) => setPhones(prev => prev.filter((_, index) => index !== i))
  };


  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5001/auth/logout", {}, { withCredentials: true });
      navigate("/"); 
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleEditSave = async () => {
    try {
      let payload = {
        firstName: editFirstName,
        lastName: editLastName,
        username: editUsername,
        password: editPassword,
        phones: phones,
        emails: emails,
      };
  
      if (user.role === "mentor") {
        payload = {
          ...payload,
          goal,
          skill,
          academicBackground: academicStatus,
          activeStatus,
        };
      } else if (user.role === "mentee") {
        payload = {
          ...payload,
          goal,
          skill,
          institution,
          academicStatus,
        };
      }
  
      await axios.post("http://localhost:5001/auth/update-profile", payload, {
        withCredentials: true,
      });
      setShowEditModal(false);
      window.location.reload(); 
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  } 
  
  
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="bg-white shadow-md rounded p-10 max-w-lg w-full">
          
          <div className="flex justify-end gap-2 mb-6">
            <button 
              onClick={() => setShowEditModal(true)}
              className="bg-gray-300 text-black font-bold py-1 px-3 rounded"
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white font-bold py-1 px-3 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          
          <div className="flex flex-col items-center mb-4">
            <img
              src="/profile.png"
              alt="Profile"
              className="w-40 h-40 rounded-full border border-gray-400 mb-4 object-cover"
            />
            <h2 className="text-xl font-semibold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-500 capitalize">
              {user.role}
            </p>
          </div>

          
          <div className="space-y-3 text-left">
            <p className="text-md font-medium">
              ID: {user.user_id || 'N/A'}
            </p>
            <p className="text-md font-medium">
              Username: {user.username || 'N/A'}
            </p>
            <p className="text-md font-medium">
              Password: {user.password || 'N/A'}
            </p>
            <p className="text-md font-medium">
              Phone(s): {user.phones?.join(', ') || 'N/A'}
            </p>
            <p className="text-md font-medium">
              Email(s): {user.emails?.join(', ') || 'N/A'}
            </p>
            {user.role !== 'admin' && (
              <>
                <p className="text-md font-medium">Goal: {user.goal || 'N/A'}</p>
                <p className="text-md font-medium">Skill: {user.skill || 'N/A'}</p>
              </>
            )}
            
            {user.role === 'mentor' && (
              <>
                <p className="text-md font-medium">
                  Academic Background: {user.mentorAcademicStatus || 'N/A'}
                </p>
                <p className="text-md font-medium">
                  Active Status: {user.mentorActiveStatus ? 'Active' : 'Inactive'}
                </p>
              </>
            )}
            {user.role === 'mentee' && (
              <>
                <p className="text-md font-medium">
                  Institution: {user.menteeInstitution || 'N/A'}
                </p>
                <p className="text-md font-medium">
                  Academic Status: {user.menteeAcademicStatus || 'N/A'}
                </p>
              </>
            )}
          </div>

          
          <div className="mt-6 flex justify-center">
            <button 
              onClick={() => window.location.href = "https://youthachievemission.wixsite.com/website"}
              className="bg-gray-300 text-black font-semibold py-2 px-4 rounded"
            >
              Contact Youth Achieve
            </button>
          </div>
        </div>
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
            <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full max-h-full overflow-auto">
              <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="border rounded p-2"
                  value={editFirstName}
                  onChange={e => setEditFirstName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="border rounded p-2"
                  value={editLastName}
                  onChange={e => setEditLastName(e.target.value)}
                />
              </div>

              
              <input
                type="text"
                value={`ID: ${user.user_id}`}
                disabled
                className="border rounded w-full p-2 mb-3 bg-gray-100 text-gray-500"
              />

              
              <input
                type="text"
                placeholder="Username"
                className="border rounded w-full p-2 mb-3"
                value={editUsername}
                onChange={e => setEditUsername(e.target.value)}
              />
              <input
                type="text"
                placeholder="Password"
                className="border rounded w-full p-2 mb-3"
                value={editPassword}
                onChange={e => setEditPassword(e.target.value)}
              />

              
              <div className="mb-4">
                <label className="font-semibold">Email(s)</label>
                {emails.map((email, index) => (
                  <div key={index} className="flex items-center mt-2">
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="border rounded p-2 flex-grow"
                      value={email}
                      onChange={e => emailHelpers.update(index, e.target.value)}
                    />
                    {emails.length > 1 && (
                      <button
                        type="button"
                        className="ml-2 text-red-500 font-bold"
                        onClick={() => emailHelpers.remove(index)}
                      >
                        &minus;
                      </button>
                    )}
                  </div>
                ))}
                <button
                  className="mt-2 text-green-600 font-bold"
                  type="button"
                  onClick={emailHelpers.add}
                >
                  + Add email
                </button>
              </div>

              
              <div className="mb-4">
                <label className="font-semibold">Phone(s)</label>
                {phones.map((phone, index) => (
                  <div key={index} className="flex items-center mt-2">
                    <input
                      type="tel"
                      placeholder="(123) 456‑7890"
                      className="border rounded p-2 flex-grow"
                      value={phone}
                      onChange={e => phoneHelpers.update(index, e.target.value)}
                    />
                    {phones.length > 1 && (
                      <button
                        type="button"
                        className="ml-2 text-red-500 font-bold"
                        onClick={() => phoneHelpers.remove(index)}
                      >
                        &minus;
                      </button>
                    )}
                  </div>
                ))}
                <button
                  className="mt-2 text-green-600 font-bold"
                  type="button"
                  onClick={phoneHelpers.add}
                >
                  + Add phone
                </button>
              </div>

              {user.role !== 'admin' && (
              <>
                <input
                  type="text"
                  placeholder=" Goal"
                  className="border rounded w-full p-2 mb-3"
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="🛠 Skill"
                  className="border rounded w-full p-2 mb-3"
                  value={skill}
                  onChange={e => setSkill(e.target.value)}
                />
                {user.role === 'mentor' && (
                  <>
                    <input
                      type="text"
                      placeholder="🎓 Academic Background"
                      className="border rounded w-full p-2 mb-3"
                      value={academicStatus}
                      onChange={e => setAcademicStatus(e.target.value)}
                    />

                    <div className="mb-4">
                      <label className="font-semibold">Active Status</label>
                      <select
                        className="border rounded w-full p-2"
                        value={activeStatus}
                        onChange={e => setActiveStatus(e.target.value === "true")}
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </>
                )}
                {user.role === 'mentee' && (
                  <>
                    <input
                      type="text"
                      placeholder=" Institution"
                      className="border rounded w-full p-2 mb-3"
                      value={institution}
                      onChange={e => setInstitution(e.target.value)}
                    />

                    <input
                      type="text"
                      placeholder="🎓 Academic Status"
                      className="border rounded w-full p-2 mb-3"
                      value={academicStatus}
                      onChange={e => setAcademicStatus(e.target.value)}
                    />
                  </>
                )}
              </>
              )}

              
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={handleEditSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}


      </div>
    </>
  );
}

export default Profile;
