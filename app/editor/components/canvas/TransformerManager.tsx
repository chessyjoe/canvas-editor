'use client';

import React from 'react';
import { Transformer } from 'react-konva';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import Konva from 'konva';

export function TransformerManager({ stageRef, trRef }: { stageRef: React.RefObject<any>; trRef: React.RefObject<any> }) {
  const { selectedIds, setIsResizing, updateLayer } = useEditorStore();

  React.useEffect(() => {
    const stage = stageRef.current;
    const tr = trRef.current;
    if (!stage || !tr) return;

    const selectedNodes = selectedIds.map((id) => stage.findOne(`#${id}`)).filter((node) => node);
    if (selectedNodes.length > 0) {
      tr.nodes(selectedNodes);
      tr.getLayer()?.batchDraw();
    } else {
      tr.nodes([]);
      tr.getLayer()?.batchDraw();
    }
  }, [selectedIds, stageRef, trRef]);

  const handleTransformStart = () => {
    setIsResizing(true);
  };

  const handleTransformEnd = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const nodes = trRef.current?.nodes() || [];
    nodes.forEach((node: Konva.Node) => {
      updateLayer(node.id(), {
        x: node.x(),
        y: node.y(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
        rotation: node.rotation(),
      });
    });
    setIsResizing(false);
  };

  return (
    <Transformer
      ref={trRef}
      onTransformStart={handleTransformStart}
      onTransformEnd={handleTransformEnd}
      // onTransform={handleTransform} // Optional: for live updates
    />
  );
}
