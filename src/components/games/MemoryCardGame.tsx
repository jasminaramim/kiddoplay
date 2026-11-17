import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';
import { fireMiniConfetti } from '../../utils/confettiUtils';

interface Card {
  uid: number;
  pairId: string;
  emoji: string;
  label: string;
  labelBn: string;
  flipped: boolean;
  matched: boolean;
}

const SYMBOLS = [
  { id: 'dog', emoji: '🐶', label: 'Puppy', labelBn: 'কুকুরছানা' },
  { id: 'cat', emoji: '🐱', label: 'Kitty', labelBn: 'বিড়ালছানা' },
  { id: 'apple', emoji: '🍎', label: 'Apple', labelBn: 'আপেল' },
  { id: 'banana', emoji: '🍌', label: 'Banana', labelBn: 'কলা' },
  { id: 'lion', emoji: '🦁', label: 'Lion', labelBn: 'সিংহ' },
  { id: 'panda', emoji: '🐼', label: 'Panda', labelBn: 'পান্ডা' },
  { id: 'rocket', emoji: '🚀', label: 'Rocket', labelBn: 'রকেট' },
  { id: 'strawberry', emoji: '🍓', label: 'Berry', labelBn: 'স্ট্রবেরি' },
  { id: 'frog', emoji: '🐸', label: 'Frog', labelBn: 'ব্যাঙ' },
  { id: 'unicorn', emoji: '🦄', label: 'Unicorn', labelBn: 'ইউনিকর্ন' },
];

export const MemoryCardGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const pairCount = state.difficulty === 'easy' ? 6 : state.difficulty === 'medium' ? 8 : 10;

  const [cards, setCards] = useState<Card[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const setupDeck = useCallback(() => {
    const selected = SYMBOLS.slice(0, pairCount);
    const doubled = [...selected, ...selected]
      .sort(() => Math.random() - 0.5)
      .map((item, idx) => ({
        uid: idx,
        pairId: item.id,
        emoji: item.emoji,
        label: item.label,
        labelBn: item.labelBn,
        flipped: false,
        matched: false,
      }));
    setCards(doubled);
    setOpenIndices([]);
    setMoves(0);
    setLocked(false);
  }, [pairCount]);

  useEffect(() => {
    setupDeck();
  }, [setupDeck]);

  const handleCardClick = (idx: number) => {
    if (locked) return;
    const card = cards[idx];
    if (!card || card.flipped || card.matched) return;

    audioManager.playClick();
    const updated = cards.map((c, i) => (i === idx ? { ...c, flipped: true } : c));
    setCards(updated);

    const nextOpen = [...openIndices, idx];
    setOpenIndices(nextOpen);

    if (nextOpen.length === 2) {
      setLocked(true);
      const nextMoves = moves + 1;
      setMoves(nextMoves);
      const [firstIdx, secondIdx] = nextOpen;
      const first = updated[firstIdx];
      const second = updated[secondIdx];

      if (first.pairId === second.pairId) {
        audioManager.playCorrect();
        fireMiniConfetti();
        speakBilingual(`${first.labelBn}! দারুণ মিলেছে!`, first.label);
        const afterMatch = updated.map((c, i) =>
          i === firstIdx || i === secondIdx ? { ...c, matched: true } : c
        );
        setCards(afterMatch);
        setOpenIndices([]);
        setLocked(false);

        if (afterMatch.every((c) => c.matched)) {
          const score = Math.max(40, pairCount * 20 - (nextMoves - pairCount) * 4);
          setTimeout(() => {
            recordGameResult({
              gameId: 'memory-cards',
              score,
              correctCount: pairCount,
              totalCount: nextMoves,
              customStars: nextMoves <= pairCount + 4 ? 3 : nextMoves <= pairCount + 8 ? 2 : 1,
            });
          }, 600);
        }
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, flipped: false } : c
            )
          );
          setOpenIndices([]);
          setLocked(false);
        }, 720);
      }
    }
  };

  const matchedPairs = cards.filter((c) => c.matched).length / 2;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="text-sm font-bold text-slate-700 tabular-nums">
          {isEn
            ? `Pairs: ${matchedPairs} / ${pairCount} · Moves: ${moves}`
            : `মিলেছে: ${matchedPairs} / ${pairCount} জোড়া · চাল: ${moves}`}
        </div>
        <button
          type="button"
          onClick={setupDeck}
          className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isEn ? 'Shuffle' : 'নতুন করে সাজাও'}</span>
        </button>
      </div>

      <div
        className={`grid gap-3 ${
          pairCount === 6
            ? 'grid-cols-3 sm:grid-cols-4'
            : pairCount === 8
              ? 'grid-cols-4'
              : 'grid-cols-4 sm:grid-cols-5'
        }`}
      >
        {cards.map((card, idx) => {
          const isOpen = card.flipped || card.matched;
          const displayLabel = isEn ? card.label : card.labelBn;
          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => handleCardClick(idx)}
              className="perspective-1000 h-24 sm:h-28 cursor-pointer select-none"
              aria-label={isOpen ? displayLabel : isEn ? 'Hidden memory card' : 'লুকানো কার্ড'}
            >
              <div
                className={`relative w-full h-full transition-transform duration-300 transform-style-3d ${
                  isOpen ? 'rotate-y-180' : ''
                }`}
              >
                <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 border-2 border-sky-600 shadow-[0_5px_0_#0284C7] flex items-center justify-center text-3xl text-white font-display font-extrabold">
                  ?
                </div>
                <div
                  className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 ${
                    card.matched
                      ? 'bg-emerald-50 border-emerald-400'
                      : 'bg-white border-sky-300 shadow-[0_5px_0_#BAE6FD]'
                  }`}
                >
                  <span className="text-4xl" aria-hidden="true">{card.emoji}</span>
                  <span className="text-[11px] font-bold text-slate-600">{displayLabel}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
