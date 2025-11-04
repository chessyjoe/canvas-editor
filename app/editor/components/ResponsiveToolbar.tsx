'use client';
import React from 'react';
import CanvasToolbar from './CanvasToolbar';
import LayersPanel from './LayersPanel';

interface ResponsiveToolbarProps {
    isOpen: boolean;
}

const ResponsiveToolbar = ({ isOpen }: ResponsiveToolbarProps) => {
  return (
    <aside className={`border-r border-gray-300 bg-white flex-col w-60 shrink-0`}>
      <CanvasToolbar />
      <LayersPanel />
    </aside>
  );
};

export default ResponsiveToolbar;
