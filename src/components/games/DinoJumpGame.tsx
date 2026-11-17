import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play } from 'lucide-react';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';

interface Obstacle {
  id: number;
  x: number;
  type: 'cactus' | 'star';
}

export const DinoJumpGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const [playing, setPlaying] = useState(false);
  const [dinoY, setDinoY] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [starsGrabbed, setStarsGrabbed] = useState(0);

  const dinoYRef = useRef(0);
  const velocityRef = useRef(0);
  const scoreRef = useRef(0);
  const starsRef = useRef(0);
  const nextIdRef = useRef(1);
  const playingRef = useRef(false);

  const jump = useCallback(() => {
    if (!playingRef.current) return;
    if (dinoYRef.current <= 2) {
      velocityRef.current = 12.5;
      audioManager.playJump();
    }
  }, []);

  const startGame = () => {
    audioManager.playClick();
    dinoYRef.current = 0;
    velocityRef.current = 0;
    scoreRef.current = 0;
    starsRef.current = 0;
    setDinoY(0);
    setScore(0);
    setStarsGrabbed(0);
    setObstacles([{ id: nextIdRef.current++, x: 95, type: 'star' }]);
    playingRef.current = true;
    setPlaying(true);
    speakBilingual(
      'লাফ দিয়ে ক্যাকটাস এড়িয়ে চলো আর তারা সংগ্রহ করো!',
      'Tap anywhere or press Space to jump over cacti and collect stars!'
    );
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (playingRef.current) {
          e.preventDefault();
          jump();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [jump]);

  useEffect(() => {
    if (!playing) return;
    let rafId = 0;
    let frame = 0;
    const speed = state.difficulty === 'easy' ? 0.85 : state.difficulty === 'medium' ? 1.15 : 1.45;

    const loop = () => {
      if (!playingRef.current) return;
      frame += 1;

      if (dinoYRef.current > 0 || velocityRef.current > 0) {
        dinoYRef.current = Math.max(0, dinoYRef.current + velocityRef.current);
        velocityRef.current -= 0.62;
        if (dinoYRef.current === 0) velocityRef.current = 0;
        setDinoY(dinoYRef.current);
      }

      if (frame % 12 === 0) {
        scoreRef.current += 2;
        setScore(scoreRef.current);
      }

      setObstacles((prev) => {
        const next: Obstacle[] = [];
        let crashed = false;

        for (const obs of prev) {
          const nx = obs.x - speed;
          const nearDinoX = nx >= 12 && nx <= 23;
          if (nearDinoX) {
            if (obs.type === 'star' && dinoYRef.current >= 22) {
              audioManager.playCorrect();
              starsRef.current += 1;
              scoreRef.current += 20;
              setStarsGrabbed(starsRef.current);
              setScore(scoreRef.current);
              continue;
            }
            if (obs.type === 'cactus' && dinoYRef.current < 34) {
              crashed = true;
            }
          }
          if (nx > -10) {
            next.push({ ...obs, x: nx });
          }
        }

        if (crashed) {
          playingRef.current = false;
          setPlaying(false);
          audioManager.playWrong();
          const finalScore = scoreRef.current;
          const grabbed = starsRef.current;
          setTimeout(() => {
            recordGameResult({
              gameId: 'dino-jump',
              score: finalScore,
              correctCount: Math.max(1, grabbed + 1),
              totalCount: Math.max(5, grabbed + 2),
              customStars: finalScore >= 100 ? 3 : finalScore >= 45 ? 2 : 1,
            });
          }, 250);
          return [];
        }

        const spawnGap = state.difficulty === 'easy' ? 75 : state.difficulty === 'medium' ? 60 : 48;
        if (frame % spawnGap === 0) {
          next.push({
            id: nextIdRef.current++,
            x: 105,
            type: Math.random() < 0.35 ? 'star' : 'cactus',
          });
        }

        return next;
      });

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [playing, state.difficulty, recordGameResult]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 text-sm font-bold text-slate-700 tabular-nums">
        <span>{isEn ? `Stars Grabbed: ${starsGrabbed} ⭐` : `সংগৃহীত তারা: ${starsGrabbed} ⭐`}</span>
        <span>{isEn ? `Score: ${score}` : `স্কোর: ${score}`}</span>
      </div>

      <div
        onPointerDown={jump}
        className="relative h-80 rounded-3xl bg-gradient-to-b from-sky-100 via-amber-50 to-amber-200 border-2 border-lime-300 overflow-hidden select-none cursor-pointer"
      >
        {!playing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white/65 backdrop-blur-[2px]">
            <div className="text-6xl mb-3" aria-hidden="true">🦖</div>
            <h2 className="font-display text-3xl font-extrabold text-slate-900 mb-2">
              {isEn ? 'Dino Star Dash' : 'ডাইনো স্টার ড্যাশ'}
            </h2>
            <p className="text-sm text-slate-700 max-w-md mb-6">
              {isEn
                ? 'Tap anywhere or press Spacebar to make Dino jump over desert cacti and grab floating stars!'
                : 'স্ক্রিনে ট্যাপ করে বা স্পেসবার চেপে ডাইনোকে লাফ দিয়ে ক্যাকটাস পার হতে আর ভাসমান তারা ধরতে সাহায্য করো!'}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="min-h-12 px-7 py-3 rounded-2xl bg-lime-500 hover:bg-lime-600 text-white font-display font-bold text-base border-2 border-lime-600 shadow-[0_5px_0_#4D7C0F] inline-flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{isEn ? 'Start Running' : 'দৌড় শুরু করো'}</span>
            </button>
          </div>
        ) : (
          <>
            <div className="absolute bottom-0 inset-x-0 h-12 bg-amber-300 border-t-4 border-lime-600" />

            <div
              style={{ bottom: `${44 + dinoY}px`, left: '16%' }}
              className="absolute text-5xl -scale-x-100 pointer-events-none"
            >
              🦖
            </div>

            {obstacles.map((obs) => (
              <div
                key={obs.id}
                style={{
                  left: `${obs.x}%`,
                  bottom: obs.type === 'star' ? '118px' : '44px',
                }}
                className="absolute text-4xl pointer-events-none"
              >
                {obs.type === 'star' ? '⭐' : '🌵'}
              </div>
            ))}
          </>
        )}
      </div>

      {playing && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={jump}
            className="min-h-12 px-8 py-3 rounded-2xl bg-lime-500 text-white font-display font-bold text-base border-2 border-lime-600 shadow-[0_4px_0_#4D7C0F] active:translate-y-0.5 cursor-pointer"
          >
            {isEn ? 'Jump! (Spacebar / Tap)' : 'লাফ দাও! (স্পেসবার / ট্যাপ)'}
          </button>
        </div>
      )}
    </div>
  );
};
