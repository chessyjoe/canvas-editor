'use client';

import React from 'react';
import { Image as KImage } from 'react-konva';
import useImage from 'use-image';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { ImageLayer } from '@/canvas/store/useEditorStore';
import { KonvaEventObject } from 'konva/lib/Node';

export function KonvaImage({ layer, onDragEnd }: { layer: ImageLayer; onDragEnd: (e: KonvaEventObject<DragEvent>) => void; }) {
  const [img] = useImage(layer.src, 'anonymous');
  const { updateLayer } = useEditorStore.getState();

  if (!img) return null;

  return (
    <KImage
      image={img}
      id={layer.id}
      x={layer.x}
      y={layer.y}
      width={layer.width}
      height={layer.height}
      draggable={!layer.locked}
      opacity={layer.locked ? 0.5 : 1}
      onDragEnd={onDragEnd}
      onTransformEnd={(e) => {
        const node: any = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        updateLayer(layer.id, {
          x: node.x(),
          y: node.y(),
          width: Math.max(10, node.width() * scaleX),
          height: Math.max(10, node.height() * scaleY),
        });
      }}
    />
  );
}
