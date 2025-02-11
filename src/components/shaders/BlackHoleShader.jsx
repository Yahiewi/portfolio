/* eslint-disable no-unused-vars */
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

// Import GLSL Shaders
import fragmentShader from '../../shaders/blackHoleFragment.glsl';
import vertexShader from '../../shaders/blackHoleVertex.glsl';

function BlackHoleShader() {
  const meshRef = useRef();
  const { size, clock, mouse } = useThree();

  // Load the nebula texture for iChannel0
  const nebulaTexture = useTexture('/textures/nebula.jpg');

  // Define uniforms (memoized to prevent re-creation)
  const uniforms = useMemo(() => ({
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector2(size.width, size.height) },
    iMouse: { value: new THREE.Vector2(0, 0) },
    iChannel0: { value: nebulaTexture },
  }), [size, nebulaTexture]);

  // Update only necessary uniforms each frame
  useFrame(() => {
    uniforms.iTime.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <planeGeometry args={[size.width, size.height]} />
      <shaderMaterial fragmentShader={fragmentShader} vertexShader={vertexShader} uniforms={uniforms} />
    </mesh>
  );
}

export default BlackHoleShader;
