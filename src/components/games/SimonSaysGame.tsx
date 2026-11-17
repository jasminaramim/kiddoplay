import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';
import { fireMiniConfetti } from '../../utils/confettiUtils';

const PADS = [
  { id: 0, label: 'Red', labelBn: 'লাল', freq: 261.63, base: 'bg-rose-500 border-rose-600 shadow-[0_6px_0_#BE123C]', lit: 'bg-rose-300 ring-4 ring-rose-200 scale-105' },
  { id: 1, label: 'Blue', labelBn: 'নীল', freq: 329.63, base: 'bg-sky-500 border-sky-600 shadow-[0_6px_0_#0369A1]', lit: 'bg-sky-300 ring-4 ring-sky-200 scale-105' },
  { id: 2, label: 'Yellow', labelBn: 'হলুদ', freq: 392.0, base: 'bg-amber-400 border-amber-500 shadow-[0_6px_0_#B45309]', lit: 'bg-amber-200 ring-4 ring-amber-100 scale-105' },
  { id: 3, label: 'Green', labelBn: 'সবুজ', freq: 523.25, base: 'bg-emerald-500 border-emerald-600 shadow-[0_6px_0_#047857]', lit: 'bg-emerald-300 ring-4 ring-emerald-200 scale-105' },
];

export const SimonSaysGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const targetRounds = state.difficulty === 'easy' ? 4 : state.difficulty === 'medium' ? 5 : 7;

  const [playing, setPlaying] = useState(false);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userIndex, setUserIndex] = useState(0);
  const [litPad, setLitPad] = useState<number | null>(null);
  const [phase, setPhase] = useState<'idle' | 'showing' | 'input'>('idle');
  const timeoutsRef = useRef<number[]>([]);

  const clearTimers = () => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const playSequence = useCallback((seq: number[]) => {
    clearTimers();
    setPhase('showing');
    setUserIndex(0);

    seq.forEach((padId, idx) => {
      const t1 = window.setTimeout(() => {
        setLitPad(padId);
        audioManager.playNote(PADS[padId].freq, 0.28, 'triangle');
      }, idx * 620 + 250);

      const t2 = window.setTimeout(() => {
        setLitPad(null);
        if (idx === seq.length - 1) {
          setPhase('input');
        }
      }, idx * 620 + 550);

      timeoutsRef.current.push(t1, t2);
    });
  }, []);

  const startGame = () => {
    audioManager.playClick();
    const first = [Math.floor(Math.random() * 4)];
    setSequence(first);
    setPlaying(true);
    speakBilingual(
      'মন দিয়ে দেখো ও শোনো, তারপর একই রঙে ট্যাপ করো!',
      'Watch and listen, then tap the matching colors!'
    );
    playSequence(first);
  };

  const handlePadTap = (padId: number) => {
    if (!playing || phase !== 'input') return;

    setLitPad(padId);
    audioManager.playNote(PADS[padId].freq, 0.24, 'triangle');
    setTimeout(() => setLitPad(null), 200);

    if (padId === sequence[userIndex]) {
      const nextIdx = userIndex + 1;
      if (nextIdx >= sequence.length) {
        if (sequence.length >= targetRounds) {
          setPlaying(false);
          setPhase('idle');
          fireMiniConfetti();
          recordGameResult({
            gameId: 'simon-says',
            score: sequence.length * 25,
            correctCount: sequence.length,
            totalCount: targetRounds,
            customStars: 3,
          });
        } else {
          setPhase('showing');
          const nextSeq = [...sequence, Math.floor(Math.random() * 4)];
          setSequence(nextSeq);
          setTimeout(() => playSequence(nextSeq), 650);
        }
      } else {
        setUserIndex(nextIdx);
      }
    } else {
      audioManager.playWrong();
      setPlaying(false);
      setPhase('idle');
      speakBilingual('উফ! ভালো চেষ্টা করেছো! চলো আবার খেলি।', 'Oops! Nice try! Let us play again.');
      recordGameResult({
        gameId: 'simon-says',
        score: Math.max(10, (sequence.length - 1) * 20),
        correctCount: Math.max(1, sequence.length - 1),
        totalCount: targetRounds,
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="flex items-center justify-between mb-4 text-sm font-bold text-slate-700 tabular-nums">
        <span>
          {isEn
            ? `Pattern Length: ${sequence.length} / ${targetRounds}`
            : `সুরের ধাপ: ${sequence.length} / ${targetRounds}`}
        </span>
        <span>
          {phase === 'showing'
            ? isEn
              ? 'Watch & Listen...'
              : 'দেখো ও শোনো...'
            : phase === 'input'
              ? isEn
                ? 'Your Turn!'
                : 'এখন তোমার পালা!'
              : isEn
                ? 'Ready'
                : 'প্রস্তুত'}
        </span>
      </div>

      {!playing ? (
        <div className="rounded-3xl bg-indigo-50 border-2 border-indigo-200 p-8 mb-5">
          <div className="text-6xl mb-3" aria-hidden="true">🎹</div>
          <h2 className="font-display text-3xl font-extrabold text-slate-900 mb-2">
            {isEn ? 'Musical Color Echo' : 'সুরেলা রঙের প্রতিধ্বনি'}
          </h2>
          <p className="text-sm text-slate-700 mb-6">
            {isEn
              ? `Repeat ${targetRounds} growing musical color sequences to win!`
              : `জিততে ${targetRounds}টি রঙ ও সুরের ধারা ঠিকমতো মিলিয়ে দেখাও!`}
          </p>
          <button
            type="button"
            onClick={startGame}
            className="min-h-12 px-7 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-display font-bold text-base border-2 border-indigo-600 shadow-[0_5px_0_#4338CA] inline-flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{isEn ? 'Play Melody' : 'সুর বাজানো শুরু করো'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          {PADS.map((pad) => {
            const isLit = litPad === pad.id;
            return (
              <motion.button
                key={pad.id}
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => handlePadTap(pad.id)}
                className={`h-32 sm:h-36 rounded-3xl border-2 text-white font-display text-xl font-extrabold cursor-pointer transition-all ${
                  isLit ? pad.lit : pad.base
                }`}
              >
                {isEn ? pad.label : pad.labelBn}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
};
