import React from 'react';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { useKiddo } from '../../context/KiddoContext';
import { Difficulty, GameMetadata } from '../../types';
import { speakBilingual } from '../../utils/speechUtils';
import { audioManager } from '../../utils/audioManager';

interface GameShellProps {
  game: GameMetadata;
  score?: number;
  roundLabel?: string;
  speakPrompt?: string;
  speakPromptBn?: string;
  hideDifficulty?: boolean;
  children: React.ReactNode;
}

export const GameShell: React.FC<GameShellProps> = ({
  game,
  score,
  roundLabel,
  speakPrompt,
  speakPromptBn,
  hideDifficulty = false,
  children,
}) => {
  const { state, setDifficulty, exitGame } = useKiddo();
  const isEn = state.language === 'en';

  const difficulties: { id: Difficulty; label: string; labelBn: string }[] = [
    { id: 'easy', label: 'Easy', labelBn: 'সহজ' },
    { id: 'medium', label: 'Medium', labelBn: 'মাঝারি' },
    { id: 'hard', label: 'Hard', labelBn: 'কঠিন' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 bg-white rounded-3xl border-[3px] border-sky-200 px-4 py-3 shadow-[0_5px_0_#BAE6FD]">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={exitGame}
            className="min-h-10 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-display font-bold text-sm flex items-center gap-1.5 border border-slate-200 cursor-pointer shrink-0 whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? 'Games' : 'ফিরে যাও'}</span>
          </button>

          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-2xl shrink-0" aria-hidden="true">
              {game.emoji}
            </span>
            <div className="min-w-0">
              <h1 className="font-display text-base sm:text-lg font-bold text-slate-900 truncate">
                {isEn ? game.title : game.titleBn}
              </h1>
              {roundLabel && (
                <p className="text-xs font-semibold text-slate-500 tabular-nums">
                  {roundLabel}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {(speakPrompt || speakPromptBn) && (
            <button
              type="button"
              onClick={() => {
                audioManager.playClick();
                speakBilingual(
                  speakPromptBn || game.descriptionBn,
                  speakPrompt || game.description
                );
              }}
              className="min-h-10 px-3.5 py-2 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 border-2 border-sky-200 font-display font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isEn ? 'Hear Prompt' : 'নির্দেশনা শোনো'}</span>
            </button>
          )}

          {typeof score === 'number' && (
            <div className="px-3.5 py-1.5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-900 font-display font-bold text-sm tabular-nums whitespace-nowrap">
              {isEn ? 'Score' : 'স্কোর'}: {score}
            </div>
          )}

          {!hideDifficulty && (
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              {difficulties.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDifficulty(d.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-display font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    state.difficulty === d.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isEn ? d.label : d.labelBn}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border-[3px] border-sky-200 p-4 sm:p-7 shadow-[0_8px_0_#BAE6FD]">
        {children}
      </div>
    </div>
  );
};
