/* eslint-disable react/no-unknown-property */
import  { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';

// Simple pillar component
function Pillar({ title, details, position }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      {/* The "pillar" shape */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Cylinder geometry to stand in as a pillar */}
        <cylinderGeometry args={[1, 1, 6, 32]} />
        <meshStandardMaterial color={hovered ? '#fbb034' : '#888888'} />
      </mesh>

      {/* Hover text */}
      {hovered && (
        <Text
          position={[0, 3.5, 0]}
          fontSize={0.25}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.002}
          outlineColor="#000000"
        >
          {title}
          {'\n'}
          {details}
        </Text>
      )}
    </group>
  );
}

export default function Education() {
  // You can expand or refine these details as needed
  const educationStages = [
    {
      title: 'Preparatory Classes (2020 - 2022)\nIPEST, Tunis',
      details: `Results:\n• Passed CCMP\n• Centrale-Supélec\n• CCINP\n• National entrance exams`
    },
    {
      title: 'Engineering Degree (2022 - 2025)\nIMT Atlantique',
      details: `1st year:\n• Probability, Stats, Signal Processing, ...\n\n2nd & 3rd year (Software Dev):\n• OOP, Functional, Design Patterns, Crypto, ...`
    },
    {
      // Example third pillar for demonstration; 
      // you can remove or repurpose it if you only need two pillars
      title: 'Future Specializations\n(Placeholder)',
      details: `Example:\n• Machine Learning\n• Cloud Computing\n• Entrepreneurship ...`
    }
  ];

  return (
    <div className="w-full h-full" style={{ height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        {/* Basic controls & starry background */}
        <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2} />
        <Stars radius={100} depth={50} count={2500} factor={4} fade />

        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight intensity={0.7} position={[10, 10, 10]} />

        {/* Layout the pillars. Adjust positions as you like */}
        <Pillar
          title={educationStages[0].title}
          details={educationStages[0].details}
          position={[-4, 0, 0]}
        />
        <Pillar
          title={educationStages[1].title}
          details={educationStages[1].details}
          position={[0, 0, 0]}
        />
        <Pillar
          title={educationStages[2].title}
          details={educationStages[2].details}
          position={[4, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
