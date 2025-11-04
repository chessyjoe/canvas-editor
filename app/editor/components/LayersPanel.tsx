'use client';
import React, { useState } from 'react';
import { useEditorStore, Layer } from '@/canvas/store/useEditorStore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function LayerItem({ layer, index }: { layer: Layer, index: number }) {
    const { selectedIds, setSelected, addToSelection, removeFromSelection, toggleVisibility, lockLayer, unlockLayer, renameLayer } = useEditorStore();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(layer.name);

    const handleLayerClick = (e: React.MouseEvent, id: string) => {
        if (e.shiftKey) {
            addToSelection(id);
        } else if (e.ctrlKey || e.metaKey) {
            if (selectedIds.includes(id)) {
                removeFromSelection(id);
            } else {
                addToSelection(id);
            }
        } else {
            setSelected(id);
        }
    }

    const handleRename = () => {
        renameLayer(layer.id, name);
        setIsEditing(false);
    }

    return (
        <Draggable draggableId={layer.id} index={index}>
            {(provided) => (
                <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={(e) => handleLayerClick(e, layer.id)}
                    onDoubleClick={() => setIsEditing(true)}
                    className={`p-2 mb-1 border border-gray-300 rounded cursor-pointer flex justify-between items-center ${
                        selectedIds.includes(layer.id) ? 'bg-gray-200' : ''
                    }`}
                >
                    {isEditing ? (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={handleRename}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleRename();
                                }
                            }}
                            autoFocus
                        />
                    ) : (
                        <span>{layer.name}</span>
                    )}
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleVisibility(layer.id);
                            }}
                        >
                            {layer.visible ? '👁️' : '🙈'}
                        </button>
                        <button
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
                        </button>
                    </div>
                </li>
            )}
        </Draggable>
    )
}

export default function LayersPanel() {
  const { layers, duplicateSelected, mergeSelected, reorderLayers } = useEditorStore();

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(layers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    reorderLayers(items);
  }

  return (
    <div className="p-3">
      <h3 className="mb-2.5">Layers</h3>
      <div className="flex gap-2 mb-2">
        <button onClick={duplicateSelected}>Duplicate</button>
        <button onClick={mergeSelected}>Merge</button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="layers">
            {(provided) => (
                <ul className="list-none p-0" {...provided.droppableProps} ref={provided.innerRef}>
                    {layers.map((layer, index) => (
                        <LayerItem key={layer.id} layer={layer} index={index} />
                    ))}
                    {provided.placeholder}
                </ul>
            )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
