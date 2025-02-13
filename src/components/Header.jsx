import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  // Scroll smoothly when clicking links
  const handleScroll = (event, sectionId) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 w-full bg-black/80 text-white backdrop-blur-lg z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <span className="text-purple-500">My</span> Portfolio
        </h1>
        
        <nav>
          <ul className="flex gap-6">
            {['Home', 'Projects', 'Skills', 'Education', 'Experience', 'Contact'].map((item) => (
              <li key={item}>
                {/* Use React Router for navigation */}
                {item === 'Home' ? (
                  <Link to="/" className="hover:text-purple-500">
                    {item}
                  </Link>
                ) : (
                  <Link to={`/${item.toLowerCase()}`} className="hover:text-purple-500">
                    {item}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
