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

export type ViewId = 'layers' | 'properties' | 'canvas' | 'ai' | 'templates' | 'toolbar' | 'export';

const TITLE_MAP: Record<ViewId, string> = {
  layers: 'Layers',
  properties: 'Properties',
  canvas: 'Canvas',
  ai: 'AI Assistant',
  templates: 'Templates',
  toolbar: 'Toolbar',
  export: 'Export',
};

interface EditorLayoutProps {
  currentNode: MosaicNode<ViewId> | null;
  setCurrentNode: (node: MosaicNode<ViewId> | null) => void;
}

const EditorLayout = ({ currentNode, setCurrentNode }: EditorLayoutProps) => {
  const { scale, setZoom, setStagePos } = useEditorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key) {
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
  }, [scale, setZoom, setStagePos]);

  const renderTile = (id: ViewId, path: any) => (
    <MosaicWindow<ViewId> key={id} path={path} createNode={() => 'canvas'} title={TITLE_MAP[id]}>
      {id === 'layers' && <LayersPanel />}
      {id === 'properties' && <PropertiesPanel />}
      {id === 'canvas' && <CanvasArea />}
      {id === 'ai' && <AIAssistantPanel />}
      {id === 'templates' && <TemplateSelectorPanel />}
      {id === 'toolbar' && <CanvasToolbar />}
      {id === 'export' && <ExportPanel />}
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
