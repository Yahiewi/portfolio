import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

// Example skill data
const skillData = [
  {
    name: 'Programming Languages',
    icon: '⌨️', // For demonstration - you could replace with a custom SVG or image
    // Each skill has a name and (x, y) offset in the constellation
    skills: [
      { name: 'C++', x: -1, y: 1 },
      { name: 'Java', x: 0, y: 2 },
      { name: 'Python', x: 1, y: 1 },
      { name: 'Scala', x: -1.5, y: 0 },
      { name: 'Rust', x: 1.5, y: 0 },
      { name: 'Haskell', x: -1, y: -1 },
      { name: 'R', x: 0, y: -2 },
      { name: 'SQL', x: 1, y: -1 }
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

// Utility to build a THREE.Line from skill positions
function ConstellationLines({ points }) {
  const linePoints = points.map((p) => new THREE.Vector3(p[0], p[1], 0));
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);

  return (
    <line>
      <primitive object={lineGeometry} attach="geometry" />
      <lineBasicMaterial attach="material" color="#ffffff" linewidth={2} />
    </line>
  );
}

function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  // Where we position each constellation in the scene
  // We'll arrange them in a circle around the origin
  const radius = 20;

  return (
    <div className="relative w-full h-full" style={{ height: '100vh' }}>
      {/* Title & Hovered Skill Display */}
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10 text-white text-center">
        <h1 className="text-3xl font-bold mb-2">Skills</h1>
        {hoveredSkill ? (
          <p className="bg-black/50 px-4 py-2 rounded-md">{hoveredSkill}</p>
        ) : (
          <p className="bg-black/50 px-4 py-2 rounded-md">Hover a star</p>
        )}
      </div>

      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 0, 50], fov: 45 }}>
        {/* Camera Controls */}
        <OrbitControls minDistance={10} maxDistance={100} />

        {/* Starry Background */}
        <Stars
          radius={200} // inner radius of the star field
          depth={60}   // render distance
          count={2000} // star count
          factor={7}   // star size factor
          saturation={0}
          fade
        />

        {/* Some lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.7} />

        {/* Each skill category becomes a constellation */}
        {skillData.map((category, index) => {
          // Determine angle around the circle for this constellation
          const angle = (index / skillData.length) * Math.PI * 2;

          // Convert polar coords to cartesian
          const cx = Math.cos(angle) * radius;
          const cy = Math.sin(angle) * radius;

          // Build lines between stars in this constellation
          // (We just connect them in the array's order for simplicity)
          // If you want more intricate connections, define them manually.
          const skillPoints = category.skills.map((s) => [
            cx + s.x,
            cy + s.y,
          ]);

          // We'll connect the skill points in a loop or chain
          // For a chain, we simply create consecutive pairs
          const lines = [];
          for (let i = 0; i < skillPoints.length - 1; i++) {
            lines.push([skillPoints[i], skillPoints[i + 1]]);
          }

          return (
            <group key={category.name}>
              {/* Category Title / Icon in the center of constellation */}
              <Text
                position={[cx, cy + 3, 0]}
                fontSize={1.2}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
              >
                {category.icon}
              </Text>

              {/* Lines connecting the stars in this constellation */}
              {lines.map((pair, idx) => (
                <ConstellationLines
                  key={idx}
                  points={pair}
                />
              ))}

              {/* Skill stars */}
              {category.skills.map((skill) => {
                const starX = cx + skill.x;
                const starY = cy + skill.y;

                return (
                  <mesh
                    key={skill.name}
                    position={[starX, starY, 0]}
                    onPointerOver={() => setHoveredSkill(skill.name)}
                    onPointerOut={() => setHoveredSkill(null)}
                  >
                    {/* Sphere for the star */}
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshStandardMaterial
                      color="#fffdc9"
                      emissive="#fffdc9"
                      emissiveIntensity={0.3}
                    />
                  </mesh>
                );
              })}
            </group>
          );
        })}
      </Canvas>
    </div>
  );
}

export default Skills;
