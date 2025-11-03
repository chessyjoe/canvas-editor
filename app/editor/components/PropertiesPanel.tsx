'use client';
import React from 'react';
import { useEditorStore } from '@/canvas/store/useEditorStore';

export default function PropertiesPanel() {
  const {
    selectedId,
    layers,
    updateSelected,
    deleteSelected,
    bringForward,
    sendBackward,
  } = useEditorStore();
  const layer = layers.find((l) => l.id === selectedId);

  if (!layer)
    return (
      <div style={{ padding: 16, color: '#888' }}>
        <p>No selection</p>
      </div>
    );

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <h3 style={{ marginBottom: 6 }}>Properties</h3>

      {layer.type === 'text' && (
        <>
          <label>
            Text:
            <input
              value={layer.text}
              onChange={(e) => updateSelected({ text: e.target.value })}
              style={{ width: '100%', marginTop: 4 }}
            />
          </label>

          <label>
            Font Size:
            <input
              type="number"
              value={layer.fontSize}
              onChange={(e) => updateSelected({ fontSize: parseInt(e.target.value) || 12 })}
              style={{ width: '100%', marginTop: 4 }}
            />
          </label>
        </>
      )}

      <label>
        Color:
        <input
          type="color"
          value={layer.fill || '#000000'}
          onChange={(e) => updateSelected({ fill: e.target.value })}
          style={{ width: '100%', marginTop: 4 }}
        />
      </label>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={sendBackward}>⬇ Send Backward</button>
        <button onClick={bringForward}>⬆ Bring Forward</button>
      </div>

      <button
        onClick={deleteSelected}
        style={{ background: '#ff5555', color: '#fff', padding: 8, border: 'none', marginTop: 10 }}
      >
        Delete
      </button>
    </div>
  );
}
