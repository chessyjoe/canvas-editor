'use client';

import dynamic from 'next/dynamic';

// Import the client version only
const CanvasArea = dynamic(() => import('./CanvasArea.client'), { ssr: false });

export default CanvasArea;
