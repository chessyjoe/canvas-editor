
'use client';
import React from 'react';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { v4 as uuidv4 } from 'uuid';

interface RulerProps {
  orientation: 'horizontal' | 'vertical';
}

export const Ruler = ({ orientation }: RulerProps) => {
  const { addGuide, scale, stagePos, stageRef } = useEditorStore();

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef?.current) return;

    const stage = stageRef.current;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    // Use the mouse position relative to the ruler itself to start the guide
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newGuide = {
      id: uuidv4(),
      orientation,
      position: orientation === 'vertical'
        ? (pointer.x - stagePos.x) / scale
        : (pointer.y - stagePos.y) / scale,
    };
    addGuide(newGuide);
  };

  const renderMarkings = () => {
    const markings = [];
    // We can't use canvasContainer anymore, so we estimate a large enough size.
    // The overflow will be hidden by the parent grid cell.
    const length = 3000;
    const isHorizontal = orientation === 'horizontal';
    const start = isHorizontal ? -stagePos.x : -stagePos.y;
    const interval = 50 * scale;

    for (let i = 0; i < length; i += (interval / 10)) {
        const currentPos = start + i;
        if (currentPos < 0) continue;

        const mainTick = currentPos % interval < (interval/10);
        const positionValue = Math.round(currentPos / scale);

        markings.push(
            <div key={i} style={{
                position: 'absolute',
                left: isHorizontal ? `${currentPos}px` : '0px',
                top: isHorizontal ? '0px' : `${currentPos}px`,
                width: isHorizontal ? '1px' : '100%',
                height: isHorizontal ? '100%' : '1px',
            }}>
                <div style={{
                    position: 'absolute',
                    left: isHorizontal ? '0' : 'auto',
                    right: isHorizontal ? 'auto' : '0',
                    top: isHorizontal ? 'auto' : '0',
                    bottom: isHorizontal ? '0' : 'auto',
                    width: isHorizontal ? '1px' : (mainTick ? '10px' : '5px'),
                    height: isHorizontal ? (mainTick ? '10px' : '5px') : '1px',
                    backgroundColor: '#ccc',
                }}/>
                {mainTick && (
                    <span style={{
                        position: 'absolute',
                        left: isHorizontal ? '2px' : 'auto',
                        right: isHorizontal ? 'auto' : '2px',
                        top: isHorizontal ? '0px' : '-8px',
                        fontSize: '10px',
                        color: '#888',
                        transform: isHorizontal ? '' : 'rotate(90deg)',
                        transformOrigin: 'top right',
                    }}>
                        {positionValue}
                    </span>
                )}
            </div>
        );
    }
    return markings;
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
        cursor: orientation === 'horizontal' ? 'row-resize' : 'col-resize',
      }}
      onMouseDown={handleMouseDown}
    >
      {renderMarkings()}
    </div>
  );
};
