'use client';
import React from 'react';
import { useEditorStore, Layer } from '@/canvas/store/useEditorStore';
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

// Individual Draggable Layer Item
function SortableLayerItem({ layer }: { layer: Layer }) {
  const { setSelected, toggleVisibility, lockLayer, unlockLayer, selectedId } = useEditorStore();
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
      className={`p-2 mb-1 border border-gray-300 rounded cursor-grab active:cursor-grabbing flex justify-between items-center ${
        selectedId === layer.id ? 'bg-blue-100 border-blue-400' : 'bg-white'
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
            layer.locked ? unlockLayer(layer.id) : lockLayer(layer.id);
          }}
        >
          {layer.locked ? '🔒' : '🔓'}
        </Button>
      </div>
    </li>
  );
}


// Main Layers Panel Component
export default function LayersPanel() {
  const { layers, reorderLayers } = useEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
        const oldIndex = layers.findIndex((l) => l.id === active.id);
        const newIndex = layers.findIndex((l) => l.id === over.id);
        if (reorderLayers) {
            reorderLayers(oldIndex, newIndex);
        }
    }
  }

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