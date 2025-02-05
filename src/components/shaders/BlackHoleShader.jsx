/* eslint-disable no-unused-vars */
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

// Import shaders
import fragmentShader from '../../shaders/blackHoleFragment.glsl';
import vertexShader from '../../shaders/blackHoleVertex.glsl';

function BlackHoleShader() {
  const meshRef = useRef();
  const { size, clock } = useThree();
  const nebulaTexture = useTexture('/textures/nebula.jpg');

  const uniforms = useMemo(() => ({
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector2(size.width, size.height) },
    iChannel0: { value: nebulaTexture },
  }), [size, nebulaTexture]);

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
