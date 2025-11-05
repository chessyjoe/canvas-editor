'use client';
import React from 'react';
import { useEditorStore } from '@/canvas/store/useEditorStore';
import { saveAs } from 'file-saver';
import PptxGenJS from 'pptxgenjs';
import { Button } from '@/components/ui/button';

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
    <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Button onClick={exportPNG} variant="outline">Export PNG</Button>
      <Button onClick={exportPPTX} variant="outline">Export PPTX</Button>
    </div>
  );
}
