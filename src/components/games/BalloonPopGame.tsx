import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Target, Play } from 'lucide-react';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';
import { fireMiniConfetti } from '../../utils/confettiUtils';

interface Balloon {
  id: number;
  label: string;
  x: number;
  y: number;
  speed: number;
  color: string;
  border: string;
  swayOffset: number;
}

interface PopParticle {
  id: number;
  x: number;
  y: number;
  color: string;
}

const BALLOON_COLORS = [
  { bg: '#F43F5E', border: '#BE123C' },
  { bg: '#0EA5E9', border: '#0369A1' },
  { bg: '#F59E0B', border: '#B45309' },
  { bg: '#10B981', border: '#047857' },
  { bg: '#8B5CF6', border: '#5B21B6' },
  { bg: '#EC4899', border: '#9D174D' },
];

const LABELS = ['অ', 'আ', 'ক', 'খ', 'গ', 'A', 'B', 'C', '১', '২', '৩', '৪'];

export const BalloonPopGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const [mode, setMode] = useState<'free' | 'mission'>('mission');
  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [poppedCount, setPoppedCount] = useState(0);
  const [missionTarget, setMissionTarget] = useState('অ');
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [particles, setParticles] = useState<PopParticle[]>([]);

  const nextIdRef = useRef(1);
  const scoreRef = useRef(0);
  const poppedRef = useRef(0);
  const missionRef = useRef('অ');

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    poppedRef.current = poppedCount;
  }, [poppedCount]);

  useEffect(() => {
    missionRef.current = missionTarget;
  }, [missionTarget]);

  const pickNewMission = useCallback(() => {
    const next = LABELS[Math.floor(Math.random() * LABELS.length)];
    setMissionTarget(next);
    missionRef.current = next;
    speakBilingual(`${next} লেখা বেলুনটি ফাটাও!`, `Pop the balloon with ${next}!`);
  }, []);

  const spawnBalloon = useCallback((forceLabel?: string): Balloon => {
    const palette = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    const baseSpeed = state.difficulty === 'easy' ? 0.35 : state.difficulty === 'medium' ? 0.55 : 0.78;
    const label = forceLabel || LABELS[Math.floor(Math.random() * LABELS.length)];
    return {
      id: nextIdRef.current++,
      label,
      x: 8 + Math.random() * 82,
      y: 105 + Math.random() * 15,
      speed: baseSpeed + Math.random() * 0.25,
      color: palette.bg,
      border: palette.border,
      swayOffset: Math.random() * Math.PI * 2,
    };
  }, [state.difficulty]);

  const startGame = () => {
    audioManager.playClick();
    setScore(0);
    setPoppedCount(0);
    scoreRef.current = 0;
    poppedRef.current = 0;
    setTimeLeft(30);
    setParticles([]);
    const initial = Array.from({ length: 7 }, (_, i) =>
      spawnBalloon(mode === 'mission' && i < 2 ? missionRef.current : undefined)
    );
    setBalloons(initial);
    setPlaying(true);
    if (mode === 'mission') {
      pickNewMission();
    } else {
      speakBilingual('যত বেশি পারো রঙিন বেলুন ফাটাও!', 'Pop as many colorful balloons as you can!');
    }
  };

  useEffect(() => {
    if (!playing) return;
    let rafId = 0;

    const tick = () => {
      setBalloons((prev) => {
        const moved = prev
          .map((b) => ({ ...b, y: b.y - b.speed }))
          .filter((b) => b.y > -18);

        while (moved.length < 8) {
          const needTarget =
            mode === 'mission' && !moved.some((m) => m.label === missionRef.current);
          moved.push(spawnBalloon(needTarget ? missionRef.current : undefined));
        }
        return moved;
      });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [playing, mode, spawnBalloon]);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setPlaying(false);
          const finalScore = scoreRef.current;
          const totalPops = Math.max(1, poppedRef.current);
          recordGameResult({
            gameId: 'balloon-pop',
            score: finalScore,
            correctCount: totalPops,
            totalCount: Math.max(totalPops, 8),
            customStars: finalScore >= 80 ? 3 : finalScore >= 40 ? 2 : 1,
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, recordGameResult]);

  const handlePop = (b: Balloon) => {
    if (!playing) return;
    audioManager.playPop();

    const pid = Date.now() + Math.random();
    setParticles((prev) => [...prev, { id: pid, x: b.x, y: b.y, color: b.color }]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== pid));
    }, 450);

    setBalloons((prev) => prev.filter((item) => item.id !== b.id));

    if (mode === 'free') {
      setScore((s) => s + 10);
      setPoppedCount((c) => c + 1);
      speakBilingual(b.label, b.label);
    } else {
      if (b.label === missionTarget) {
        audioManager.playCorrect();
        fireMiniConfetti();
        setScore((s) => s + 20);
        setPoppedCount((c) => c + 1);
        pickNewMission();
      } else {
        audioManager.playWrong();
        setScore((s) => Math.max(0, s - 5));
        speakBilingual(`ওটা ${b.label}। তুমি ${missionTarget} ফাটাও!`, `That was ${b.label}. Find ${missionTarget}!`);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            disabled={playing}
            onClick={() => setMode('mission')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
              mode === 'mission' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-rose-500" />
            <span>{isEn ? 'Mission Mode' : 'লক্ষ্য মোড'}</span>
          </button>
          <button
            type="button"
            disabled={playing}
            onClick={() => setMode('free')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
              mode === 'free' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>{isEn ? 'Free Pop' : 'মুক্ত ফাটানো'}</span>
          </button>
        </div>

        <div className="flex items-center gap-4 text-sm font-bold text-slate-700 tabular-nums">
          {playing && mode === 'mission' && (
            <span className="px-3 py-1 rounded-xl bg-rose-100 text-rose-800 border border-rose-200">
              {isEn ? `Pop: “${missionTarget}”` : `ফাটাও: “${missionTarget}”`}
            </span>
          )}
          <span>{isEn ? `Time: ${timeLeft}s` : `সময়: ${timeLeft} সে.`}</span>
          <span>{isEn ? `Score: ${score}` : `স্কোর: ${score}`}</span>
        </div>
      </div>

      <div className="relative h-[420px] rounded-3xl bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-50 border-2 border-sky-300 overflow-hidden select-none">
        {!playing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white/55 backdrop-blur-[2px]">
            <div className="text-6xl mb-3" aria-hidden="true">🎈</div>
            <h2 className="font-display text-3xl font-extrabold text-slate-900 mb-2">
              {isEn ? 'Balloon Pop Fiesta' : 'বেলুন ফাটানো মেলা'}
            </h2>
            <p className="text-sm text-slate-700 max-w-md mb-6">
              {mode === 'mission'
                ? isEn
                  ? 'Listen for the target letter or number and pop matching floating balloons in 30 seconds!'
                  : 'নির্দিষ্ট বাংলা/ইংরেজি অক্ষর ও সংখ্যার উড়ন্ত বেলুন ৩০ সেকেন্ডে ট্যাপ করে ফাটাও!'
                : isEn
                  ? 'Tap any floating balloon to hear its letter or number and burst colorful particles!'
                  : 'যেকোনো উড়ন্ত বেলুন ট্যাপ করে ফাটাও আর মজার শব্দ শোনো!'}
            </p>
            <button
              type="button"
              onClick={startGame}
              className="min-h-12 px-7 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-display font-bold text-base border-2 border-pink-600 shadow-[0_5px_0_#BE185D] active:translate-y-0.5 flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{isEn ? 'Start Popping' : 'বেলুন ফাটানো শুরু করো'}</span>
            </button>
          </div>
        ) : (
          <>
            {balloons.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handlePop(b)}
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  backgroundColor: b.color,
                  borderColor: b.border,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-20 rounded-full border-4 text-white font-display text-2xl font-extrabold flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 active:scale-90 transition-transform"
              >
                <span>{b.label}</span>
                <span
                  className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-0.5 h-5 bg-slate-500/70 pointer-events-none"
                  aria-hidden="true"
                />
              </button>
            ))}

            {particles.map((p) => (
              <div
                key={p.id}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                <div
                  className="w-16 h-16 rounded-full border-4 animate-ping opacity-75"
                  style={{ borderColor: p.color }}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
