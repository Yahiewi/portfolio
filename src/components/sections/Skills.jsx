/* eslint-disable react/no-unknown-property */
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import skillData from '../../data/skillData'; // Import skill data
import PropTypes from 'prop-types';
import * as THREE from 'three';

// Constants
const CONSTELLATION_RADIUS = 15; // Distance of constellations from the center

// Draw connecting lines between skill points
function ConstellationLines({ points, hovered }) {
  const linePoints = points.map(([x, y]) => new THREE.Vector3(x, y, 0));
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);

  return (
    <line renderOrder={1}>
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

ConstellationLines.propTypes = {
  points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  hovered: PropTypes.bool.isRequired,
};

// Render a single constellation
function Constellation({
  category,
  position,
  hoveredCategory,
  setHoveredCategory,
  setHoveredSkill,
}) {
  // True if this constellation is the one currently hovered
  const isHovered = hoveredCategory === category.name;

  // Build line segments between skill points
  const skillPoints = category.skills.map(({ x, y }) => [x, y]);
  const lines = [];
  for (let i = 0; i < skillPoints.length - 1; i++) {
    lines.push([skillPoints[i], skillPoints[i + 1]]);
  }

  return (
    <group position={position} scale={isHovered ? 1.3 : 1}>
      {/* 
        Invisible bounding sphere for hover detection. Render first and ensure
        it does not block rendering of other elements.
      */}
      <mesh
        renderOrder={-1}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredCategory(category.name);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          if (hoveredCategory === category.name) {
            setHoveredCategory(null);
          }
        }}
      >
        <sphereGeometry args={[4.5 + category.skills.length * 0.15, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Category Icon / Title */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={1.1}
        color={isHovered ? '#ffcc00' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        renderOrder={2}
      >
        {category.icon}
      </Text>

      {/* Lines (constellation connections) */}
      {lines.map((pair, idx) => (
        <ConstellationLines key={idx} points={pair} hovered={isHovered} />
      ))}

      {/* Stars (skills) */}
      {category.skills.map((skill) => (
        <group key={skill.name} position={[skill.x, skill.y, 0]}>
          {/* Star sphere */}
          <mesh
            renderOrder={3}
            onPointerOver={(e) => {
              e.stopPropagation(); // So we don’t exit the bounding sphere
              setHoveredSkill(skill.name);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHoveredSkill(null);
            }}
          >
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive={isHovered ? '#ffee33' : '#ffffff'}
              emissiveIntensity={isHovered ? 1.0 : 0.3}
            />
          </mesh>

          {/* Display skill name if constellation is hovered */}
          {isHovered && (
            <Text
              position={[0, 0.6, 0]}
              fontSize={0.35}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              renderOrder={4}
            >
              {skill.name}
            </Text>
          )}
        </group>
      ))}
    </group>
  );
}

Constellation.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  hoveredCategory: PropTypes.string,
  setHoveredCategory: PropTypes.func.isRequired,
  setHoveredSkill: PropTypes.func.isRequired,
};

export default function Skills() {
  // eslint-disable-next-line no-unused-vars
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <div className="relative w-full h-full" style={{ height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 50], fov: 45 }}>
        {/* Minimal camera movement; perspective unchanged */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 2.4}
          maxAzimuthAngle={0.05}
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

        {/* Basic Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight intensity={0.6} position={[20, 20, 20]} />

        {/* Constellations */}
        {skillData.map((category, index) => {
          // Position each constellation in a circle
          const angle = (index / skillData.length) * Math.PI * 2;
          const x = Math.cos(angle) * CONSTELLATION_RADIUS;
          const y = Math.sin(angle) * CONSTELLATION_RADIUS;

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
