import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

// Import sections
import Home from './components/sections/Home';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Education from './components/sections/Education';
import Experience from './components/sections/Experience';
import Contact from './components/sections/Contact';

const App = () => {
  const [language, setLanguage] = useState('en');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'fr' : 'en'));
  };

  const navItems = {
    en: ['Home', 'Projects', 'Skills', 'Education', 'Experience', 'Contact'],
    fr: ['Accueil', 'Projets', 'Compétences', 'Éducation', 'Expérience', 'Contact']
  };

  return (
    <Router>
      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Interactive Background */}
        <div
          className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.15),rgba(0,0,0,0))]"
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
          }}
        />

        {/* Header */}
        <header className="fixed w-full z-50">
          <nav className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between backdrop-blur-lg bg-black/20 rounded-2xl px-6 py-4 border border-white/10">
              <h1 className="text-2xl font-bold">
                <span className="text-purple-500">Y</span>ahia
              </h1>

              <div className="flex items-center gap-8">
                <ul className="hidden md:flex gap-8">
                  {navItems[language].map((item, index) => (
                    <li key={index}>
                      <Link
                        to={`/${item.toLowerCase()}`}
                        className="relative group text-white hover:text-white transition-colors"
                      >
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-purple-500 transition-all group-hover:w-full" />
                      </Link>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
                >
                  <Globe size={16} className="text-purple-400" />
                  <span className="text-sm font-medium">{language.toUpperCase()}</span>
                </button>
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="relative pt-32 max-w-6xl mx-auto px-6">
          <Routes>
            <Route path="/" element={<Home language={language} />} />
            <Route path="/projects" element={<Projects language={language} />} />
            <Route path="/skills" element={<Skills language={language} />} />
            <Route path="/education" element={<Education language={language} />} />
            <Route path="/experience" element={<Experience language={language} />} />
            <Route path="/contact" element={<Contact language={language} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
