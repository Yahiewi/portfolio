import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const Portfolio = () => {
  const [language, setLanguage] = useState('en');
  const [activeSection, setActiveSection] = useState('home');
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
    en: ['Home', 'Projects', 'Skills', 'CV', 'Contact'],
    fr: ['Accueil', 'Projets', 'Compétences', 'CV', 'Contact']
  };

  return (
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
                    <button 
                      onClick={() => setActiveSection(item.toLowerCase())}
                      className={`relative group ${
                        activeSection === item.toLowerCase() ? 'text-purple-400' : ''
                      }`}
                    >
                      {item}
                      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-purple-500 transition-all group-hover:w-full" />
                    </button>
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
        <section className="min-h-[calc(100vh-8rem)] flex flex-col justify-center">
          {/* Decorative elements */}
          <div className="absolute top-40 -left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
          
          {/* Content */}
          <div className="relative">
            <h2 className="text-6xl font-bold mb-8">
              {language === 'en' ? (
                <>
                  Software Engineer<br />
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Creating Digital Solutions
                  </span>
                </>
              ) : (
                <>
                  Ingénieur Logiciel<br />
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Créant des Solutions Digitales
                  </span>
                </>
              )}
            </h2>
            
            <p className="text-xl text-gray-400 max-w-2xl mb-12">
              {language === 'en' 
                ? "Transforming complex problems into elegant solutions through innovative software engineering."
                : "Transformer des problèmes complexes en solutions élégantes par l'ingénierie logicielle innovante."}
            </p>

            <div className="flex gap-6">
              <button className="px-8 py-4 rounded-xl bg-purple-500 hover:bg-purple-600 transition-colors">
                {language === 'en' ? "View Projects" : "Voir les Projets"}
              </button>
              <button className="px-8 py-4 rounded-xl border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300">
                {language === 'en' ? "Contact Me" : "Me Contacter"}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Portfolio;
