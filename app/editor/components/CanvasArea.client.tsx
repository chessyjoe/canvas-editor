'use client';

import React, { useRef, useState } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { KonvaImage } from './canvas/KonvaImage';
import { KonvaText } from './canvas/KonvaText';
import { TransformerManager } from './canvas/TransformerManager';
import { ImageLayer, TextLayer, RectLayer } from '@/canvas/store/useEditorStore';

export default function CanvasArea() {
  const {
    width,
    height,
    background,
    layers,
    selectedIds,
    setSelecteds,
    addToSelection,
    removeFromSelection,
    scale,
    stagePos,
    setZoom,
    setStagePos,
    canvasContainer,
    tool,
  } = useEditorStore();
  const stageRef = useRef<Konva.Stage>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const [selectionRect, setSelectionRect] = useState({ x1: 0, y1: 0, x2: 0, y2: 0, visible: false });
  const [lassoPoints, setLassoPoints] = useState<number[]>([]);
  const [isLassoing, setIsLassoing] = useState(false);

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    if (e.evt.ctrlKey) {
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
      const newPos = {
        x: stage.x() - e.evt.deltaX,
        y: stage.y() - e.evt.deltaY,
      };
      setStagePos(newPos);
    }
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === 'pan' || (tool === 'select' && e.target !== e.target.getStage())) {
      if (e.target !== e.target.getStage()) {
        const id = e.target.id();
        if (e.evt.shiftKey) {
          if (selectedIds.includes(id)) {
            removeFromSelection(id);
          } else {
            addToSelection(id);
          }
        } else {
          if (!selectedIds.includes(id)) {
            setSelecteds([id]);
          }
        }
      }
      return;
    }

    const stage = stageRef.current;
    if (!stage) return;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    if (tool === 'select') {
      setSelectionRect({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y, visible: true });
    } else if (tool === 'lasso') {
      setIsLassoing(true);
      setLassoPoints([pos.x, pos.y]);
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    if (selectionRect.visible) {
      setSelectionRect({ ...selectionRect, x2: pos.x, y2: pos.y });
    } else if (isLassoing) {
      setLassoPoints([...lassoPoints, pos.x, pos.y]);
    }
  };

  const handleMouseUp = () => {
    if (selectionRect.visible) {
      const stage = stageRef.current;
      if (!stage) return;
      const { x1, y1, x2, y2 } = selectionRect;
      const box = {
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x1 - x2),
        height: Math.abs(y1 - y2),
      };
      const selected = stage.find('#' + layers.map((l) => l.id).join(', #')).filter((shape) => {
        const shapeRect = shape.getClientRect();
        return Konva.Util.haveIntersection(box, shapeRect);
      });
      setSelecteds(selected.map((shape) => shape.id()));
      setSelectionRect({ ...selectionRect, visible: false });
    } else if (isLassoing) {
      const stage = stageRef.current;
      if (!stage) return;

      const selected = stage.find('#' + layers.map((l) => l.id).join(', #')).filter((shape) => {
        const shapeRect = shape.getClientRect();
        const center = {
          x: shapeRect.x + shapeRect.width / 2,
          y: shapeRect.y + shapeRect.height / 2,
        };
        return isInside(center, lassoPoints);
      });
      setSelecteds(selected.map((shape) => shape.id()));
      setLassoPoints([]);
      setIsLassoing(false);
    }
  };

  const isInside = (point: { x: number; y: number }, polygon: number[]) => {
    const x = point.x;
    const y = point.y;
    let inside = false;
    for (let i = 0, j = polygon.length - 2; i < polygon.length; j = i, i += 2) {
      const xi = polygon[i];
      const yi = polygon[i + 1];
      const xj = polygon[j];
      const yj = polygon[j + 1];

      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) {
        inside = !inside;
      }
    }
    return inside;
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const { updateLayer } = useEditorStore.getState();
    const id = e.target.id();
    const layer = layers.find((l) => l.id === id);
    if (!layer) return;

    const dx = e.target.x() - layer.x;
    const dy = e.target.y() - layer.y;

    updateLayer(id, { x: e.target.x(), y: e.target.y() });

    if (layer.groupId) {
      layers.forEach((l) => {
        if (l.groupId === layer.groupId && l.id !== id) {
          updateLayer(l.id, { x: l.x + dx, y: l.y + dy });
        }
      });
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
        draggable={tool === 'pan'}
        x={stagePos.x}
        y={stagePos.y}
        scaleX={scale}
        scaleY={scale}
        onDragEnd={(e) => setStagePos({ x: e.target.x(), y: e.target.y() })}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {layers.map((layer) => {
            if (!layer.visible) return null;
            if (layer.type === 'image') return <KonvaImage key={layer.id} layer={layer as ImageLayer} onDragEnd={handleDragEnd} />;
            if (layer.type === 'text') return <KonvaText key={layer.id} layer={layer as TextLayer} onDragEnd={handleDragEnd} />;
            if (layer.type === 'rect')
              return (
                <Rect
                  key={layer.id}
                  id={layer.id}
                  x={layer.x}
                  y={layer.y}
                  width={(layer as RectLayer).width}
                  height={(layer as RectLayer).height}
                  fill={(layer as RectLayer).fill}
                  draggable={!layer.locked}
                  opacity={layer.locked ? 0.5 : 1}
                  onDragEnd={handleDragEnd}
                />
              );
          })}
          <TransformerManager stageRef={stageRef} trRef={trRef} />
          {selectionRect.visible && (
            <Rect
              x={Math.min(selectionRect.x1, selectionRect.x2)}
              y={Math.min(selectionRect.y1, selectionRect.y2)}
              width={Math.abs(selectionRect.x1 - selectionRect.x2)}
              height={Math.abs(selectionRect.y1 - selectionRect.y2)}
              fill="rgba(0, 0, 255, 0.5)"
            />
          )}
          {isLassoing && <Line points={lassoPoints} stroke="blue" strokeWidth={2} />}
        </Layer>
      </Stage>
    </div>
  );
}
