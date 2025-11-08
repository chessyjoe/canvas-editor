
'use client';
import React from 'react';
import { Line } from 'react-konva';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { v4 as uuidv4 } from 'uuid';

export const Guides = () => {
  const { guides, updateGuide, scale, stagePos, canvasContainer } = useEditorStore();

  const handleDragEnd = (id: string, e: any) => {
    const node = e.target;
    updateGuide(id, node.x() || node.y());
  };

  return (
    <>
      {guides.map((guide) => (
        <Line
          key={guide.id}
          points={
            guide.orientation === 'vertical'
              ? [guide.position, -stagePos.y / scale, guide.position, (-stagePos.y + canvasContainer.height) / scale]
              : [-stagePos.x / scale, guide.position, (-stagePos.x + canvasContainer.width) / scale, guide.position]
          }
          stroke="red"
          strokeWidth={1 / scale}
          draggable
          onDragEnd={(e) => handleDragEnd(guide.id, e)}
          dragBoundFunc={(pos) => {
            if (guide.orientation === 'vertical') {
              return { x: pos.x, y: guide.position };
            } else {
              return { x: guide.position, y: pos.y };
            }
          }}
        />
      ))}
    </>
  );
};
