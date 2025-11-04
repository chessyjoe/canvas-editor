'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Image as KImage, Text as KText, Transformer, Ellipse, Line, RegularPolygon, Group, Path } from 'react-konva';
import useImage from 'use-image';
import { useEditorStore, Layer as LayerType, PathLayer } from '@/canvas/store/useEditorStore';
import { v4 as uuidv4 } from 'uuid';

function KonvaImage({ layer }: any) {
  const [img] = useImage(layer.src, 'anonymous');
  const { updateLayer, setSelected, addToSelection } = useEditorStore.getState();

  if (!img) return null;

  return (
    <KImage
      image={img}
      id={layer.id}
      name={layer.name}
      x={layer.x}
      y={layer.y}
      width={layer.width}
      height={layer.height}
      draggable={!layer.locked}
      opacity={layer.locked ? 0.5 : 1}
      onClick={(e) => {
        if (e.evt.shiftKey) {
            addToSelection(layer.id);
        } else {
            setSelected(layer.id);
        }
      }}
      onTap={() => setSelected(layer.id)}
      onDragEnd={(e) => updateLayer(layer.id, { x: e.target.x(), y: e.target.y() })}
      onTransformEnd={(e) => {
        const node: any = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        updateLayer(layer.id, {
          x: node.x(),
          y: node.y(),
          width: Math.max(10, node.width() * scaleX),
          height: Math.max(10, node.height() * scaleY),
        });
      }}
    />
  );
}

function KonvaText({ layer }: any) {
  const { updateLayer, setSelected, addToSelection } = useEditorStore.getState();

  return (
    <KText
      id={layer.id}
      name={layer.name}
      text={layer.text}
      x={layer.x}
      y={layer.y}
      fontSize={layer.fontSize}
      fontFamily={layer.fontFamily}
      fill={layer.fill}
      draggable={!layer.locked}
      opacity={layer.locked ? 0.5 : 1}
      onClick={(e) => {
        if (e.evt.shiftKey) {
            addToSelection(layer.id);
        } else {
            setSelected(layer.id);
        }
      }}
      onTap={() => setSelected(layer.id)}
      onDragEnd={(e) => updateLayer(layer.id, { x: e.target.x(), y: e.target.y() })}
    />
  );
}

function KonvaPath({ layer }: any) {
    const { updateLayer, setSelected, addToSelection } = useEditorStore.getState();

    return (
        <Path
            id={layer.id}
            name={layer.name}
            x={layer.x}
            y={layer.y}
            data={layer.data}
            stroke={layer.stroke}
            strokeWidth={layer.strokeWidth}
            draggable={!layer.locked}
            opacity={layer.locked ? 0.5 : 1}
            onClick={(e) => {
                if (e.evt.shiftKey) {
                    addToSelection(layer.id);
                } else {
                    setSelected(layer.id);
                }
            }}
            onTap={() => setSelected(layer.id)}
            onDragEnd={(e) => updateLayer(layer.id, { x: e.target.x(), y: e.target.y() })}
        />
    )
}

function KonvaGroup({ layer }: any) {
    const { updateLayer, setSelected, addToSelection } = useEditorStore.getState();

    return (
        <Group
            id={layer.id}
            name={layer.name}
            x={layer.x}
            y={layer.y}
            draggable={!layer.locked}
            opacity={layer.locked ? 0.5 : 1}
            onClick={(e) => {
                if (e.evt.shiftKey) {
                    addToSelection(layer.id);
                } else {
                    setSelected(layer.id);
                }
            }}
            onTap={() => setSelected(layer.id)}
            onDragEnd={(e) => updateLayer(layer.id, { x: e.target.x(), y: e.target.y() })}
        >
            {layer.layers.map((child: LayerType) => (
                <RenderLayer key={child.id} layer={child} />
            ))}
        </Group>
    )
}

function RenderLayer({ layer }: { layer: LayerType }) {
    if (!layer.visible) return null;

    switch (layer.type) {
        case 'image':
            return <KonvaImage layer={layer} />;
        case 'text':
            return <KonvaText layer={layer} />;
        case 'rect':
            return <Rect
                id={layer.id}
                name={layer.name}
                x={layer.x}
                y={layer.y}
                width={layer.width}
                height={layer.height}
                fill={layer.fill}
                draggable={!layer.locked}
                opacity={layer.locked ? 0.5 : 1}
                onClick={(e) => {
                    if (e.evt.shiftKey) {
                        useEditorStore.getState().addToSelection(layer.id);
                    } else {
                        useEditorStore.getState().setSelected(layer.id);
                    }
                }}
                onDragEnd={(e) =>
                    useEditorStore.getState().updateLayer(layer.id, { x: e.target.x(), y: e.target.y() })
                }
            />;
        case 'ellipse':
            return <Ellipse
                id={layer.id}
                name={layer.name}
                x={layer.x}
                y={layer.y}
                width={layer.width}
                height={layer.height}
                fill={layer.fill}
                draggable={!layer.locked}
                opacity={layer.locked ? 0.5 : 1}
                onClick={(e) => {
                    if (e.evt.shiftKey) {
                        useEditorStore.getState().addToSelection(layer.id);
                    } else {
                        useEditorStore.getState().setSelected(layer.id);
                    }
                }}
                onDragEnd={(e) =>
                    useEditorStore.getState().updateLayer(layer.id, { x: e.target.x(), y: e.target.y() })
                }
            />;
        case 'line':
            return <Line
                id={layer.id}
                name={layer.name}
                x={layer.x}
                y={layer.y}
                points={layer.points}
                stroke={layer.stroke}
                strokeWidth={layer.strokeWidth}
                draggable={!layer.locked}
                opacity={layer.locked ? 0.5 : 1}
                onClick={(e) => {
                    if (e.evt.shiftKey) {
                        useEditorStore.getState().addToSelection(layer.id);
                    } else {
                        useEditorStore.getState().setSelected(layer.id);
                    }
                }}
                onDragEnd={(e) =>
                    useEditorStore.getState().updateLayer(layer.id, { x: e.target.x(), y: e.target.y() })
                }
            />;
        case 'polygon':
            return <RegularPolygon
                id={layer.id}
                name={layer.name}
                x={layer.x}
                y={layer.y}
                sides={layer.sides}
                radius={layer.radius}
                fill={layer.fill}
                stroke={layer.stroke}
                strokeWidth={layer.strokeWidth}
                draggable={!layer.locked}
                opacity={layer.locked ? 0.5 : 1}
                onClick={(e) => {
                    if (e.evt.shiftKey) {
                        useEditorStore.getState().addToSelection(layer.id);
                    } else {
                        useEditorStore.getState().setSelected(layer.id);
                    }
                }}
                onDragEnd={(e) =>
                    useEditorStore.getState().updateLayer(layer.id, { x: e.target.x(), y: e.target.y() })
                }
            />
        case 'path':
            return <KonvaPath layer={layer} />;
        case 'group':
            return <KonvaGroup layer={layer} />;
        default:
            return null;
    }
}

function TransformerManager({ stageRef, trRef }: any) {
  const selectedIds = useEditorStore((s) => s.selectedIds);

  useEffect(() => {
    const stage = stageRef.current;
    const tr = trRef.current;
    if (!stage || !tr) return;

    const selectedNodes = selectedIds.map(id => stage.findOne(`#${id}`)).filter(Boolean);

    if (selectedNodes.length > 0) {
      tr.nodes(selectedNodes);
      tr.getLayer()?.batchDraw();
    } else {
      tr.nodes([]);
      tr.getLayer()?.batchDraw();
    }
  }, [selectedIds]);

  return <Transformer ref={trRef} />;
}

export default function CanvasArea() {
  const { width, height, background, layers } = useEditorStore();
  const { setSelected, clearSelection, addToSelection, addPath, updateLayer } = useEditorStore.getState();
  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const [selectionRect, setSelectionRect] = useState({ x: 0, y: 0, width: 0, height: 0, visible: false });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<PathLayer | null>(null);

  const handleMouseDown = (e: any) => {
    if (useEditorStore.getState().selectedTool === 'path') {
        setIsDrawing(true);
        const pos = e.target.getStage().getPointerPosition();
        const newPath: PathLayer = {
            id: uuidv4(),
            name: 'Path',
            type: 'path',
            x: 0,
            y: 0,
            data: `M${pos.x} ${pos.y}`,
            stroke: '#000000',
            strokeWidth: 2,
            locked: false,
            visible: true,
        };
        setCurrentPath(newPath);
    } else {
        if (e.target !== e.target.getStage()) return;
        const pos = e.target.getStage().getPointerPosition();
        setSelectionRect({ x: pos.x, y: pos.y, width: 0, height: 0, visible: true });
    }
  };

  const handleMouseMove = (e: any) => {
    if (isDrawing && currentPath) {
        const pos = e.target.getStage().getPointerPosition();
        setCurrentPath({
            ...currentPath,
            data: currentPath.data + ` L${pos.x} ${pos.y}`,
        });
    } else if (selectionRect.visible) {
        const pos = e.target.getStage().getPointerPosition();
        setSelectionRect({
            ...selectionRect,
            width: pos.x - selectionRect.x,
            height: pos.y - selectionRect.y,
        });
    }
  };

  const handleMouseUp = (e: any) => {
    if (isDrawing && currentPath) {
        addPath(currentPath);
        setIsDrawing(false);
        setCurrentPath(null);
    } else if (selectionRect.visible) {
        setSelectionRect({ ...selectionRect, visible: false });

        const shapes = stageRef.current.find('Rect, Text, Image, Ellipse, Line, RegularPolygon, Group, Path');
        const box = {
            x: selectionRect.x,
            y: selectionRect.y,
            width: selectionRect.width,
            height: selectionRect.height,
        };

        const selected = shapes.filter((shape: any) => {
            const shapeBox = shape.getClientRect();
            return (
                shapeBox.x < box.x + box.width &&
                shapeBox.x + shapeBox.width > box.x &&
                shapeBox.y < box.y + box.height &&
                shapeBox.y + shapeBox.height > box.y
            );
        });

        const selectedIds = selected.map((shape: any) => shape.id());
        if (e.evt.shiftKey) {
            selectedIds.forEach((id: string) => addToSelection(id));
        } else {
            clearSelection();
            selectedIds.forEach((id: string) => addToSelection(id));
        }
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', background }}>
      <Stage
        width={width}
        height={height}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          <Rect x={0} y={0} width={width} height={height} fill={background} listening={false} />
          {layers.map((layer) => (
            <RenderLayer key={layer.id} layer={layer} />
          ))}
          {currentPath && <KonvaPath layer={currentPath} />}
          <TransformerManager stageRef={stageRef} trRef={trRef} />
          <Rect
            x={selectionRect.x}
            y={selectionRect.y}
            width={selectionRect.width}
            height={selectionRect.height}
            fill="rgba(0, 0, 255, 0.5)"
            visible={selectionRect.visible}
          />
        </Layer>
      </Stage>
    </div>
  );
}
