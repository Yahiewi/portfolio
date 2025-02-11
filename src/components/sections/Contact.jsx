/* eslint-disable react/no-unknown-property */
import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import emailjs from '@emailjs/browser';

// --------------------------------------------------
// 1) Hologram Subcomponent
// --------------------------------------------------
function Hologram({ hovered, logoTexture }) {
  const groupRef = React.useRef(null);
  const logoRef = React.useRef(null);
  const auraRef = React.useRef(null);

  // We'll keep refs for scale and opacity to animate them in useFrame
  const scale = React.useRef(0);
  const opacity = React.useRef(0);

  useFrame(() => {
    // Smoothly transition scale from 0 to 1 on hover
    const targetScale = hovered ? 1 : 0;
    scale.current = THREE.MathUtils.lerp(scale.current, targetScale, 0.1);

    // Smoothly transition opacity from 0 to ~0.9 on hover
    const targetOpacity = hovered ? 0.9 : 0;
    opacity.current = THREE.MathUtils.lerp(opacity.current, targetOpacity, 0.1);

    // Update main logo plane
    if (logoRef.current) {
      logoRef.current.scale.set(scale.current, scale.current, 1);
      logoRef.current.material.opacity = opacity.current;
    }

    // Update hologram aura plane behind the logo
    if (auraRef.current) {
      // Match the main logo's scale for a synchronized fade in/out
      auraRef.current.scale.set(scale.current, scale.current, 1);
      // Slightly lower opacity so the aura is more subtle
      auraRef.current.material.opacity = 0.4 * opacity.current;
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.5, 0]}>
      {/* Hologram aura plane (slightly bigger, subtle color) */}
      <mesh ref={auraRef} position={[0, 0, -0.01]}>
        <planeGeometry args={[1.4, 1.4]} />
        <meshStandardMaterial
          color="#00bbff"
          emissive="#00bbff"
          emissiveIntensity={0.2}
          transparent
          opacity={0}
          side={THREE.DoubleSide} // visible from both sides
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
          side={THREE.DoubleSide} // visible from both sides
        />
      </mesh>
    </group>
  );
}

// --------------------------------------------------
// 2) A Reusable VoyagerBase Component
//    - Contains the body, dish, antenna, ring, and
//      rotation/bobbing logic
//    - Accepts props to customize each "Voyager"
// --------------------------------------------------
function VoyagerBase({
  position,
  isHovered,
  probeID,
  setHovered,
  onClick,
  // Visual customizations
  bodyColor,
  dishEmissive,
  ringColor,
  ringEmissive,
  ringEmissiveIntensity = 0.2,
  // Rotation customizations
  minAngle,
  maxAngle,
  rotationSpeed,
  // Hologram texture
  logoTexture
}) {
  const groupRef = useRef();

  // We'll store the current rotation direction in a ref so it persists
  const directionRef = useRef(1);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // 1) Rotation
      groupRef.current.rotation.y += directionRef.current * rotationSpeed * delta;

      // 2) Check limits
      if (groupRef.current.rotation.y > maxAngle) {
        groupRef.current.rotation.y = maxAngle;
        directionRef.current = -1; // flip direction
      } else if (groupRef.current.rotation.y < minAngle) {
        groupRef.current.rotation.y = minAngle;
        directionRef.current = 1; // flip direction
      }

      // 3) Bobbing
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime) * 0.4;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      // Hover events
      onPointerOver={(e) => {
        setHovered(probeID);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        setHovered(null);
        document.body.style.cursor = 'auto';
      }}
      onClick={onClick}
    >
      {/* Body */}
      <mesh>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Dish */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0, 0.6, 0.05, 16]} />
        <meshStandardMaterial emissive={dishEmissive} emissiveIntensity={0.3} />
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
          color={ringColor}
          emissive={ringEmissive}
          emissiveIntensity={ringEmissiveIntensity}
        />
      </mesh>

      {/* Hologram logo */}
      <Hologram hovered={isHovered === probeID} logoTexture={logoTexture} />
    </group>
  );
}

// --------------------------------------------------
// 3) VoyagerOne, VoyagerTwo, VoyagerThree
//    - Thin wrappers that pass unique props to VoyagerBase
// --------------------------------------------------
function VoyagerOne({ position, isHovered, setHovered, onClick }) {
  const mailLogo = useTexture('/images/mail.png');
  return (
    <VoyagerBase
      position={position}
      isHovered={isHovered}
      probeID="voyager1"
      setHovered={setHovered}
      onClick={onClick}
      bodyColor="#bbbbbb"
      dishEmissive="#fff59d"
      ringColor="#fff9c4"
      ringEmissive="#fff9c4"
      ringEmissiveIntensity={0.2}
      minAngle={-0.6}
      maxAngle={0.6}
      rotationSpeed={0.4}
      logoTexture={mailLogo}
    />
  );
}

function VoyagerTwo({ position, isHovered, setHovered, onClick }) {
  const linkedinLogo = useTexture('/images/linkedin.png');
  return (
    <VoyagerBase
      position={position}
      isHovered={isHovered}
      probeID="voyager2"
      setHovered={setHovered}
      onClick={onClick}
      bodyColor="#aabbee"
      dishEmissive="#bbdefb"
      ringColor="#dbefff"
      ringEmissive="#dbefff"
      ringEmissiveIntensity={0.2}
      minAngle={-0.4}
      maxAngle={0.4}
      rotationSpeed={0.3}
      logoTexture={linkedinLogo}
    />
  );
}

function VoyagerThree({ position, isHovered, setHovered, onClick }) {
  const githubLogo = useTexture('/images/github.png');
  return (
    <VoyagerBase
      position={position}
      isHovered={isHovered}
      probeID="voyager3"
      setHovered={setHovered}
      onClick={onClick}
      bodyColor="#cccccc"
      dishEmissive="#ccc"
      ringColor="#ccc"
      ringEmissive="#ccc"
      ringEmissiveIntensity={0.2}
      minAngle={-0.3}
      maxAngle={0.25}
      rotationSpeed={0.3}
      logoTexture={githubLogo}
    />
  );
}

// --------------------------------------------------
// 4) EmailFormModal
// --------------------------------------------------
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
              Thank you for reaching out. I’ll get back to you as soon as possible.
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

// --------------------------------------------------
// 5) Main Contact Component
// --------------------------------------------------
export default function Contact() {
  // Track which probe (if any) is hovered: 'voyager1', 'voyager2', 'voyager3', or null
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
