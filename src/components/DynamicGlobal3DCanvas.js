'use client';

import dynamic from 'next/dynamic';

const Global3DCanvas = dynamic(() => import('./Global3DCanvas'), { ssr: false });

const DynamicGlobal3DCanvas = () => {
  return <Global3DCanvas />;
};

export default DynamicGlobal3DCanvas;
