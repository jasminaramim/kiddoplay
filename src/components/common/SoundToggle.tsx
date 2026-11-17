import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({ enabled, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={enabled ? 'শব্দ ও ভয়েস বন্ধ করো' : 'শব্দ ও ভয়েস চালু করো'}
      title={enabled ? 'শব্দ ও ভয়েস চালু আছে' : 'শব্দ ও ভয়েস বন্ধ আছে'}
      className={`flex items-center justify-center w-10 h-10 rounded-2xl border-2 transition-transform active:translate-y-0.5 cursor-pointer shrink-0 ${
        enabled
          ? 'bg-sky-50 border-sky-300 text-sky-700 shadow-[0_3px_0_#7DD3FC] hover:bg-sky-100'
          : 'bg-slate-100 border-slate-300 text-slate-500 shadow-[0_3px_0_#CBD5E1] hover:bg-slate-200'
      }`}
    >
      {enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
    </button>
  );
};
