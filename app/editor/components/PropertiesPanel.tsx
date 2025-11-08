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
    gridSize,
    setGridSize,
    gridColor,
    setGridColor,
  } = useEditorStore();
  const layer = layers.find((l) => l.id === selectedIds[0]);

  if (!layer)
    return (
      <PanelCard title="Properties">
        <div className="flex flex-col gap-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="gridSize">Grid Size</Label>
            <Input
              id="gridSize"
              type="number"
              value={gridSize}
              onChange={(e) => setGridSize(parseInt(e.target.value) || 20)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="gridColor">Grid Color</Label>
            <Input
              id="gridColor"
              type="color"
              value={gridColor}
              onChange={(e) => setGridColor(e.target.value)}
            />
          </div>
        </div>
      </PanelCard>
    );

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

            <div className="flex gap-2">
              <Button
                variant={layer.fontWeight === 'bold' ? 'secondary' : 'outline'}
                onClick={() =>
                  updateLayer(layer.id, {
                    fontWeight: layer.fontWeight === 'bold' ? 'normal' : 'bold',
                  })
                }
              >
                Bold
              </Button>
              <Button
                variant={layer.fontStyle === 'italic' ? 'secondary' : 'outline'}
                onClick={() =>
                  updateLayer(layer.id, {
                    fontStyle: layer.fontStyle === 'italic' ? 'normal' : 'italic',
                  })
                }
              >
                Italic
              </Button>
              <Button
                variant={layer.textDecoration === 'underline' ? 'secondary' : 'outline'}
                onClick={() =>
                  updateLayer(layer.id, {
                    textDecoration: layer.textDecoration === 'underline' ? 'none' : 'underline',
                  })
                }
              >
                Underline
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant={layer.textAlign === 'left' ? 'secondary' : 'outline'}
                onClick={() => updateLayer(layer.id, { textAlign: 'left' })}
              >
                Left
              </Button>
              <Button
                variant={layer.textAlign === 'center' ? 'secondary' : 'outline'}
                onClick={() => updateLayer(layer.id, { textAlign: 'center' })}
              >
                Center
              </Button>
              <Button
                variant={layer.textAlign === 'right' ? 'secondary' : 'outline'}
                onClick={() => updateLayer(layer.id, { textAlign: 'right' })}
              >
                Right
              </Button>
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
    </PanelCard>
  );
}
