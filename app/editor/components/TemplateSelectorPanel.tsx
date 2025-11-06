'use client';
import React, { useState } from 'react';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { templates, Template } from '@/canvas/data/templates';
import Image from 'next/image';

const TemplateSelectorPanel = () => {
  const { applyTemplate } = useEditorStore();
  const [filter, setFilter] = useState<'All' | Template['category']>('All');

  const filteredTemplates = filter === 'All' ? templates : templates.filter((t) => t.category === filter);

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Templates</h2>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('All')}
          className={`px-3 py-1 text-sm rounded ${filter === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('Poster')}
          className={`px-3 py-1 text-sm rounded ${filter === 'Poster' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Posters
        </button>
        <button
          onClick={() => setFilter('Logo')}
          className={`px-3 py-1 text-sm rounded ${filter === 'Logo' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Logos
        </button>
      </div>

      {/* Template Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="cursor-pointer border rounded-md hover:border-blue-500"
              onClick={() => applyTemplate(template)}
            >
              <Image
                src={template.previewImage}
                alt={template.name}
                width={150}
                height={100}
                className="w-full h-auto rounded-t-md"
              />
              <p className="text-sm p-2">{template.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelectorPanel;
