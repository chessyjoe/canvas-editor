'use client';
import React, { useRef } from 'react';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CanvasToolbar() {
  const addText = useEditorStore((s) => s.addText);
  const addRect = useEditorStore((s) => s.addRect);
  const addImage = useEditorStore((s) => s.addImage);
  const fileRef = useRef<HTMLInputElement | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tools</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button onClick={addText} variant="outline">Add Text</Button>
        <Button onClick={addRect} variant="outline">Add Rectangle</Button>
        <Button onClick={() => fileRef.current?.click()} variant="outline">Upload Image</Button>
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
      </CardContent>
    </Card>
  );
}
