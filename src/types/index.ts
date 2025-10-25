export interface TimerSettings {
  minutes: number;
  isActive: boolean;
}

export interface PDFViewerState {
  pdfUrl: string | null;
  currentPage: number;
  totalPages: number;
  scale: number;
}
