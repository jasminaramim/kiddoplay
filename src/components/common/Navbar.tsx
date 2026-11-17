import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useKiddo } from '../../context/KiddoContext';
import { AppView } from '../../types';
import { StarCounter } from './StarCounter';
import { SoundToggle } from './SoundToggle';
import { audioManager } from '../../utils/audioManager';

export const Navbar: React.FC = () => {
  const { state, view, setView, exitGame, toggleSoundAndVoice, isFullscreen, toggleFullscreen } = useKiddo();

  const navigate = (target: AppView) => {
    audioManager.playClick();
    if (view === 'game') {
      exitGame();
    }
    setView(target);
  };

  const isEn = state.language === 'en';

  const navItems: { id: AppView; label: string; labelBn: string }[] = [
    { id: 'hub', label: 'Games', labelBn: 'খেলাসমূহ' },
    { id: 'challenges', label: 'Daily Quests', labelBn: 'দৈনিক চ্যালেঞ্জ' },
    { id: 'badges', label: 'Badges', labelBn: 'ব্যাজ ও ট্রফি' },
    { id: 'parents', label: 'Parents', labelBn: 'অভিভাবক প্যানেল' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-[3px] border-sky-200 shadow-sm">
      <div className="h-1.5 w-full bg-gradient-to-r from-rose-400 via-amber-400 via-emerald-400 to-sky-500" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Logo */}
        <button
          type="button"
          onClick={() => navigate('hub')}
          className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform shrink-0"
          aria-label={isEn ? 'KiddoPlay Home' : 'কিডোপ্লে হোম'}
        >
          <img
            src="/kiddoplay.png"
            alt={isEn ? 'KiddoPlay' : 'কিডোপ্লে'}
            className="h-10 sm:h-12 w-auto max-w-[160px] sm:max-w-[200px] object-contain drop-shadow-sm"
          />
        </button>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-base font-display font-semibold text-slate-600" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = view === item.id || (view === 'game' && item.id === 'hub');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                className={`py-1.5 border-b-[3px] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'border-rose-500 text-rose-600'
                    : 'border-transparent hover:text-sky-700 hover:border-sky-300'
                }`}
              >
                {isEn ? item.label : item.labelBn}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Star Bank, Sound, Fullscreen controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <StarCounter stars={state.stars} />
          <SoundToggle enabled={state.soundEnabled} onToggle={toggleSoundAndVoice} />
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              toggleFullscreen();
            }}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            title={isEn ? 'Fullscreen' : 'পূর্ণ স্ক্রিন'}
            className="hidden sm:flex items-center justify-center w-10 h-10 rounded-2xl border-2 bg-violet-50 border-violet-300 text-violet-700 shadow-[0_3px_0_#C4B5FD] hover:bg-violet-100 active:translate-y-0.5 transition-transform cursor-pointer shrink-0"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile secondary nav strip */}
      <div className="md:hidden border-t border-slate-100 px-3 py-1.5 flex items-center justify-around bg-white/95">
        {navItems.map((item) => {
          const active = view === item.id || (view === 'game' && item.id === 'hub');
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-display font-bold whitespace-nowrap shrink-0 cursor-pointer ${
                active ? 'bg-rose-100 text-rose-700' : 'text-slate-600'
              }`}
            >
              {isEn ? item.label : item.labelBn}
            </button>
          );
        })}
      </div>
    </header>
  );
};
