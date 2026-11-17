import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';
import { fireMiniConfetti } from '../../utils/confettiUtils';

interface LogicPuzzle {
  title: string;
  titleBn: string;
  items: string[];
  choices: string[];
  answer: string;
  explanation: string;
  explanationBn: string;
}

const PATTERN_POOL: LogicPuzzle[] = [
  {
    title: 'Complete the Pattern!',
    titleBn: 'প্যাটার্নটি সম্পূর্ণ করো!',
    items: ['🍎', '🍌', '🍎', '🍌', '🍎', '?'],
    choices: ['🍌', '🍎', '🍇', '🍊'],
    answer: '🍌',
    explanation: 'Apple and Banana take turns: Apple, Banana, Apple, Banana!',
    explanationBn: 'আপেল আর কলা পালাক্রমে আসছে: আপেল, কলা, আপেল, কলা!',
  },
  {
    title: 'Which One Does NOT Belong?',
    titleBn: 'কোনটি দলের সাথে মেলে না?',
    items: ['🐶', '🐱', '🐰', '🚌'],
    choices: ['🐶', '🐱', '🐰', '🚌'],
    answer: '🚌',
    explanation: 'The Bus is a vehicle, while the others are cute animals!',
    explanationBn: 'বাস হলো একটি গাড়ি, আর বাকিগুলো সুন্দর প্রাণী!',
  },
  {
    title: 'Complete the Shape Pattern!',
    titleBn: 'পরের ছবিটি কী হবে?',
    items: ['⭐', '🌙', '☀️', '⭐', '🌙', '?'],
    choices: ['☀️', '⭐', '🌙', '☁️'],
    answer: '☀️',
    explanation: 'The cycle repeats: Star, Moon, Sun!',
    explanationBn: 'ক্রমটি হলো: তারা, চাঁদ, সূর্য!',
  },
  {
    title: 'What Number Comes Next?',
    titleBn: 'পরের সংখ্যাটি কত হবে?',
    items: ['2', '4', '6', '8', '?'],
    choices: ['9', '10', '12', '7'],
    answer: '10',
    explanation: 'We are counting by 2s: 2, 4, 6, 8, 10!',
    explanationBn: '২ করে বাড়ছে: ২, ৪, ৬, ৮, ১০!',
  },
  {
    title: 'Which One Does NOT Belong?',
    titleBn: 'কোনটি এই দলে আলাদা?',
    items: ['🍓', '🍉', '🍇', '👟'],
    choices: ['🍓', '🍉', '🍇', '👟'],
    answer: '👟',
    explanation: 'A shoe is something you wear, not a yummy fruit!',
    explanationBn: 'জুতা পায়ে পরার জিনিস, ফল নয়!',
  },
  {
    title: 'What Number Comes Next?',
    titleBn: 'খালি ঘরে কোন সংখ্যা বসবে?',
    items: ['5', '10', '15', '20', '?'],
    choices: ['21', '25', '30', '22'],
    answer: '25',
    explanation: 'Counting by 5s gives 25 next!',
    explanationBn: '৫ করে বাড়লে ২০-এর পর ২৫ হবে!',
  },
  {
    title: 'Complete the Rocket Sequence!',
    titleBn: 'রকেট ও মহাকাশের ধারাটি মেলাও!',
    items: ['🚀', '🚀', '🛸', '🚀', '🚀', '?'],
    choices: ['🛸', '🚀', '🪐', '⭐'],
    answer: '🛸',
    explanation: 'Two rockets followed by one UFO!',
    explanationBn: 'দুটো রকেটের পর একটি ইউএফও!',
  },
];

export const BrainBoosterGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const totalRounds = 5;

  const [puzzles, setPuzzles] = useState<LogicPuzzle[]>([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);

  const init = useCallback(() => {
    const picked = [...PATTERN_POOL].sort(() => Math.random() - 0.5).slice(0, totalRounds);
    setPuzzles(picked);
    setRound(0);
    setScore(0);
    setCorrectCount(0);
    setWrongPicks([]);
    setLocked(false);
    if (picked[0]) {
      speakBilingual(picked[0].titleBn, picked[0].title);
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const current = puzzles[round];

  const handleSelect = (choice: string) => {
    if (!current || locked) return;
    if (choice === current.answer) {
      setLocked(true);
      audioManager.playCorrect();
      fireMiniConfetti();
      const firstTry = wrongPicks.length === 0;
      const nextScore = score + (firstTry ? 20 : 10);
      const nextCorrect = correctCount + (firstTry ? 1 : 0);
      setScore(nextScore);
      setCorrectCount(nextCorrect);
      speakBilingual(
        `দারুণ বুদ্ধি! ${current.explanationBn}`,
        `Smart thinking! ${current.explanation}`
      );

      setTimeout(() => {
        if (round + 1 >= puzzles.length) {
          recordGameResult({
            gameId: 'brain-booster',
            score: nextScore,
            correctCount: Math.max(1, nextCorrect),
            totalCount: puzzles.length,
          });
        } else {
          const nextR = round + 1;
          setRound(nextR);
          setWrongPicks([]);
          setLocked(false);
          speakBilingual(puzzles[nextR].titleBn, puzzles[nextR].title);
        }
      }, 1500);
    } else {
      audioManager.playWrong();
      setWrongPicks((prev) => [...prev, choice]);
      speakBilingual(
        'আবার ভালো করে ভেবে দেখো!',
        'Look closely at the pattern and try another one!'
      );
    }
  };

  if (!current) return null;

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="flex items-center justify-between mb-4 text-sm font-bold text-slate-600 tabular-nums">
        <span>{isEn ? `Puzzle ${round + 1} / ${puzzles.length}` : `ধাঁধা ${round + 1} / ${puzzles.length}`}</span>
        <span>{isEn ? `Score: ${score}` : `স্কোর: ${score}`}</span>
      </div>

      <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-5">
        {isEn ? current.title : current.titleBn}
      </h2>

      <div className="rounded-3xl bg-purple-50 border-2 border-purple-200 p-6 flex flex-wrap items-center justify-center gap-3 mb-6">
        {current.items.map((item, idx) => (
          <div
            key={idx}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 flex items-center justify-center font-display text-3xl font-extrabold ${
              item === '?'
                ? 'bg-white border-dashed border-purple-400 text-purple-600'
                : 'bg-white border-purple-200 text-slate-900 shadow-sm'
            }`}
          >
            {locked && item === '?' ? current.answer : item}
          </div>
        ))}
      </div>

      {locked && (
        <p className="mb-5 text-sm font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-2xl py-2.5 px-4">
          {isEn ? current.explanation : current.explanationBn}
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {current.choices.map((c) => {
          const isRight = locked && c === current.answer;
          const isWrong = wrongPicks.includes(c);
          return (
            <motion.button
              key={c}
              type="button"
              whileTap={{ scale: 0.93 }}
              onClick={() => handleSelect(c)}
              className={`min-h-20 rounded-3xl border-2 font-display text-3xl font-extrabold cursor-pointer ${
                isRight
                  ? 'bg-emerald-500 border-emerald-600 text-white'
                  : isWrong
                    ? 'bg-rose-50 border-rose-200 opacity-50'
                    : 'bg-white border-purple-200 text-slate-900 shadow-[0_5px_0_#D8B4FE] hover:bg-purple-50'
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
