'use client';

import React, { useEffect } from 'react';
import { Transformer } from 'react-konva';
import { useEditorStore } from '@/canvas/store/useEditorStore';

export function TransformerManager({ stageRef, trRef }: { stageRef: React.RefObject<any>; trRef: React.RefObject<any> }) {
  const selectedIds = useEditorStore((s) => s.selectedIds);

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

  return <Transformer ref={trRef} />;
}
