'use client';
import React from 'react';
import CanvasToolbar from './components/CanvasToolbar';
import CanvasArea from './components/CanvasArea';
import PropertiesPanel from './components/PropertiesPanel';

export default function EditorPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* 🔝 Top Header */}
      <header className="h-14 border-b border-gray-300 bg-white flex items-center justify-between px-4 text-gray-800">
        <div className="font-semibold text-lg flex items-center gap-2">
          🎨 <span>Canvas Editor</span>
        </div>

        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">Undo</button>
          <button className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">Redo</button>
          <button className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">Save</button>
          <button className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">Export</button>
        </div>
      </header>

      {/* 🧱 Main Layout */}
      <div className="flex flex-1">
        {/* Left Toolbar */}
        <aside className="w-60 border-r border-gray-300 bg-white flex flex-col">
          <CanvasToolbar />
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 flex justify-center items-center bg-gray-100">
          <CanvasArea />
        </main>

        {/* Right Properties Panel */}
        <aside className="w-64 border-l border-gray-300 bg-white flex flex-col">
          <PropertiesPanel />
        </aside>
      </div>
    </div>
  );
}
