'use client';

import React from 'react';
import { Text as KText } from 'react-konva';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { TextLayer } from '@/canvas/store/useEditorStore';

export function KonvaText({ layer }: { layer: TextLayer }) {
  const { updateLayer, setSelected } = useEditorStore.getState();

  return (
    <KText
      id={layer.id}
      text={layer.text}
      x={layer.x}
      y={layer.y}
      rotation={layer.rotation}
      scaleX={layer.scaleX}
      scaleY={layer.scaleY}
      fontSize={layer.fontSize}
      fontFamily={layer.fontFamily}
      fill={layer.fill}
      draggable={!layer.locked}
      opacity={layer.locked ? 0.5 : 1}
      onClick={() => setSelected(layer.id)}
      onTap={() => setSelected(layer.id)}
      onDragEnd={(e) => updateLayer(layer.id, { x: e.target.x(), y: e.target.y() })}
      onTransformEnd={(e) => {
        const node = e.target;
        updateLayer(layer.id, {
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
        });
      }}
      onContextMenu={(e) => {
        e.evt.preventDefault();
        setSelected(layer.id);
      }}
    />
  );
}
