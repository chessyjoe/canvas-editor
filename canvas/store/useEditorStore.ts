'use client';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { EditorMode } from './types';

// The state is designed to be serializable.
// This means it can be easily saved to JSON and restored later.
// All properties are primitive types or plain objects.

export type LayerType = 'text' | 'image' | 'rect';

export interface BaseLayer {
  id: string;
  type: LayerType;
  x: number;
  y: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  locked?: boolean;
  visible?: boolean;
  groupId?: string;
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
}

export interface RectLayer extends BaseLayer {
  type: 'rect';
  width: number;
  height: number;
  fill: string;
}

export interface ImageLayer extends BaseLayer {
  type: 'image';
  width: number;
  height: number;
  src: string;
}

export type Layer = TextLayer | RectLayer | ImageLayer;

export type HistoryAction =
  | { type: 'ADD_LAYER'; payload: Layer }
  | { type: 'DELETE_LAYER'; payload: { layer: Layer; index: number } }
  | { type: 'UPDATE_LAYER'; payload: { id: string; changes: Partial<Layer>; previousChanges: Partial<Layer> } }
  | { type: 'REORDER_LAYERS'; payload: { oldIndex: number; newIndex: number } };

export interface EditorState {
  width: number;
  height: number;
  background: string;
  layers: Layer[];
  selectedIds: string[];
  mode: EditorMode;
  previousMode: EditorMode | null;
  isResizing: boolean;
  scale: number;
  stagePos: { x: number; y: number };
  canvasContainer: { width: number; height: number };

  // Zoom & Pan
  setZoom: (newZoom: number) => void;
  setCanvasContainer: (size: { width: number; height: number }) => void;
  setStagePos: (newPos: { x: number; y: number }) => void;

  // Selection & manipulation
  setSelecteds: (ids: string[]) => void;
  addToSelection: (id: string) => void;
  removeFromSelection: (id: string) => void;
  setMode: (mode: EditorMode) => void;
  setPreviousMode: (mode: EditorMode | null) => void;
  setIsResizing: (isResizing: boolean) => void;
  selectAll: () => void;
  deleteSelected: () => void;
  bringForward: () => void;
  sendBackward: () => void;

  // Layer management
  addText: () => void;
  addRect: () => void;
  addImage: (src: string) => void;
  updateLayer: (id: string, changes: Partial<Layer>) => void;
  lockLayer: (id: string) => void;
  unlockLayer: (id: string) => void;
  isLocked: (id: string) => boolean;
  toggleVisibility: (id: string) => void;
  reorderLayers: (oldIndex: number, newIndex: number) => void;
  groupSelection: () => void;
  ungroupSelection: () => void;

  // History
  history: HistoryAction[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  setHistoryIndex: (index: number) => void;
}

const recordAction = (set: any, get: any) => (action: HistoryAction) => {
  const state = get();
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(action);

  if (newHistory.length > 100) {
    newHistory.shift();
  }

  set({
    history: newHistory,
    historyIndex: newHistory.length - 1,
  });
};

export const useEditorStore = create<EditorState>((set, get) => {
  const addAction = recordAction(set, get);

  return {
    width: 800,
    height: 600,
    background: '#ffffff',
    layers: [],
    history: [],
    historyIndex: -1,
    selectedIds: [],
    mode: EditorMode.SELECT,
    previousMode: null,
    isResizing: false,
    scale: 1,
    stagePos: { x: 0, y: 0 },
    canvasContainer: { width: 0, height: 0 },

    setZoom: (newZoom) => set({ scale: newZoom }),
    setStagePos: (newPos) => set({ stagePos: newPos }),
    setCanvasContainer: (size) => set({ canvasContainer: size }),

    setSelecteds: (ids: string[]) => set({ selectedIds: ids }),
    addToSelection: (id: string) => set((state) => ({ selectedIds: [...state.selectedIds, id] })),
    removeFromSelection: (id: string) => set((state) => ({ selectedIds: state.selectedIds.filter((i) => i !== id) })),
    setMode: (mode: EditorMode) => set({ mode }),
    setPreviousMode: (mode: EditorMode | null) => set({ previousMode: mode }),
    setIsResizing: (isResizing: boolean) => set({ isResizing }),
    selectAll: () => set((state) => ({ selectedIds: state.layers.map((l) => l.id) })),

    deleteSelected: () => {
      const ids = get().selectedIds;
      if (ids.length === 0) return;

      const layers = get().layers;
      const layersToDelete = layers.filter((l) => ids.includes(l.id));

      if (layersToDelete.length === 1) {
        const layer = layersToDelete[0];
        const index = layers.findIndex((l) => l.id === layer.id);
        addAction({ type: 'DELETE_LAYER', payload: { layer, index } });
      }

      set((state) => ({
        layers: state.layers.filter((l) => !ids.includes(l.id)),
        selectedIds: [],
      }));
    },

    bringForward: () => {
      const { layers, selectedIds } = get();
      const selectedLayers = selectedIds.map((id) => layers.find((l) => l.id === id)).filter(Boolean) as Layer[];
      if (selectedLayers.length === 0) return;

      const indices = selectedLayers.map((l) => layers.indexOf(l));
      const maxIndex = Math.max(...indices);
      if (maxIndex === layers.length - 1) return;

      const newLayers = [...layers];
      selectedLayers.forEach((layer) => {
        const index = newLayers.indexOf(layer);
        newLayers.splice(index, 1);
        newLayers.splice(index + 1, 0, layer);
      });
      set({ layers: newLayers });
    },

    sendBackward: () => {
      const { layers, selectedIds } = get();
      const selectedLayers = selectedIds.map((id) => layers.find((l) => l.id === id)).filter(Boolean) as Layer[];
      if (selectedLayers.length === 0) return;

      const indices = selectedLayers.map((l) => layers.indexOf(l));
      const minIndex = Math.min(...indices);
      if (minIndex === 0) return;

      const newLayers = [...layers];
      selectedLayers.forEach((layer) => {
        const index = newLayers.indexOf(layer);
        newLayers.splice(index, 1);
        newLayers.splice(index - 1, 0, layer);
      });
      set({ layers: newLayers });
    },

    addText: () => {
      const newLayer: TextLayer = {
        id: uuidv4(),
        type: 'text',
        x: 100,
        y: 100,
        text: 'New Text',
        fontSize: 24,
        fontFamily: 'Arial',
        fill: '#000000',
        locked: false,
        visible: true,
      };
      addAction({ type: 'ADD_LAYER', payload: newLayer });
      set((state) => ({
        layers: [...state.layers, newLayer],
      }));
    },

    addRect: () => {
      const newLayer: RectLayer = {
        id: uuidv4(),
        type: 'rect',
        x: 150,
        y: 150,
        width: 100,
        height: 80,
        fill: '#007bff',
        locked: false,
        visible: true,
      };
      addAction({ type: 'ADD_LAYER', payload: newLayer });
      set((state) => ({
        layers: [...state.layers, newLayer],
      }));
    },

    addImage: (src: string) => {
      const newLayer: ImageLayer = {
        id: uuidv4(),
        type: 'image',
        x: 200,
        y: 200,
        width: 200,
        height: 200,
        src,
        locked: false,
        visible: true,
      };
      addAction({ type: 'ADD_LAYER', payload: newLayer });
      set((state) => ({
        layers: [...state.layers, newLayer],
      }));
    },

    updateLayer: (id: string, changes: Partial<Layer>) => {
      const layer = get().layers.find((l) => l.id === id);
      if (layer) {
        const previousChanges: Partial<Layer> = {};
        for (const key in changes) {
          (previousChanges as any)[key] = (layer as any)[key];
        }
        addAction({ type: 'UPDATE_LAYER', payload: { id, changes, previousChanges } });
        set((state) => ({
          layers: state.layers.map((l) => (l.id === id ? { ...l, ...changes } : l)),
        }));
      }
    },

    lockLayer: (id: string) => {
      const layer = get().layers.find((l) => l.id === id);
      if (layer) {
        addAction({
          type: 'UPDATE_LAYER',
          payload: { id, changes: { locked: true }, previousChanges: { locked: layer.locked } },
        });
        set((state) => ({
          layers: state.layers.map((l) => (l.id === id ? { ...l, locked: true } : l)),
        }));
      }
    },

    unlockLayer: (id: string) => {
      const layer = get().layers.find((l) => l.id === id);
      if (layer) {
        addAction({
          type: 'UPDATE_LAYER',
          payload: { id, changes: { locked: false }, previousChanges: { locked: layer.locked } },
        });
        set((state) => ({
          layers: state.layers.map((l) => (l.id === id ? { ...l, locked: false } : l)),
        }));
      }
    },

    isLocked: (id: string) => {
      const layer = get().layers.find((l) => l.id === id);
      return !!layer?.locked;
    },

    toggleVisibility: (id: string) => {
      const layer = get().layers.find((l) => l.id === id);
      if (layer) {
        addAction({
          type: 'UPDATE_LAYER',
          payload: { id, changes: { visible: !layer.visible }, previousChanges: { visible: layer.visible } },
        });
        set((state) => ({
          layers: state.layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)),
        }));
      }
    },

    reorderLayers: (oldIndex: number, newIndex: number) => {
      addAction({ type: 'REORDER_LAYERS', payload: { oldIndex, newIndex } });
      set((state) => {
        const layers = [...state.layers];
        const [movedLayer] = layers.splice(oldIndex, 1);
        layers.splice(newIndex, 0, movedLayer);
        return { layers };
      });
    },

    groupSelection: () => {
      const { selectedIds, layers } = get();
      if (selectedIds.length < 2) return;
      const groupId = uuidv4();
      set((state) => ({
        layers: state.layers.map((layer) =>
          selectedIds.includes(layer.id) ? { ...layer, groupId } : layer
        ),
      }));
    },

    ungroupSelection: () => {
      const { selectedIds, layers } = get();
      if (selectedIds.length === 0) return;
      const groupIds = new Set(
        layers
          .filter((layer) => selectedIds.includes(layer.id) && layer.groupId)
          .map((layer) => layer.groupId)
      );
      if (groupIds.size === 0) return;

      set((state) => ({
        layers: state.layers.map((layer) =>
          layer.groupId && groupIds.has(layer.groupId) ? { ...layer, groupId: undefined } : layer
        ),
      }));
    },

    undo: () => {
      const { history, historyIndex, layers } = get();
      if (historyIndex < 0) return;

      const action = history[historyIndex];
      let newLayers = [...layers];

      switch (action.type) {
        case 'ADD_LAYER':
          newLayers = newLayers.filter((l) => l.id !== action.payload.id);
          break;
        case 'DELETE_LAYER':
          newLayers.splice(action.payload.index, 0, action.payload.layer);
          break;
        case 'UPDATE_LAYER':
          newLayers = newLayers.map((l) =>
            l.id === action.payload.id ? { ...l, ...action.payload.previousChanges } : l
          );
          break;
        case 'REORDER_LAYERS':
          const [movedLayer] = newLayers.splice(action.payload.newIndex, 1);
          newLayers.splice(action.payload.oldIndex, 0, movedLayer);
          break;
      }
      set({ layers: newLayers, historyIndex: historyIndex - 1 });
    },

    redo: () => {
      const { history, historyIndex, layers } = get();
      if (historyIndex >= history.length - 1) return;

      const newHistoryIndex = historyIndex + 1;
      const action = history[newHistoryIndex];
      let newLayers = [...layers];

      switch (action.type) {
        case 'ADD_LAYER':
          newLayers.push(action.payload);
          break;
        case 'DELETE_LAYER':
          newLayers = newLayers.filter((l) => l.id !== action.payload.layer.id);
          break;
        case 'UPDATE_LAYER':
          newLayers = newLayers.map((l) =>
            l.id === action.payload.id ? { ...l, ...action.payload.changes } : l
          );
          break;
        case 'REORDER_LAYERS':
          const [movedLayer] = newLayers.splice(action.payload.oldIndex, 1);
          newLayers.splice(action.payload.newIndex, 0, movedLayer);
          break;
      }
      set({ layers: newLayers, historyIndex: newHistoryIndex });
    },

    setHistoryIndex: (index: number) => {
      const { history } = get();
      if (index < -1 || index >= history.length) return;

      let layers: Layer[] = [];
      for (let i = 0; i <= index; i++) {
        const action = history[i];
        switch (action.type) {
          case 'ADD_LAYER':
            layers.push(action.payload);
            break;
          case 'DELETE_LAYER':
            layers = layers.filter((l) => l.id !== action.payload.layer.id);
            break;
          case 'UPDATE_LAYER':
            layers = layers.map((l) =>
              l.id === action.payload.id ? { ...l, ...action.payload.changes } : l
            );
            break;
          case 'REORDER_LAYERS':
            const [movedLayer] = layers.splice(action.payload.oldIndex, 1);
            layers.splice(action.payload.newIndex, 0, movedLayer);
            break;
        }
      }
      set({ layers, historyIndex: index });
    },
  };
});
