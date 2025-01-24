import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Education() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create our main timeline that controls the 5 floors.
      // We pin the entire section and give it enough scroll distance
      // for each floor fade in/out.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=5000',    // total scroll distance; adjust as needed
          pin: true,        // pin the section
          scrub: 1,         // smooth scrubbing
        },
      });

      // 5 floors => 4 transitions (Floor1->Floor2, Floor2->Floor3, etc.)
      // We'll do fade out / fade in for each.

      // FLOOR 1: keep visible at first
      tl.fromTo('.floor-1', { autoAlpha: 1 }, { autoAlpha: 1, duration: 0.5 });

      // Fade floor-1 out, floor-2 in
      tl.to('.floor-1', { autoAlpha: 0, duration: 1 });
      tl.fromTo('.floor-2', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 });

      // Fade floor-2 out, floor-3 in
      tl.to('.floor-2', { autoAlpha: 0, duration: 1 });
      tl.fromTo('.floor-3', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 });

      // Fade floor-3 out, floor-4 in
      tl.to('.floor-3', { autoAlpha: 0, duration: 1 });
      tl.fromTo('.floor-4', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 });

      // Fade floor-4 out, floor-5 in
      tl.to('.floor-4', { autoAlpha: 0, duration: 1 });
      tl.fromTo('.floor-5', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden text-white bg-black"
    >
      {/* Optional: If you want a global background fade or starfield, place it here. */}
      {/* <img
        src="/images/starfield.jpg"
        alt="Starfield"
        className="absolute inset-0 w-full h-full object-cover"
      /> */}

      {/* 
        We'll place all floors as absolute overlays (same size, same position).
        We'll let GSAP fade them in/out in sequence.
      */}
      <div className="absolute inset-0">
        {/* ====== FLOOR 1: Preparatory Classes Year 1 ====== */}
        <div
          className="
            floor-1
            absolute inset-0
            flex flex-col items-center justify-center text-center
            px-4
            transition-opacity
          "
          style={{
            // Example background or inline style
            backgroundImage: 'url("/images/ground.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <h2 className="text-4xl font-bold mb-4">Preparatory Classes – Year 1</h2>
          <p className="text-lg max-w-lg mb-4">
            <strong>2020–2021</strong> at IPEST, Tunis <br />
            Foundations in Mathematics &amp; Physics
          </p>
          <p className="opacity-80">You are on the <strong>Ground Level</strong>.</p>
        </div>

        {/* ====== FLOOR 2: Preparatory Classes Year 2 ====== */}
        <div
          className="
            floor-2
            absolute inset-0
            flex flex-col items-center justify-center text-center
            px-4
            transition-opacity
          "
          style={{
            // Example background or inline style
            backgroundImage: 'url("/images/skyscraper.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0, // Start hidden
          }}
        >
          <h2 className="text-4xl font-bold mb-4">Preparatory Classes – Year 2</h2>
          <p className="text-lg max-w-lg mb-4">
            <strong>2021–2022</strong> at IPEST, Tunis <br />
            Passed CCMP, Centrale-Supélec, CCINP, and national exams
          </p>
          <p className="opacity-80">We’ve reached the <strong>Skyscraper Level</strong>.</p>
        </div>

        {/* ====== FLOOR 3: Engineering Year 1 ====== */}
        <div
          className="
            floor-3
            absolute inset-0
            flex flex-col items-center justify-center text-center
            px-4
            transition-opacity
          "
          style={{
            backgroundImage: 'url("/images/plane.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0,
          }}
        >
          <h2 className="text-4xl font-bold mb-4">Engineering – 1st Year</h2>
          <p className="text-lg max-w-lg mb-4">
            <strong>2022–2023</strong> at IMT Atlantique <br />
            Probability, Statistics, Signal Processing, Physics, Programming...
          </p>
          <p className="opacity-80">
            We are now at the <strong>Commercial Plane Level</strong>.
          </p>
        </div>

        {/* ====== FLOOR 4: Engineering Year 2 ====== */}
        <div
          className="
            floor-4
            absolute inset-0
            flex flex-col items-center justify-center text-center
            px-4
            transition-opacity
          "
          style={{
            backgroundImage: 'url("/images/nearspace.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0,
          }}
        >
          <h2 className="text-4xl font-bold mb-4">Engineering – 2nd Year</h2>
          <p className="text-lg max-w-lg mb-4">
            <strong>2023–2024</strong> (Software Development Specialization)
            <br />
            OOP, Functional Paradigm, Design Patterns, Cryptography, Microservices...
          </p>
          <p className="opacity-80">Welcome to <strong>Near Space Orbit</strong>.</p>
        </div>

        {/* ====== FLOOR 5: Engineering Year 3 ====== */}
        <div
          className="
            floor-5
            absolute inset-0
            flex flex-col items-center justify-center text-center
            px-4
            transition-opacity
          "
          style={{
            backgroundImage: 'url("/images/outerspace.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0,
          }}
        >
          <h2 className="text-4xl font-bold mb-4">Engineering – 3rd Year</h2>
          <p className="text-lg max-w-lg mb-4">
            <strong>2024–2025</strong> (Software Dev. Continuation)
            <br />
            Advanced topics, specialized projects, final internships
          </p>
          <p className="opacity-80">We’ve reached <strong>Deep Space</strong>!</p>
        </div>
      </div>
    </section>
  );
}
