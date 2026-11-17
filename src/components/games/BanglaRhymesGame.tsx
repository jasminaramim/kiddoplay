import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Play, Pause, Award, Sparkles, BookOpen, HelpCircle } from 'lucide-react';
import { BANGLA_RHYMES, BanglaRhyme } from '../../data/learningContent';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBangla, stopSpeech } from '../../utils/speechUtils';
import { fireCelebrationConfetti } from '../../utils/confettiUtils';

export const BanglaRhymesGame: React.FC = () => {
  const { recordGameResult } = useKiddo();
  const [selectedRhyme, setSelectedRhyme] = useState<BanglaRhyme>(BANGLA_RHYMES[0]);
  const [activeLineIdx, setActiveLineIdx] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [mode, setMode] = useState<'read' | 'quiz'>('read');
  const [quizAnswered, setQuizAnswered] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Play line with Bangla voice
  const reciteLine = (line: string, idx: number) => {
    setActiveLineIdx(idx);
    audioManager.playVoicePrompt();
    speakBangla(line);
  };

  // Play whole rhyme sequentially
  const handlePlayAll = () => {
    if (isPlayingAll) {
      stopSpeech();
      setIsPlayingAll(false);
      setActiveLineIdx(null);
      return;
    }

    setIsPlayingAll(true);
    audioManager.playChoraMelody();

    let current = 0;
    const playNext = () => {
      if (current < selectedRhyme.lines.length) {
        setActiveLineIdx(current);
        speakBangla(selectedRhyme.lines[current]);
        current += 1;
        setTimeout(playNext, 2800);
      } else {
        setIsPlayingAll(false);
        setActiveLineIdx(null);
        audioManager.playStarSuccess();
      }
    };
    playNext();
  };

  const handleRhymeChange = (rhyme: BanglaRhyme) => {
    stopSpeech();
    setIsPlayingAll(false);
    setActiveLineIdx(null);
    setQuizAnswered(null);
    setIsCorrect(null);
    setSelectedRhyme(rhyme);
    audioManager.playPop();
    speakBangla(`${rhyme.title}! প্রচলিত সুন্দর বাংলা ছড়া।`);
  };

  const handleQuizChoice = (option: string) => {
    if (quizAnswered) return;
    setQuizAnswered(option);
    const correct = option === selectedRhyme.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      audioManager.playCorrect();
      audioManager.playStarSuccess();
      fireCelebrationConfetti();
      speakBangla('শাবাশ! তোমার উত্তর একদম সঠিক হয়েছে!');
      recordGameResult({
        gameId: 'bangla-rhymes',
        score: 100,
        customStars: 3,
        correctCount: 1,
        totalCount: 1,
      });
    } else {
      audioManager.playWrong();
      speakBangla('আবার চেষ্টা করো! সঠিক উত্তর খুঁজে নাও।');
    }
  };

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {BANGLA_RHYMES.map((rhyme) => {
          const active = selectedRhyme.id === rhyme.id;
          return (
            <button
              key={rhyme.id}
              onClick={() => handleRhymeChange(rhyme)}
              className={`px-4 py-2.5 rounded-2xl font-display font-bold text-sm sm:text-base border-2 shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
                active
                  ? 'bg-rose-500 border-rose-600 text-white shadow-[0_4px_0_#BE123C] scale-105'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-rose-300'
              }`}
            >
              <span className="text-xl">{rhyme.emoji}</span>
              <span>{rhyme.title}</span>
            </button>
          );
        })}
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => {
            audioManager.playClick();
            setMode('read');
          }}
          className={`px-5 py-2 rounded-2xl font-display font-bold text-sm border-2 flex items-center gap-2 cursor-pointer ${
            mode === 'read'
              ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-[0_3px_0_#D97706]'
              : 'bg-white border-slate-200 text-slate-600'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>ছড়া শুনো ও পড়ো</span>
        </button>
        <button
          onClick={() => {
            audioManager.playClick();
            setMode('quiz');
          }}
          className={`px-5 py-2 rounded-2xl font-display font-bold text-sm border-2 flex items-center gap-2 cursor-pointer ${
            mode === 'quiz'
              ? 'bg-sky-500 border-sky-600 text-white shadow-[0_3px_0_#0284C7]'
              : 'bg-white border-slate-200 text-slate-600'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>ছড়া কুইজ</span>
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-white rounded-[2.5rem] border-[3px] border-amber-300 p-6 sm:p-8 shadow-[0_10px_0_#FDE68A] overflow-hidden relative">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-4xl animate-bounce">{selectedRhyme.emoji}</span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900">
                {selectedRhyme.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-bold text-rose-500">
              কবি: {selectedRhyme.poet}
            </p>
          </div>

          {mode === 'read' && (
            <button
              onClick={handlePlayAll}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:brightness-105 text-white font-display font-bold text-sm sm:text-base border-2 border-rose-600 shadow-[0_4px_0_#BE123C] flex items-center gap-2 cursor-pointer transition-transform active:translate-y-0.5"
            >
              {isPlayingAll ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{isPlayingAll ? 'থামাও' : 'পুরো ছড়া একসাথে শোনো 🎶'}</span>
            </button>
          )}
        </div>

        {mode === 'read' ? (
          <div className="py-6 space-y-4">
            <p className="text-center text-xs sm:text-sm font-bold text-slate-400 mb-2">
              💡 লাইনে ট্যাপ করে মিষ্টি বাংলা গলায় আবৃত্তি শোনো
            </p>
            {selectedRhyme.lines.map((line, idx) => {
              const isCurrent = activeLineIdx === idx;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => reciteLine(line, idx)}
                  className={`p-4 sm:p-5 rounded-2xl border-[3px] cursor-pointer flex items-center justify-between transition-all ${
                    isCurrent
                      ? 'bg-rose-100 border-rose-400 shadow-[0_5px_0_#FDA4AF] scale-102'
                      : 'bg-amber-50/70 border-amber-200 hover:border-amber-300 shadow-[0_4px_0_#FEF08A]'
                  }`}
                >
                  <div>
                    <p className="font-display text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed">
                      {line}
                    </p>
                    <p className="text-xs font-semibold text-slate-500 italic mt-0.5">
                      {selectedRhyme.linesEn[idx]}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="w-10 h-10 rounded-xl bg-white border-2 border-amber-300 flex items-center justify-center text-amber-700 shadow-sm shrink-0"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 space-y-6">
            <div className="bg-sky-50 rounded-2xl border-2 border-sky-200 p-5 text-center">
              <span className="text-3xl mb-2 inline-block">🤔</span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-sky-950">
                {selectedRhyme.quizQuestion}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedRhyme.quizOptions.map((opt) => {
                const isSelected = quizAnswered === opt;
                const isThisCorrect = opt === selectedRhyme.correctAnswer;
                let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-sky-300';

                if (quizAnswered) {
                  if (isThisCorrect) {
                    btnStyle = 'bg-emerald-500 border-emerald-600 text-white shadow-[0_4px_0_#059669]';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-500 border-rose-600 text-white shadow-[0_4px_0_#E11D48]';
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleQuizChoice(opt)}
                    disabled={!!quizAnswered}
                    className={`p-4 rounded-2xl border-[3px] font-display font-bold text-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:translate-y-0.5 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {quizAnswered && (
              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    setQuizAnswered(null);
                    setIsCorrect(null);
                  }}
                  className="px-6 py-2.5 rounded-2xl bg-amber-400 border-2 border-amber-500 text-amber-950 font-display font-bold text-sm shadow-[0_3px_0_#D97706] cursor-pointer"
                >
                  আবার খেলো 🔄
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
