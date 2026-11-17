import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Volume2, BookOpen, HelpCircle } from 'lucide-react';
import { BANGLA_LETTERS, BanglaLetter } from '../../data/learningContent';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';
import { fireMiniConfetti } from '../../utils/confettiUtils';

export const BanglaEnglishGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');
  const [groupFilter, setGroupFilter] = useState<'all' | 'vowel' | 'consonant'>('all');
  const [selected, setSelected] = useState<BanglaLetter>(BANGLA_LETTERS[0]);

  const totalQuestions = 6;
  const [qIndex, setQIndex] = useState(0);
  const [target, setTarget] = useState<BanglaLetter>(BANGLA_LETTERS[0]);
  const [options, setOptions] = useState<BanglaLetter[]>([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongChars, setWrongChars] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);

  const visibleLetters = BANGLA_LETTERS.filter((l) =>
    groupFilter === 'all' ? true : l.group === groupFilter
  );

  const speakBanglaCard = (item: BanglaLetter) => {
    audioManager.playPop();
    speakBilingual(
      `${item.char} তে ${item.word}!`,
      `${item.roman}! ${item.word} means ${item.meaningEn}!`
    );
  };

  const setupQuizQuestion = useCallback(() => {
    const shuffled = [...BANGLA_LETTERS].sort(() => Math.random() - 0.5);
    const chosen = shuffled[0];
    const choices = shuffled.slice(0, 4).sort(() => Math.random() - 0.5);
    setTarget(chosen);
    setOptions(choices);
    setWrongChars([]);
    setLocked(false);
    speakBilingual(
      `${chosen.word} শব্দটি কোন বাংলা বর্ণ দিয়ে শুরু হয়?`,
      `Find the Bangla letter for ${chosen.meaningEn}!`
    );
  }, []);

  useEffect(() => {
    if (mode === 'quiz') {
      setQIndex(0);
      setScore(0);
      setCorrectCount(0);
      setupQuizQuestion();
    }
  }, [mode, setupQuizQuestion]);

  const handleQuizChoice = (item: BanglaLetter) => {
    if (locked) return;
    if (item.char === target.char) {
      setLocked(true);
      audioManager.playCorrect();
      fireMiniConfetti();
      const firstTry = wrongChars.length === 0;
      const nextScore = score + (firstTry ? 15 : 10);
      const nextCorrect = correctCount + (firstTry ? 1 : 0);
      setScore(nextScore);
      setCorrectCount(nextCorrect);
      speakBilingual(`শাবাশ! ${item.char} তে ${item.word}!`, `${item.word} means ${item.meaningEn}!`);

      setTimeout(() => {
        if (qIndex + 1 >= totalQuestions) {
          recordGameResult({
            gameId: 'bangla-english',
            score: nextScore,
            correctCount: Math.max(1, nextCorrect),
            totalCount: totalQuestions,
          });
        } else {
          setQIndex((q) => q + 1);
          setupQuizQuestion();
        }
      }, 1100);
    } else {
      audioManager.playWrong();
      setWrongChars((prev) => [...prev, item.char]);
      speakBilingual(`ওটা ${item.char}। আবার চেষ্টা করো!`, `That is ${item.roman}. Try again!`);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              setMode('learn');
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 cursor-pointer ${
              mode === 'learn' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>বর্ণমালা শিখো</span>
          </button>
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              setMode('quiz');
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 cursor-pointer ${
              mode === 'quiz' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-rose-600" />
            <span>{isEn ? 'Bilingual Quiz' : 'বর্ণমালা কুইজ'}</span>
          </button>
        </div>

        {mode === 'learn' ? (
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            {[
              { id: 'all', label: 'সব বর্ণ' },
              { id: 'vowel', label: 'স্বরবর্ণ' },
              { id: 'consonant', label: 'ব্যঞ্জনবর্ণ' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setGroupFilter(f.id as 'all' | 'vowel' | 'consonant')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                  groupFilter === f.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-sm font-bold text-slate-600 tabular-nums">
            {isEn ? `Question ${qIndex + 1} / ${totalQuestions} · Score ${score}` : `প্রশ্ন ${qIndex + 1} / ${totalQuestions} · স্কোর ${score}`}
          </div>
        )}
      </div>

      {mode === 'learn' ? (
        <div className="space-y-6">
          <motion.div
            key={selected.char}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="rounded-3xl bg-emerald-50 border-2 border-emerald-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-5"
          >
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-3xl bg-white border-2 border-emerald-300 flex items-center justify-center font-display text-6xl font-extrabold text-emerald-800">
                {selected.char}
              </div>
              <div>
                <div className="text-5xl mb-1" aria-hidden="true">{selected.emoji}</div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {selected.char} তে {selected.word}
                </h2>
                <p className="text-sm font-bold text-emerald-800">
                  ইংরেজি: {selected.meaningEn} · উচ্চারণ: “{selected.roman}”
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => speakBanglaCard(selected)}
              className="min-h-12 px-5 py-3 rounded-2xl bg-white border-2 border-emerald-300 text-emerald-900 font-display font-bold text-sm shadow-[0_4px_0_#6EE7B7] flex items-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
              <span>শুনুন</span>
            </button>
          </motion.div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {visibleLetters.map((item) => {
              const active = selected.char === item.char;
              return (
                <motion.button
                  key={item.char}
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    setSelected(item);
                    speakBanglaCard(item);
                  }}
                  className={`min-h-20 rounded-2xl border-2 p-2 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                    active
                      ? 'bg-emerald-100 border-emerald-500 ring-4 ring-emerald-200'
                      : 'bg-white border-slate-200 shadow-[0_4px_0_#E2E8F0] hover:border-emerald-300'
                  }`}
                >
                  <span className="font-display text-2xl font-extrabold text-slate-900">
                    {item.char}
                  </span>
                  <span className="text-lg" aria-hidden="true">{item.emoji}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto text-center py-2">
          <p className="text-sm font-bold text-emerald-700 mb-2">বাংলা বর্ণমালা চ্যালেঞ্জ</p>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
            <span className="text-emerald-700">“{target.word}”</span> ({target.emoji}) কোন বর্ণ দিয়ে শুরু হয়?
          </h2>
          <p className="text-sm text-slate-500 font-semibold mb-6">
            সঠিক বাংলা বর্ণটিতে ট্যাপ করো!
          </p>

          <div className="grid grid-cols-2 gap-4">
            {options.map((item) => {
              const isRight = locked && item.char === target.char;
              const isWrong = wrongChars.includes(item.char);
              return (
                <motion.button
                  key={item.char}
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleQuizChoice(item)}
                  className={`min-h-28 rounded-3xl border-2 p-4 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    isRight
                      ? 'bg-emerald-500 border-emerald-600 text-white'
                      : isWrong
                        ? 'bg-rose-50 border-rose-200 text-rose-400'
                        : 'bg-white border-emerald-200 text-slate-900 shadow-[0_5px_0_#6EE7B7] hover:bg-emerald-50'
                  }`}
                >
                  <span className="font-display text-5xl font-extrabold">{item.char}</span>
                  <span className="text-xs font-bold opacity-80">({item.word})</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
