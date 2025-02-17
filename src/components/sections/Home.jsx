import translations from '../../translations';
import { useRef, useEffect } from 'react';

export default function Home({ language }) {
  const t = translations[language].home;
  
  // Simple wobble animation using requestAnimationFrame
  const signRef = useRef(null);
  useEffect(() => {
    let frame;
    let angle = 0;

    const animate = () => {
      angle += 0.03; // adjust speed
      if (signRef.current) {
        signRef.current.style.transform = `translateY(${Math.sin(angle) * 2}px)`;
      }
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section
      id="home"
      className="relative w-full min-h-screen bg-transparent text-white flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/stars-bg.jpg')", 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark/Color overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      {/* "Under Construction" floating astronaut */}
      <div className="absolute top-5 right-5 z-20 flex items-center" ref={signRef}>
        {/* Small astronaut icon */}
        <img
          src="/images/astronaut-icon.png"
          alt="Astronaut"
          className="w-8 h-8 mr-2"
        />
        {/* Sign with text */}
        <div className="bg-purple-600 text-white px-3 py-1 rounded-full shadow-lg text-sm font-semibold">
          Under Construction
        </div>
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
        {/* Left (Text) */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            {t.greeting} <span className="text-purple-400">Yahia</span>
          </h1>
          <p className="leading-relaxed text-gray-200">{t.description}</p>
          {/* Example Button or CTA */}
          <div>
            <a
              href="contact"
              className="inline-block bg-purple-600 hover:bg-purple-700 transition-colors px-6 py-3 rounded-full text-white font-semibold"
            >
              {t.contactButton}
            </a>
          </div>
        </div>

        {/* Right (Photo) */}
        <div className="flex-1 flex justify-center">
          <img
            src="/images/yahia.jpg" // Replace with your actual file name in /public
            alt="Yahia Profile"
            className="w-72 h-72 object-cover rounded-full border-4 border-purple-400 shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
