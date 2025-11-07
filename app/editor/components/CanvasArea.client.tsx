'use client';

import React, { useRef } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { KonvaImage } from './canvas/KonvaImage';
import { KonvaText } from './canvas/KonvaText';
import { TransformerManager } from './canvas/TransformerManager';
import { ImageLayer, TextLayer } from '@/canvas/store/useEditorStore';

export default function CanvasArea() {
  const {
    width,
    height,
    background,
    layers,
    setSelected,
    scale,
    stagePos,
    setZoom,
    setStagePos,
  } = useEditorStore();
  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  const handleWheel = (e: any) => {
    if (!e.evt.ctrlKey) return;
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = stageRef.current;
    if (!stage) return;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    setZoom(newScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    setStagePos(newPos);
  };

  return (
    <div style={{ border: '1px solid #ddd', background }}>
      <Stage
        width={width}
        height={height}
        ref={stageRef}
        draggable
        x={stagePos.x}
        y={stagePos.y}
        scaleX={scale}
        scaleY={scale}
        onDragEnd={(e) => setStagePos({ x: e.target.x(), y: e.target.y() })}
        onWheel={handleWheel}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) setSelected(null);
        }}
      >
        <Layer>
          <Rect x={0} y={0} width={width} height={height} fill={background} listening={false} />
          {layers.map((layer) => {
            if (!layer.visible) return null;
            if (layer.type === 'image') return <KonvaImage key={layer.id} layer={layer as ImageLayer} />;
            if (layer.type === 'text') return <KonvaText key={layer.id} layer={layer as TextLayer} />;
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
