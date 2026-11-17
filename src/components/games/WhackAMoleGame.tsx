import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';

type HoleState = 'empty' | 'mole' | 'bunny' | 'hedgehog';

export const WhackAMoleGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const [playing, setPlaying] = useState(false);
  const [holes, setHoles] = useState<HoleState[]>(Array(9).fill('empty'));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(35);
  const scoreRef = useRef(0);
  const hitsRef = useRef(0);

  const startGame = () => {
    audioManager.playClick();
    scoreRef.current = 0;
    hitsRef.current = 0;
    setScore(0);
    setTimeLeft(35);
    setHoles(Array(9).fill('empty'));
    setPlaying(true);
    speakBilingual(
      'মিষ্টি ইঁদুর আর খরগোশে ট্যাপ করো! কাঁটাওয়ালা সজারুতে ট্যাপ করো না!',
      'Tap the cute moles and bunnies! Do not tap the spiky hedgehogs!'
    );
  };

  useEffect(() => {
    if (!playing) return;

    const intervalMs = state.difficulty === 'easy' ? 950 : state.difficulty === 'medium' ? 720 : 540;
    const popTimer = setInterval(() => {
      setHoles(() => {
        const next: HoleState[] = Array(9).fill('empty');
        const activeCount = state.difficulty === 'hard' ? 2 : 1;
        for (let i = 0; i < activeCount; i++) {
          const idx = Math.floor(Math.random() * 9);
          const roll = Math.random();
          next[idx] = roll < 0.2 ? 'hedgehog' : roll < 0.45 ? 'bunny' : 'mole';
        }
        return next;
      });
    }, intervalMs);

    const countdown = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(popTimer);
          clearInterval(countdown);
          setPlaying(false);
          setHoles(Array(9).fill('empty'));
          const finalScore = scoreRef.current;
          const hits = Math.max(1, hitsRef.current);
          recordGameResult({
            gameId: 'whack-a-mole',
            score: finalScore,
            correctCount: hits,
            totalCount: Math.max(10, hits),
            customStars: finalScore >= 110 ? 3 : finalScore >= 55 ? 2 : 1,
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(popTimer);
      clearInterval(countdown);
    };
  }, [playing, state.difficulty, recordGameResult]);

  const handleTapHole = (idx: number) => {
    if (!playing) return;
    const occupant = holes[idx];
    if (occupant === 'empty') return;

    if (occupant === 'hedgehog') {
      audioManager.playWrong();
      scoreRef.current = Math.max(0, scoreRef.current - 10);
      setScore(scoreRef.current);
    } else {
      audioManager.playPop();
      const pts = occupant === 'bunny' ? 15 : 10;
      scoreRef.current += pts;
      hitsRef.current += 1;
      setScore(scoreRef.current);
    }

    setHoles((prev) => prev.map((v, i) => (i === idx ? 'empty' : v)));
  };

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="flex items-center justify-between mb-4 text-sm font-bold text-slate-700 tabular-nums">
        <span>{isEn ? `Time: ${timeLeft}s` : `সময়: ${timeLeft} সে.`}</span>
        <span>{isEn ? `Score: ${score}` : `স্কোর: ${score}`}</span>
      </div>

      {!playing ? (
        <div className="rounded-3xl bg-emerald-50 border-2 border-emerald-200 p-8">
          <div className="text-6xl mb-3" aria-hidden="true">🐹</div>
          <h2 className="font-display text-3xl font-extrabold text-slate-900 mb-2">
            {isEn ? 'Meadow Mole Pop' : 'মাঠের ইঁদুর ট্যাপ'}
          </h2>
          <p className="text-sm text-slate-700 mb-6">
            {isEn
              ? 'Tap moles (+10) and golden bunnies (+15)! Avoid spiky hedgehogs (−10).'
              : 'মাঠের ইঁদুর (+১০) ও সোনার খরগোশে (+১৫) ট্যাপ করো! কাঁটাওয়ালা সজারু (−১০) এড়িয়ে চলো।'}
          </p>
          <button
            type="button"
            onClick={startGame}
            className="min-h-12 px-7 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold text-base border-2 border-emerald-600 shadow-[0_5px_0_#047857] inline-flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{isEn ? 'Start Meadow Pop' : 'খেলা শুরু করো'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 rounded-3xl bg-emerald-100 border-2 border-emerald-300 p-5">
          {holes.map((occ, idx) => (
            <motion.button
              key={idx}
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTapHole(idx)}
              className="h-24 sm:h-28 rounded-3xl bg-amber-900/80 border-4 border-amber-950/30 flex items-center justify-center text-5xl cursor-pointer shadow-inner select-none"
              aria-label={isEn ? `Hole ${idx + 1}` : `গর্ত ${idx + 1}`}
            >
              {occ === 'mole' && <span className="animate-bounce">🐹</span>}
              {occ === 'bunny' && <span className="animate-bounce">🐰</span>}
              {occ === 'hedgehog' && <span>🦔</span>}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};
