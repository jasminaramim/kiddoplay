import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';
import { fireMiniConfetti } from '../../utils/confettiUtils';

interface ShapeItem {
  id: string;
  colorName: string;
  colorNameBn: string;
  shapeName: string;
  shapeNameBn: string;
  fill: string;
  stroke: string;
  shape: 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'diamond';
}

const COLOR_OPTIONS = [
  { name: 'Red', nameBn: 'লাল', fill: '#EF4444', stroke: '#B91C1C' },
  { name: 'Blue', nameBn: 'নীল', fill: '#0EA5E9', stroke: '#0369A1' },
  { name: 'Yellow', nameBn: 'হলুদ', fill: '#FACC15', stroke: '#CA8A04' },
  { name: 'Green', nameBn: 'সবুজ', fill: '#10B981', stroke: '#047857' },
  { name: 'Purple', nameBn: 'বেগুনি', fill: '#8B5CF6', stroke: '#6D28D9' },
  { name: 'Orange', nameBn: 'কমলা', fill: '#F97316', stroke: '#C2410C' },
];

const SHAPE_META: { id: ShapeItem['shape']; en: string; bn: string }[] = [
  { id: 'circle', en: 'Circle', bn: 'বৃত্ত' },
  { id: 'square', en: 'Square', bn: 'বর্গক্ষেত্র' },
  { id: 'triangle', en: 'Triangle', bn: 'ত্রিভুজ' },
  { id: 'star', en: 'Star', bn: 'তারা' },
  { id: 'heart', en: 'Heart', bn: 'হৃদয়' },
  { id: 'diamond', en: 'Diamond', bn: 'হীরক' },
];

function ShapeGraphic({ shape, fill, stroke }: { shape: ShapeItem['shape']; fill: string; stroke: string }) {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-sm">
      {shape === 'circle' && <circle cx="50" cy="50" r="38" fill={fill} stroke={stroke} strokeWidth="5" />}
      {shape === 'square' && <rect x="15" y="15" width="70" height="70" rx="12" fill={fill} stroke={stroke} strokeWidth="5" />}
      {shape === 'triangle' && <polygon points="50,12 88,84 12,84" fill={fill} stroke={stroke} strokeWidth="5" strokeLinejoin="round" />}
      {shape === 'diamond' && <polygon points="50,10 88,50 50,90 12,50" fill={fill} stroke={stroke} strokeWidth="5" strokeLinejoin="round" />}
      {shape === 'star' && (
        <polygon
          points="50,10 61,36 89,38 67,56 74,84 50,69 26,84 33,56 11,38 39,36"
          fill={fill}
          stroke={stroke}
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
      )}
      {shape === 'heart' && (
        <path
          d="M50 84 C50 84 14 60 14 35 C14 21 25 14 36 14 C43 14 48 18 50 23 C52 18 57 14 64 14 C75 14 86 21 86 35 C86 60 50 84 50 84 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="5"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export const ColorShapeGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const totalRounds = 6;

  const [round, setRound] = useState(0);
  const [cards, setCards] = useState<ShapeItem[]>([]);
  const [target, setTarget] = useState<ShapeItem | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [locked, setLocked] = useState(false);
  const [hintMsg, setHintMsg] = useState('');

  const setupRound = useCallback(() => {
    const numCards = state.difficulty === 'easy' ? 4 : state.difficulty === 'medium' ? 6 : 8;
    const pool: ShapeItem[] = [];
    const usedKeys = new Set<string>();

    while (pool.length < numCards) {
      const col = COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)];
      const shp = SHAPE_META[Math.floor(Math.random() * SHAPE_META.length)];
      const key = `${col.name}-${shp.id}`;
      if (!usedKeys.has(key)) {
        usedKeys.add(key);
        pool.push({
          id: key,
          colorName: col.name,
          colorNameBn: col.nameBn,
          shapeName: shp.en,
          shapeNameBn: shp.bn,
          fill: col.fill,
          stroke: col.stroke,
          shape: shp.id,
        });
      }
    }

    const pickedTarget = pool[Math.floor(Math.random() * pool.length)];
    setCards(pool);
    setTarget(pickedTarget);
    setLocked(false);
    setHintMsg('');
    speakBilingual(
      `${pickedTarget.colorNameBn} রঙের ${pickedTarget.shapeNameBn} ট্যাপ করো!`,
      `Tap the ${pickedTarget.colorName} ${pickedTarget.shapeName}!`
    );
  }, [state.difficulty]);

  useEffect(() => {
    setRound(0);
    setScore(0);
    setCorrectCount(0);
    setupRound();
  }, [setupRound]);

  const handlePick = (item: ShapeItem) => {
    if (!target || locked) return;
    if (item.id === target.id) {
      setLocked(true);
      audioManager.playCorrect();
      fireMiniConfetti();
      const firstTry = hintMsg === '';
      const nextScore = score + (firstTry ? 15 : 10);
      const nextCorrect = correctCount + (firstTry ? 1 : 0);
      setScore(nextScore);
      setCorrectCount(nextCorrect);
      speakBilingual(
        `দারুণ! ওটাই ${item.colorNameBn} রঙের ${item.shapeNameBn}!`,
        `Awesome! That is the ${item.colorName} ${item.shapeName}!`
      );

      setTimeout(() => {
        if (round + 1 >= totalRounds) {
          recordGameResult({
            gameId: 'color-shape-match',
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
      setHintMsg(
        isEn
          ? `That was the ${item.colorName} ${item.shapeName}. Find the ${target.colorName} ${target.shapeName}!`
          : `ওটা ছিল ${item.colorNameBn} ${item.shapeNameBn}। তুমি ${target.colorNameBn} রঙের ${target.shapeNameBn} খুঁজে বের করো!`
      );
      speakBilingual(
        `ওটা ${item.colorNameBn} ${item.shapeNameBn}। আবার চেষ্টা করো!`,
        `That is ${item.colorName} ${item.shapeName}. Try again!`
      );
    }
  };

  if (!target) return null;

  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="flex items-center justify-between mb-4 text-sm font-bold text-slate-600 tabular-nums">
        <span>{isEn ? `Shape ${round + 1} / ${totalRounds}` : `আকৃতি ${round + 1} / ${totalRounds}`}</span>
        <span>{isEn ? `Score: ${score}` : `স্কোর: ${score}`}</span>
      </div>

      <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
        {isEn ? (
          <>Tap the <span style={{ color: target.stroke }}>{target.colorName} {target.shapeName}</span>!</>
        ) : (
          <><span style={{ color: target.stroke }}>{target.colorNameBn} রঙের {target.shapeNameBn}</span> ট্যাপ করো!</>
        )}
      </h2>

      <button
        type="button"
        onClick={() =>
          speakBilingual(
            `${target.colorNameBn} রঙের ${target.shapeNameBn} ট্যাপ করো!`,
            `Tap the ${target.colorName} ${target.shapeName}!`
          )
        }
        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-sky-50 border-2 border-sky-200 text-sky-800 text-sm font-bold mb-6 cursor-pointer"
      >
        <Volume2 className="w-4 h-4" />
        <span>{isEn ? 'Hear Shape' : 'আবার শোনো'}</span>
      </button>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        {cards.map((item) => {
          const isMatched = locked && item.id === target.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => handlePick(item)}
              className={`min-h-36 rounded-3xl border-2 p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                isMatched
                  ? 'bg-emerald-50 border-emerald-400 ring-4 ring-emerald-200'
                  : 'bg-slate-50/70 border-slate-200 shadow-[0_6px_0_#E2E8F0] hover:bg-white'
              }`}
            >
              <ShapeGraphic shape={item.shape} fill={item.fill} stroke={item.stroke} />
              <span className="text-xs font-bold text-slate-600">
                {isEn ? `${item.colorName} ${item.shapeName}` : `${item.colorNameBn} ${item.shapeNameBn}`}
              </span>
            </motion.button>
          );
        })}
      </div>

      {hintMsg && <p className="text-sm font-bold text-rose-600">{hintMsg}</p>}
    </div>
  );
};
