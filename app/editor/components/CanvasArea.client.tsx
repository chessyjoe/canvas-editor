'use client';

import React, { useRef, useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { KonvaImage } from './canvas/KonvaImage';
import { KonvaText } from './canvas/KonvaText';
import { TransformerManager } from './canvas/TransformerManager';
import { ImageLayer, TextLayer, RectLayer } from '@/canvas/store/useEditorStore';
import { Line } from 'react-konva';
import { Guides } from './Guides';
import { SmartGuides } from './SmartGuides';

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
    gridVisible,
    gridSize,
    gridColor,
    guides,
    snapToGrid,
    snapToGuides,
    setStageRef,
  } = useEditorStore();
  const stageRef = useRef<Konva.Stage>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const [selectionRect, setSelectionRect] = useState({ x1: 0, y1: 0, x2: 0, y2: 0, visible: false });
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);

  useEffect(() => {
    setStageRef(stageRef);
  }, [setStageRef]);

  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    setDraggingLayerId(e.target.id());
  };

  const renderGrid = () => {
    if (!gridVisible) return null;

    const lines = [];
    const stroke = gridColor;
    const strokeWidth = 1;

    const viewRect = {
      x1: -stagePos.x / scale,
      y1: -stagePos.y / scale,
      x2: (-stagePos.x + canvasContainer.width) / scale,
      y2: (-stagePos.y + canvasContainer.height) / scale,
    };

    const startX = Math.floor(viewRect.x1 / gridSize) * gridSize;
    const endX = Math.ceil(viewRect.x2 / gridSize) * gridSize;
    const startY = Math.floor(viewRect.y1 / gridSize) * gridSize;
    const endY = Math.ceil(viewRect.y2 / gridSize) * gridSize;

    for (let x = startX; x < endX; x += gridSize) {
      lines.push(
        <Line
          key={`v-${x}`}
          points={[x, viewRect.y1, x, viewRect.y2]}
          stroke={stroke}
          strokeWidth={strokeWidth / scale}
        />,
      );
    }

    for (let y = startY; y < endY; y += gridSize) {
      lines.push(
        <Line
          key={`h-${y}`}
          points={[viewRect.x1, y, viewRect.x2, y]}
          stroke={stroke}
          strokeWidth={strokeWidth / scale}
        />,
      );
    }

    return <Layer listening={false}>{lines}</Layer>;
  };

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
    if (tool === 'pan' || e.target !== e.target.getStage()) {
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

    setSelectionRect({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y, visible: true });
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!selectionRect.visible) return;

    const stage = stageRef.current;
    if (!stage) return;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    setSelectionRect({
      ...selectionRect,
      x2: pos.x,
      y2: pos.y,
    });
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
    }
    setSelectionRect({ ...selectionRect, visible: false });
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const { updateLayer } = useEditorStore.getState();
    const id = e.target.id();
    const layer = layers.find((l) => l.id === id);
    if (!layer) return;

    let x = e.target.x();
    let y = e.target.y();

    if (snapToGrid) {
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;
    }

    if (snapToGuides) {
      guides.forEach((guide) => {
        if (guide.orientation === 'vertical') {
          if (Math.abs(x - guide.position) < 10) {
            x = guide.position;
          }
        } else {
          if (Math.abs(y - guide.position) < 10) {
            y = guide.position;
          }
        }
      });
    }

    const dx = x - layer.x;
    const dy = y - layer.y;

    updateLayer(id, { x, y });

    if (layer.groupId) {
      layers.forEach((l) => {
        if (l.groupId === layer.groupId && l.id !== id) {
          updateLayer(l.id, { x: l.x + dx, y: l.y + dy });
        }
      });
    }
    setDraggingLayerId(null);
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
        {renderGrid()}
        <Layer>
          <Guides />
          <SmartGuides draggingLayerId={draggingLayerId} />
          {layers.map((layer) => {
            if (!layer.visible) return null;
            if (layer.type === 'image') return <KonvaImage key={layer.id} layer={layer as ImageLayer} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />;
            if (layer.type === 'text') return <KonvaText key={layer.id} layer={layer as TextLayer} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />;
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
                  onDragStart={handleDragStart}
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
        </Layer>
      </Stage>
    </div>
  );
}
