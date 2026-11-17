import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Globe2 } from 'lucide-react';
import { WORLD_COUNTRIES, CountryQuestion } from '../../data/learningContent';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';
import { fireMiniConfetti } from '../../utils/confettiUtils';

interface WorldPrompt {
  questionText: string;
  questionTextBn: string;
  visual: string;
  clueText: string;
  correctAnswer: string;
  choices: string[];
}

const CAPITALS_BN: Record<string, string> = {
  Dhaka: 'ঢাকা',
  Tokyo: 'টোকিও',
  Paris: 'প্যারিস',
  Cairo: 'কায়রো',
  'Washington, D.C.': 'ওয়াশিংটন ডি.সি.',
  'Brasília': 'ব্রাসিলিয়া',
  Canberra: 'ক্যানবেরা',
  London: 'লন্ডন',
  'New Delhi': 'নয়াদিল্লি',
  Ottawa: 'অটোয়া',
};

export const WorldExplorerGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const totalRounds = 6;

  const [round, setRound] = useState(0);
  const [prompt, setPrompt] = useState<WorldPrompt | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);

  const buildPrompt = useCallback((): WorldPrompt => {
    const shuffled: CountryQuestion[] = [...WORLD_COUNTRIES].sort(() => Math.random() - 0.5);
    const target = shuffled[0];
    const distractors = shuffled.slice(1, 4);

    const qType =
      state.difficulty === 'easy'
        ? 'flag'
        : (['flag', 'capital', 'landmark'] as const)[Math.floor(Math.random() * 3)];

    if (qType === 'flag') {
      const choices = [target, ...distractors]
        .map((c) => (isEn ? c.country : c.countryBn))
        .sort(() => Math.random() - 0.5);
      const qEn = 'Which country does this flag belong to?';
      const qBn = 'এই পতাকাটি কোন দেশের?';
      speakBilingual(qBn, qEn);
      return {
        questionText: qEn,
        questionTextBn: qBn,
        visual: target.flag,
        clueText: isEn ? `Continent: ${target.continent}` : `মহাদেশ: ${target.continent}`,
        correctAnswer: isEn ? target.country : target.countryBn,
        choices,
      };
    }

    if (qType === 'capital') {
      const choices = [target, ...distractors]
        .map((c) => (isEn ? c.capital : CAPITALS_BN[c.capital] || c.capital))
        .sort(() => Math.random() - 0.5);
      const qEn = `What is the capital city of ${target.country}?`;
      const qBn = `${target.countryBn}-এর রাজধানীর নাম কী?`;
      speakBilingual(qBn, qEn);
      return {
        questionText: qEn,
        questionTextBn: qBn,
        visual: target.flag,
        clueText: `${target.countryBn} · ${target.continent}`,
        correctAnswer: isEn ? target.capital : CAPITALS_BN[target.capital] || target.capital,
        choices,
      };
    }

    const choices = [target, ...distractors]
      .map((c) => (isEn ? c.country : c.countryBn))
      .sort(() => Math.random() - 0.5);
    const qEn = `Where can you visit the ${target.landmark}?`;
    const qBn = `${target.landmark} কোন দেশে অবস্থিত?`;
    speakBilingual(qBn, qEn);
    return {
      questionText: qEn,
      questionTextBn: qBn,
      visual: target.emoji,
      clueText: isEn ? `Landmark: ${target.landmark}` : `বিখ্যাত স্থান: ${target.landmark}`,
      correctAnswer: isEn ? target.country : target.countryBn,
      choices,
    };
  }, [state.difficulty, isEn]);

  useEffect(() => {
    setRound(0);
    setScore(0);
    setCorrectCount(0);
    setPrompt(buildPrompt());
    setWrongPicks([]);
    setLocked(false);
  }, [buildPrompt]);

  const handleSelect = (choice: string) => {
    if (!prompt || locked) return;

    if (choice === prompt.correctAnswer) {
      setLocked(true);
      audioManager.playCorrect();
      fireMiniConfetti();
      const firstTry = wrongPicks.length === 0;
      const nextScore = score + (firstTry ? 15 : 10);
      const nextCorrect = correctCount + (firstTry ? 1 : 0);
      setScore(nextScore);
      setCorrectCount(nextCorrect);
      speakBilingual(`সঠিক উত্তর! ${choice}!`, `Correct! ${choice}!`);

      setTimeout(() => {
        if (round + 1 >= totalRounds) {
          recordGameResult({
            gameId: 'world-explorer',
            score: nextScore,
            correctCount: Math.max(1, nextCorrect),
            totalCount: totalRounds,
          });
        } else {
          setRound((r) => r + 1);
          setPrompt(buildPrompt());
          setWrongPicks([]);
          setLocked(false);
        }
      }, 950);
    } else {
      audioManager.playWrong();
      setWrongPicks((prev) => [...prev, choice]);
      speakBilingual('এটি নয়! আবার চেষ্টা করো।', 'Not that one, keep exploring!');
    }
  };

  if (!prompt) return null;

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="flex items-center justify-between mb-4 text-sm font-bold text-slate-600 tabular-nums">
        <span>{isEn ? `Stop ${round + 1} / ${totalRounds}` : `পর্ব ${round + 1} / ${totalRounds}`}</span>
        <span>{isEn ? `Score: ${score}` : `স্কোর: ${score}`}</span>
      </div>

      <div className="rounded-3xl bg-cyan-50 border-2 border-cyan-200 p-6 mb-6">
        <div className="text-7xl sm:text-8xl mb-3 select-none" aria-hidden="true">
          {prompt.visual}
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          {isEn ? prompt.questionText : prompt.questionTextBn}
        </h2>
        <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-800">
          <Globe2 className="w-4 h-4" />
          <span>{prompt.clueText}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {prompt.choices.map((c) => {
          const isRight = locked && c === prompt.correctAnswer;
          const isWrong = wrongPicks.includes(c);
          return (
            <motion.button
              key={c}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSelect(c)}
              className={`min-h-16 rounded-2xl border-2 px-5 py-3 font-display text-lg font-bold cursor-pointer transition-colors ${
                isRight
                  ? 'bg-emerald-500 border-emerald-600 text-white shadow-[0_4px_0_#047857]'
                  : isWrong
                    ? 'bg-rose-50 border-rose-200 text-rose-400'
                    : 'bg-white border-cyan-200 text-slate-900 shadow-[0_4px_0_#67E8F9] hover:bg-cyan-50'
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
