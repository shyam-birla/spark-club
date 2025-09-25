'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Torus } from '@react-three/drei';

function RotatingShape() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1; // Rotation thoda slow kiya
      meshRef.current.rotation.y += delta * 0.1; // Rotation thoda slow kiya
    }
  });

  return (
    // Step 1: Shape ka size badhane ke liye 'scale' add kiya
    <mesh ref={meshRef} scale={1.5}>
      <Torus args={[1, 0.2, 16, 100]}>
        {/* Step 2: Wapas wireframe style aur opacity kam ki */}
        <meshStandardMaterial 
          color="#808080" 
          wireframe 
          transparent 
          opacity={0.3} 
        />
      </Torus>
    </mesh>
  );
}

const Hero3D = () => {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
      {/* Lighting ko thoda kam kiya taaki wireframe saaf dikhe */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <RotatingShape />
    </Canvas>
  );
};

export default Hero3D;