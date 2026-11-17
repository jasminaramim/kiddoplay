import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';

interface FallingItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  emoji: string;
  isBomb: boolean;
  points: number;
}

const FRUITS = [
  { emoji: '🍎', points: 10 },
  { emoji: '🍓', points: 15 },
  { emoji: '🍊', points: 10 },
  { emoji: '🍌', points: 10 },
  { emoji: '🍇', points: 20 },
];

export const FruitCatcherGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const [playing, setPlaying] = useState(false);
  const [basketX, setBasketX] = useState(50);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [score, setScore] = useState(0);
  const [caughtCount, setCaughtCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  const basketRef = useRef(50);
  const scoreRef = useRef(0);
  const caughtRef = useRef(0);
  const nextIdRef = useRef(1);
  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const stageRef = useRef<HTMLDivElement | null>(null);

  const highScore = state.gameStats['fruit-catcher']?.highScore || 0;

  const spawnItem = useCallback((): FallingItem => {
    const bombChance = state.difficulty === 'easy' ? 0.14 : state.difficulty === 'medium' ? 0.22 : 0.3;
    const isBomb = Math.random() < bombChance;
    const fruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];
    const baseSpeed = state.difficulty === 'easy' ? 0.72 : state.difficulty === 'medium' ? 1.0 : 1.32;
    return {
      id: nextIdRef.current++,
      x: 8 + Math.random() * 84,
      y: -8,
      speed: baseSpeed + Math.random() * 0.4,
      emoji: isBomb ? '💣' : fruit.emoji,
      isBomb,
      points: isBomb ? -15 : fruit.points,
    };
  }, [state.difficulty]);

  const startGame = () => {
    audioManager.playClick();
    basketRef.current = 50;
    setBasketX(50);
    scoreRef.current = 0;
    caughtRef.current = 0;
    setScore(0);
    setCaughtCount(0);
    setTimeLeft(60);
    setItems([spawnItem()]);
    setPlaying(true);
    speakBilingual(
      'ঝুড়ি সরিয়ে মজার ফল ধরো, আর বোমা থেকে সাবধান থাকো!',
      'Slide the basket to catch yummy fruits and dodge bombs!'
    );
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keysRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    let rafId = 0;
    let frame = 0;

    const loop = () => {
      frame += 1;
      if (keysRef.current.left) {
        basketRef.current = Math.max(8, basketRef.current - 2.2);
        setBasketX(basketRef.current);
      }
      if (keysRef.current.right) {
        basketRef.current = Math.min(92, basketRef.current + 2.2);
        setBasketX(basketRef.current);
      }

      setItems((prev) => {
        const next: FallingItem[] = [];
        for (const item of prev) {
          const ny = item.y + item.speed;
          const hitBasket = ny >= 80 && ny <= 93 && Math.abs(item.x - basketRef.current) < 12;

          if (hitBasket) {
            if (item.isBomb) {
              audioManager.playWrong();
              scoreRef.current = Math.max(0, scoreRef.current - 15);
              setScore(scoreRef.current);
            } else {
              audioManager.playPop();
              scoreRef.current += item.points;
              caughtRef.current += 1;
              setScore(scoreRef.current);
              setCaughtCount(caughtRef.current);
            }
            continue;
          }

          if (ny < 103) {
            next.push({ ...item, y: ny });
          }
        }

        const spawnEvery = state.difficulty === 'easy' ? 42 : state.difficulty === 'medium' ? 32 : 24;
        if (frame % spawnEvery === 0) {
          next.push(spawnItem());
        }
        return next;
      });

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [playing, state.difficulty, spawnItem]);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setPlaying(false);
          const finalScore = scoreRef.current;
          const caught = caughtRef.current;
          recordGameResult({
            gameId: 'fruit-catcher',
            score: finalScore,
            correctCount: Math.max(1, caught),
            totalCount: Math.max(10, caught),
            customStars: finalScore >= 140 ? 3 : finalScore >= 70 ? 2 : 1,
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, recordGameResult]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!playing || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(8, Math.min(92, pct));
    basketRef.current = clamped;
    setBasketX(clamped);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-sm font-bold text-slate-700 tabular-nums">
        <span>
          {isEn ? `Caught: ${caughtCount} · Best: ${highScore}` : `ধরা হয়েছে: ${caughtCount} · সেরা: ${highScore}`}
        </span>
        <div className="flex items-center gap-4">
          <span>{isEn ? `Time: ${timeLeft}s` : `সময়: ${timeLeft} সে.`}</span>
          <span className="text-amber-700">{isEn ? `Score: ${score}` : `স্কোর: ${score}`}</span>
        </div>
      </div>

      <div
        ref={stageRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerMove}
        className="relative h-[400px] rounded-3xl bg-gradient-to-b from-amber-50 via-sky-50 to-emerald-100 border-2 border-amber-200 overflow-hidden touch-none select-none"
      >
        {!playing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white/65 backdrop-blur-[2px]">
            <div className="text-6xl mb-3" aria-hidden="true">🧺</div>
            <h2 className="font-display text-3xl font-extrabold text-slate-900 mb-2">
              {isEn ? 'Fruit Catcher Arcade' : 'ফল ধরার মজার খেলা'}
            </h2>
            <p className="text-sm text-slate-700 max-w-md mb-6">
              {isEn
                ? 'Use Arrow Keys, drag across the screen, or tap the Left/Right buttons to catch fresh fruits and dodge bombs in 60 seconds!'
                : 'তীর বাটন বা আঙুল দিয়ে ঝুড়ি সরিয়ে ৬০ সেকেন্ডে তাজা ফল ধরো আর বোমা এড়িয়ে চলো!'}
            </p>
            <button
              type="button"
              onClick={startGame}
              className="min-h-12 px-7 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-display font-bold text-base border-2 border-amber-500 shadow-[0_5px_0_#D97706] flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{isEn ? 'Start Catching' : 'খেলা শুরু করো'}</span>
            </button>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <div
                key={item.id}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-4xl pointer-events-none"
              >
                {item.emoji}
              </div>
            ))}

            <div
              style={{ left: `${basketX}%` }}
              className="absolute bottom-3 -translate-x-1/2 w-24 h-12 rounded-2xl bg-amber-600 border-4 border-amber-800 flex items-center justify-center text-2xl shadow-lg pointer-events-none"
            >
              🧺
            </div>
          </>
        )}
      </div>

      {playing && (
        <div className="mt-4 flex items-center justify-center gap-4 sm:hidden">
          <button
            type="button"
            onClick={() => {
              basketRef.current = Math.max(8, basketRef.current - 12);
              setBasketX(basketRef.current);
            }}
            className="flex-1 min-h-12 rounded-2xl bg-slate-100 border-2 border-slate-300 flex items-center justify-center"
            aria-label={isEn ? 'Move basket left' : 'ঝুড়ি বামে সরাও'}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={() => {
              basketRef.current = Math.min(92, basketRef.current + 12);
              setBasketX(basketRef.current);
            }}
            className="flex-1 min-h-12 rounded-2xl bg-slate-100 border-2 border-slate-300 flex items-center justify-center"
            aria-label={isEn ? 'Move basket right' : 'ঝুড়ি ডানে সরাও'}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};
