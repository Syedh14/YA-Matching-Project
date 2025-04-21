import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import axios from 'axios';

function Login() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginRole, setLoginRole] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [newUserId, setNewUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('');
  const [emails, setEmails] = useState(['']);
  const [phones, setPhones] = useState(['']);
  const [goal, setGoal] = useState('');
  const [skill, setSkill] = useState('');
  const [createMessage, setCreateMessage] = useState('');

  const [showMentorPopup, setShowMentorPopup] = useState(false);
  const [mentorAcademicStatus, setMentorAcademicStatus] = useState('');
  const [mentorActiveStatus, setMentorActiveStatus] = useState('');

  const [showMenteePopup, setShowMenteePopup] = useState(false);
  const [menteeInstitution, setMenteeInstitution] = useState('');
  const [menteeAcademicStatus, setMenteeAcademicStatus] = useState('');
  const [availability, setAvailability] = useState([""]);


  const navigate = useNavigate();



  const openLoginModal = role => {
    setLoginRole(role);
    setUserId('');
    setPassword('');
    setLoginMessage('');
    setShowLoginModal(true);
  };
  const closeLoginModal = () => setShowLoginModal(false);

  const handleLogin = async () => {
    try {
      const formattedRole = loginRole.charAt(0).toUpperCase() + loginRole.slice(1);
      const response = await axios.post("http://localhost:5001/auth/login", {
        username: userId.trim(),
        password: password.trim(),
        role: formattedRole
      },
      {withCredentials: true }
    );  
      setLoginMessage("Login successful!");
      navigate(`/${formattedRole.toLowerCase()}`);
  
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setLoginMessage("Invalid credentials. Please try again.");
      } else {
        setLoginMessage("An error occurred during login.");
        console.error(error);
      }
    }
  };
  

  const openCreateModal = () => {
    setFirstName('');
    setLastName('');
    setNewUserId('');
    setNewPassword('');
    setNewRole('');
    setEmails(['']);
    setPhones(['']);
    setGoal('');
    setSkill('');
    setCreateMessage('');
    setShowCreateModal(true);
  };
  const closeCreateModal = () => setShowCreateModal(false);

  // display the mentor/mentee popup based on the exact casing
  useEffect(() => {
    if (newRole === 'Mentor') {
      setShowMentorPopup(true);
      setShowMenteePopup(false);
    } else if (newRole === 'Mentee') {
      setShowMenteePopup(true);
      setShowMentorPopup(false);
    } else {
      setShowMentorPopup(false);
      setShowMenteePopup(false);
    }
  }, [newRole]);

  const handleCreateAccount = async () => {
    // basic validation
    const baseInvalid =
      !firstName.trim() ||
      !lastName.trim() ||
      !newUserId.trim() ||
      !newPassword.trim() ||
      !newRole ||
      emails.some(e => !e.trim()) ||
      phones.some(p => !p.trim()) ||
      !goal.trim() ||
      !skill.trim();

    const mentorInvalid =
      newRole === "Mentor" &&
      (!mentorAcademicStatus.trim() || !mentorActiveStatus);

    const menteeInvalid =
      newRole === "Mentee" &&
      (!menteeInstitution.trim() || !menteeAcademicStatus.trim());

    if (baseInvalid || mentorInvalid || menteeInvalid) {
      setCreateMessage("Please fill out all required fields.");
      return;
    }

    const newUser = {
      username: newUserId,
      password: newPassword,
      firstName,
      lastName,
      role: newRole,           
      emails,
      phones,
      goals: goal,            
      skills: skill,
      availability,            
      ...(newRole === "Mentor" && {
        activeStatus: mentorActiveStatus === "active",
        academicBackground: mentorAcademicStatus 
      }),
      ...(newRole === "Mentee" && {
        institution: menteeInstitution,
        academicStatus: menteeAcademicStatus 
      })
    };

    try {
      const response = await axios.post("http://localhost:5001/auth/signup", newUser, {withCredentials: true});

      // correctly detect HTTP 201 Created
      if (response.status === 201) {
        setCreateMessage("Account created successfully!");
        setTimeout(() => {
          closeCreateModal();
          openLoginModal(newRole);
        }, 1000);
      } else {
        setCreateMessage(response.data.error || "Something went wrong");
      }
    } catch (error) {
      setCreateMessage("Failed to create account.");
      console.error(error);
    }
  };

  const availabilityHelpers = {
    update: (i, val) => {
      const copy = [...availability];
      copy[i] = val;
      setAvailability(copy);
    },
    add: () => setAvailability([...availability, ""]),
    remove: i => setAvailability(availability.filter((_, idx) => idx !== i))
  };
  // helpers for dynamic email/phone lists
  const makeListHelpers = (arr, setArr) => ({
    update: (i, val) => {
      const copy = [...arr];
      copy[i] = val;
      setArr(copy);
    },
    add: () => setArr([...arr, '']),
    remove: i => setArr(arr.filter((_, idx) => idx !== i)),
  });
  const emailHelpers = makeListHelpers(emails, setEmails);
  const phoneHelpers = makeListHelpers(phones, setPhones);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <div className="bg-white shadow-md rounded p-8 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="w-24 h-24 mb-4" />
          <h1 className="text-3xl font-bold">Welcome!</h1>
        </div>

        <div className="flex flex-col space-y-4">
          {['admin', 'mentor', 'mentee'].map(r => (
            <button
              key={r}
              className="bg-secondary text-white py-2 px-4 rounded font-bold"
              onClick={() => openLoginModal(r)}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)} Login
            </button>
          ))}
        </div>

        <p className="mt-6 text-center">
          New?{' '}
          <button
            className="text-blue-500 hover:underline"
            onClick={openCreateModal}
          >
            Create an account
          </button>
        </p>
      </div>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 capitalize">
              {loginRole} Login
            </h2>
            <input
              type="text"
              placeholder="Username"
              className="border rounded w-full p-2 mb-3"
              value={userId}
              onChange={e => setUserId(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="border rounded w-full p-2 mb-3"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {loginMessage && <p className="text-sm mb-2">{loginMessage}</p>}
            <div className="flex justify-between">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleLogin}
              >
                Submit
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={closeLoginModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE ACCOUNT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full max-h-full overflow-auto">
            <h2 className="text-2xl font-bold mb-4">Create Account</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="First Name"
                className="border rounded p-2"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="border rounded p-2"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </div>
            <input
              type="text"
              placeholder="Username"
              className="border rounded w-full p-2 mb-3"
              value={newUserId}
              onChange={e => setNewUserId(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="border rounded w-full p-2 mb-3"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <select
              className="border rounded w-full p-2 mb-4"
              value={newRole}
              onChange={e => setNewRole(e.target.value)}
            >
              <option value="">Select role…</option>
              <option value="Mentor">Mentor</option>
              <option value="Mentee">Mentee</option>
            </select>

            {/* Emails */}
            <div className="mb-4">
              <label className="font-semibold">Email addresses</label>
              {emails.map((em, i) => (
                <div key={i} className="flex items-center mt-2">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="border rounded p-2 flex-grow"
                    value={em}
                    onChange={e => emailHelpers.update(i, e.target.value)}
                  />
                  {emails.length > 1 && (
                    <button
                      className="ml-2 text-red-500 font-bold"
                      onClick={() => emailHelpers.remove(i)}
                      type="button"
                    >
                      &minus;
                    </button>
                  )}
                </div>
              ))}
              <button
                className="mt-2 text-green-600 font-bold"
                onClick={emailHelpers.add}
                type="button"
              >
                + Add email
              </button>
            </div>

            {/* Phones */}
            <div className="mb-4">
              <label className="font-semibold">Phone numbers</label>
              {phones.map((ph, i) => (
                <div key={i} className="flex items-center mt-2">
                  <input
                    type="tel"
                    placeholder="(123) 456‑7890"
                    className="border rounded p-2 flex-grow"
                    value={ph}
                    onChange={e => phoneHelpers.update(i, e.target.value)}
                  />
                  {phones.length > 1 && (
                    <button
                      className="ml-2 text-red-500 font-bold"
                      onClick={() => phoneHelpers.remove(i)}
                      type="button"
                    >
                      &minus;
                    </button>
                  )}
                </div>
              ))}
              <button
                className="mt-2 text-green-600 font-bold"
                onClick={phoneHelpers.add}
                type="button"
              >
                + Add phone
              </button>
            </div>
            {/* Availability */}
            <div className="mb-4">
              <label className="font-semibold">Availability</label>
              {availability.map((dt, i) => (
                <div key={i} className="flex items-center mt-2">
                  <input
                    type="datetime-local"
                    className="border rounded p-2 flex-grow"
                    value={dt}
                    onChange={e => availabilityHelpers.update(i, e.target.value)}
                  />
                  {availability.length > 1 && (
                    <button
                      className="ml-2 text-red-500 font-bold"
                      type="button"
                      onClick={() => availabilityHelpers.remove(i)}
                    >
                      &minus;
                    </button>
                  )}
                </div>
              ))}
              <button
                className="mt-2 text-green-600 font-bold"
                type="button"
                onClick={availabilityHelpers.add}
              >
                + Add availability
             </button>
            </div>

            {/* Goal & Skill */}
            <div className="mb-4">
              <label className="font-semibold">Goal</label>
              <input
                type="text"
                placeholder="Enter a goal"
                className="border rounded p-2 w-full"
                value={goal}
                onChange={e => setGoal(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="font-semibold">Skill</label>
              <input
                type="text"
                placeholder="Enter a skill"
                className="border rounded p-2 w-full"
                value={skill}
                onChange={e => setSkill(e.target.value)}
              />
            </div>

            {createMessage && <p className="text-sm mb-3">{createMessage}</p>}
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={closeCreateModal}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleCreateAccount}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mentor popup */}
      {showMentorPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Mentor Details</h3>
            <input
              type="text"
              placeholder="Academic Background"
              className="border rounded w-full p-2 mb-3"
              value={mentorAcademicStatus}
              onChange={e => setMentorAcademicStatus(e.target.value)}
            />
            <select
              className="border rounded w-full p-2 mb-3"
              value={mentorActiveStatus}
              onChange={e => setMentorActiveStatus(e.target.value)}
            >
              <option value="">Active status…</option>
              <option value="active">Active</option>
              <option value="not_active">Not Active</option>
            </select>
            <button
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setShowMentorPopup(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Mentee popup */}
      {showMenteePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Mentee Details</h3>
            <input
              type="text"
              placeholder="Institution"
              className="border rounded w-full p-2 mb-3"
              value={menteeInstitution}
              onChange={e => setMenteeInstitution(e.target.value)}
            />
            <input
              type="text"
              placeholder="Academic Status"
              className="border rounded w-full p-2 mb-3"
              value={menteeAcademicStatus}
              onChange={e => setMenteeAcademicStatus(e.target.value)}
            />
            <button
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setShowMenteePopup(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
