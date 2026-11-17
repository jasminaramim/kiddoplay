import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Volume2, Sparkles, Search } from 'lucide-react';
import { PHONICS_ALPHABET, PhonicsCard } from '../../data/learningContent';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';
import { fireMiniConfetti } from '../../utils/confettiUtils';

export const AlphabetPhonicsGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const [mode, setMode] = useState<'explore' | 'practice'>('explore');
  const [selectedCard, setSelectedCard] = useState<PhonicsCard>(PHONICS_ALPHABET[0]);

  const totalQuestions = state.difficulty === 'easy' ? 5 : state.difficulty === 'medium' ? 7 : 10;
  const [qIndex, setQIndex] = useState(0);
  const [targetCard, setTargetCard] = useState<PhonicsCard>(PHONICS_ALPHABET[0]);
  const [options, setOptions] = useState<PhonicsCard[]>([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const pickQuestion = useCallback(() => {
    const poolSize = state.difficulty === 'easy' ? 4 : state.difficulty === 'medium' ? 6 : 9;
    const shuffled = [...PHONICS_ALPHABET].sort(() => Math.random() - 0.5);
    const target = shuffled[0];
    const choices = shuffled.slice(0, poolSize).sort(() => Math.random() - 0.5);
    setTargetCard(target);
    setOptions(choices);
    setFeedback('idle');
    speakBilingual(
      `${target.letter} অক্ষরটি খুঁজে বের করো! ${target.letter} দিয়ে ${target.wordBn}`,
      `Find the letter ${target.letter}! ${target.letter} as in ${target.word}.`
    );
  }, [state.difficulty]);

  useEffect(() => {
    if (mode === 'practice') {
      setQIndex(0);
      setScore(0);
      setCorrectCount(0);
      pickQuestion();
    }
  }, [mode, pickQuestion]);

  const handleCardTap = (card: PhonicsCard) => {
    audioManager.playPop();
    setSelectedCard(card);
    speakBilingual(
      `${card.letter} তে ${card.word}, বাংলায় ${card.wordBn}`,
      `${card.letter}! ${card.phonicsSound}! ${card.letter} is for ${card.word}!`
    );
  };

  const handlePracticeChoice = (choice: PhonicsCard) => {
    if (feedback === 'correct') return;
    if (choice.letter === targetCard.letter) {
      audioManager.playCorrect();
      fireMiniConfetti();
      setFeedback('correct');
      const nextScore = score + 10;
      const nextCorrect = correctCount + 1;
      setScore(nextScore);
      setCorrectCount(nextCorrect);
      speakBilingual(
        `দারুণ হয়েছে! ${choice.letter} দিয়ে ${choice.wordBn}!`,
        `Great job! ${choice.letter} is for ${choice.word}!`
      );

      setTimeout(() => {
        if (qIndex + 1 >= totalQuestions) {
          recordGameResult({
            gameId: 'alphabet-phonics',
            score: nextScore,
            correctCount: nextCorrect,
            totalCount: totalQuestions,
          });
        } else {
          setQIndex((q) => q + 1);
          pickQuestion();
        }
      }, 950);
    } else {
      audioManager.playWrong();
      setFeedback('wrong');
      speakBilingual(
        `ওটা ${choice.letter}। তুমি ${targetCard.letter} অক্ষরটি খুঁজে বের করো!`,
        `Oops, that is ${choice.letter}. Try to find ${targetCard.letter}!`
      );
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              setMode('explore');
            }}
            className={`px-4 py-2 rounded-xl text-sm font-display font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              mode === 'explore' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>{isEn ? 'Explore A–Z' : 'এ–জেড শিখো'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              setMode('practice');
            }}
            className={`px-4 py-2 rounded-xl text-sm font-display font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              mode === 'practice' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Search className="w-4 h-4 text-sky-500" />
            <span>{isEn ? 'Practice Quiz' : 'অনুশীলন কুইজ'}</span>
          </button>
        </div>

        {mode === 'practice' && (
          <div className="text-sm font-bold text-slate-700 tabular-nums">
            {isEn ? `Question ${qIndex + 1} / ${totalQuestions} · Score ${score}` : `প্রশ্ন ${qIndex + 1} / ${totalQuestions} · স্কোর ${score}`}
          </div>
        )}
      </div>

      {mode === 'explore' ? (
        <div className="space-y-6">
          <motion.div
            key={selectedCard.letter}
            initial={{ scale: 0.94, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 360, damping: 22 }}
            className={`rounded-3xl border-2 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 ${selectedCard.color}`}
          >
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/90 border-2 border-white shadow-sm flex items-center justify-center font-display text-6xl sm:text-7xl font-extrabold">
                {selectedCard.letter}
              </div>
              <div>
                <div className="text-5xl sm:text-6xl mb-2" aria-hidden="true">
                  {selectedCard.emoji}
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold">
                  {isEn
                    ? `${selectedCard.letter} is for ${selectedCard.word}`
                    : `${selectedCard.letter} তে ${selectedCard.word} (${selectedCard.wordBn})`}
                </h2>
                <p className="text-sm font-semibold opacity-80">
                  {isEn
                    ? `Phonics sound: “${selectedCard.phonicsSound}” · বাংলা: ${selectedCard.wordBn}`
                    : `উচ্চারণ: “${selectedCard.phonicsSound}” · বাংলা অর্থ: ${selectedCard.wordBn}`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCardTap(selectedCard)}
              className="min-h-12 px-5 py-3 rounded-2xl bg-white text-slate-900 font-display font-bold text-sm border-2 border-slate-200 shadow-[0_4px_0_#CBD5E1] active:translate-y-0.5 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Volume2 className="w-5 h-5 text-sky-600" />
              <span>{isEn ? 'Speak Aloud' : 'জোরে শোনো'}</span>
            </button>
          </motion.div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-3">
            {PHONICS_ALPHABET.map((card) => {
              const active = selectedCard.letter === card.letter;
              return (
                <motion.button
                  key={card.letter}
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleCardTap(card)}
                  className={`min-h-20 rounded-2xl border-2 p-2.5 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                    card.color
                  } ${
                    active
                      ? 'ring-4 ring-sky-400 scale-105 shadow-md'
                      : 'shadow-[0_4px_0_rgba(15,23,42,0.12)] hover:-translate-y-0.5'
                  }`}
                >
                  <span className="font-display text-2xl font-extrabold leading-none">
                    {card.letter}
                  </span>
                  <span className="text-xl leading-none" aria-hidden="true">
                    {card.emoji}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto text-center py-4">
          <div className="mb-6">
            <p className="text-sm font-bold text-sky-700 mb-2">
              {isEn ? 'Listen & Find the Letter' : 'শুনে সঠিক অক্ষরটি খুঁজে বের করো'}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              {isEn ? (
                <>Find the letter <span className="text-rose-600">“{targetCard.letter}”</span>!</>
              ) : (
                <>অক্ষর <span className="text-rose-600">“{targetCard.letter}”</span> খুঁজে বের করো!</>
              )}
            </h2>
            <button
              type="button"
              onClick={() =>
                speakBilingual(
                  `${targetCard.letter} অক্ষরটি খুঁজে বের করো!`,
                  `Find the letter ${targetCard.letter}!`
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-sky-50 border-2 border-sky-200 text-sky-800 font-bold text-sm cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isEn ? 'Repeat Voice Clue' : 'আবার শোনো'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
            {options.map((opt) => {
              const isTarget = opt.letter === targetCard.letter;
              return (
                <motion.button
                  key={opt.letter}
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handlePracticeChoice(opt)}
                  className={`min-h-28 rounded-3xl border-2 p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-[0_5px_0_rgba(15,23,42,0.12)] ${
                    feedback === 'correct' && isTarget
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-900 ring-4 ring-emerald-300'
                      : opt.color
                  }`}
                >
                  <span className="font-display text-4xl font-extrabold">{opt.letter}</span>
                  <span className="text-xs font-bold opacity-80">
                    {isEn ? opt.word : opt.wordBn}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {feedback === 'wrong' && (
            <p className="text-sm font-bold text-rose-600">
              {isEn
                ? `Almost! Look closely for “${targetCard.letter}” — you can do it!`
                : `কাছাকাছি! “${targetCard.letter}” অক্ষরটি ভালো করে দেখো — তুমি পারবে!`}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
