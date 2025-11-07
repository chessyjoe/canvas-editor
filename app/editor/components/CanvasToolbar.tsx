'use client';
import React, { useRef } from 'react';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { Button } from '@/app/editor/components/ui/button';

export default function CanvasToolbar() {
  const addText = useEditorStore((s) => s.addText);
  const addRect = useEditorStore((s) => s.addRect);
  const addImage = useEditorStore((s) => s.addImage);
  const { scale, setZoom, setStagePos, width, height, canvasContainer } = useEditorStore();
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12 }}>
      <Button onClick={addText}>Add Text</Button>
      <Button onClick={addRect}>Add Rectangle</Button>
      <Button onClick={() => fileRef.current?.click()}>Upload Image</Button>
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
