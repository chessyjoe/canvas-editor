'use client';
import React from 'react';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import PanelCard from '@/app/editor/components/ui/PanelCard';
import { Button } from '@/app/editor/components/ui/button';

export default function HistoryPanel() {
  const { history, historyIndex, setHistoryIndex } = useEditorStore();

  return (
    <PanelCard title="History">
      <div style={{ padding: '8px', display: 'flex', flexDirection: 'column-reverse', gap: '4px' }}>
        {history.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center' }}>No history yet.</p>
        ) : (
          history.map((action, index) => (
            <Button
              key={index}
              onClick={() => setHistoryIndex(index)}
              variant={historyIndex === index ? 'secondary' : 'outline'}
              size="sm"
            >
              {action.type}
            </Button>
          ))
        )}
      </div>
    </PanelCard>
  );
}
