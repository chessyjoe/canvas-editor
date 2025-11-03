'use client';

import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Image as KImage, Text as KText, Transformer } from 'react-konva';
import useImage from 'use-image';
import { useEditorStore } from '@/canvas/store/useEditorStore';

function KonvaImage({ layer }: any) {
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
      draggable={!layer.locked}
      opacity={layer.locked ? 0.5 : 1}
      onClick={() => setSelected(layer.id)}
      onTap={() => setSelected(layer.id)}
      onDragEnd={(e) => updateLayer(layer.id, { x: e.target.x(), y: e.target.y() })}
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

function KonvaText({ layer }: any) {
  const { updateLayer, setSelected } = useEditorStore.getState();

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
      onClick={() => setSelected(layer.id)}
      onTap={() => setSelected(layer.id)}
      onDragEnd={(e) => updateLayer(layer.id, { x: e.target.x(), y: e.target.y() })}
    />
  );
}

function TransformerManager({ stageRef, trRef }: any) {
  const selectedId = useEditorStore((s) => s.selectedId);

  useEffect(() => {
    const stage = stageRef.current;
    const tr = trRef.current;
    if (!stage || !tr) return;

    const selectedNode = stage.findOne(`#${selectedId}`);
    if (selectedNode) {
      tr.nodes([selectedNode]);
      tr.getLayer()?.batchDraw();
    } else {
      tr.nodes([]);
      tr.getLayer()?.batchDraw();
    }
  }, [selectedId]);

  return <Transformer ref={trRef} />;
}

export default function CanvasArea() {
  const { width, height, background, layers } = useEditorStore();
  const setSelected = useEditorStore((s) => s.setSelected);
  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  return (
    <div style={{ border: '1px solid #ddd', background }}>
      <Stage
        width={width}
        height={height}
        ref={stageRef}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) setSelected(null);
        }}
      >
        <Layer>
          <Rect x={0} y={0} width={width} height={height} fill={background} listening={false} />
          {layers.map((layer) => {
            if (!layer.visible) return null;
            if (layer.type === 'image') return <KonvaImage key={layer.id} layer={layer} />;
            if (layer.type === 'text') return <KonvaText key={layer.id} layer={layer} />;
            if (layer.type === 'rect')
              return (
                <Rect
                  key={layer.id}
                  id={layer.id}
                  x={layer.x}
                  y={layer.y}
                  width={layer.width}
                  height={layer.height}
                  fill={layer.fill}
                  draggable={!layer.locked}
                  opacity={layer.locked ? 0.5 : 1}
                  onClick={() => setSelected(layer.id)}
                  onDragEnd={(e) =>
                    useEditorStore.getState().updateLayer(layer.id, { x: e.target.x(), y: e.target.y() })
                  }
                />
              );
          })}
          <TransformerManager stageRef={stageRef} trRef={trRef} />
        </Layer>
      </Stage>
    </div>
  );
}
