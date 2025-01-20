import React from 'react';

const Header = () => {
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
                <a href={`#${item.toLowerCase()}`} className="hover:text-purple-500">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
