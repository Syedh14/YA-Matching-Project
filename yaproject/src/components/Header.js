import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../images/logo.png';
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
    <nav className="flex items-center justify-between p-6 border-b border-black">
      <div className="flex space-x-48">
    {navLinks.map((link) => {
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

  {/* Logo on the right side */}
  <div>
    <img src={logo} alt="Logo" className="w-16 h-16" />
  </div>
</nav>
  );
};

export default Header;