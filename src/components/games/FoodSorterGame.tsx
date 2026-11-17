import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Apple, Cookie } from 'lucide-react';
import { FOOD_SORTER_ITEMS, FoodItem } from '../../data/learningContent';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';
import { fireMiniConfetti } from '../../utils/confettiUtils';

const FOOD_TIPS_BN: Record<string, string> = {
  Apple: 'আপেলে প্রচুর ভিটামিন আছে যা শরীর সুস্থ রাখে!',
  Broccoli: 'সবুজ সবজি আমাদের হাড় ও শরীর শক্তিশালী করে!',
  Carrot: 'গাজর খেলে আমাদের চোখ খুব ভালো থাকে!',
  Banana: 'কলা আমাদের খেলার জন্য দ্রুত শক্তি জোগায়!',
  Watermelon: 'তরমুজ গরমে শরীর ঠান্ডা ও সতেজ রাখে!',
  Milk: 'দুধে থাকা ক্যালসিয়াম দাঁত ও হাড় মজবুত করে!',
  Donut: 'অতিরিক্ত চিনিযুক্ত খাবার প্রতিদিন খাওয়া উচিত নয়!',
  Candy: 'বেশি মিষ্টি ক্যান্ডি খেলে দাঁতের ক্ষতি হতে পারে!',
  Soda: 'কোমল পানীয়ের চেয়ে পানি ও তাজা ফলের রস অনেক স্বাস্থ্যকর!',
  'French Fries': 'ভাজাপোড়া খাবার মাঝে মাঝে খাওয়া ভালো, প্রতিদিন নয়!',
  Cupcake: 'কেক বা পেস্ট্রি শুধু বিশেষ দিনের জন্য রাখাই ভালো!',
  Avocado: 'অ্যাভোকাডো মস্তিষ্কের জন্য দারুণ উপকারী ফল!',
};

export const FoodSorterGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const totalItems = 8;

  const [queue, setQueue] = useState<FoodItem[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [tipText, setTipText] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const setupGame = useCallback(() => {
    const picked = [...FOOD_SORTER_ITEMS].sort(() => Math.random() - 0.5).slice(0, totalItems);
    setQueue(picked);
    setIndex(0);
    setScore(0);
    setCorrectCount(0);
    setTipText(null);
    setLocked(false);
    if (picked[0]) {
      speakBilingual(
        `${picked[0].nameBn} কি স্বাস্থ্যকর খাবার নাকি জাঙ্ক ফুড?`,
        `Is ${picked[0].name} a healthy everyday food or an occasional treat?`
      );
    }
  }, []);

  useEffect(() => {
    setupGame();
  }, [setupGame]);

  const currentFood = queue[index];

  const handleSort = (basket: 'healthy' | 'treat') => {
    if (!currentFood || locked) return;
    setLocked(true);

    const isRight = currentFood.category === basket;
    let nextScore = score;
    let nextCorrect = correctCount;
    const tipBn = FOOD_TIPS_BN[currentFood.name] || currentFood.tip;

    if (isRight) {
      audioManager.playCorrect();
      fireMiniConfetti();
      nextScore += 15;
      nextCorrect += 1;
      setScore(nextScore);
      setCorrectCount(nextCorrect);
      speakBilingual(`সঠিক! ${tipBn}`, `Right! ${currentFood.tip}`);
    } else {
      audioManager.playWrong();
      speakBilingual(`ওহ! ${tipBn}`, `Oops! ${currentFood.tip}`);
    }

    setTipText(isEn ? currentFood.tip : tipBn);

    setTimeout(() => {
      if (index + 1 >= queue.length) {
        recordGameResult({
          gameId: 'food-sorter',
          score: nextScore,
          correctCount: Math.max(1, nextCorrect),
          totalCount: queue.length,
        });
      } else {
        const nextIdx = index + 1;
        setIndex(nextIdx);
        setTipText(null);
        setLocked(false);
        speakBilingual(
          `এবারের খাবার হলো ${queue[nextIdx].nameBn}!`,
          `Next up: ${queue[nextIdx].name}!`
        );
      }
    }, 1350);
  };

  if (!currentFood) return null;

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="flex items-center justify-between mb-4 text-sm font-bold text-slate-600 tabular-nums">
        <span>{isEn ? `Food ${index + 1} / ${queue.length}` : `খাবার ${index + 1} / ${queue.length}`}</span>
        <span>{isEn ? `Score: ${score}` : `স্কোর: ${score}`}</span>
      </div>

      <p className="text-sm font-bold text-emerald-700 mb-3">
        {isEn ? 'Sort each food into the right basket!' : 'প্রতিটি খাবার সঠিক ঝুড়িতে রাখো!'}
      </p>

      <motion.div
        key={currentFood.name}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-flex flex-col items-center justify-center rounded-3xl bg-white border-2 border-slate-200 px-10 py-6 shadow-[0_6px_0_#E2E8F0] mb-6"
      >
        <div className="text-7xl mb-2" aria-hidden="true">{currentFood.emoji}</div>
        <h2 className="font-display text-2xl font-extrabold text-slate-900">
          {isEn ? currentFood.name : currentFood.nameBn}
        </h2>
        {state.language === 'both' && (
          <p className="text-sm font-semibold text-slate-500">{currentFood.name}</p>
        )}
      </motion.div>

      {tipText && (
        <div className="mb-5 bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 text-sm font-bold text-amber-900">
          {tipText}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSort('healthy')}
          className="min-h-28 rounded-3xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 p-5 flex flex-col items-center justify-center gap-2 text-emerald-900 shadow-[0_5px_0_#6EE7B7] cursor-pointer"
        >
          <Apple className="w-8 h-8 text-emerald-600" />
          <span className="font-display text-xl font-extrabold">
            {isEn ? 'Healthy Everyday Food' : 'স্বাস্থ্যকর ও পুষ্টিকর খাবার'}
          </span>
          <span className="text-xs font-semibold text-emerald-700">
            {isEn ? 'Fruits, veggies & protein' : 'ফলমূল, সবজি ও দুধ'}
          </span>
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSort('treat')}
          className="min-h-28 rounded-3xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 p-5 flex flex-col items-center justify-center gap-2 text-rose-900 shadow-[0_5px_0_#FDA4AF] cursor-pointer"
        >
          <Cookie className="w-8 h-8 text-rose-600" />
          <span className="font-display text-xl font-extrabold">
            {isEn ? 'Occasional Treat' : 'জাঙ্ক ফুড / মিষ্টি খাবার'}
          </span>
          <span className="text-xs font-semibold text-rose-700">
            {isEn ? 'Sweets & sugary snacks' : 'চিনি ও ভাজাপোড়া স্ন্যাকস'}
          </span>
        </motion.button>
      </div>
    </div>
  );
};
