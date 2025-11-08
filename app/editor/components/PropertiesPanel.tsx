'use client';
import React from 'react';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { Button } from '@/app/editor/components/ui/button';
import { Input } from '@/app/editor/components/ui/input';
import { Label } from '@/app/editor/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="fontFamily">Font Family</Label>
              <Select
                value={layer.fontFamily}
                onValueChange={(value) => updateLayer(layer.id, { fontFamily: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Verdana">Verdana</SelectItem>
                </SelectContent>
              </Select>
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
              <Button
                variant={layer.textAlign === 'justify' ? 'secondary' : 'outline'}
                onClick={() => updateLayer(layer.id, { textAlign: 'justify' })}
              >
                Justify
              </Button>
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="textBackgroundColor">Background Color</Label>
              <Input
                id="textBackgroundColor"
                type="color"
                value={layer.textBackgroundColor || '#ffffff'}
                onChange={(e) => updateLayer(layer.id, { textBackgroundColor: e.target.value })}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="lineHeight">Line Height</Label>
              <Input
                id="lineHeight"
                type="number"
                step="0.1"
                value={layer.lineHeight}
                onChange={(e) => updateLayer(layer.id, { lineHeight: parseFloat(e.target.value) || 1 })}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="letterSpacing">Letter Spacing</Label>
              <Input
                id="letterSpacing"
                type="number"
                value={layer.letterSpacing}
                onChange={(e) =>
                  updateLayer(layer.id, { letterSpacing: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="shadowColor">Shadow Color</Label>
              <Input
                id="shadowColor"
                type="color"
                value={layer.shadowColor || '#000000'}
                onChange={(e) => updateLayer(layer.id, { shadowColor: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number"
                placeholder="Blur"
                value={layer.shadowBlur}
                onChange={(e) =>
                  updateLayer(layer.id, { shadowBlur: parseInt(e.target.value) || 0 })
                }
              />
              <Input
                type="number"
                placeholder="Offset X"
                value={layer.shadowOffsetX}
                onChange={(e) =>
                  updateLayer(layer.id, { shadowOffsetX: parseInt(e.target.value) || 0 })
                }
              />
              <Input
                type="number"
                placeholder="Offset Y"
                value={layer.shadowOffsetY}
                onChange={(e) =>
                  updateLayer(layer.id, { shadowOffsetY: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="stroke">Stroke Color</Label>
              <Input
                id="stroke"
                type="color"
                value={layer.stroke || '#000000'}
                onChange={(e) => updateLayer(layer.id, { stroke: e.target.value })}
              />
            </div>
            <Input
              type="number"
              placeholder="Stroke Width"
              value={layer.strokeWidth}
              onChange={(e) =>
                updateLayer(layer.id, { strokeWidth: parseInt(e.target.value) || 0 })
              }
            />

            <div className="flex items-center gap-2">
              <Label>Fill</Label>
              <Button
                variant={layer.fillPriority === 'color' ? 'secondary' : 'outline'}
                onClick={() => updateLayer(layer.id, { fillPriority: 'color' })}
              >
                Color
              </Button>
              <Button
                variant={layer.fillPriority === 'gradient' ? 'secondary' : 'outline'}
                onClick={() => updateLayer(layer.id, { fillPriority: 'gradient' })}
              >
                Gradient
              </Button>
            </div>

            {layer.fillPriority === 'gradient' && (
              <div className="flex flex-col gap-2">
                <div>
                  <Label>Color Stops</Label>
                  {layer.fillLinearGradientColorStops?.map((stop, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2"
                    >
                      <Input
                        type="number"
                        step="0.1"
                        max="1"
                        min="0"
                        value={stop[0]}
                        onChange={(e) => {
                          const stops = [...(layer.fillLinearGradientColorStops || [])];
                          stops[i] = [parseFloat(e.target.value), stops[i][1]];
                          updateLayer(layer.id, { fillLinearGradientColorStops: stops });
                        }}
                      />
                      <Input
                        type="color"
                        value={stop[1]}
                        onChange={(e) => {
                          const stops = [...(layer.fillLinearGradientColorStops || [])];
                          stops[i] = [stops[i][0], e.target.value];
                          updateLayer(layer.id, { fillLinearGradientColorStops: stops });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              disabled
              title="Coming Soon"
            >
              Rich Text
            </Button>
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
