import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { VEHICLE_QUIZ_ITEMS, VehicleItem } from '../../data/learningContent';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';
import { fireMiniConfetti } from '../../utils/confettiUtils';

const VEHICLES_BN: Record<string, { soundBn: string; clueBn: string }> = {
  'School Bus': { soundBn: 'পিঁপ! পিঁপ!', clueBn: 'বড় হলুদ রঙের গাড়ি যা বাচ্চাদের স্কুলে নিয়ে যায়!' },
  Train: { soundBn: 'ঝিক! ঝিক! কু-উ-উ!', clueBn: 'লোহার রেললাইনের ওপর দিয়ে দ্রুত ছুটে চলে!' },
  'Fire Truck': { soundBn: 'উই-উ! উই-উ!', clueBn: 'আগুন নেভানোর জন্য পানি ও মই নিয়ে ছুটে আসে!' },
  Airplane: { soundBn: 'হু-উ-শ!', clueBn: 'বড় ডানা মেলে মেঘের ওপর দিয়ে আকাশে ওড়ে!' },
  Car: { soundBn: 'পোঁ-পোঁ!', clueBn: 'চার চাকার গাড়ি যা রাস্তা দিয়ে পরিবার নিয়ে চলে!' },
  Ship: { soundBn: 'ভোঁ-ও-ও!', clueBn: 'গভীর সমুদ্র ও নদীর পানিতে ভেসে চলে!' },
};

export const VehicleQuizGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const totalRounds = 5;

  const [round, setRound] = useState(0);
  const [target, setTarget] = useState<VehicleItem>(VEHICLE_QUIZ_ITEMS[0]);
  const [options, setOptions] = useState<VehicleItem[]>([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongNames, setWrongNames] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);

  const playClue = useCallback((v: VehicleItem) => {
    audioManager.playVehicleEffect(v.effect);
    const bn = VEHICLES_BN[v.name];
    setTimeout(() => {
      speakBilingual(
        `${bn?.soundBn || ''} ${bn?.clueBn || ''} এটি কোন যানবাহন?`,
        `${v.soundLabel} ${v.clue}`
      );
    }, 380);
  }, []);

  const setupRound = useCallback(() => {
    const shuffled = [...VEHICLE_QUIZ_ITEMS].sort(() => Math.random() - 0.5);
    const chosen = shuffled[0];
    const choices = shuffled.slice(0, 4).sort(() => Math.random() - 0.5);
    setTarget(chosen);
    setOptions(choices);
    setWrongNames([]);
    setLocked(false);
    playClue(chosen);
  }, [playClue]);

  useEffect(() => {
    setRound(0);
    setScore(0);
    setCorrectCount(0);
    setupRound();
  }, [setupRound]);

  const handleSelect = (v: VehicleItem) => {
    if (locked) return;
    if (v.name === target.name) {
      setLocked(true);
      audioManager.playCorrect();
      fireMiniConfetti();
      const firstTry = wrongNames.length === 0;
      const nextScore = score + (firstTry ? 15 : 10);
      const nextCorrect = correctCount + (firstTry ? 1 : 0);
      setScore(nextScore);
      setCorrectCount(nextCorrect);
      speakBilingual(`দারুণ! ওটা হলো ${v.nameBn}!`, `Yes! That is the ${v.name}!`);

      setTimeout(() => {
        if (round + 1 >= totalRounds) {
          recordGameResult({
            gameId: 'vehicle-quiz',
            score: nextScore,
            correctCount: Math.max(1, nextCorrect),
            totalCount: totalRounds,
          });
        } else {
          setRound((r) => r + 1);
          setupRound();
        }
      }, 950);
    } else {
      audioManager.playWrong();
      setWrongNames((prev) => [...prev, v.name]);
      speakBilingual(`ওটা ${v.nameBn}। আবার চেষ্টা করো!`, `That is a ${v.name}. Try again!`);
    }
  };

  const targetBn = VEHICLES_BN[target.name];

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="flex items-center justify-between mb-4 text-sm font-bold text-slate-600 tabular-nums">
        <span>{isEn ? `Vehicle ${round + 1} / ${totalRounds}` : `যানবাহন ${round + 1} / ${totalRounds}`}</span>
        <span>{isEn ? `Score: ${score}` : `স্কোর: ${score}`}</span>
      </div>

      <div className="rounded-3xl bg-red-50 border-2 border-red-200 p-6 mb-6">
        <p className="text-xs font-bold text-red-700 mb-1">
          “{isEn ? target.soundLabel : targetBn?.soundBn || target.soundLabel}”
        </p>
        <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 mb-4">
          {isEn ? target.clue : targetBn?.clueBn || target.clue}
        </h2>
        <button
          type="button"
          onClick={() => playClue(target)}
          className="min-h-11 px-5 py-2.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-display font-bold text-sm border-2 border-red-600 shadow-[0_4px_0_#B91C1C] inline-flex items-center gap-2 cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
          <span>{isEn ? 'Honk / Hear Clue' : 'আবার শব্দ ও সূত্র শোনো'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map((v) => {
          const isRight = locked && v.name === target.name;
          const isWrong = wrongNames.includes(v.name);
          return (
            <motion.button
              key={v.name}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => handleSelect(v)}
              className={`min-h-32 rounded-3xl border-2 p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                isRight
                  ? 'bg-emerald-500 border-emerald-600 text-white'
                  : isWrong
                    ? 'bg-rose-50 border-rose-200 opacity-60'
                    : 'bg-white border-slate-200 shadow-[0_5px_0_#E2E8F0] hover:border-red-300'
              }`}
            >
              <span className="text-5xl" aria-hidden="true">{v.emoji}</span>
              <span className="font-display text-lg font-extrabold">
                {isEn ? v.name : v.nameBn}
              </span>
              {state.language === 'both' && (
                <span className="text-xs font-semibold opacity-75">{v.name}</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
