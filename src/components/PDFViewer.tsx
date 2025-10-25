import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl: string;
  timeRemaining: number;
  isFullscreen: boolean;
}

export default function PDFViewer({ pdfUrl, timeRemaining, isFullscreen }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPDF();
  }, [pdfUrl]);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;

      try {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (error) {
        console.error('Error rendering page:', error);
      }
    };

    renderPage();
  }, [pdfDoc, currentPage, scale]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    setScale(Math.min(scale + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(Math.max(scale - 0.25, 0.5));
  };

  return (
    <div className="relative w-full h-screen bg-slate-900 flex flex-col">
      {/* Timer Display */}
      <div className="absolute top-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm py-4 px-6 flex items-center justify-between z-10 shadow-lg">
        <div className="text-white/80 text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <div className="text-3xl font-bold text-white tabular-nums tracking-wider">
          {formatTime(timeRemaining)}
        </div>
        <div className="text-white/80 text-sm font-medium">Focus Mode Active</div>
      </div>

      {/* PDF Canvas Container */}
      <div className="flex-1 overflow-auto flex items-center justify-center pt-20 pb-24">
        <canvas ref={canvasRef} className="shadow-2xl" />
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm py-4 px-6 flex items-center justify-center gap-6 z-10 shadow-lg">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <button
          onClick={handleZoomOut}
          className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
        >
          <ZoomOut className="w-5 h-5 text-white" />
        </button>

        <span className="text-white font-medium px-4">
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={handleZoomIn}
          className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
        >
          <ZoomIn className="w-5 h-5 text-white" />
        </button>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Fullscreen indicator */}
      {isFullscreen && (
        <div className="absolute top-20 right-6 bg-emerald-500/90 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          🔒 Locked in Focus Mode
        </div>
      )}
    </div>
  );
}
