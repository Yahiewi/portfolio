/* eslint-disable react/no-unknown-property */
import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import emailjs from '@emailjs/browser';

// ----- Hologram Subcomponent -----
// Replaces the old Hologram. Now we have:
// 1) A "flickerPlane" behind the logo (slightly bigger, flickers light blue).
// 2) The main logo plane in front, fully visible (fades in/out on hover).
function Hologram({ hovered, logoTexture }) {
  const groupRef = React.useRef(null);
  const logoRef = React.useRef(null);
  const flickerRef = React.useRef(null);

  // We'll keep local refs for scale and opacity to animate them smoothly in useFrame
  const scale = React.useRef(0);
  const opacity = React.useRef(0);

  useFrame(() => {
    // If hovered, target scale = 1; else 0
    const targetScale = hovered ? 1 : 0;
    scale.current = THREE.MathUtils.lerp(scale.current, targetScale, 0.1);

    // If hovered, target opacity = ~0.9; else 0
    const targetOpacity = hovered ? 0.9 : 0;
    opacity.current = THREE.MathUtils.lerp(opacity.current, targetOpacity, 0.1);

    // Update main logo plane
    if (logoRef.current) {
      // Fade scale & opacity in/out
      logoRef.current.scale.set(scale.current, scale.current, 1);
      logoRef.current.material.opacity = opacity.current;
    }

    // Update flicker plane behind the logo
    if (flickerRef.current) {
      // Match the scale of the main logo so they appear/disappear together
      flickerRef.current.scale.set(scale.current, scale.current, 1);

      if (hovered) {
        // Random flicker factor in a small range
        const flicker = 0.2 + Math.random() * 0.1;
        // Multiply by overall opacity so it fades in/out with the logo
        flickerRef.current.material.opacity = flicker * opacity.current;
        // Adjust emissive intensity to flicker the glow
        flickerRef.current.material.emissiveIntensity = flicker * 1.5;
      } else {
        flickerRef.current.material.opacity = 0;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.5, 0]}>
      {/* Flickering plane behind the logo (slightly bigger) */}
      <mesh
        ref={flickerRef}
        position={[0, 0, -0.01]} // Slightly behind the logo plane
        rotation={[0, 0, 0]}    // You can tilt this if you like (e.g., [Math.PI / 12, 0, 0])
      >
        <planeGeometry args={[1.4, 1.4]} />
        <meshStandardMaterial
          color="#00bbff"
          emissive="#00bbff"
          transparent
          opacity={0}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Main logo plane (fully visible, no flicker) */}
      <mesh ref={logoRef}>
        <planeGeometry args={[1.2, 1.2]} />
        <meshBasicMaterial
          map={logoTexture}
          transparent
          opacity={0}
          color="#ffffff"
        />
      </mesh>
    </group>
  );
}



// ----- Voyager 1 (Email) -----
function VoyagerOne({ position, isHovered, setHovered, onClick }) {
  // Load your mail logo image (replace path as needed)
  const mailLogo = useTexture('/images/mail.png');
  const groupRef = useRef();

  // Drifting animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Slow rotation
      groupRef.current.rotation.y += delta * 0.1;
      // Bobbing up/down
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime) * 0.4;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      // Hover events
      onPointerOver={() => setHovered('voyager1')}
      onPointerOut={() => setHovered(null)}
      onClick={onClick}
    >
      {/* Body of the probe (simple box) */}
      <mesh>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshStandardMaterial color="#bbbbbb" />
      </mesh>

      {/* Dish (cylindrical + scaled) */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0, 0.6, 0.05, 16]} />
        <meshStandardMaterial emissive="#fff59d" emissiveIntensity={0.3} />
      </mesh>

      {/* Antenna (small stick) */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial color="#888" />
      </mesh>

      {/* Outer ring for style */}
      <mesh rotation-x={Math.PI / 2} position={[0, 0.21, 0]}>
        <ringGeometry args={[0.62, 0.65, 32]} />
        <meshStandardMaterial
          color="#fff9c4"
          emissive="#fff9c4"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Hologram logo */}
      <Hologram hovered={isHovered === 'voyager1'} logoTexture={mailLogo} />
    </group>
  );
}

// ----- Voyager 2 (LinkedIn) -----
function VoyagerTwo({ position, isHovered, setHovered, onClick }) {
  // Load your LinkedIn logo image (replace path as needed)
  const linkedinLogo = useTexture('/images/linkedin.png');
  const groupRef = useRef();

  // Drifting animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Slow rotation (opposite direction for variation)
      groupRef.current.rotation.y -= delta * 0.1;
      // Bobbing up/down
      groupRef.current.position.y =
        position[1] + Math.cos(state.clock.elapsedTime) * 0.4;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      // Hover events
      onPointerOver={() => setHovered('voyager2')}
      onPointerOut={() => setHovered(null)}
      onClick={onClick}
    >
      {/* Body */}
      <mesh>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshStandardMaterial color="#aabbee" />
      </mesh>

      {/* Dish */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0, 0.6, 0.05, 16]} />
        <meshStandardMaterial emissive="#bbdefb" emissiveIntensity={0.3} />
      </mesh>

      {/* Antenna */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial color="#888" />
      </mesh>

      {/* Outer ring */}
      <mesh rotation-x={Math.PI / 2} position={[0, 0.21, 0]}>
        <ringGeometry args={[0.62, 0.65, 32]} />
        <meshStandardMaterial
          color="#dbefff"
          emissive="#dbefff"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Hologram logo */}
      <Hologram hovered={isHovered === 'voyager2'} logoTexture={linkedinLogo} />
    </group>
  );
}

// ----- Voyager 3 (GitHub) -----
function VoyagerThree({ position, isHovered, setHovered, onClick }) {
  // Load your GitHub logo image (replace path as needed)
  const githubLogo = useTexture('/images/github.png');
  const groupRef = useRef();

  // Drifting animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + 2) * 0.4;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered('voyager3')}
      onPointerOut={() => setHovered(null)}
      onClick={onClick}
    >
      {/* Body */}
      <mesh>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>

      {/* Dish */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0, 0.6, 0.05, 16]} />
        <meshStandardMaterial emissive="#ccc" emissiveIntensity={0.3} />
      </mesh>

      {/* Antenna */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial color="#888" />
      </mesh>

      {/* Outer ring */}
      <mesh rotation-x={Math.PI / 2} position={[0, 0.21, 0]}>
        <ringGeometry args={[0.62, 0.65, 32]} />
        <meshStandardMaterial
          color="#ccc"
          emissive="#ccc"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Hologram logo */}
      <Hologram hovered={isHovered === 'voyager3'} logoTexture={githubLogo} />
    </group>
  );
}

// ----- Email Modal (sends via EmailJS) -----
function EmailFormModal({ onClose }) {
  const formRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);

    // Replace with your own EmailJS keys/config
    emailjs
      .sendForm(
        'service_0ur1wb9',
        'template_fuvqcnj',
        formRef.current,
        'FogpWK-HACq62q8If'
      )
      .then(
        (result) => {
          console.log('Email sent:', result.text);
          setSending(false);
          setSuccess(true);
        },
        (error) => {
          console.error('Email error:', error);
          setSending(false);
        }
      );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4">
      <div className="bg-white text-black p-6 rounded-md w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        {success ? (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">Message Sent!</h2>
            <p className="mb-4">
              Thank you for reaching out. I’ll get back to you as soon as
              possible.
            </p>
            <button
              onClick={onClose}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">Send me an Email</h2>
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* The "to_email" or "to_name" can be set in your EmailJS template settings */}
              <label className="flex flex-col">
                <span className="font-medium">Your Name</span>
                <input
                  type="text"
                  name="from_name"
                  required
                  className="border px-2 py-1 mt-1"
                />
              </label>
              <label className="flex flex-col">
                <span className="font-medium">Your Email</span>
                <input
                  type="email"
                  name="reply_to"
                  required
                  className="border px-2 py-1 mt-1"
                />
              </label>
              <label className="flex flex-col">
                <span className="font-medium">Message</span>
                <textarea
                  name="message"
                  rows="4"
                  required
                  className="border px-2 py-1 mt-1"
                />
              </label>
              <button
                type="submit"
                disabled={sending}
                className="bg-purple-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-purple-700 transition"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ----- Main Contact Component -----
export default function Contact() {
  // Track which probe (if any) is hovered
  // Can be 'voyager1', 'voyager2', 'voyager3', or null
  const [hovered, setHovered] = useState(null);

  // Email modal
  const [showEmailForm, setShowEmailForm] = useState(false);

  // Click handlers
  const handleVoyager1Click = () => {
    // Show email form
    setShowEmailForm(true);
  };

  const handleVoyager2Click = () => {
    // Redirect to LinkedIn
    window.open('https://www.linkedin.com/in/yahia-heni', '_blank');
  };

  const handleVoyager3Click = () => {
    // Redirect to GitHub
    window.open('https://github.com/Yahiewi', '_blank');
  };

  return (
    <div className="relative w-full h-screen" id="contact">
      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        {/* OrbitControls if you want user to move the scene */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 2.5}
        />

        {/* Star field */}
        <Stars radius={200} depth={50} count={3000} factor={7} fade />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={0.5} />

        {/* Voyagers / Probes */}
        <VoyagerOne
          position={[-4, 0, 0]}
          isHovered={hovered}
          setHovered={setHovered}
          onClick={handleVoyager1Click}
        />
        <VoyagerTwo
          position={[0, -1, 0]}
          isHovered={hovered}
          setHovered={setHovered}
          onClick={handleVoyager2Click}
        />
        <VoyagerThree
          position={[4, 0, 0]}
          isHovered={hovered}
          setHovered={setHovered}
          onClick={handleVoyager3Click}
        />
      </Canvas>

      {/* Email Form Modal */}
      {showEmailForm && <EmailFormModal onClose={() => setShowEmailForm(false)} />}
    </div>
  );
}
