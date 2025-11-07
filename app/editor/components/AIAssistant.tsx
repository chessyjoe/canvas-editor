'use client';
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useEditorStore } from '@/canvas/store/useEditorStore';

const AIAssistant = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { addImage } = useEditorStore();

  const handleGenerate = async () => {
    setLoading(true);
    // Placeholder for AI image generation
    setTimeout(() => {
      const imageUrl = `https://picsum.photos/512/512?random=${Math.random()}`;
      setImage(imageUrl);
      setLoading(false);
    }, 1000);
  };

  const handleAddToCanvas = () => {
    if (image) {
      addImage(image);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="ai-prompt">Prompt</Label>
        <Input
          id="ai-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A futuristic cityscape"
        />
      </div>
      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </Button>
      {image && (
        <div className="mt-4">
          <img src={image} alt="Generated image" className="rounded-md" />
          <Button onClick={handleAddToCanvas} className="mt-2 w-full">
            Add to Canvas
          </Button>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
