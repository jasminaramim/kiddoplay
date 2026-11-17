import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { ANIMALS_QUIZ, AnimalItem } from '../../data/learningContent';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';
import { fireMiniConfetti } from '../../utils/confettiUtils';

const ANIMAL_BN_INFO: Record<string, { soundBn: string; factBn: string }> = {
  cow: { soundBn: 'হাম্বা! হাম্বা!', factBn: 'গরু শান্ত প্রকৃতির প্রাণী এবং আমাদের দুধ দেয়।' },
  dog: { soundBn: 'ঘেউ! ঘেউ!', factBn: 'কুকুর মানুষের খুব বিশ্বস্ত বন্ধু এবং ঘ্রাণশক্তি প্রবল।' },
  cat: { soundBn: 'মিউ! মিউ!', factBn: 'বিড়াল খুব পরিষ্কার প্রাণী এবং আরাম করে ঘুমাতে ভালোবাসে।' },
  bird: { soundBn: 'কিচির! মিচির!', factBn: 'পাখির হালকা ডানা থাকায় তারা আকাশে উড়তে পারে।' },
  lion: { soundBn: 'হালুম! হালুম!', factBn: 'সিংহের গর্জন অনেক দূর থেকেও শোনা যায়!' },
  duck: { soundBn: 'প্যাক! প্যাক!', factBn: 'হাঁসের পালকে পানি লাগে না, তাই তারা পুকুরে সাঁতার কাটে।' },
  sheep: { soundBn: 'ম্যা! ম্যা!', factBn: 'ভেড়ার নরম লোম থেকে শীতের গরম উল তৈরি হয়।' },
  frog: { soundBn: 'ঘ্যাঙর! ঘ্যাঙ!', factBn: 'ব্যাঙ বৃষ্টির দিনে পুকুরের ধারে গান গায়!' },
};

export const AnimalSoundsGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const totalRounds = 6;

  const [round, setRound] = useState(0);
  const [target, setTarget] = useState<AnimalItem>(ANIMALS_QUIZ[0]);
  const [options, setOptions] = useState<AnimalItem[]>([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [revealedFact, setRevealedFact] = useState<string | null>(null);
  const [wrongIds, setWrongIds] = useState<string[]>([]);

  const playSoundClue = useCallback((animal: AnimalItem) => {
    audioManager.playAnimalEffect(animal.effect);
    const bnInfo = ANIMAL_BN_INFO[animal.id];
    setTimeout(() => {
      speakBilingual(
        `কোন প্রাণী ${bnInfo?.soundBn || animal.soundText} করে ডাকে?`,
        `Which animal says ${animal.soundText}?`
      );
    }, 320);
  }, []);

  const setupRound = useCallback(() => {
    const optCount = state.difficulty === 'easy' ? 3 : 4;
    const shuffled = [...ANIMALS_QUIZ].sort(() => Math.random() - 0.5);
    const chosen = shuffled[0];
    const choices = shuffled.slice(0, optCount).sort(() => Math.random() - 0.5);
    setTarget(chosen);
    setOptions(choices);
    setRevealedFact(null);
    setWrongIds([]);
    playSoundClue(chosen);
  }, [state.difficulty, playSoundClue]);

  useEffect(() => {
    setRound(0);
    setScore(0);
    setCorrectCount(0);
    setupRound();
  }, [setupRound]);

  const handleSelect = (animal: AnimalItem) => {
    if (revealedFact) return;
    const bnInfo = ANIMAL_BN_INFO[animal.id];
    if (animal.id === target.id) {
      audioManager.playCorrect();
      fireMiniConfetti();
      const firstTry = wrongIds.length === 0;
      const nextScore = score + (firstTry ? 15 : 10);
      const nextCorrect = correctCount + (firstTry ? 1 : 0);
      setScore(nextScore);
      setCorrectCount(nextCorrect);
      const factText = isEn ? animal.fact : bnInfo?.factBn || animal.fact;
      setRevealedFact(factText);
      speakBilingual(
        `একদম ঠিক! ওটা হলো ${animal.nameBn}! ${bnInfo?.factBn || ''}`,
        `Yes! It is the ${animal.name}! ${animal.fact}`
      );

      setTimeout(() => {
        if (round + 1 >= totalRounds) {
          recordGameResult({
            gameId: 'animal-sounds',
            score: nextScore,
            correctCount: Math.max(1, nextCorrect),
            totalCount: totalRounds,
          });
        } else {
          setRound((r) => r + 1);
          setupRound();
        }
      }, 2200);
    } else {
      audioManager.playWrong();
      setWrongIds((prev) => [...prev, animal.id]);
      speakBilingual(
        `ওটা হলো ${animal.nameBn}। আবার শব্দটি শুনে দেখো!`,
        `That is a ${animal.name}. Listen again!`
      );
    }
  };

  const targetBn = ANIMAL_BN_INFO[target.id];

  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="flex items-center justify-between mb-4 text-sm font-bold text-slate-600 tabular-nums">
        <span>{isEn ? `Animal ${round + 1} / ${totalRounds}` : `প্রাণী ${round + 1} / ${totalRounds}`}</span>
        <span>{isEn ? `Score: ${score}` : `স্কোর: ${score}`}</span>
      </div>

      <div className="rounded-3xl bg-lime-50 border-2 border-lime-200 p-6 mb-6">
        <p className="text-sm font-bold text-lime-800 mb-2">
          {isEn ? 'Listen to the Sound Clue' : 'প্রাণীর ডাকটি মনোযোগ দিয়ে শোনো'}
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
          “{isEn ? target.soundText : targetBn?.soundBn || target.soundText}”
        </h2>
        <button
          type="button"
          onClick={() => playSoundClue(target)}
          className="min-h-12 px-6 py-3 rounded-2xl bg-lime-500 hover:bg-lime-600 text-white font-display font-bold text-base border-2 border-lime-600 shadow-[0_5px_0_#4D7C0F] active:translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
        >
          <Volume2 className="w-5 h-5" />
          <span>{isEn ? 'Play Animal Sound' : 'আবার ডাক শোনো'}</span>
        </button>
      </div>

      <div className={`grid gap-4 mb-5 ${options.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {options.map((a) => {
          const isMatched = Boolean(revealedFact) && a.id === target.id;
          const isWrong = wrongIds.includes(a.id);
          return (
            <motion.button
              key={a.id}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => handleSelect(a)}
              className={`min-h-36 rounded-3xl border-2 p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                isMatched
                  ? 'bg-emerald-100 border-emerald-400 ring-4 ring-emerald-200'
                  : isWrong
                    ? 'bg-rose-50 border-rose-200 opacity-60'
                    : 'bg-white border-slate-200 shadow-[0_6px_0_#E2E8F0] hover:border-lime-400'
              }`}
            >
              <span className="text-5xl sm:text-6xl" aria-hidden="true">{a.emoji}</span>
              <span className="font-display text-lg font-bold text-slate-900">
                {isEn ? a.name : a.nameBn}
              </span>
              {state.language === 'both' && (
                <span className="text-xs font-semibold text-slate-500">{a.name}</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {revealedFact && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-sm font-semibold text-amber-900">
          {isEn ? `Fun Fact: ${revealedFact}` : `মজার তথ্য: ${revealedFact}`}
        </div>
      )}
    </div>
  );
};
