'use client';
import React, { useEffect, useRef } from 'react';
import { Transformer } from 'react-konva';
import { useEditorStore, Layer } from '@/canvas/store/useEditorStore';

export function TransformerManager({
  stageRef,
  trRef,
}: {
  stageRef: React.RefObject<any>;
  trRef: React.RefObject<any>;
}) {
  const { selectedIds, layers, updateLayer } = useEditorStore();
  const initialPositions = useRef<Map<string, { x: number; y: number }>>(new Map());

  useEffect(() => {
    const stage = stageRef.current;
    const tr = trRef.current;
    if (!stage || !tr) return;

    const selectedNodes = selectedIds.map((id) => stage.findOne(`#${id}`)).filter((node) => node);

    if (selectedNodes.length > 0) {
      tr.nodes(selectedNodes);
    } else {
      tr.nodes([]);
    }
    tr.getLayer()?.batchDraw();
  }, [selectedIds, stageRef, trRef]);

  const handleDragStart = () => {
    const currentPositions = new Map<string, { x: number; y: number }>();
    layers.forEach((layer) => {
      if (selectedIds.includes(layer.id)) {
        currentPositions.set(layer.id, { x: layer.x, y: layer.y });
      }
    });
    initialPositions.current = currentPositions;
  };

  const handleDragEnd = (e: any) => {
    const group = e.target;
    const deltaX = group.x();
    const deltaY = group.y();

    selectedIds.forEach((id) => {
      const initialPos = initialPositions.current.get(id);
      if (initialPos) {
        updateLayer(id, {
          x: initialPos.x + deltaX,
          y: initialPos.y + deltaY,
        });
      }
    });
  };

  return <Transformer ref={trRef} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />;
}
