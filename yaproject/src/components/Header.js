
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../images/logo.png';
import axios from 'axios';

const Header = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

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

  
  if (!user) return null;

  const adminLinks = [
    { name: 'Home', path: '/admin' },
    { name: 'AI Matching', path: '/admin-matches' },
    { name: 'Profile', path: '/profile' },
  ];

  const mentorMenteeLinks = [
    { name: 'Home', path: `/${user.role}` },          
    { name: 'Progress Reports', path: '/progress_report' },
    { name: 'Resources', path: '/resources' },
    { name: 'Profile', path: '/profile' },
  ];

  const navLinks = user.role === 'admin' ? adminLinks : mentorMenteeLinks;

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
