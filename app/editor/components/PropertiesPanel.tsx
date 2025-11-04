'use client';
import React from 'react';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { Button } from '@/app/editor/components/ui/button';
import { Input } from '@/app/editor/components/ui/input';
import { Label } from '@/app/editor/components/ui/label';

export default function PropertiesPanel() {
  const {
    selectedId,
    layers,
    updateLayer,
    deleteSelected,
    bringForward,
    sendBackward,
  } = useEditorStore();
  const layer = layers.find((l) => l.id === selectedId);

  if (!layer)
    return (
      <div className="p-4 text-gray-500">
        <p>No selection</p>
      </div>
    );

  return (
    <div className="p-4 flex flex-col gap-4">
      <h3 className="mb-2">Properties</h3>

      {layer.type === 'text' && (
        <>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="text">Text</Label>
            <Input
              id="text"
              value={layer.text}
              onChange={(e) => updateLayer(layer.id, { text: e.target.value })}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="fontSize">Font Size</Label>
            <Input
              id="fontSize"
              type="number"
              value={layer.fontSize}
              onChange={(e) => updateLayer(layer.id, { fontSize: parseInt(e.target.value) || 12 })}
            />
          </div>
        </>
      )}

      {(layer.type === 'rect' || layer.type === 'image') && (
        <>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="width">Width</Label>
            <Input
              id="width"
              type="number"
              value={layer.width}
              onChange={(e) => updateLayer(layer.id, { width: parseInt(e.target.value) || 10 })}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              type="number"
              value={layer.height}
              onChange={(e) => updateLayer(layer.id, { height: parseInt(e.target.value) || 10 })}
            />
          </div>
        </>
      )}

      {(layer.type === 'text' || layer.type === 'rect') && (
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            type="color"
            value={layer.fill || '#000000'}
            onChange={(e) => updateLayer(layer.id, { fill: e.target.value })}
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={sendBackward}>⬇ Send Backward</Button>
        <Button onClick={bringForward}>⬆ Bring Forward</Button>
      </div>

      <Button
        variant="destructive"
        onClick={deleteSelected}
      >
        Delete
      </Button>
    </div>
  );
}
