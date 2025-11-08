'use client';
import React from 'react';
import { useEditorStore, TextLayer } from '@/canvas/store/useEditorStore';
import { Label } from './ui/label';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  ToggleGroup,
  ToggleGroupItem,
} from './ui/toggle-group';
import { FaBold, FaItalic, FaUnderline, FaAlignLeft, FaAlignCenter, FaAlignRight } from 'react-icons/fa';

interface TextPropertiesProps {
  layer: TextLayer;
}

export default function TextProperties({ layer }: TextPropertiesProps) {
  const { updateLayer } = useEditorStore();

  const handleValueChange = (key: keyof TextLayer, value: any) => {
    updateLayer(layer.id, { [key]: value });
  };

  const handleNumericValueChange = (key: keyof TextLayer, value: string) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      updateLayer(layer.id, { [key]: numericValue });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="text">Text</Label>
        <Input
          id="text"
          value={layer.text}
          onChange={(e) => handleValueChange('text', e.target.value)}
        />
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label>Font</Label>
        <div className="flex gap-2">
          <Select
            value={layer.fontFamily}
            onValueChange={(value) => handleValueChange('fontFamily', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Font Family" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Helvetica">Helvetica</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="Verdana">Verdana</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            className="w-20"
            value={layer.fontSize}
            onChange={(e) => handleNumericValueChange('fontSize', e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <ToggleGroup
            type="single"
            value={layer.fontWeight}
            onValueChange={(value) => handleValueChange('fontWeight', value || 'normal')}
            className="gap-2"
        >
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
                <FaBold className="h-4 w-4" />
            </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
            type="single"
            value={layer.fontStyle}
            onValueChange={(value) => handleValueChange('fontStyle', value || 'normal')}
            className="gap-2"
        >
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
                <FaItalic className="h-4 w-4" />
            </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
            type="single"
            value={layer.textDecoration}
            onValueChange={(value) => handleValueChange('textDecoration', value || 'none')}
            className="gap-2"
        >
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
                <FaUnderline className="h-4 w-4" />
            </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label>Alignment</Label>
        <ToggleGroup
          type="single"
          value={layer.textAlign}
          onValueChange={(value) => handleValueChange('textAlign', value)}
          className="w-full justify-start"
        >
          <ToggleGroupItem value="left" aria-label="Left aligned">
            <FaAlignLeft />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Center aligned">
            <FaAlignCenter />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Right aligned">
            <FaAlignRight />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="lineHeight">Line Height</Label>
            <Input
                id="lineHeight"
                type="number"
                step="0.1"
                value={layer.lineHeight}
                onChange={(e) => handleNumericValueChange('lineHeight', e.target.value)}
            />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="letterSpacing">Letter Spacing</Label>
            <Input
                id="letterSpacing"
                type="number"
                value={layer.letterSpacing}
                onChange={(e) => handleNumericValueChange('letterSpacing', e.target.value)}
            />
        </div>
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          type="color"
          value={layer.fill}
          onChange={(e) => handleValueChange('fill', e.target.value)}
        />
      </div>
    </div>
  );
}
