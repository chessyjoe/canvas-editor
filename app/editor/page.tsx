'use client';
import React, { useState, useEffect } from 'react';
import CanvasToolbar from './components/CanvasToolbar';
import CanvasArea from './components/CanvasArea';
import PropertiesPanel from './components/PropertiesPanel';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import LayersPanel from './components/LayersPanel';
import ExportPanel from './components/ExportPanel';

export default function EditorPage() {
  const { layers, width, height, background } = useEditorStore();
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

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
      <header className="h-14 border-b border-gray-300 bg-white flex items-center justify-between px-4 text-gray-800">
        <div className="font-semibold text-lg flex items-center gap-2">
          🎨 <span>Canvas Editor</span>
        </div>

        <div className="flex gap-2">
          <button onClick={saveState} className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">Save</button>
          <button onClick={() => setShowExportPanel(!showExportPanel)} className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">Export</button>
        </div>
      </header>

      {/* 🧱 Main Layout */}
      <div className="flex flex-1">
        {/* Left Toolbar */}
        <aside className="w-60 border-r border-gray-300 bg-white flex flex-col">
          <CanvasToolbar />
          <LayersPanel />
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 flex justify-center items-center bg-gray-100">
          <CanvasArea />
        </main>

        {/* Right Properties Panel */}
        <aside className="w-64 border-l border-gray-300 bg-white flex flex-col">
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
