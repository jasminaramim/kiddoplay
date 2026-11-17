import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';
import { BANGLA_WORD_PUZZLES, BanglaWordPuzzle } from '../../data/learningContent';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBangla } from '../../utils/speechUtils';
import { fireCelebrationConfetti } from '../../utils/confettiUtils';

export const BanglaWordBuilderGame: React.FC = () => {
  const { recordGameResult } = useKiddo();
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const currentPuzzle = BANGLA_WORD_PUZZLES[puzzleIndex % BANGLA_WORD_PUZZLES.length];

  const [assembled, setAssembled] = useState<string[]>([]);
  const [availableTiles, setAvailableTiles] = useState<{ id: string; letter: string; used: boolean }[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stars, setStars] = useState(0);

  // Initialize or change puzzle
  useEffect(() => {
    const letters = [...currentPuzzle.letters];
    // Add 1-2 random distractor letters for fun
    const distractors = ['ক', 'ল', 'র', 'ত', 'ন', 'প'];
    const extra = distractors[Math.floor(Math.random() * distractors.length)];
    const all = [...letters, extra].sort(() => Math.random() - 0.5);

    setAvailableTiles(
      all.map((char, idx) => ({
        id: `${char}-${idx}`,
        letter: char,
        used: false,
      }))
    );
    setAssembled([]);
    setIsCompleted(false);

    speakBangla(`চলো বানাই ${currentPuzzle.word}! ${currentPuzzle.hint}`);
  }, [puzzleIndex]);

  const handleTileClick = (tile: { id: string; letter: string; used: boolean }) => {
    if (tile.used || isCompleted) return;

    audioManager.playPop();
    speakBangla(tile.letter);

    const nextAssembled = [...assembled, tile.letter];
    setAssembled(nextAssembled);

    setAvailableTiles((prev) =>
      prev.map((t) => (t.id === tile.id ? { ...t, used: true } : t))
    );

    // Check if target word is matched
    const builtWord = nextAssembled.join('');
    if (builtWord === currentPuzzle.word) {
      setIsCompleted(true);
      audioManager.playCorrect();
      audioManager.playStarSuccess();
      fireCelebrationConfetti();
      setStars((s) => s + 1);
      speakBangla(`শাবাশ! সঠিক শব্দ: ${currentPuzzle.word}! দারুণ হয়েছে!`);

      recordGameResult({
        gameId: 'bangla-words',
        score: (puzzleIndex + 1) * 20,
        customStars: 2,
        correctCount: 1,
        totalCount: 1,
      });
    } else if (builtWord.length >= currentPuzzle.word.length) {
      audioManager.playWrong();
      speakBangla('আবার চেষ্টা করো! সঠিক অক্ষরগুলো সাজাও।');
    }
  };

  const handleResetCurrent = () => {
    audioManager.playClick();
    setAssembled([]);
    setAvailableTiles((prev) => prev.map((t) => ({ ...t, used: false })));
    setIsCompleted(false);
    speakBangla(`আবার শুরু করো! শব্দ: ${currentPuzzle.word}`);
  };

  const handleNextWord = () => {
    audioManager.playClick();
    setPuzzleIndex((prev) => (prev + 1) % BANGLA_WORD_PUZZLES.length);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 border-2 border-teal-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧩</span>
          <span className="font-display font-bold text-slate-800 text-lg">
            শব্দ {puzzleIndex + 1} / {BANGLA_WORD_PUZZLES.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1.5 rounded-full font-display font-bold text-sm">
          <span>⭐</span>
          <span>{stars} টি তারা</span>
        </div>
      </div>

      {/* Word Showcase Card */}
      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-[2.5rem] border-[3px] border-teal-300 p-6 sm:p-8 shadow-[0_9px_0_#99F6E4] text-center space-y-6">
        <div className="relative inline-block">
          <span className="text-7xl sm:text-8xl inline-block drop-shadow-md animate-bounce">
            {currentPuzzle.emoji}
          </span>
          <button
            onClick={() => speakBangla(`${currentPuzzle.word}! ${currentPuzzle.hint}`)}
            className="absolute -right-3 -bottom-2 w-10 h-10 rounded-full bg-white border-2 border-teal-400 text-teal-700 flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
            title="উচ্চারণ শোনো"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <div>
          <p className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-1">
            {currentPuzzle.meaningEn}
          </p>
          <p className="font-display text-lg sm:text-xl font-bold text-slate-700">
            {currentPuzzle.hint}
          </p>
        </div>

        {/* Word Assembly Slots */}
        <div className="flex justify-center items-center gap-2 sm:gap-3 min-h-[70px] p-3 rounded-2xl bg-white/90 border-2 border-dashed border-teal-300">
          {assembled.length === 0 ? (
            <span className="text-slate-400 font-display font-bold text-sm">
              নিচের বর্ণগুলোতে ট্যাপ করে শব্দ বানাও
            </span>
          ) : (
            assembled.map((char, idx) => (
              <motion.span
                key={idx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-teal-500 text-white font-display font-black text-2xl sm:text-3xl flex items-center justify-center shadow-[0_4px_0_#0F766E]"
              >
                {char}
              </motion.span>
            ))
          )}
        </div>

        {/* Letter Choice Tiles */}
        <div className="pt-2">
          <p className="text-xs font-bold text-slate-400 mb-3">বর্ণ পছন্দ করো:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {availableTiles.map((tile) => (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                disabled={tile.used || isCompleted}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-[3px] font-display font-black text-2xl sm:text-3xl flex items-center justify-center transition-all cursor-pointer ${
                  tile.used
                    ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed scale-95'
                    : 'bg-white border-amber-300 text-slate-800 shadow-[0_5px_0_#FCD34D] hover:scale-105 active:translate-y-1'
                }`}
              >
                {tile.letter}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-center gap-4 pt-4 border-t-2 border-teal-100">
          <button
            onClick={handleResetCurrent}
            className="px-4 py-2.5 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-display font-bold text-sm flex items-center gap-1.5 hover:border-slate-300 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>মুছে ফেলো</span>
          </button>

          {isCompleted && (
            <motion.button
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              onClick={handleNextWord}
              className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white border-2 border-emerald-600 font-display font-bold text-base shadow-[0_4px_0_#047857] flex items-center gap-2 cursor-pointer transition-transform active:translate-y-0.5"
            >
              <span>পরবর্তী শব্দ</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
