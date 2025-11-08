'use client';
import React, { useEffect } from 'react';
import { Mosaic, MosaicNode, MosaicWindow } from 'react-mosaic-component';
import 'react-mosaic-component/react-mosaic-component.css';
import LayersPanel from './LayersPanel';
import PropertiesPanel from './PropertiesPanel';
import CanvasArea from './CanvasArea';
import AIAssistantPanel from './AIAssistantPanel';
import TemplateSelectorPanel from './TemplateSelectorPanel';
import CanvasToolbar from './CanvasToolbar';
import ExportPanel from './ExportPanel';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import HistoryPanel from './HistoryPanel';

export type ViewId = 'layers' | 'properties' | 'canvas' | 'ai' | 'templates' | 'toolbar' | 'export' | 'history';

const TITLE_MAP: Record<ViewId, string> = {
  layers: 'Layers',
  properties: 'Properties',
  canvas: 'Canvas',
  ai: 'AI Assistant',
  templates: 'Templates',
  toolbar: 'Toolbar',
  export: 'Export',
  history: 'History',
};

interface EditorLayoutProps {
  currentNode: MosaicNode<ViewId> | null;
  setCurrentNode: (node: MosaicNode<ViewId> | null) => void;
}

const EditorLayout = ({ currentNode, setCurrentNode }: EditorLayoutProps) => {
  const { scale, setZoom, setStagePos, undo, redo } = useEditorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            undo();
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case '+':
          case '=':
            e.preventDefault();
            setZoom(scale * 1.2);
            break;
          case '-':
            e.preventDefault();
            setZoom(scale / 1.2);
            break;
          case '0':
            e.preventDefault();
            setZoom(1);
            setStagePos({ x: 0, y: 0 });
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [scale, setZoom, setStagePos, undo, redo]);

  const renderTile = (id: ViewId, path: any) => (
    <MosaicWindow<ViewId> path={path} createNode={() => 'canvas'} title={TITLE_MAP[id]}>
      <div style={{ width: '100%', height: '100%' }}>
        {id === 'layers' && <LayersPanel />}
        {id === 'properties' && <PropertiesPanel />}
        {id === 'canvas' && <CanvasArea />}
        {id === 'ai' && <AIAssistantPanel />}
        {id === 'templates' && <TemplateSelectorPanel />}
        {id === 'toolbar' && <CanvasToolbar />}
        {id === 'export' && <ExportPanel />}
        {id === 'history' && <HistoryPanel />}
      </div>
    </MosaicWindow>
  );

  return (
    <Mosaic<ViewId>
      renderTile={renderTile}
      value={currentNode}
      onChange={setCurrentNode}
    />
  );
};

export default EditorLayout;
