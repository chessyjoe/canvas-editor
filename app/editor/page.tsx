'use client';
import React, { useState, useEffect } from 'react';
import { MosaicNode } from 'react-mosaic-component';
import EditorLayout, { ViewId } from './components/EditorLayout';
import { useEditorStore } from '@/canvas/store/useEditorStore';

const DEFAULT_LAYOUT: MosaicNode<ViewId> = {
  direction: 'row',
  first: {
    direction: 'column',
    first: 'toolbar',
    second: 'layers',
    splitPercentage: 40,
  },
  second: {
    direction: 'row',
    first: 'canvas',
    second: {
      direction: 'column',
      first: 'properties',
      second: {
        direction: 'column',
        first: 'ai',
        second: 'templates',
        splitPercentage: 50,
      },
      splitPercentage: 50,
    },
    splitPercentage: 75,
  },
  splitPercentage: 20,
};

const deepClone = (obj: MosaicNode<ViewId> | null): MosaicNode<ViewId> | null => {
  if (obj === null) return null;
  return JSON.parse(JSON.stringify(obj));
}

const replaceNode = (
  currentNode: MosaicNode<ViewId> | null,
  target: ViewId,
  replacement: ViewId
): MosaicNode<ViewId> | null => {
  if (!currentNode) return null;
  const newNode = deepClone(currentNode);

  function recurse(node: MosaicNode<ViewId> | ViewId): boolean {
    if (typeof node === 'string') return false;

    if (node.first === target) {
      node.first = replacement;
      return true;
    }
    if (node.second === target) {
      node.second = replacement;
      return true;
    }
    if (typeof node.first === 'object' && recurse(node.first)) {
      return true;
    }
    if (typeof node.second === 'object' && recurse(node.second)) {
      return true;
    }
    return false;
  }

  if(newNode) {
    recurse(newNode);
  }

  return newNode;
};


export default function EditorPage() {
  const { layers, width, height, background } = useEditorStore();
  const [showNotification, setShowNotification] = useState(false);
  const [currentNode, setCurrentNode] = useState<MosaicNode<ViewId> | null>(DEFAULT_LAYOUT);
  const [showExportPanel, setShowExportPanel] = useState(false);

  const saveState = () => {
    const state = { layers, width, height, background };
    localStorage.setItem('canvas-state', JSON.stringify(state));
    setShowNotification(true);
  };

  const resetLayout = () => {
    setCurrentNode(DEFAULT_LAYOUT);
  };

  const toggleExportPanel = () => {
    if (showExportPanel) {
      setCurrentNode(replaceNode(currentNode, 'export', 'properties'));
    } else {
      setCurrentNode(replaceNode(currentNode, 'properties', 'export'));
    }
    setShowExportPanel(!showExportPanel);
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
      <header className="h-14 border-b border-gray-300 bg-white flex items-center justify-between px-4 text-gray-800 flex-shrink-0">
        <div className="font-semibold text-lg flex items-center gap-2">
          🎨 <span>Canvas Editor</span>
        </div>

        <div className="flex gap-2">
          <button onClick={saveState} className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">Save</button>
          <button onClick={toggleExportPanel} className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">
            {showExportPanel ? 'Properties' : 'Export'}
          </button>
          <button onClick={resetLayout} className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">Reset Layout</button>
        </div>
      </header>

      {/* 🧱 Main Layout */}
      <div className="flex-1">
        <EditorLayout currentNode={currentNode} setCurrentNode={setCurrentNode} />
      </div>

      {showNotification && (
        <div className="absolute bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded">
          State saved!
        </div>
      )}
    </div>
  );
}
