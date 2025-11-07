'use client';
import React, { useRef } from 'react';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { Button } from '@/app/editor/components/ui/button';
import { FaMousePointer, FaHandPaper, FaDrawPolygon } from 'react-icons/fa';

export default function CanvasToolbar() {
  const {
    undo,
    redo,
    history,
    historyIndex,
    addText,
    addRect,
    addImage,
    scale,
    setZoom,
    setStagePos,
    width,
    height,
    canvasContainer,
    tool,
    setTool,
    groupSelection,
    ungroupSelection,
    selectedIds,
    selectAll,
    layers,
  } = useEditorStore();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const zoom = (factor: number) => {
    const newZoom = scale * factor;
    setZoom(newZoom);
  };

  const resetZoom = () => {
    setZoom(1);
    setStagePos({ x: 0, y: 0 });
  };

  const fitToScreen = () => {
    const padding = 50;
    const { width: containerWidth, height: containerHeight } = canvasContainer;

    if (containerWidth === 0 || containerHeight === 0) return;

    const availableWidth = containerWidth - padding * 2;
    const availableHeight = containerHeight - padding * 2;

    const scaleX = availableWidth / width;
    const scaleY = availableHeight / height;
    const newScale = Math.min(scaleX, scaleY);

    setZoom(newScale);

    // Center the stage
    const newX = (containerWidth - width * newScale) / 2;
    const newY = (containerHeight - height * newScale) / 2;

    setStagePos({ x: newX, y: newY });
  };

  const addTestShapes = () => {
    addRect();
    addText();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        <Button
          onClick={() => setTool('select')}
          variant={tool === 'select' ? 'secondary' : 'ghost'}
          title="Box Selection"
        >
          <FaMousePointer />
        </Button>
        <Button
          onClick={() => setTool('pan')}
          variant={tool === 'pan' ? 'secondary' : 'ghost'}
          title="Pan"
        >
          <FaHandPaper />
        </Button>
        <Button
          onClick={() => setTool('lasso')}
          variant={tool === 'lasso' ? 'secondary' : 'ghost'}
          title="Lasso Selection"
        >
          <FaDrawPolygon />
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
        <Button onClick={undo} disabled={historyIndex < 0}>
          Undo
        </Button>
        <Button onClick={redo} disabled={historyIndex >= history.length - 1}>
          Redo
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
        <Button onClick={groupSelection} disabled={selectedIds.length < 2}>
          Group
        </Button>
        <Button onClick={ungroupSelection} disabled={selectedIds.length === 0}>
          Ungroup
        </Button>
      </div>
      <Button onClick={addText}>Add Text</Button>
      <Button onClick={addRect}>Add Rectangle</Button>
      <Button onClick={() => fileRef.current?.click()}>Upload Image</Button>
      <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
        <Button onClick={addTestShapes}>Add Test Shapes</Button>
        <Button onClick={selectAll} disabled={layers.length === 0}>
          Select All
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
        <Button onClick={() => zoom(1.2)}>Zoom In</Button>
        <Button onClick={() => zoom(0.8)}>Zoom Out</Button>
        <Button onClick={resetZoom}>Reset</Button>
        <Button onClick={fitToScreen}>Fit</Button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const url = URL.createObjectURL(f);
          addImage(url);
          e.target.value = '';
        }}
      />
    </div>
  );
}
