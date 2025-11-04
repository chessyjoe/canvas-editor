'use client';

import React from 'react';
import { Rect as KRect } from 'react-konva';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { RectLayer } from '@/canvas/store/useEditorStore';

export function KonvaRect({ layer }: { layer: RectLayer }) {
  const { updateLayer, setSelected } = useEditorStore.getState();

  return (
    <KRect
      id={layer.id}
      x={layer.x}
      y={layer.y}
      width={layer.width}
      height={layer.height}
      rotation={layer.rotation}
      scaleX={layer.scaleX}
      scaleY={layer.scaleY}
      fill={layer.fill}
      draggable={!layer.locked}
      opacity={layer.visible === false ? 0 : layer.locked ? 0.5 : 1}
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
