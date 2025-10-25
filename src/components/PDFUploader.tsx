import { Upload } from 'lucide-react';

interface PDFUploaderProps {
  onFileSelect: (file: File) => void;
}

export default function PDFUploader({ onFileSelect }: PDFUploaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label
        htmlFor="pdf-upload"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-white hover:bg-slate-50 transition-all duration-200 hover:border-slate-400"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-16 h-16 mb-4 text-slate-400" />
          <p className="mb-2 text-lg font-medium text-slate-700">
            Click to upload PDF
          </p>
          <p className="text-sm text-slate-500">Select a PDF file to begin your focus session</p>
        </div>
        <input
          id="pdf-upload"
          type="file"
          className="hidden"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}
