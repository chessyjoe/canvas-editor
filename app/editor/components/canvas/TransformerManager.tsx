'use client';

import React, { useEffect } from 'react';
import { Transformer } from 'react-konva';
import { useEditorStore } from '@/canvas/store/useEditorStore';

export function TransformerManager({ stageRef, trRef }: { stageRef: React.RefObject<any>; trRef: React.RefObject<any> }) {
  const { selectedIds, editingLayerId } = useEditorStore((s) => ({
    selectedIds: s.selectedIds,
    editingLayerId: s.editingLayerId,
  }));

  useEffect(() => {
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

  const { updateLayer } = useEditorStore.getState();

  const onTransformEnd = (e: any) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const width = Math.max(5, node.width() * scaleX);
    const height = Math.max(node.height() * scaleY);

    updateLayer(node.id(), {
      x: node.x(),
      y: node.y(),
      width,
      height,
    });
    node.scaleX(1);
    node.scaleY(1);
  };

  return <Transformer ref={trRef} onTransformEnd={onTransformEnd} visible={!editingLayerId} />;
}
