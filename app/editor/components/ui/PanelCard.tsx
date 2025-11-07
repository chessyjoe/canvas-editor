import React from 'react';

interface PanelCardProps {
  title: string;
  children: React.ReactNode;
}

const PanelCard: React.FC<PanelCardProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold p-4 pb-2">{title}</h3>
      <div className="flex-grow overflow-y-auto p-4 pt-2">
        {children}
      </div>
    </div>
  );
};

export default PanelCard;
