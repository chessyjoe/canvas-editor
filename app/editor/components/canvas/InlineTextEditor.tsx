'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { TextLayer } from '@/canvas/store/useEditorStore';

export function InlineTextEditor() {
  const { editingLayerId, layers, updateLayer, setEditingLayerId, scale, stagePos } = useEditorStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const layer = layers.find((l) => l.id === editingLayerId) as TextLayer | undefined;

  const [text, setText] = useState(layer?.text || '');

  useEffect(() => {
    if (layer) {
      setText(layer.text);
    }
  }, [layer]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  if (!layer) return null;

  const handleBlur = () => {
    if (layer) {
      updateLayer(layer.id, { text });
      setEditingLayerId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setText(layer.text);
      handleBlur();
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      style={{
        position: 'absolute',
        left: `${layer.x * scale + stagePos.x}px`,
        top: `${layer.y * scale + stagePos.y}px`,
        width: `${(layer.width || 100) * scale}px`,
        height: `${(layer.height || 20) * scale}px`,
        fontSize: `${layer.fontSize * scale}px`,
        fontFamily: layer.fontFamily,
        color: layer.fill,
        lineHeight: layer.lineHeight,
        letterSpacing: `${layer.letterSpacing * scale}px`,
        textAlign: layer.textAlign,
        background: 'none',
        border: '1px solid #007bff',
        outline: 'none',
        resize: 'none',
        overflow: 'hidden',
        padding: `${10 * scale}px`,
        zIndex: 1000,
      }}
      autoFocus
    />
  );
}
