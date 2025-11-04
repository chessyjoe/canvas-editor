'use client';

import React, { useRef } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { KonvaImage } from './canvas/KonvaImage';
import { KonvaText } from './canvas/KonvaText';
import { KonvaRect } from './canvas/KonvaRect';
import { TransformerManager } from './canvas/TransformerManager';
import { ImageLayer, TextLayer, RectLayer } from '@/canvas/store/useEditorStore';
import { EditorContextMenu } from './EditorContextMenu';

export default function CanvasArea() {
  const { width, height, background, layers, setSelected } = useEditorStore();
  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  return (
    <div style={{ border: '1px solid #ddd', background }}>
      <EditorContextMenu>
        <Stage
          width={width}
          height={height}
          ref={stageRef}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) setSelected(null);
          }}
          onContextMenu={(e) => e.evt.preventDefault()}
        >
          <Layer>
            <Rect x={0} y={0} width={width} height={height} fill={background} listening={false} />
            {layers.map((layer) => {
              if (layer.type === 'image') return <KonvaImage key={layer.id} layer={layer as ImageLayer} />;
              if (layer.type === 'text') return <KonvaText key={layer.id} layer={layer as TextLayer} />;
              if (layer.type === 'rect') return <KonvaRect key={layer.id} layer={layer as RectLayer} />;
            })}
            <TransformerManager stageRef={stageRef} trRef={trRef} />
          </Layer>
        </Stage>
      </EditorContextMenu>
    </div>
  );
}
