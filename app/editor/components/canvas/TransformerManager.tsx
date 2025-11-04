'use client';

import React, { useEffect } from 'react';
import { Transformer } from 'react-konva';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import Konva from 'konva';

export function TransformerManager({ stageRef, trRef }: { stageRef: React.RefObject<any>; trRef: React.RefObject<any> }) {
  const { selectedId, updateLayer } = useEditorStore();

  useEffect(() => {
    const stage = stageRef.current;
    const tr = trRef.current;
    if (!stage || !tr) return;

    const selectedNode = stage.findOne(`#${selectedId}`);
    if (selectedNode) {
      tr.nodes([selectedNode]);
    } else {
      tr.nodes([]);
    }
    tr.getLayer()?.batchDraw();
  }, [selectedId, stageRef, trRef]);

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    const id = node.id();
    updateLayer(id, {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
    });
  };

  return (
    <Transformer
      ref={trRef}
      rotateEnabled={true}
      onTransformEnd={handleTransformEnd}
      enabledAnchors={[
        'top-left',
        'top-center',
        'top-right',
        'middle-right',
        'middle-left',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ]}
    />
  );
}
