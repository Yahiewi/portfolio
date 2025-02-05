/* eslint-disable react/no-unknown-property */
import React, { useState, useRef, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// Import the black hole background
import BlackHoleShader from '../shaders/BlackHoleShader';

// Import experience data
import experienceData from '../../data/experienceData';

// ------------------- StarOrbit (experience spheres) -------------------
const StarOrbit = memo(({ experience, onHover }) => {
  const { orbitRadius, color, role, company, duration, description } = experience;
  const orbitRef = useRef();
  const [hovered, setHovered] = useState(false);
  const orbitSpeed = 0.1; // Reduced speed for efficiency

  // Animate the star orbit (around a fixed center)
  useFrame((_, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += orbitSpeed * delta;
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
        <meshStandardMaterial emissive={color} emissiveIntensity={hovered ? 1.5 : 0.7} color={color} />
        
        {/* Hover Information */}
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
});

// ------------------- Experience Page -------------------
export default function Experience() {
  const [activeExperience, setActiveExperience] = useState(null);

  return (
    <div className="w-full h-screen text-white relative">
      <Canvas camera={{ position: [0, 0, 25], fov: 45 }}>
        {/* Render Black Hole as a Static Background */}
        <BlackHoleShader />

        {/* Basic Lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight intensity={0.8} position={[10, 10, 5]} />

        {/* Orbiting Experiences */}
        {experienceData.map((exp) => (
          <StarOrbit key={exp.id} experience={exp} onHover={setActiveExperience} />
        ))}
      </Canvas>

      {/* Hovered Experience Details Overlay */}
      {activeExperience && (
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-black/80 p-4 rounded-lg max-w-md">
          <h2 className="text-lg font-bold text-purple-300 mb-2">
            {activeExperience.role} @ {activeExperience.company}
          </h2>
          <p className="text-sm text-gray-200 mb-1">{activeExperience.duration}</p>
          <p className="text-sm text-gray-300">
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
