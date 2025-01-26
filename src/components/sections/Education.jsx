import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Education() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main timeline controlling 5 backgrounds + 5 text blocks.
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=5000',    // Total scroll distance; tweak as needed
          pin: true,
          scrub: 1,         // Smooth scrubbing
        },
      });

      // Background transitions (fade in/out)
      mainTl.fromTo('.bg-1', { autoAlpha: 1 }, { autoAlpha: 1, duration: 0.1 }, 0); // Ground remains visible at first
      mainTl.to('.bg-1', { autoAlpha: 0, duration: 1 }, 0.2); // Fade out Ground
      mainTl.fromTo('.bg-2', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 0.2); // Fade in Skyscraper

      mainTl.to('.bg-2', { autoAlpha: 0, duration: 1 }, 0.4); // Fade out Skyscraper
      mainTl.fromTo('.bg-3', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 0.4); // Fade in Plane

      mainTl.to('.bg-3', { autoAlpha: 0, duration: 1 }, 0.6); // Fade out Plane
      mainTl.fromTo('.bg-4', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 0.6); // Fade in Near Space

      mainTl.to('.bg-4', { autoAlpha: 0, duration: 1 }, 0.8); // Fade out Near Space
      mainTl.fromTo('.bg-5', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 0.8); // Fade in Outer Space

      // Text transitions (ensure no overlap)
      mainTl.fromTo('.floorText-1', { autoAlpha: 1 }, { autoAlpha: 1, duration: 0.1 }, 0); // Keep text 1 visible
      mainTl.to('.floorText-1', { autoAlpha: 0, duration: 0.5 }, 0.18); // Start fading out text 1 slightly before 0.2
      mainTl.fromTo('.floorText-2', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.22); // Fade in text 2 after text 1 fades out

      mainTl.to('.floorText-2', { autoAlpha: 0, duration: 0.5 }, 0.38);
      mainTl.fromTo('.floorText-3', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.42);

      mainTl.to('.floorText-3', { autoAlpha: 0, duration: 0.5 }, 0.58);
      mainTl.fromTo('.floorText-4', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.62);

      mainTl.to('.floorText-4', { autoAlpha: 0, duration: 0.5 }, 0.78);
      mainTl.fromTo('.floorText-5', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.82);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full min-h-screen overflow-hidden bg-black text-white">
      {/* Background images */}
      <div className="absolute inset-0">
        <img
          src="/images/ground.jpg"
          alt="Ground"
          className="bg-1 absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 1 }}
        />
        <img
          src="/images/skyscraper.jpg"
          alt="Skyscraper"
          className="bg-2 absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0 }}
        />
        <img
          src="/images/plane.jpg"
          alt="Plane"
          className="bg-3 absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0 }}
        />
        <img
          src="/images/nearspace.jpg"
          alt="Near Space"
          className="bg-4 absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0 }}
        />
        <img
          src="/images/outerspace.jpg"
          alt="Outer Space"
          className="bg-5 absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0 }}
        />
      </div>

      {/* Text containers */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="floorText-1 max-w-lg text-center">
          <h2 className="text-4xl font-bold mb-4">Preparatory Classes – Year 1</h2>
          <p className="text-lg mb-4">
            <strong>2020–2021</strong> at IPEST, Tunis
            <br />
            Foundations in Mathematics &amp; Physics
          </p>
          <p>You are on the <strong>Ground Level</strong>.</p>
        </div>

        <div className="floorText-2 max-w-lg text-center absolute" style={{ opacity: 0 }}>
          <h2 className="text-4xl font-bold mb-4">Preparatory Classes – Year 2</h2>
          <p className="text-lg mb-4">
            <strong>2021–2022</strong> at IPEST, Tunis
            <br />
            Passed CCMP, Centrale-Supélec, CCINP, and national exams
          </p>
          <p>We’ve reached the <strong>Skyscraper Level</strong>.</p>
        </div>

        <div className="floorText-3 max-w-lg text-center absolute" style={{ opacity: 0 }}>
          <h2 className="text-4xl font-bold mb-4">Engineering – 1st Year</h2>
          <p className="text-lg mb-4">
            <strong>2022–2023</strong> at IMT Atlantique
            <br />
            Probability, Statistics, Signal Processing, Physics, Programming...
          </p>
          <p>We are now at the <strong>Commercial Plane Level</strong>.</p>
        </div>

        <div className="floorText-4 max-w-lg text-center absolute" style={{ opacity: 0 }}>
          <h2 className="text-4xl font-bold mb-4">Engineering – 2nd Year</h2>
          <p className="text-lg mb-4">
            <strong>2023–2024</strong> (Software Dev Specialization)
            <br />
            OOP, Functional Paradigm, Design Patterns, Cryptography, Microservices...
          </p>
          <p>Welcome to <strong>Near Space Orbit</strong>.</p>
        </div>

        <div className="floorText-5 max-w-lg text-center absolute" style={{ opacity: 0 }}>
          <h2 className="text-4xl font-bold mb-4">Engineering – 3rd Year</h2>
          <p className="text-lg mb-4">
            <strong>2024–2025</strong> (Software Dev Continuation)
            <br />
            Advanced topics, specialized projects, final internships
          </p>
          <p>We’ve reached <strong>Deep Space</strong>!</p>
        </div>
      </div>
    </section>
  );
}
