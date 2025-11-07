'use client';
import React from 'react';
import AIAssistant from './AIAssistant';
import PanelCard from './ui/PanelCard';

const AIAssistantPanel = () => {
  return (
    <PanelCard title="AI Assistant">
      <AIAssistant />
    </PanelCard>
  );
};

export default AIAssistantPanel;
