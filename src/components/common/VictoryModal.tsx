import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Home, Star, Award } from 'lucide-react';
import { VictorySummary } from '../../types';
import { useKiddo } from '../../context/KiddoContext';

interface VictoryModalProps {
  summary: VictorySummary | null;
  onPlayAgain: () => void;
  onBackToHub: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  summary,
  onPlayAgain,
  onBackToHub,
}) => {
  const { state } = useKiddo();
  const isEn = state.language === 'en';

  return (
    <AnimatePresence>
      {summary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="victory-heading"
        >
          <motion.div
            initial={{ scale: 0.85, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 24 }}
            className="w-full max-w-md bg-white rounded-3xl border-4 border-amber-300 p-6 sm:p-8 text-center shadow-2xl"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              {[1, 2, 3].map((idx) => {
                const earned = idx <= summary.starsEarned;
                return (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.12 * idx,
                      type: 'spring',
                      stiffness: 420,
                      damping: 16,
                    }}
                    className={idx === 2 ? '-translate-y-2' : ''}
                  >
                    <Star
                      className={`w-12 h-12 sm:w-14 sm:h-14 ${
                        earned
                          ? 'fill-amber-400 text-amber-500 drop-shadow-sm'
                          : 'fill-slate-100 text-slate-300'
                      }`}
                    />
                  </motion.div>
                );
              })}
            </div>

            <h2
              id="victory-heading"
              className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1.5"
            >
              {isEn ? 'Awesome Job, Superstar!' : 'দারুণ করেছো, চ্যাম্পিয়ন!'}
            </h2>
            <p className="text-sm font-semibold text-slate-600 mb-5">
              {summary.title} · {summary.message}
            </p>

            <div className="grid grid-cols-3 gap-3 bg-sky-50 border-2 border-sky-100 rounded-2xl p-3.5 mb-5">
              <div>
                <div className="text-xs font-semibold text-slate-500">{isEn ? 'Stars' : 'তারা'}</div>
                <div className="font-display text-xl font-extrabold text-amber-600 tabular-nums">
                  +{summary.starsEarned}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">{isEn ? 'Score' : 'স্কোর'}</div>
                <div className="font-display text-xl font-extrabold text-sky-700 tabular-nums">
                  {summary.score}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">{isEn ? 'Accuracy' : 'সঠিকতা'}</div>
                <div className="font-display text-xl font-extrabold text-emerald-700 tabular-nums">
                  {summary.accuracy}%
                </div>
              </div>
            </div>

            {summary.newlyUnlockedBadges.length > 0 && (
              <div className="mb-5 bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 text-left">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-2">
                  <Award className="w-4 h-4" />
                  <span>{isEn ? 'New Badge Unlocked!' : 'নতুন ব্যাজ আনলক হয়েছে!'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {summary.newlyUnlockedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-2 bg-white border border-amber-200 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-800"
                    >
                      <span>{badge.emoji}</span>
                      <span>{isEn ? badge.title : badge.titleBn}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onPlayAgain}
                className="flex-1 min-h-12 py-3 px-4 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-display font-bold text-base border-2 border-sky-600 shadow-[0_5px_0_#0284C7] active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-5 h-5" />
                <span>{isEn ? 'Play Again' : 'আবার খেলো'}</span>
              </button>
              <button
                type="button"
                onClick={onBackToHub}
                className="flex-1 min-h-12 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-display font-bold text-base border-2 border-slate-300 shadow-[0_5px_0_#CBD5E1] active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Home className="w-5 h-5" />
                <span>{isEn ? 'All Games' : 'সব খেলা'}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
