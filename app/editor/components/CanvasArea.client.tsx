'use client';

import React, { useRef } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { KonvaImage } from './canvas/KonvaImage';
import { KonvaText } from './canvas/KonvaText';
import { TransformerManager } from './canvas/TransformerManager';
import { ImageLayer, TextLayer } from '@/canvas/store/useEditorStore';

export default function CanvasArea() {
  const { width, height, background, layers, setSelected } = useEditorStore();
  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  return (
    <div style={{ border: '1px solid #ddd', background }}>
      <Stage
        width={width}
        height={height}
        ref={stageRef}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) setSelected(null);
        }}
      >
        <Layer>
          <Rect x={0} y={0} width={width} height={height} fill={background} listening={false} />
          {layers.map((layer) => {
            if (!layer.visible) return null;
            if (layer.type === 'image') return <KonvaImage key={layer.id} layer={layer as ImageLayer} />;
            if (layer.type === 'text') return <KonvaText key={layer.id} layer={layer as TextLayer} />;
            if (layer.type === 'rect')
              return (
                <Rect
                  key={layer.id}
                  id={layer.id}
                  x={layer.x}
                  y={layer.y}
                  width={layer.width}
                  height={layer.height}
                  fill={layer.fill}
                  draggable={!layer.locked}
                  opacity={layer.locked ? 0.5 : 1}
                  onClick={() => setSelected(layer.id)}
                  onDragEnd={(e) =>
                    useEditorStore.getState().updateLayer(layer.id, { x: e.target.x(), y: e.target.y() })
                  }
                />
              );
          })}
          <TransformerManager stageRef={stageRef} trRef={trRef} />
        </Layer>
      </Stage>
    </div>
  );
}
