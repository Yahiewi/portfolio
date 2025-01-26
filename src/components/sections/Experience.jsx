/* eslint-disable react/no-unknown-property */
import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// Import the black hole background
import BlackHoleShader from '../shaders/BlackHoleShader';

// Import your experience data
import experienceData from '../../data/experienceData';

// ------------------- StarOrbit (experience spheres) -------------------
function StarOrbit({ experience, onHover }) {
  const { orbitRadius, color, role, company, duration, description } = experience;
  const orbitRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Animate the star orbit around Y-axis
  useFrame((state, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += 0.2 * delta; // orbit speed
    }
  });

  return (
    <group ref={orbitRef}>
      <mesh
        position={[orbitRadius, 0, 0]}
        onPointerOver={() => {
          setHovered(true);
          onHover(experience);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
      >
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          emissive={color}
          emissiveIntensity={hovered ? 1.5 : 0.7}
          color={color}
        />
        {hovered && (
          <Html distanceFactor={10}>
            <div
              style={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: '8px 12px',
                borderRadius: '8px',
                maxWidth: '220px',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>{role}</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#ccc' }}>
                {company} <br />
                {duration}
              </p>
            </div>
          </Html>
        )}
      </mesh>
    </group>
  );
}

// ------------------- Experience Page -------------------
export default function Experience() {
  const [activeExperience, setActiveExperience] = useState(null);

  return (
    <div className="w-full h-screen text-white relative">
      <Canvas camera={{ position: [0, 5, 25], fov: 45 }}>
        {/* 
          1. Render the black hole as a background plane 
             (we put it first so that subsequent objects render on top).
        */}
        <BlackHoleShader />

        {/* 2. OrbitControls so user can pan/zoom (if desired) */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={0}
          rotateSpeed={0.4}
        />

        {/* 3. Basic lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight intensity={0.8} position={[10, 10, 5]} />

        {/* 4. Orbiting experiences */}
        {experienceData.map((exp) => (
          <StarOrbit
            key={exp.id}
            experience={exp}
            onHover={(expData) => setActiveExperience(expData)}
          />
        ))}
      </Canvas>

      {/* 5. An overlay that shows details of the hovered star */}
      {activeExperience && (
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-black/80 p-4 rounded-lg max-w-md">
          <h2 className="text-lg font-bold text-purple-300 mb-2">
            {activeExperience.role} @ {activeExperience.company}
          </h2>
          <p className="text-sm text-gray-200 mb-1">{activeExperience.duration}</p>
          <p className="text-sm text-gray-300">
            {/* Join the array of bullet points with line breaks */}
            {activeExperience.description.map((point, idx) => (
              <React.Fragment key={idx}>
                {point}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}
