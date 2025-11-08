'use client';

import React from 'react';
import { Label as KLabel, Tag as KTag, Text as KText } from 'react-konva';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { TextLayer } from '@/canvas/store/useEditorStore';
import { KonvaEventObject } from 'konva/lib/Node';

export function KonvaText({ layer, onDragStart, onDragEnd }: { layer: TextLayer; onDragStart: (e: KonvaEventObject<DragEvent>) => void; onDragEnd: (e: KonvaEventObject<DragEvent>) => void; }) {

  return (
    <KLabel
      id={layer.id}
      x={layer.x}
      y={layer.y}
      draggable={!layer.locked}
      opacity={layer.locked ? 0.5 : 1}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <KTag fill={layer.textBackgroundColor} />
      <KText
        text={layer.text}
        fontSize={layer.fontSize}
        fontFamily={layer.fontFamily}
        fill={layer.fill}
        fontStyle={layer.fontStyle}
        fontWeight={layer.fontWeight}
        textDecoration={layer.textDecoration}
        align={layer.textAlign}
        lineHeight={layer.lineHeight}
        letterSpacing={layer.letterSpacing}
        padding={10}
        shadowColor={layer.shadowColor}
        shadowBlur={layer.shadowBlur}
        shadowOffsetX={layer.shadowOffsetX}
        shadowOffsetY={layer.shadowOffsetY}
        stroke={layer.stroke}
        strokeWidth={layer.strokeWidth}
      />
    </KLabel>
  );
}
