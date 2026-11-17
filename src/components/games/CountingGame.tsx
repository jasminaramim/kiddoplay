import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';
import { fireMiniConfetti } from '../../utils/confettiUtils';

const SAFARI_ITEMS = [
  { name: 'bunnies', nameBn: 'খরগোশ', singular: 'bunny', emoji: '🐰' },
  { name: 'stars', nameBn: 'তারা', singular: 'star', emoji: '⭐' },
  { name: 'bananas', nameBn: 'কলা', singular: 'banana', emoji: '🍌' },
  { name: 'lions', nameBn: 'সিংহ', singular: 'lion', emoji: '🦁' },
  { name: 'apples', nameBn: 'আপেল', singular: 'apple', emoji: '🍎' },
  { name: 'butterflies', nameBn: 'প্রজাপতি', singular: 'butterfly', emoji: '🦋' },
];

export const CountingGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const totalRounds = 6;

  const [round, setRound] = useState(0);
  const [count, setCount] = useState(3);
  const [item, setItem] = useState(SAFARI_ITEMS[0]);
  const [choices, setChoices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongPicks, setWrongPicks] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);

  const generateRound = useCallback(() => {
    const maxNum = state.difficulty === 'easy' ? 6 : state.difficulty === 'medium' ? 10 : 15;
    const minNum = state.difficulty === 'easy' ? 1 : 3;
    const target = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    const pickedItem = SAFARI_ITEMS[Math.floor(Math.random() * SAFARI_ITEMS.length)];

    const setOpts = new Set<number>([target]);
    while (setOpts.size < 3) {
      const offset = Math.floor(Math.random() * 5) - 2;
      const cand = Math.max(1, Math.min(maxNum + 2, target + offset));
      setOpts.add(cand);
    }

    setCount(target);
    setItem(pickedItem);
    setChoices(Array.from(setOpts).sort((a, b) => a - b));
    setWrongPicks([]);
    setLocked(false);

    speakBilingual(
      `এখানে কয়টি ${pickedItem.nameBn} আছে? গুনে বলো তো!`,
      `How many ${pickedItem.name} are there?`
    );
  }, [state.difficulty]);

  useEffect(() => {
    setRound(0);
    setScore(0);
    setCorrectCount(0);
    generateRound();
  }, [generateRound]);

  const handleAnswer = (val: number) => {
    if (locked) return;

    if (val === count) {
      setLocked(true);
      audioManager.playCorrect();
      fireMiniConfetti();
      const firstTry = wrongPicks.length === 0;
      const nextScore = score + (firstTry ? 15 : 10);
      const nextCorrect = correctCount + (firstTry ? 1 : 0);
      setScore(nextScore);
      setCorrectCount(nextCorrect);
      speakBilingual(
        `শাবাশ! এখানে ${count}টি ${item.nameBn} আছে!`,
        `Yes! There ${count === 1 ? 'is' : 'are'} ${count} ${count === 1 ? item.singular : item.name}!`
      );

      setTimeout(() => {
        if (round + 1 >= totalRounds) {
          recordGameResult({
            gameId: 'counting-safari',
            score: nextScore,
            correctCount: Math.max(1, nextCorrect),
            totalCount: totalRounds,
          });
        } else {
          setRound((r) => r + 1);
          generateRound();
        }
      }, 950);
    } else {
      audioManager.playWrong();
      if (!wrongPicks.includes(val)) {
        setWrongPicks((prev) => [...prev, val]);
      }
      speakBilingual(
        'আবার চেষ্টা করো! একটা একটা করে গুনে দেখো।',
        'Not quite! Let us count each one carefully.'
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="flex items-center justify-between mb-4 text-sm font-bold text-slate-600 tabular-nums">
        <span>{isEn ? `Safari Round ${round + 1} / ${totalRounds}` : `পর্ব ${round + 1} / ${totalRounds}`}</span>
        <span>{isEn ? `Score: ${score}` : `স্কোর: ${score}`}</span>
      </div>

      <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
        {isEn ? `How many ${item.name} are there?` : `এখানে কয়টি ${item.nameBn} আছে?`}
      </h2>

      <button
        type="button"
        onClick={() =>
          speakBilingual(
            `এখানে কয়টি ${item.nameBn} আছে?`,
            `How many ${item.name} are there?`
          )
        }
        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-900 text-sm font-bold mb-6 cursor-pointer"
      >
        <Volume2 className="w-4 h-4" />
        <span>{isEn ? 'Ask Again' : 'আবার শোনো'}</span>
      </button>

      <div className="min-h-48 rounded-3xl bg-gradient-to-b from-sky-50 to-emerald-50 border-2 border-emerald-200 p-6 flex flex-wrap items-center justify-center gap-4 mb-7">
        {Array.from({ length: count }).map((_, idx) => (
          <motion.button
            key={`${round}-${idx}`}
            type="button"
            initial={{ scale: 0, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: idx * 0.04, type: 'spring', stiffness: 400, damping: 18 }}
            whileTap={{ scale: 1.25 }}
            onClick={() => {
              audioManager.playPop();
              speakBilingual(String(idx + 1), String(idx + 1));
            }}
            className="text-4xl sm:text-5xl p-2 rounded-2xl hover:bg-white/60 cursor-pointer select-none"
            title={isEn ? `Tap to count ${idx + 1}` : `গুনতে ট্যাপ করো ${idx + 1}`}
          >
            {item.emoji}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        {choices.map((c) => {
          const isWrong = wrongPicks.includes(c);
          const isRight = locked && c === count;
          return (
            <motion.button
              key={c}
              type="button"
              whileTap={{ scale: 0.93 }}
              onClick={() => handleAnswer(c)}
              className={`min-h-20 rounded-3xl border-2 font-display text-3xl sm:text-4xl font-extrabold tabular-nums cursor-pointer transition-colors ${
                isRight
                  ? 'bg-emerald-500 border-emerald-600 text-white shadow-[0_5px_0_#047857]'
                  : isWrong
                    ? 'bg-rose-50 border-rose-200 text-rose-400'
                    : 'bg-white border-sky-300 text-slate-900 shadow-[0_6px_0_#7DD3FC] hover:bg-sky-50'
              }`}
            >
              {c}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
