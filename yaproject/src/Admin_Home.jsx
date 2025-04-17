import React from 'react';

function Admin_Home() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="bg-white shadow-md rounded p-8 max-w-md w-full"> 
          <div className="flex flex-col items-center mb-6">
            <img src={logo} alt="Logo" className="w-24 h-24 mb-4" />
            <h1 className="text-3xl font-bold">Welcome!</h1>
          </div>
          <div className="flex flex-col space-y-4">
            <button
              className="bg-secondary text-white font-bold py-2 px-4 rounded"
              onClick={() => console.log('Admin Login')}
            >
              Admin Login
            </button>
            <button
              className="bg-secondary text-white font-bold py-2 px-4 rounded"
              onClick={() => console.log('Mentor Login')}
            >
              Mentor Login
            </button>
            <button
              className="bg-secondary text-white font-bold py-2 px-4 rounded"
              onClick={() => console.log('Mentee Login')}
            >
              Mentee Login
            </button>
          </div>
          <p className="mt-6 text-center">
            New?{' '}
            <a href="/create-account" className="text-blue-500 hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>
    );
  }
  
  export default Admin_Home;