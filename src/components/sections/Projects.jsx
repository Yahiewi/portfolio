// components/sections/Projects.jsx

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import projectData from '../../data/projectData';
import * as THREE from 'three';

function Planet({ project, baseAngle, onPlanetClick }) {
  const planetRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Animate orbit
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = baseAngle + t * (project.orbitSpeed * 2 * Math.PI);
    const x = Math.cos(angle) * project.orbitRadius;
    const z = Math.sin(angle) * project.orbitRadius;
    if (planetRef.current) {
      planetRef.current.position.set(x, 0, z);
    }
  });

  return (
    <group>
      {/* Orbit Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry
          args={[project.orbitRadius - 0.02, project.orbitRadius + 0.02, 64]}
        />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Planet Sphere */}
      <mesh
        ref={planetRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onPlanetClick(project)} // click callback
      >
        <sphereGeometry args={[project.size, 32, 32]} />
        <meshStandardMaterial
          color={project.color}
          emissive={hovered ? project.color : '#000000'}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
      </mesh>
    </group>
  );
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  // Clears the selected project
  const closeOverlay = () => setSelectedProject(null);

  return (
    <div className="relative w-full h-screen">

      {/* --- Canvas with 3D Solar System --- */}
      <Canvas camera={{ position: [0, 15, 40], fov: 45 }}>
        <OrbitControls enableZoom={true} enablePan={false} maxPolarAngle={Math.PI / 2} />
        <Stars radius={200} depth={50} count={3000} factor={7} fade />

        {/* Light sources */}
        <ambientLight intensity={0.3} />
        <directionalLight intensity={1} position={[10, 10, 5]} />

        {/* "Sun" in the center */}
        <mesh>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial emissive="#ffffff" emissiveIntensity={1} />
        </mesh>

        {/* Planets */}
        {projectData.map((project, index) => {
          const baseAngle = (index / projectData.length) * Math.PI * 2;
          return (
            <Planet
              key={project.name}
              project={project}
              baseAngle={baseAngle}
              onPlanetClick={(p) => setSelectedProject(p)}
            />
          );
        })}
      </Canvas>

      {/* --- 2D Overlay for Selected Project Info --- */}
      {selectedProject && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-white text-black p-6 rounded shadow-lg max-w-md relative">
            <button
              onClick={closeOverlay}
              className="absolute top-2 right-2 text-sm bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-2">{selectedProject.name}</h2>
            <p className="mb-4">{selectedProject.description}</p>
            {/* If you have links, images, etc. you can display them here */}
          </div>
        </div>
      )}
    </div>
  );
}
