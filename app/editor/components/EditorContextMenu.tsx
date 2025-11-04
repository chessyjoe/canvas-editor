'use client';

import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { useEditorStore } from '@/canvas/store/useEditorStore';

interface EditorContextMenuProps {
  children: React.ReactNode;
}

export function EditorContextMenu({ children }: EditorContextMenuProps) {
  const {
    copyLayer,
    pasteLayer,
    duplicateLayer,
    deleteSelected,
    selectedId,
    layers,
    lockLayer,
    unlockLayer,
    clipboard,
    openProperties,
  } = useEditorStore();

  const selectedLayer = layers.find((l) => l.id === selectedId);

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={copyLayer} disabled={!selectedId}>
          Copy
        </ContextMenuItem>
        <ContextMenuItem onClick={pasteLayer} disabled={!clipboard}>
          Paste
        </ContextMenuItem>
        <ContextMenuItem onClick={duplicateLayer} disabled={!selectedId}>
          Duplicate
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={openProperties} disabled={!selectedId}>
          Properties
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => {
            if (!selectedLayer) return;
            if (selectedLayer.locked) {
              unlockLayer(selectedLayer.id);
            } else {
              lockLayer(selectedLayer.id);
            }
          }}
          disabled={!selectedId}
        >
          {selectedLayer?.locked ? 'Unlock' : 'Lock'}
        </ContextMenuItem>
        <ContextMenuItem onClick={deleteSelected} disabled={!selectedId}>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
