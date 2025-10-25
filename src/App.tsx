import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import PDFUploader from './components/PDFUploader';
import TimerSettings from './components/TimerSettings';
import PDFViewer from './components/PDFViewer';
import { useTimer } from './hooks/useTimer';
import { useFullscreen } from './hooks/useFullscreen';

function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [minutes, setMinutes] = useState(25);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);

  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen();

  const handleTimerComplete = async () => {
    await exitFullscreen();
    setSessionStarted(false);
    setPdfFile(null);
    setPdfUrl(null);
  };

  const { timeRemaining, start: startTimer, reset: resetTimer } = useTimer({
    initialMinutes: timerMinutes,
    onComplete: handleTimerComplete,
  });

  const handleFileSelect = (file: File) => {
    setPdfFile(file);
    const url = URL.createObjectURL(file);
    setPdfUrl(url);
  };

  const handleStartSession = async () => {
    if (!pdfUrl) return;
    setTimerMinutes(minutes);
    resetTimer(minutes);
    setSessionStarted(true);
    await enterFullscreen();
    startTimer();
  };

  if (sessionStarted && pdfUrl) {
    return (
      <PDFViewer
        pdfUrl={pdfUrl}
        timeRemaining={timeRemaining}
        isFullscreen={isFullscreen}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-slate-800" />
            <h1 className="text-4xl font-bold text-slate-900">Focus Timer PDF Viewer</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload a PDF, set your focus duration, and dive into distraction-free reading.
            The viewer locks you in fullscreen mode until the timer completes.
          </p>
        </div>

        <PDFUploader onFileSelect={handleFileSelect} />

        {pdfFile && (
          <div className="mt-6 text-center">
            <p className="text-slate-700 font-medium">
              Selected: <span className="text-slate-900">{pdfFile.name}</span>
            </p>
          </div>
        )}

        {pdfFile && (
          <TimerSettings
            minutes={minutes}
            onMinutesChange={setMinutes}
            onStart={handleStartSession}
          />
        )}
      </div>
    </div>
  );
}

export default App;
