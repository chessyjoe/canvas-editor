'use client';
import React from 'react';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { saveAs } from 'file-saver';
import PptxGenJS from 'pptxgenjs';
import PanelCard from './ui/PanelCard';
import { Button } from './ui/button';

export default function ExportPanel() {
  const { layers, width, height } = useEditorStore();

  const exportPNG = () => {
    const stage = document.querySelector('canvas') as HTMLCanvasElement;
    if (!stage) return;
    stage.toBlob((blob) => blob && saveAs(blob, 'design.png'));
  };

  const exportPPTX = async () => {
    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();

    const stage = document.querySelector('canvas') as HTMLCanvasElement;
    const dataUrl = stage?.toDataURL();
    if (dataUrl)
      slide.addImage({
        data: dataUrl,
        x: 0.5,
        y: 0.5,
        w: (width / 96) * 1.0,
        h: (height / 96) * 1.0,
      });

    pptx.writeFile({ fileName: 'design.pptx' });
  };

  return (
    <PanelCard title="Export">
      <div className="flex flex-col gap-2">
        <Button onClick={exportPNG}>Export PNG</Button>
        <Button onClick={exportPPTX}>Export PPTX</Button>
      </div>
    </PanelCard>
  );
}
