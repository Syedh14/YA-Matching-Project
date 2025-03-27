import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  // useLocation allows us to get the current URL path
  const location = useLocation();

  // Define your navigation links
  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Progress Reports', path: '/progress-reports' },
    { name: 'Resources', path: '/resources' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="flex items-center space-x-48 p-6">
      {navLinks.map((link) => {
        // Check if the current path is the same as the link path
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
    </nav>
  );
};

export default Header;