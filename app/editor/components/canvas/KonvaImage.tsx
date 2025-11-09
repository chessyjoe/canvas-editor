'use client';

import React from 'react';
import { Image as KImage } from 'react-konva';
import useImage from 'use-image';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { ImageLayer } from '@/canvas/store/useEditorStore';
import { KonvaEventObject } from 'konva/lib/Node';

export function KonvaImage({ layer, onDragStart, onDragEnd }: { layer: ImageLayer; onDragStart: (e: KonvaEventObject<DragEvent>) => void; onDragEnd: (e: KonvaEventObject<DragEvent>) => void; }) {
  const [img] = useImage(layer.src, 'anonymous');
  const { updateLayer } = useEditorStore.getState();
  const imageRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (imageRef.current) {
      imageRef.current.cache();
    }
  }, [layer.cropX, layer.cropY, layer.cropWidth, layer.cropHeight, img]);

  if (!img) return null;

  const clipFunc = (ctx: any) => {
    if (layer.cropWidth && layer.cropHeight) {
      ctx.rect(layer.cropX, layer.cropY, layer.cropWidth, layer.cropHeight);
    }
  };

  return (
    <KImage
      ref={imageRef}
      image={img}
      id={layer.id}
      clipFunc={clipFunc}
      x={layer.x}
      y={layer.y}
      width={layer.width}
      height={layer.height}
      draggable={!layer.locked}
      opacity={layer.locked ? 0.5 : 1}
      onDragStart={onDragStart}
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
