'use client';
import Hero3D from './Hero3D'; // Humara purana 3D component use karega

const Global3DCanvas = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-screen -z-10">
      <Hero3D />
    </div>
  );
};

export default Global3DCanvas;