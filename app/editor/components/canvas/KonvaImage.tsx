'use client';

import React from 'react';
import { Image as KImage } from 'react-konva';
import useImage from 'use-image';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { ImageLayer } from '@/canvas/store/useEditorStore';

export function KonvaImage({ layer }: { layer: ImageLayer }) {
  const [img] = useImage(layer.src, 'anonymous');
  const { updateLayer, setSelected } = useEditorStore.getState();

  if (!img) return null;

  return (
    <KImage
      image={img}
      id={layer.id}
      x={layer.x}
      y={layer.y}
      width={layer.width}
      height={layer.height}
      rotation={layer.rotation}
      scaleX={layer.scaleX}
      scaleY={layer.scaleY}
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
