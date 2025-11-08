
'use client';
import React from 'react';
import { Line, Text } from 'react-konva';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { KonvaEventObject } from 'konva/lib/Node';

interface SmartGuidesProps {
  draggingLayerId: string | null;
}

export const SmartGuides = ({ draggingLayerId }: SmartGuidesProps) => {
  const { layers, scale } = useEditorStore();
  const draggingLayer = layers.find((l) => l.id === draggingLayerId);

  if (!draggingLayer) return null;

  const lines = [];
  const texts = [];

  layers.forEach((layer) => {
    if (layer.id === draggingLayerId) return;

    const draggingWidth = 'width' in draggingLayer ? draggingLayer.width : 0;
    const draggingHeight = 'height' in draggingLayer ? draggingLayer.height : 0;
    const layerWidth = 'width' in layer ? layer.width : 0;
    const layerHeight = 'height' in layer ? layer.height : 0;

    // Horizontal alignment
    if (Math.abs(layer.y - draggingLayer.y) < 5) {
      lines.push(
        <Line
          key={`${layer.id}-h-top`}
          points={[layer.x, layer.y, draggingLayer.x + draggingWidth, draggingLayer.y]}
          stroke="cyan"
          strokeWidth={1 / scale}
        />
      );
      if (Math.abs(layer.x - (draggingLayer.x + draggingWidth)) > 20) {
        texts.push(
          <Text
            key={`${layer.id}-h-top-text`}
            x={(layer.x + draggingLayer.x + draggingWidth) / 2}
            y={layer.y - 10}
            text={`${Math.round(Math.abs(layer.x - (draggingLayer.x + draggingWidth)))}px`}
            fontSize={10}
            fill="cyan"
          />
        );
      }
    }
    if (Math.abs(layer.y + layerHeight - (draggingLayer.y + draggingHeight)) < 5) {
      lines.push(
        <Line
          key={`${layer.id}-h-bottom`}
          points={[layer.x, layer.y + layerHeight, draggingLayer.x + draggingWidth, draggingLayer.y + draggingHeight]}
          stroke="cyan"
          strokeWidth={1 / scale}
        />
      );
    }

    // Vertical alignment
    if (Math.abs(layer.x - draggingLayer.x) < 5) {
      lines.push(
        <Line
          key={`${layer.id}-v-left`}
          points={[layer.x, layer.y, draggingLayer.x, draggingLayer.y + draggingHeight]}
          stroke="cyan"
          strokeWidth={1 / scale}
        />
      );
    }
    if (Math.abs(layer.x + layerWidth - (draggingLayer.x + draggingWidth)) < 5) {
      lines.push(
        <Line
          key={`${layer.id}-v-right`}
          points={[layer.x + layerWidth, layer.y, draggingLayer.x + draggingWidth, draggingLayer.y + draggingHeight]}
          stroke="cyan"
          strokeWidth={1 / scale}
        />
      );
    }
  });

  return <>{lines}{texts}</>;
};
