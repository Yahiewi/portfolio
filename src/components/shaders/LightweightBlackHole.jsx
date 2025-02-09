/* eslint-disable react/no-unknown-property */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function LightweightBlackHole() {
  const blackHoleRef = useRef();

  // Simple pulsating effect
  useFrame(({ clock }) => {
    const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
    blackHoleRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={blackHoleRef} position={[0, 0, -5]}>
      <sphereGeometry args={[2, 32, 32]} /> 
      <meshBasicMaterial color="black" />
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color="purple" transparent opacity={0.3} />
      </mesh>
    </mesh>
  );
}
