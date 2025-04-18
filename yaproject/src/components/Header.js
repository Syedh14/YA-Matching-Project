// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../images/logo.png';

const Header = () => {
  const location = useLocation();
  const [role, setRole] = useState(null);

  useEffect(() => {
    
    setRole(localStorage.getItem('userRole'));
  }, []);

  
  if (!role) return null;

  const adminLinks = [
    { name: 'Home', path: '/admin' },
    { name: 'AI Matching', path: '/admin-matches' },
    { name: 'Profile', path: '/profile' },
  ];

  const mentorMenteeLinks = [
    { name: 'Home', path: `/${role}` },          // '/mentor' or '/mentee'
    { name: 'Progress Reports', path: '/progress_report' },
    { name: 'Resources', path: '/resources' },
    { name: 'Profile', path: '/profile' },
  ];

  const navLinks = role === 'admin' ? adminLinks : mentorMenteeLinks;

  return (
    <nav className="flex items-center justify-between p-6 border-b border-black">
      <div className="flex space-x-48">
        {navLinks.map(link => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`
                px-24 py-3 
                border 
                rounded-t-md 
                transition-colors
                ${isActive 
                  ? 'bg-secondary text-white border-secondary' 
                  : 'bg-white text-secondary border-secondary hover:bg-secondary hover:text-white'
                }
              `}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
      <div>
        <img src={logo} alt="Logo" className="w-16 h-16" />
      </div>
    </nav>
  );
};

export default Header;
