'use client';
import React from 'react';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { Button } from '@/app/editor/components/ui/button';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Layer } from '@/canvas/store/useEditorStore';

interface SortableLayerItemProps {
  layer: Layer;
}

const SortableLayerItem = ({ layer }: SortableLayerItemProps) => {
  const { setSelected, selectedId, toggleVisibility, lockLayer, unlockLayer } = useEditorStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: layer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => setSelected(layer.id)}
      className={`p-2 mb-1 border rounded cursor-pointer flex justify-between items-center ${
        selectedId === layer.id
          ? 'bg-blue-100 border-blue-500'
          : 'border-gray-300'
      }`}
    >
      <span>{layer.type}</span>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            toggleVisibility(layer.id);
          }}
        >
          {layer.visible ? '👁️' : '🙈'}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            if (layer.locked) {
              unlockLayer(layer.id);
            } else {
              lockLayer(layer.id);
            }
          }}
        >
          {layer.locked ? '🔒' : '🔓'}
        </Button>
      </div>
    </li>
  );
};

export default function LayersPanel() {
  const { layers, moveLayer } = useEditorStore();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = layers.findIndex((l) => l.id === active.id);
      const newIndex = layers.findIndex((l) => l.id === over.id);
      moveLayer(oldIndex, newIndex);
    }
  };

  return (
    <div className="p-3">
      <h3 className="mb-2.5">Layers</h3>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={layers.map(l => l.id)} strategy={verticalListSortingStrategy}>
          <ul className="list-none p-0">
            {layers.map((layer) => (
              <SortableLayerItem key={layer.id} layer={layer} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
