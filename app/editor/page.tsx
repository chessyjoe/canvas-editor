'use client';
import React, { useState, useEffect } from 'react';
import CanvasArea from './components/CanvasArea';
import PropertiesPanel from './components/PropertiesPanel';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import ExportPanel from './components/ExportPanel';
import ResponsiveToolbar from './components/ResponsiveToolbar';

export default function EditorPage() {
  const { layers, width, height, background } = useEditorStore();
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  const saveState = () => {
    const state = { layers, width, height, background };
    localStorage.setItem('canvas-state', JSON.stringify(state));
    setShowNotification(true);
  };

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* 🔝 Top Header */}
      <header className="h-14 border-b border-gray-300 bg-white flex items-center justify-between px-4 text-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)} className="p-1.5 rounded hover:bg-gray-200 md:hidden">
            ☰
          </button>
          <div className="font-semibold text-lg flex items-center gap-2">
            🎨 <span>Canvas Editor</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={saveState} className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">Save</button>
          <button onClick={() => setShowExportPanel(!showExportPanel)} className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">Export</button>
          <button onClick={() => setIsRightPanelOpen(!isRightPanelOpen)} className="p-1.5 rounded hover:bg-gray-200 md:hidden">
            ⚙️
          </button>
        </div>
      </header>

      {/* 🧱 Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Toolbar */}
        <div className={`absolute top-0 left-0 h-full z-10 md:relative md:flex ${isLeftPanelOpen ? 'block' : 'hidden'}`}>
          <ResponsiveToolbar isOpen={isLeftPanelOpen} />
        </div>

        {/* Canvas Area */}
        <main className="flex-1 flex justify-center items-center bg-gray-100 overflow-auto">
          <CanvasArea />
        </main>

        {/* Right Properties Panel */}
        <aside className={`absolute top-0 right-0 h-full z-10 border-l border-gray-300 bg-white flex-col ${isRightPanelOpen ? 'flex' : 'hidden'} md:relative md:flex w-64 shrink-0`}>
          {showExportPanel ? <ExportPanel /> : <PropertiesPanel />}
        </aside>
      </div>

      {showNotification && (
        <div className="absolute bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded">
          State saved!
        </div>
      )}
    </div>
  );
}
