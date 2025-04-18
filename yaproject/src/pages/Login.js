import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import users from '../data/users';

function Login() {
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const openModal = (selectedRole) => {
    setRole(selectedRole);
    setShowModal(true);
    setUserId('');
    setPassword('');
    setMessage('');
  };

  const closeModal = () => setShowModal(false);

  const handleLogin = () => {
    const userList = users[role];
    const userMatch = userList.find(
      (u) => u.userId === userId && u.password === password
    );

    if (userMatch) {
      setMessage('✅ Login successful!');
      setTimeout(() => {
        navigate(`/${role}`); // ✅ redirect based on role
      }, 800); // delay to show the success message
      localStorage.setItem('userRole', role);
    } else {
      setMessage('❌ Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="bg-white shadow-md rounded p-8 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="w-24 h-24 mb-4" />
          <h1 className="text-3xl font-bold">Welcome!</h1>
        </div>

        <div className="flex flex-col space-y-4">
          <button className="bg-secondary text-white font-bold py-2 px-4 rounded" onClick={() => openModal('admin')}>Admin Login</button>
          <button className="bg-secondary text-white font-bold py-2 px-4 rounded" onClick={() => openModal('mentor')}>Mentor Login</button>
          <button className="bg-secondary text-white font-bold py-2 px-4 rounded" onClick={() => openModal('mentee')}>Mentee Login</button>
        </div>

        <p className="mt-6 text-center">
          New?{' '}
          <Link to="/create-account" className="text-blue-500 hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 capitalize">{role} Login</h2>
            <input
              type="text"
              placeholder="User ID"
              className="border border-gray-300 rounded w-full p-2 mb-3"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 rounded w-full p-2 mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {message && <p className="text-sm mb-2">{message}</p>}
            <div className="flex justify-between">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleLogin}
              >
                Submit
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
