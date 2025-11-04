'use client';

import React, { useEffect } from 'react';
import { Transformer } from 'react-konva';
import { useEditorStore } from '@/canvas/store/useEditorStore';

export function TransformerManager({ stageRef, trRef }: { stageRef: React.RefObject<any>; trRef: React.RefObject<any> }) {
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
  }, [selectedId, stageRef, trRef]);

  return <Transformer ref={trRef} />;
}
