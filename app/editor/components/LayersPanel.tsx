'use client';
import React from 'react';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { Button } from '@/app/editor/components/ui/button';

export default function LayersPanel() {
  const { layers, selectedId, setSelected, toggleVisibility, lockLayer, unlockLayer } = useEditorStore();

  return (
    <div className="p-3">
      <h3 className="mb-2.5">Layers</h3>
      <ul className="list-none p-0">
        {layers.map((layer) => (
          <li
            key={layer.id}
            onClick={() => setSelected(layer.id)}
            className={`p-2 mb-1 border border-gray-300 rounded cursor-pointer flex justify-between items-center ${
              selectedId === layer.id ? 'bg-gray-200' : ''
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
        ))}
      </ul>
    </div>
  );
}
