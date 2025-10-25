import { Clock, Play } from 'lucide-react';

interface TimerSettingsProps {
  minutes: number;
  onMinutesChange: (minutes: number) => void;
  onStart: () => void;
  disabled?: boolean;
}

export default function TimerSettings({
  minutes,
  onMinutesChange,
  onStart,
  disabled = false,
}: TimerSettingsProps) {
  const presetMinutes = [5, 10, 15, 25, 30, 45, 60];

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-2xl shadow-sm p-8">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-slate-700" />
        <h2 className="text-2xl font-semibold text-slate-800">Set Focus Duration</h2>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {presetMinutes.map((preset) => (
          <button
            key={preset}
            onClick={() => onMinutesChange(preset)}
            disabled={disabled}
            className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
              minutes === preset
                ? 'bg-slate-800 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {preset} min
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-6">
        <label className="text-slate-600 font-medium whitespace-nowrap">Custom:</label>
        <input
          type="number"
          min="1"
          max="180"
          value={minutes}
          onChange={(e) => onMinutesChange(Math.max(1, parseInt(e.target.value) || 1))}
          disabled={disabled}
          className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800"
        />
        <span className="text-slate-600 font-medium">minutes</span>
      </div>

      <button
        onClick={onStart}
        disabled={disabled}
        className="w-full bg-slate-800 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-slate-900 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Play className="w-5 h-5" />
        Start Focus Session
      </button>
    </div>
  );
}
