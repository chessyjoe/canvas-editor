'use client';
import React from 'react';
import { Mosaic, MosaicNode, MosaicWindow } from 'react-mosaic-component';
import 'react-mosaic-component/react-mosaic-component.css';
import LayersPanel from './LayersPanel';
import PropertiesPanel from './PropertiesPanel';
import CanvasArea from './CanvasArea';
import AIAssistantPanel from './AIAssistantPanel';
import TemplateSelectorPanel from './TemplateSelectorPanel';
import CanvasToolbar from './CanvasToolbar';
import ExportPanel from './ExportPanel';

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
  return (
    <Mosaic<ViewId>
      renderTile={(id, path) => (
        <MosaicWindow<ViewId> path={path} createNode={() => 'canvas'} title={TITLE_MAP[id]}>
          {id === 'layers' && <LayersPanel />}
          {id === 'properties' && <PropertiesPanel />}
          {id === 'canvas' && <CanvasArea />}
          {id === 'ai' && <AIAssistantPanel />}
          {id === 'templates' && <TemplateSelectorPanel />}
          {id === 'toolbar' && <CanvasToolbar />}
          {id === 'export' && <ExportPanel />}
        </MosaicWindow>
      )}
      value={currentNode}
      onChange={setCurrentNode}
    />
  );
};

export default EditorLayout;
