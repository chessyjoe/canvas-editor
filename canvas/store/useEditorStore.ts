'use client';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// The state is designed to be serializable.
// This means it can be easily saved to JSON and restored later.
// All properties are primitive types or plain objects.

export type LayerType = 'text' | 'image' | 'rect';

export interface BaseLayer {
  id: string;
  type: LayerType;
  x: number;
  y: number;
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

export interface EditorState {
  width: number;
  height: number;
  background: string;
  layers: Layer[];
  selectedIds: string[];

  // Selection & manipulation
  setSelected: (id: string | null) => void;
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
  applyTemplate: (template: any) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  width: 800,
  height: 600,
  background: '#ffffff',
  layers: [],
  selectedIds: [],

  setSelected: (id: string | null) => {
    if (id === null) {
      set({ selectedIds: [] });
      return;
    }

    const { layers } = get();
    const clickedLayer = layers.find((l) => l.id === id);

    if (clickedLayer?.groupId) {
      const groupIds = layers.filter((l) => l.groupId === clickedLayer.groupId).map((l) => l.id);
      set({ selectedIds: groupIds });
    } else {
      set({ selectedIds: [id] });
    }
  },

  // Note: We use `get()` inside actions to access the latest state
  // without subscribing to changes. This is a performance optimization
  // that prevents components from re-rendering unnecessarily when they
  // call these actions.
  deleteSelected: () => {
    const ids = get().selectedIds;
    if (!ids.length) return;
    set((state) => ({
      layers: state.layers.filter((l) => !ids.includes(l.id)),
      selectedIds: [],
    }));
  },

  bringForward: () => {
    const ids = get().selectedIds;
    if (ids.length !== 1) return;
    const id = ids[0];
    set((state) => {
      const idx = state.layers.findIndex((l) => l.id === id);
      if (idx === -1 || idx === state.layers.length - 1) return {};
      const layers = [...state.layers];
      const [item] = layers.splice(idx, 1);
      layers.splice(idx + 1, 0, item);
      return { layers };
    });
  },

  sendBackward: () => {
    const ids = get().selectedIds;
    if (ids.length !== 1) return;
    const id = ids[0];
    set((state) => {
      const idx = state.layers.findIndex((l) => l.id === id);
      if (idx <= 0) return {};
      const layers = [...state.layers];
      const [item] = layers.splice(idx, 1);
      layers.splice(idx - 1, 0, item);
      return { layers };
    });
  },

  addText: () =>
    set((state) => ({
      layers: [
        ...state.layers,
        {
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
        } as TextLayer,
      ],
    })),

  addRect: () =>
    set((state) => ({
      layers: [
        ...state.layers,
        {
          id: uuidv4(),
          type: 'rect',
          x: 150,
          y: 150,
          width: 100,
          height: 80,
          fill: '#007bff',
          locked: false,
          visible: true,
        } as RectLayer,
      ],
    })),

  addImage: (src: string) =>
    set((state) => ({
      layers: [
        ...state.layers,
        {
          id: uuidv4(),
          type: 'image',
          x: 200,
          y: 200,
          width: 200,
          height: 200,
          src,
          locked: false,
          visible: true,
        } as ImageLayer,
      ],
    })),

  updateLayer: (id: string, changes: Partial<Layer>) => {
    const layers = get().layers.map((l) => (l.id === id ? { ...l, ...changes } : l));
    set({ layers: layers as Layer[] });
  },

  lockLayer: (id:string) =>
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, locked: true } : l)),
    })),

  unlockLayer: (id: string) =>
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, locked: false } : l)),
    })),

  isLocked: (id: string) => {
    const layer = get().layers.find((l) => l.id === id);
    return !!layer?.locked;
  },

  toggleVisibility: (id: string) =>
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)),
    })),

    reorderLayers: (oldIndex: number, newIndex: number) => {
        set((state) => {
          if (oldIndex < 0 || oldIndex >= state.layers.length || newIndex < 0 || newIndex >= state.layers.length) {
            return {};
          }
          const layers = [...state.layers];
          const [movedLayer] = layers.splice(oldIndex, 1);
          layers.splice(newIndex, 0, movedLayer);
          return { layers };
        });
      },

  applyTemplate: (template: any) => {
    const groupId = uuidv4();
    const newLayers = template.layers.map((layer: Omit<Layer, 'id'>) => ({
      ...layer,
      id: uuidv4(),
      groupId,
    }));
    set((state) => ({
      layers: [...state.layers, ...newLayers],
    }));
  },
}));
