import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

// Example skill data
const skillData = [
  {
    name: 'Programming Languages',
    icon: '⌨️',
    skills: [
      { name: 'C++', x: -1, y: 1 },
      { name: 'Java', x: 0, y: 2 },
      { name: 'Python', x: 1, y: 1 },
      { name: 'Scala', x: -1.5, y: 0 },
      { name: 'Rust', x: 1.5, y: 0 },
      { name: 'Haskell', x: -1, y: -1 },
      { name: 'R', x: 0, y: -2 },
      { name: 'SQL', x: 1, y: -1 },
    ],
  },
  {
    name: 'Game Development',
    icon: '⚔️',
    skills: [
      { name: 'Unity', x: -1, y: 0.5 },
      { name: 'Unreal Engine 5', x: 0, y: 1.5 },
      { name: 'Blender', x: 1, y: 0.5 },
    ],
  },
  {
    name: 'Web Development',
    icon: '🌐',
    skills: [
      { name: 'React', x: 0, y: 2 },
      { name: 'JavaScript', x: -1, y: 1 },
      { name: 'Tailwind', x: 1, y: 1 },
      { name: 'Node.js', x: -1, y: 0 },
      { name: 'Express.js', x: 1, y: 0 },
    ],
  },
  {
    name: 'Machine Learning',
    icon: '🤖',
    skills: [
      { name: 'TensorFlow', x: -1, y: 0.5 },
      { name: 'PyTorch', x: 0, y: 1.5 },
      { name: 'Scikit-Learn', x: 1, y: 0.5 },
    ],
  },
  {
    name: 'Computer Vision',
    icon: '👁️',
    skills: [
      { name: 'Optical Flow', x: -0.5, y: 0.5 },
      { name: 'OpenCV', x: 0.5, y: 0.5 },
    ],
  },
];

// Draw connecting lines between skill points
function ConstellationLines({ points, hovered }) {
  const linePoints = points.map(([x, y]) => new THREE.Vector3(x, y, 0));
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);

  return (
    <line>
      <primitive object={lineGeometry} attach="geometry" />
      <lineBasicMaterial
        attach="material"
        color={hovered ? '#ffdd00' : '#ffffff'}
        linewidth={2}
        transparent
        opacity={hovered ? 1 : 0.5}
      />
    </line>
  );
}

// Render a single constellation
function Constellation({ category, position, hoveredCategory, setHoveredCategory, setHoveredSkill }) {
  const isHovered = hoveredCategory === category.name;

  // Map skill positions and build line segments
  const skillPoints = category.skills.map(({ x, y }) => [x, y]);
  const lines = [];
  for (let i = 0; i < skillPoints.length - 1; i++) {
    lines.push([skillPoints[i], skillPoints[i + 1]]);
  }

  return (
    <group
      position={position}
      scale={isHovered ? 1.3 : 1}
      onPointerOver={() => setHoveredCategory(category.name)}
      onPointerOut={() => setHoveredCategory(null)}
    >
      {/* Center icon */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={1.1}
        color={isHovered ? '#ffcc00' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
      >
        {category.icon}
      </Text>

      {/* Lines */}
      {lines.map((pair, idx) => (
        <ConstellationLines key={idx} points={pair} hovered={isHovered} />
      ))}

      {/* Stars */}
      {category.skills.map((skill) => (
        <group key={skill.name} position={[skill.x, skill.y, 0]}>
          {/* Star */}
          <mesh
            onPointerOver={() => setHoveredSkill(skill.name)}
            onPointerOut={() => setHoveredSkill(null)}
          >
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive={isHovered ? '#ffee33' : '#ffffff'}
              emissiveIntensity={isHovered ? 1.0 : 0.3}
            />
          </mesh>

          {/* Skill name (visible only when hovered) */}
          {isHovered && (
            <Text
              position={[0, 0.6, 0]}
              fontSize={0.35}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {skill.name}
            </Text>
          )}
        </group>
      ))}
    </group>
  );
}

export default function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const radius = 20; // Distance from center for each constellation

  return (
    <div className="relative w-full h-full" style={{ height: '100vh' }}>
      {/* Title and hovered skill display */}
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10 text-white text-center">
        <h1 className="text-3xl font-bold mb-2">Skills</h1>
        <p className="bg-black/50 px-4 py-2 rounded-md">
          {hoveredSkill ?? 'Hover a star'}
        </p>
      </div>

      <Canvas camera={{ position: [0, 0, 50], fov: 45 }}>
        {/* Subtle camera control to "fake" perspective */}
        <OrbitControls
          enablePan={false} // Disable panning
          enableZoom={false} // Disable zooming
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.2} // Prevent excessive up/down tilt
          minPolarAngle={Math.PI / 2.4}
          maxAzimuthAngle={0.05} // Limit horizontal rotation
          minAzimuthAngle={-0.05}
          dampingFactor={0.2}
          rotateSpeed={0.3}
        />

        {/* Background stars */}
        <Stars
          radius={200}
          depth={60}
          count={3000}
          factor={7}
          saturation={0}
          fade
        />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight intensity={0.6} position={[20, 20, 20]} />

        {/* Constellations */}
        {skillData.map((category, index) => {
          const angle = (index / skillData.length) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <Constellation
              key={category.name}
              category={category}
              position={[x, y, 0]}
              hoveredCategory={hoveredCategory}
              setHoveredCategory={setHoveredCategory}
              setHoveredSkill={setHoveredSkill}
            />
          );
        })}
      </Canvas>
    </div>
  );
}
