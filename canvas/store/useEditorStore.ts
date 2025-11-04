'use client';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type LayerType = 'text' | 'image' | 'rect' | 'ellipse' | 'line' | 'polygon' | 'path' | 'group';

export interface BaseLayer {
  id: string;
  name: string;
  type: LayerType;
  x: number;
  y: number;
  locked?: boolean;
  visible?: boolean;
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

export interface EllipseLayer extends BaseLayer {
    type: 'ellipse';
    width: number;
    height: number;
    fill: string;
}

export interface LineLayer extends BaseLayer {
    type: 'line';
    points: number[];
    stroke: string;
    strokeWidth: number;
}

export interface PolygonLayer extends BaseLayer {
    type: 'polygon';
    points: number[];
    sides: number;
    radius: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
}

export interface PathLayer extends BaseLayer {
    type: 'path';
    data: string;
    stroke: string;
    strokeWidth: number;
}

export interface GroupLayer extends BaseLayer {
    type: 'group';
    layers: Layer[];
}

export type Layer = TextLayer | RectLayer | ImageLayer | EllipseLayer | LineLayer | PolygonLayer | PathLayer | GroupLayer;

export interface EditorState {
  width: number;
  height: number;
  background: string;
  layers: Layer[];
  selectedIds: string[];
  selectedTool: string;

  // Selection & manipulation
  setSelected: (id: string) => void;
  addToSelection: (id: string) => void;
  removeFromSelection: (id: string) => void;
  clearSelection: () => void;
  deleteSelected: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  groupSelected: () => void;
  ungroupSelected: () => void;
  setSelectedTool: (tool: string) => void;

  // Layer management
  addText: () => void;
  addRect: () => void;
  addImage: (src: string) => void;
  addEllipse: () => void;
  addLine: () => void;
  addPolygon: () => void;
  addPath: (path: PathLayer) => void;
  updateLayer: (id: string, changes: Partial<Layer>) => void;
  renameLayer: (id: string, name: string) => void;
  lockLayer: (id: string) => void;
  unlockLayer: (id: string) => void;
  isLocked: (id: string) => boolean;
  toggleVisibility: (id: string) => void;
  duplicateSelected: () => void;
  mergeSelected: () => void;
  reorderLayers: (layers: Layer[]) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  width: 800,
  height: 600,
  background: '#ffffff',
  layers: [],
  selectedIds: [],
  selectedTool: 'select',

  setSelected: (id: string) => set({ selectedIds: [id] }),
  addToSelection: (id: string) => set((state) => ({ selectedIds: [...state.selectedIds, id] })),
  removeFromSelection: (id: string) => set((state) => ({ selectedIds: state.selectedIds.filter((selectedId) => selectedId !== id) })),
  clearSelection: () => set({ selectedIds: [] }),
  setSelectedTool: (tool: string) => set({ selectedTool: tool }),

  deleteSelected: () => {
    const ids = get().selectedIds;
    if (ids.length === 0) return;
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

  groupSelected: () => {
    const ids = get().selectedIds;
    if (ids.length < 2) return;
    set((state) => {
      const selectedLayers = state.layers.filter((l) => ids.includes(l.id));
      const newGroup: GroupLayer = {
        id: uuidv4(),
        name: 'New Group',
        type: 'group',
        x: Math.min(...selectedLayers.map((l) => l.x)),
        y: Math.min(...selectedLayers.map((l) => l.y)),
        layers: selectedLayers,
        locked: false,
        visible: true,
      };
      const remainingLayers = state.layers.filter((l) => !ids.includes(l.id));
      const newLayers = [...remainingLayers, newGroup];
      return { layers: newLayers, selectedIds: [newGroup.id] };
    });
  },

  ungroupSelected: () => {
    const ids = get().selectedIds;
    if (ids.length !== 1) return;
    const group = get().layers.find(l => l.id === ids[0] && l.type === 'group') as GroupLayer;
    if (!group) return;

    set((state) => {
        const layersWithoutGroup = state.layers.filter(l => l.id !== group.id);
        const ungroupedLayers = group.layers.map(l => ({...l, x: group.x + l.x, y: group.y + l.y}));
        const newLayers = [...layersWithoutGroup, ...ungroupedLayers];
        return { layers: newLayers, selectedIds: group.layers.map(l => l.id) };
    });
  },


  addText: () =>
    set((state) => ({
      layers: [
        ...state.layers,
        {
          id: uuidv4(),
          name: 'Text',
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
          name: 'Rectangle',
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
          name: 'Image',
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

    addEllipse: () => set((state) => ({
        layers: [
            ...state.layers,
            {
                id: uuidv4(),
                name: 'Ellipse',
                type: 'ellipse',
                x: 200,
                y: 200,
                width: 100,
                height: 50,
                fill: '#007bff',
                locked: false,
                visible: true,
            } as EllipseLayer,
        ]
    })),

    addLine: () => set((state) => ({
        layers: [
            ...state.layers,
            {
                id: uuidv4(),
                name: 'Line',
                type: 'line',
                x: 200,
                y: 200,
                points: [0, 0, 100, 0],
                stroke: '#000000',
                strokeWidth: 2,
                locked: false,
                visible: true,
            } as LineLayer,
        ]
    })),

    addPolygon: () => set((state) => ({
        layers: [
            ...state.layers,
            {
                id: uuidv4(),
                name: 'Polygon',
                type: 'polygon',
                x: 200,
                y: 200,
                sides: 6,
                radius: 50,
                points: [], // will be calculated in component
                fill: '#007bff',
                stroke: '#000000',
                strokeWidth: 2,
                locked: false,
                visible: true,
            } as PolygonLayer,
        ]
    })),

    addPath: (path: PathLayer) => set((state) => ({
        layers: [
            ...state.layers,
            path,
        ]
    })),

  updateLayer: (id: string, changes: Partial<Layer>) => {
    const layers = get().layers.map((l) => (l.id === id ? { ...l, ...changes } : l));
    set({ layers: layers as Layer[] });
  },

  renameLayer: (id: string, name: string) => {
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, name } : l)),
    }));
  },

  lockLayer: (id: string) =>
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

    duplicateSelected: () => {
        const ids = get().selectedIds;
        if (ids.length === 0) return;
        set((state) => {
            const layersToDuplicate = state.layers.filter(l => ids.includes(l.id));
            const duplicatedLayers = layersToDuplicate.map(l => ({
                ...l,
                id: uuidv4(),
                name: `${l.name} (copy)`,
                x: l.x + 10,
                y: l.y + 10,
            }));
            return { layers: [...state.layers, ...duplicatedLayers] };
        });
    },

    mergeSelected: () => {
        const ids = get().selectedIds;
        if (ids.length < 2) return;
        set((state) => {
            const selectedLayers = state.layers.filter((l) => ids.includes(l.id));
            const topMostLayer = selectedLayers.reduce((top, current) => {
                const topIndex = state.layers.findIndex(l => l.id === top.id);
                const currentIndex = state.layers.findIndex(l => l.id === current.id);
                return currentIndex > topIndex ? current : top;
            });

            const newGroup: GroupLayer = {
                id: uuidv4(),
                name: 'Merged Group',
                type: 'group',
                x: Math.min(...selectedLayers.map((l) => l.x)),
                y: Math.min(...selectedLayers.map((l) => l.y)),
                layers: selectedLayers,
                locked: false,
                visible: true,
            };

            // Apply top-most layer's properties to the new group
            if ('fill' in topMostLayer) {
                (newGroup as any).fill = (topMostLayer as any).fill;
            }
            if ('stroke' in topMostLayer) {
                (newGroup as any).stroke = (topMostLayer as any).stroke;
            }
            if ('strokeWidth' in topMostLayer) {
                (newGroup as any).strokeWidth = (topMostLayer as any).strokeWidth;
            }


            const remainingLayers = state.layers.filter((l) => !ids.includes(l.id));
            const newLayers = [...remainingLayers, newGroup];
            return { layers: newLayers, selectedIds: [newGroup.id] };
        });
    },
    reorderLayers: (layers: Layer[]) => {
        set({ layers });
    }
}));
