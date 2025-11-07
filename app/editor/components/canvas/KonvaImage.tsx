'use client';

import React, { useRef, useEffect } from 'react';
import { Image as KImage, Rect, Transformer } from 'react-konva';
import useImage from 'use-image';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { ImageLayer } from '@/canvas/store/useEditorStore';
import { KonvaEventObject } from 'konva/lib/Node';
import Konva from 'konva';

function CroppingRect({
  x,
  y,
  width,
  height,
  onTransformEnd,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  onTransformEnd: (newAttrs: { x: number; y: number; width: number; height: number }) => void;
}) {
  const shapeRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, []);

  return (
    <React.Fragment>
      <Rect
        ref={shapeRef}
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="blue"
        strokeWidth={2}
        draggable
        onTransformEnd={() => {
          if (shapeRef.current) {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onTransformEnd({
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
            });
          }
        }}
      />
      <Transformer ref={trRef} />
    </React.Fragment>
  );
}

export function KonvaImage({ layer, onDragEnd }: { layer: ImageLayer; onDragEnd: (e: KonvaEventObject<DragEvent>) => void; }) {
  const [img] = useImage(layer.src, 'anonymous');
  const { updateLayer, croppingLayerId } = useEditorStore((state) => ({
    croppingLayerId: state.croppingLayerId,
    updateLayer: state.updateLayer,
  }));
  const isCropping = croppingLayerId === layer.id;

  if (!img) return null;

  const crop =
    layer.cropX !== undefined &&
    layer.cropY !== undefined &&
    layer.cropWidth !== undefined &&
    layer.cropHeight !== undefined
      ? {
          x: layer.cropX,
          y: layer.cropY,
          width: layer.cropWidth,
          height: layer.cropHeight,
        }
      : undefined;

  return (
    <>
      <KImage
        image={img}
        id={layer.id}
        x={layer.x}
        y={layer.y}
        width={layer.width}
        height={layer.height}
        draggable={!layer.locked && !isCropping}
        opacity={layer.locked ? 0.5 : 1}
        onDragEnd={onDragEnd}
        crop={crop}
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
      {isCropping && (
        <CroppingRect
          x={layer.x + (layer.cropX || 0)}
          y={layer.y + (layer.cropY || 0)}
          width={layer.cropWidth || layer.width}
          height={layer.cropHeight || layer.height}
          onTransformEnd={(newAttrs) => {
            updateLayer(layer.id, {
              cropX: newAttrs.x - layer.x,
              cropY: newAttrs.y - layer.y,
              cropWidth: newAttrs.width,
              cropHeight: newAttrs.height,
            });
          }}
        />
      )}
    </>
  );
}
