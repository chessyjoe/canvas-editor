'use client';
import React from 'react';
import AIAssistant from './AIAssistant';

const AIAssistantPanel = () => {
  return (
    <div className="p-4 h-full">
      <h2 className="text-lg font-semibold mb-4">AI Assistant</h2>
      <AIAssistant />
    </div>
  );
};

export default AIAssistantPanel;
