'use client';

import React from 'react';
import { Text as KText } from 'react-konva';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { TextLayer } from '@/canvas/store/useEditorStore';
import { KonvaEventObject } from 'konva/lib/Node';

export function KonvaText({ layer, onDragEnd }: { layer: TextLayer; onDragEnd: (e: KonvaEventObject<DragEvent>) => void; }) {

  return (
    <KText
      id={layer.id}
      text={layer.text}
      x={layer.x}
      y={layer.y}
      fontSize={layer.fontSize}
      fontFamily={layer.fontFamily}
      fill={layer.fill}
      draggable={!layer.locked}
      opacity={layer.locked ? 0.5 : 1}
      onDragEnd={onDragEnd}
    />
  );
}
