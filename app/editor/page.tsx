'use client';
import React, { useState, useEffect, useRef } from 'react';
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

const addNode = (
  currentNode: MosaicNode<ViewId> | null,
  target: ViewId,
  newNode: ViewId,
  direction: 'row' | 'column' = 'row',
  splitPercentage = 50
): MosaicNode<ViewId> | null => {
  if (!currentNode) return { direction, first: target, second: newNode, splitPercentage };
  const newLayout = deepClone(currentNode);

  function recurse(node: MosaicNode<ViewId> | ViewId): MosaicNode<ViewId> | ViewId {
    if (typeof node === 'string') {
      if (node === target) {
        return { direction, first: target, second: newNode, splitPercentage };
      }
      return node;
    }
    node.first = recurse(node.first);
    node.second = recurse(node.second);
    return node;
  }

  return recurse(newLayout as MosaicNode<ViewId>);
};

const removeNode = (
  currentNode: MosaicNode<ViewId> | null,
  target: ViewId
): MosaicNode<ViewId> | null => {
    if (!currentNode) return null;
    const newLayout = deepClone(currentNode);

    function recurse(node: MosaicNode<ViewId> | ViewId): MosaicNode<ViewId> | ViewId | null {
        if (typeof node === 'string') {
            return node === target ? null : node;
        }

        if (node.first === target) return node.second;
        if (node.second === target) return node.first;

        const first = recurse(node.first);
        const second = recurse(node.second);

        if (first && second) {
            node.first = first;
            node.second = second;
            return node;
        } else if (first) {
            return first;
        } else if (second) {
            return second;
        } else {
            return null;
        }
    }

    return recurse(newLayout as MosaicNode<ViewId>) as MosaicNode<ViewId> | null;
};


export default function EditorPage() {
  const { layers, width, height, background, setCanvasContainer } = useEditorStore();
  const [showNotification, setShowNotification] = useState(false);
  const [currentNode, setCurrentNode] = useState<MosaicNode<ViewId> | null>(DEFAULT_LAYOUT);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const layoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (layoutRef.current) {
        const { width, height } = layoutRef.current.getBoundingClientRect();
        setCanvasContainer({ width, height });
      }
    });

    if (layoutRef.current) {
      resizeObserver.observe(layoutRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [setCanvasContainer]);

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

  const toggleHistoryPanel = () => {
    if (showHistoryPanel) {
        setCurrentNode(removeNode(currentNode, 'history'));
    } else {
        setCurrentNode(addNode(currentNode, 'properties', 'history', 'column'));
    }
    setShowHistoryPanel(!showHistoryPanel);
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
          <button onClick={toggleHistoryPanel} className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">
            {showHistoryPanel ? 'Hide History' : 'Show History'}
            </button>
          <button onClick={resetLayout} className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">Reset Layout</button>
        </div>
      </header>

      {/* 🧱 Main Layout */}
      <div className="flex-1" ref={layoutRef}>
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
