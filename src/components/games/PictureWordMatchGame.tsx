import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { PHONICS_ALPHABET } from '../../data/learningContent';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';
import { fireMiniConfetti } from '../../utils/confettiUtils';

interface PairItem {
  id: string;
  word: string;
  wordBn: string;
  emoji: string;
}

export const PictureWordMatchGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const pairCount = state.difficulty === 'easy' ? 4 : state.difficulty === 'medium' ? 5 : 6;

  const [pairs, setPairs] = useState<PairItem[]>([]);
  const [shuffledWords, setShuffledWords] = useState<PairItem[]>([]);
  const [selectedPicture, setSelectedPicture] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [score, setScore] = useState(0);

  const setupBoard = useCallback(() => {
    const picked = [...PHONICS_ALPHABET]
      .sort(() => Math.random() - 0.5)
      .slice(0, pairCount)
      .map((item) => ({
        id: item.letter,
        word: item.word,
        wordBn: item.wordBn,
        emoji: item.emoji,
      }));
    setPairs(picked);
    setShuffledWords([...picked].sort(() => Math.random() - 0.5));
    setSelectedPicture(null);
    setMatchedIds([]);
    setMistakes(0);
    setScore(0);
    speakBilingual(
      'বাম পাশের একটি ছবি ট্যাপ করো, তারপর ডান পাশের সঠিক শব্দটি মেলাও!',
      'Tap a picture, then tap its matching word!'
    );
  }, [pairCount]);

  useEffect(() => {
    setupBoard();
  }, [setupBoard]);

  const handleSelectPicture = (item: PairItem) => {
    if (matchedIds.includes(item.id)) return;
    audioManager.playClick();
    setSelectedPicture(item.id);
    speakBilingual(item.wordBn, item.word);
  };

  const handleSelectWord = (wordItem: PairItem) => {
    if (!selectedPicture || matchedIds.includes(wordItem.id)) return;

    if (selectedPicture === wordItem.id) {
      audioManager.playCorrect();
      fireMiniConfetti();
      const nextMatched = [...matchedIds, wordItem.id];
      const nextScore = score + 15;
      setMatchedIds(nextMatched);
      setSelectedPicture(null);
      setScore(nextScore);
      speakBilingual(`মিলে গেছে! ${wordItem.wordBn}!`, `Match! ${wordItem.word}!`);

      if (nextMatched.length === pairs.length) {
        setTimeout(() => {
          const correctEstimate = Math.max(1, pairs.length - Math.min(pairs.length - 1, mistakes));
          recordGameResult({
            gameId: 'picture-word-match',
            score: nextScore,
            correctCount: correctEstimate,
            totalCount: pairs.length,
          });
        }, 700);
      }
    } else {
      audioManager.playWrong();
      setMistakes((m) => m + 1);
      speakBilingual(
        `ওটা হলো ${wordItem.wordBn}। আবার চেষ্টা করো!`,
        `Oops, that word is ${wordItem.word}. Try again!`
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5 text-sm font-bold text-slate-600 tabular-nums">
        <span>{isEn ? `Matched ${matchedIds.length} / ${pairs.length}` : `মিলেছে ${matchedIds.length} / ${pairs.length}`}</span>
        <span>{isEn ? `Score: ${score}` : `স্কোর: ${score}`}</span>
      </div>

      <p className="text-center font-display text-lg font-bold text-slate-800 mb-5">
        {isEn
          ? '1. Tap a picture on the left · 2. Tap its matching word on the right'
          : '১. বামে ছবি ট্যাপ করো · ২. ডানে সঠিক শব্দটি ট্যাপ করো'}
      </p>

      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        <div className="space-y-3">
          {pairs.map((item) => {
            const isMatched = matchedIds.includes(item.id);
            const isSelected = selectedPicture === item.id;
            return (
              <motion.button
                key={item.id}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectPicture(item)}
                className={`w-full min-h-20 rounded-2xl border-2 px-4 py-3 flex items-center justify-center text-4xl cursor-pointer transition-all ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-300 opacity-75'
                    : isSelected
                      ? 'bg-fuchsia-100 border-fuchsia-500 ring-4 ring-fuchsia-200'
                      : 'bg-white border-slate-200 shadow-[0_4px_0_#E2E8F0] hover:border-fuchsia-300'
                }`}
              >
                <span aria-hidden="true">{item.emoji}</span>
                {isMatched && <Check className="w-5 h-5 text-emerald-600 ml-2" />}
              </motion.button>
            );
          })}
        </div>

        <div className="space-y-3">
          {shuffledWords.map((item) => {
            const isMatched = matchedIds.includes(item.id);
            return (
              <motion.button
                key={item.id}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectWord(item)}
                className={`w-full min-h-20 rounded-2xl border-2 px-4 py-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-75'
                    : selectedPicture
                      ? 'bg-white border-sky-300 shadow-[0_4px_0_#7DD3FC] hover:bg-sky-50'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span className="font-display text-lg sm:text-xl font-extrabold">
                  {isEn ? item.word : item.wordBn}
                </span>
                {state.language === 'both' && (
                  <span className="text-xs font-semibold text-slate-500">{item.word}</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
