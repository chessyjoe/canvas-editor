'use client';
import React from 'react';
import { useEditorStore, TextLayer } from '@/canvas/store/useEditorStore';
import { Button } from '@/app/editor/components/ui/button';
import { Input } from '@/app/editor/components/ui/input';
import { Label } from '@/app/editor/components/ui/label';
import PanelCard from './ui/PanelCard';
import TextProperties from './TextProperties';

export default function PropertiesPanel() {
  const {
    selectedIds,
    layers,
    updateLayer,
    deleteSelected,
    bringForward,
    sendBackward,
  } = useEditorStore();
  const selectedId = selectedIds.length === 1 ? selectedIds[0] : null;
  const layer = layers.find((l) => l.id === selectedId);

  if (!layer)
    return (
      <PanelCard title="Properties">
        <div className="p-4 text-gray-500">
          <p>No selection</p>
        </div>
      </PanelCard>
    );

  return (
    <PanelCard title="Properties">
      <div className="flex flex-col gap-4">
        {layer.type === 'text' && (
          <TextProperties layer={layer as TextLayer} />
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

        {layer.type === 'rect' && (
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
    </PanelCard>
  );
}
