'use client';
import React, { useRef } from 'react';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { Button } from '@/app/editor/components/ui/button';

export default function CanvasToolbar() {
  const addText = useEditorStore((s) => s.addText);
  const addRect = useEditorStore((s) => s.addRect);
  const addImage = useEditorStore((s) => s.addImage);
  const fileRef = useRef<HTMLInputElement | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12 }}>
      <Button onClick={addText}>Add Text</Button>
      <Button onClick={addRect}>Add Rectangle</Button>
      <Button onClick={() => fileRef.current?.click()}>Upload Image</Button>
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
