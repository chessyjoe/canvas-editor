'use client';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type LayerType = 'text' | 'image' | 'rect';

export interface BaseLayer {
  id: string;
  type: LayerType;
  x: number;
  y: number;
  locked?: boolean;
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
  selectedId: string | null;

  // Selection & manipulation
  setSelected: (id: string | null) => void;
  updateSelected: (changes: Partial<Layer>) => void;
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
}

export const useEditorStore = create<EditorState>((set, get) => ({
  width: 800,
  height: 600,
  background: '#ffffff',
  layers: [],
  selectedId: null,

  setSelected: (id) => set({ selectedId: id }),

  updateSelected: (changes) => {
    const id = get().selectedId;
    if (!id) return;
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, ...changes } : l)),
    }));
  },

  deleteSelected: () => {
    const id = get().selectedId;
    if (!id) return;
    set((state) => ({
      layers: state.layers.filter((l) => l.id !== id),
      selectedId: null,
    }));
  },

  bringForward: () => {
    const id = get().selectedId;
    if (!id) return;
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
    const id = get().selectedId;
    if (!id) return;
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
        } as RectLayer,
      ],
    })),

  addImage: (src) =>
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
        } as ImageLayer,
      ],
    })),

  updateLayer: (id, changes) =>
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, ...changes } : l)),
    })),

  lockLayer: (id) =>
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, locked: true } : l)),
    })),

  unlockLayer: (id) =>
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, locked: false } : l)),
    })),

  isLocked: (id) => {
    const layer = get().layers.find((l) => l.id === id);
    return !!layer?.locked;
  },
}));
