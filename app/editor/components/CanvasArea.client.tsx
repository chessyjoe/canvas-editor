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
    canvasContainer,
  } = useEditorStore();
  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    if (e.evt.ctrlKey) {
      // Zooming
      const scaleBy = 1.05;
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
    } else {
      // Panning with two-finger scroll
      const newPos = {
        x: stage.x() - e.evt.deltaX,
        y: stage.y() - e.evt.deltaY,
      };
      setStagePos(newPos);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background,
      }}
    >
      <Stage
        width={canvasContainer.width}
        height={canvasContainer.height}
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
