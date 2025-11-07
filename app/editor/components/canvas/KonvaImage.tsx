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
      rotation={layer.rotation}
      scaleX={layer.scaleX}
      scaleY={layer.scaleY}
    />
  );
}
