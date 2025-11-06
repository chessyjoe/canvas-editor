
import { Layer } from '../store/useEditorStore';

export interface Template {
  id: string;
  name: string;
  category: 'Poster' | 'Logo' | 'Banner';
  previewImage: string;
  layers: Omit<Layer, 'id'>[];
}

export const templates: Template[] = [
  {
    id: 'template-1',
    name: 'Modern Poster',
    category: 'Poster',
    previewImage: 'https://via.placeholder.com/150/007bff/ffffff?text=Poster',
    layers: [
      {
        type: 'rect',
        x: 50,
        y: 50,
        width: 700,
        height: 500,
        fill: '#f0f4f8',
      },
      {
        type: 'text',
        x: 100,
        y: 120,
        text: 'EVENT HEADLINE',
        fontSize: 64,
        fontFamily: 'Helvetica',
        fill: '#1e293b',
      },
      {
        type: 'text',
        x: 100,
        y: 200,
        text: 'A short, catchy description of the event goes here.',
        fontSize: 24,
        fontFamily: 'Arial',
        fill: '#475569',
      },
    ],
  },
  {
    id: 'template-2',
    name: 'Simple Logo',
    category: 'Logo',
    previewImage: 'https://via.placeholder.com/150/28a745/ffffff?text=Logo',
    layers: [
      {
        type: 'rect',
        x: 10,
        y: 10,
        width: 80,
        height: 80,
        fill: '#28a745',
      },
      {
        type: 'text',
        x: 105,
        y: 45,
        text: 'BrandName',
        fontSize: 32,
        fontFamily: 'Verdana',
        fill: '#343a40',
      },
    ],
  },
];
