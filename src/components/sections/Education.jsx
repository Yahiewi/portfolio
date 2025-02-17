import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import translations from '../../translations';

gsap.registerPlugin(ScrollTrigger);

export default function Education({ language }) {
  const stages = translations[language].education.stages;
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${stages.length * 1000}`, // Dynamically adjust scroll distance
          pin: true,
          scrub: 1,
        },
      });

      // Background transitions
      stages.forEach((_, index) => {
        if (index > 0) {
          mainTl.to(`.bg-${index}`, { autoAlpha: 0, duration: 1 }, index * 0.2);
          mainTl.fromTo(`.bg-${index + 1}`, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, index * 0.2);
        }
      });

      // Text transitions
      stages.forEach((_, index) => {
        if (index > 0) {
          mainTl.to(`.floorText-${index}`, { autoAlpha: 0, duration: 0.5 }, index * 0.18);
          mainTl.fromTo(`.floorText-${index + 1}`, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, index * 0.22);
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [stages]);

  return (
    <section ref={containerRef} className="relative w-full min-h-screen overflow-hidden bg-black text-white">
      {/* Background images */}
      <div className="absolute inset-0">
        {stages.map((_, index) => (
          <img
            key={index}
            src={`/images/${['ground', 'skyscraper', 'plane', 'nearspace', 'outerspace'][index]}.jpg`}
            alt={`Stage ${index + 1}`}
            className={`bg-${index + 1} absolute inset-0 w-full h-full object-cover`}
            style={{ opacity: index === 0 ? 1 : 0 }}
          />
        ))}
      </div>

      {/* Text containers */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        {stages.map((stage, index) => (
          <div
            key={index}
            className={`floorText-${index + 1} max-w-lg text-center absolute`}
            style={{ opacity: index === 0 ? 1 : 0 }}
          >
            <h2 className="text-4xl font-bold mb-4">{stage.title}</h2>
            <p className="text-lg mb-4">
              <strong>{stage.period}</strong> {stage.location}
              <br />
              {stage.details}
            </p>
            <p dangerouslySetInnerHTML={{ __html: stage.level }} />
          </div>
        ))}
      </div>
    </section>
  );
}
