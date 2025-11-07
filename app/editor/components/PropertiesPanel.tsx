'use client';
import React from 'react';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { Button } from '@/app/editor/components/ui/button';
import { Input } from '@/app/editor/components/ui/input';
import { Label } from '@/app/editor/components/ui/label';
import PanelCard from './ui/PanelCard';

export default function PropertiesPanel() {
  const {
    selectedIds,
    layers,
    updateLayer,
    deleteSelected,
    bringForward,
    sendBackward,
    startCropping,
    stopCropping,
    croppingLayerId,
  } = useEditorStore();

  const selectedId = selectedIds.length === 1 ? selectedIds[0] : null;
  const layer = layers.find((l) => l.id === selectedId);
  const isCropping = croppingLayerId === layer?.id;

  if (!layer || !selectedId) {
    return (
      <PanelCard title="Properties">
        <div className="p-4 text-gray-500">
          <p>{selectedIds.length > 1 ? 'Multiple items selected' : 'No selection'}</p>
        </div>
      </PanelCard>
    );
  }

  return (
    <PanelCard title="Properties">
      <div className="flex flex-col gap-4">
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
                disabled={isCropping}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                value={layer.height}
                onChange={(e) => updateLayer(layer.id, { height: parseInt(e.target.value) || 10 })}
                disabled={isCropping}
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

        {layer.type === 'image' && !isCropping && (
          <Button onClick={() => startCropping(layer.id)}>Crop Image</Button>
        )}

        {isCropping && (
          <div className="flex gap-2">
            <Button onClick={() => stopCropping(true)}>Apply Crop</Button>
            <Button variant="secondary" onClick={() => stopCropping(false)}>
              Cancel
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={sendBackward} disabled={isCropping}>
            ⬇ Send Backward
          </Button>
          <Button onClick={bringForward} disabled={isCropping}>
            ⬆ Bring Forward
          </Button>
        </div>

        <Button
          variant="destructive"
          onClick={deleteSelected}
          disabled={isCropping}
        >
          Delete
        </Button>
      </div>
    </PanelCard>
  );
}
