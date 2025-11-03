'use client';
import React, { useRef } from 'react';
import { useEditorStore } from '@/canvas/store/useEditorStore';

export default function CanvasToolbar() {
  const addText = useEditorStore((s) => s.addText);
  const addRect = useEditorStore((s) => s.addRect);
  const addImage = useEditorStore((s) => s.addImage);
  const fileRef = useRef<HTMLInputElement | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12 }}>
      <button onClick={addText}>Add Text</button>
      <button onClick={addRect}>Add Rectangle</button>
      <button onClick={() => fileRef.current?.click()}>Upload Image</button>
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
