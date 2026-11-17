import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Volume2, Lightbulb, RotateCcw } from 'lucide-react';
import { WORD_BUILDER_WORDS, WordItem } from '../../data/learningContent';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';
import { fireMiniConfetti } from '../../utils/confettiUtils';

interface Tile {
  id: string;
  char: string;
}

export const WordBuilderGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const totalWords = 5;

  const [wordsList, setWordsList] = useState<WordItem[]>([]);
  const [index, setIndex] = useState(0);
  const [poolTiles, setPoolTiles] = useState<Tile[]>([]);
  const [placedTiles, setPlacedTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<'playing' | 'won' | 'wrong'>('playing');

  const loadWord = useCallback((w: WordItem) => {
    const letters = w.word.split('').map((char, idx) => ({
      id: `${w.word}-${idx}-${Math.random()}`,
      char,
    }));
    const scrambled = [...letters].sort(() => Math.random() - 0.5);
    setPoolTiles(scrambled);
    setPlacedTiles([]);
    setShowHint(false);
    setStatus('playing');
    speakBilingual(
      `ছবি দেখে ইংরেজি শব্দটি সাজাও! বাংলায় এটা ${w.wordBn}।`,
      `Spell the word ${w.word}! ${w.hint}`
    );
  }, []);

  useEffect(() => {
    const filtered = WORD_BUILDER_WORDS.filter((w) => {
      if (state.difficulty === 'easy') return w.level === 'easy';
      if (state.difficulty === 'medium') return w.level !== 'hard';
      return true;
    });
    const chosen = [...filtered].sort(() => Math.random() - 0.5).slice(0, totalWords);
    setWordsList(chosen);
    setIndex(0);
    setScore(0);
    setCorrectCount(0);
    if (chosen[0]) {
      loadWord(chosen[0]);
    }
  }, [state.difficulty, loadWord]);

  const currentWord = wordsList[index];

  const handlePickTile = (tile: Tile) => {
    if (!currentWord || status === 'won') return;
    audioManager.playPop();
    speakBilingual(tile.char, tile.char);
    const nextPool = poolTiles.filter((t) => t.id !== tile.id);
    const nextPlaced = [...placedTiles, tile];
    setPoolTiles(nextPool);
    setPlacedTiles(nextPlaced);
    setStatus('playing');

    if (nextPlaced.length === currentWord.word.length) {
      const spelled = nextPlaced.map((t) => t.char).join('');
      if (spelled === currentWord.word) {
        setStatus('won');
        audioManager.playCorrect();
        fireMiniConfetti();
        const nextScore = score + (showHint ? 10 : 15);
        const nextCorrect = correctCount + 1;
        setScore(nextScore);
        setCorrectCount(nextCorrect);
        speakBilingual(
          `দারুণ! ${currentWord.wordBn} মানে ${currentWord.word}!`,
          `Fantastic! ${currentWord.word}!`
        );

        setTimeout(() => {
          if (index + 1 >= wordsList.length) {
            recordGameResult({
              gameId: 'word-builder',
              score: nextScore,
              correctCount: nextCorrect,
              totalCount: wordsList.length,
            });
          } else {
            const nextIdx = index + 1;
            setIndex(nextIdx);
            loadWord(wordsList[nextIdx]);
          }
        }, 1000);
      } else {
        setStatus('wrong');
        audioManager.playWrong();
        speakBilingual(
          'বানানটি ঠিক হয়নি! অক্ষরে ট্যাপ করে আবার সাজাও।',
          'Not quite! Tap a letter to try another order.'
        );
      }
    }
  };

  const handleRemovePlaced = (tile: Tile) => {
    if (status === 'won') return;
    audioManager.playClick();
    setPlacedTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setPoolTiles((prev) => [...prev, tile]);
    setStatus('playing');
  };

  if (!currentWord) return null;

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="flex items-center justify-between mb-4 text-sm font-bold text-slate-600 tabular-nums">
        <span>{isEn ? `Word ${index + 1} / ${wordsList.length}` : `শব্দ ${index + 1} / ${wordsList.length}`}</span>
        <span>{isEn ? `Score: ${score}` : `স্কোর: ${score}`}</span>
      </div>

      <div className="inline-flex flex-col items-center bg-indigo-50 border-2 border-indigo-200 rounded-3xl px-8 py-5 mb-5">
        <div className="text-7xl mb-2" aria-hidden="true">{currentWord.emoji}</div>
        <p className="text-base font-display font-bold text-indigo-900">
          {currentWord.wordBn}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        <button
          type="button"
          onClick={() =>
            speakBilingual(`ছবিটি হলো ${currentWord.wordBn}`, currentWord.word)
          }
          className="px-4 py-2 rounded-2xl bg-sky-50 border-2 border-sky-200 text-sky-800 text-sm font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
          <span>{isEn ? 'Hear Word' : 'শব্দ শোনো'}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            audioManager.playClick();
            setShowHint(true);
            speakBilingual(
              `প্রথম অক্ষর হলো ${currentWord.word[0]}`,
              currentWord.hint
            );
          }}
          className="px-4 py-2 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-900 text-sm font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Lightbulb className="w-4 h-4" />
          <span>{isEn ? 'Hint' : 'সংকেত'}</span>
        </button>
        <button
          type="button"
          onClick={() => loadWord(currentWord)}
          className="px-3.5 py-2 rounded-2xl bg-slate-100 border-2 border-slate-200 text-slate-700 text-sm font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isEn ? 'Reset' : 'আবার সাজাও'}</span>
        </button>
      </div>

      {showHint && (
        <p className="text-sm font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-2xl py-2 px-4 mb-5">
          {isEn
            ? `Clue: ${currentWord.hint} · Starts with “${currentWord.word[0]}”`
            : `সংকেত: প্রথম অক্ষর “${currentWord.word[0]}” (${currentWord.wordBn})`}
        </p>
      )}

      <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-7">
        {currentWord.word.split('').map((_, slotIdx) => {
          const placed = placedTiles[slotIdx];
          return (
            <button
              key={slotIdx}
              type="button"
              disabled={!placed}
              onClick={() => placed && handleRemovePlaced(placed)}
              className={`w-14 h-16 sm:w-16 sm:h-18 rounded-2xl border-2 font-display text-3xl font-extrabold flex items-center justify-center transition-all ${
                placed
                  ? status === 'won'
                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-[0_5px_0_#047857]'
                    : status === 'wrong'
                      ? 'bg-rose-100 border-rose-400 text-rose-800 cursor-pointer'
                      : 'bg-sky-500 border-sky-600 text-white shadow-[0_5px_0_#0284C7] cursor-pointer'
                  : 'bg-slate-100 border-dashed border-slate-300 text-slate-400'
              }`}
            >
              {placed ? placed.char : ''}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {poolTiles.map((tile) => (
          <motion.button
            key={tile.id}
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => handlePickTile(tile)}
            className="w-14 h-16 sm:w-16 sm:h-18 rounded-2xl bg-white border-2 border-indigo-300 text-indigo-900 font-display text-3xl font-extrabold shadow-[0_5px_0_#A5B4FC] hover:bg-indigo-50 cursor-pointer"
          >
            {tile.char}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
