import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';
import { fireMiniConfetti } from '../../utils/confettiUtils';

type Operation = 'all' | '+' | '-' | '×' | '÷';

interface MathPuzzle {
  a: number;
  b: number;
  op: '+' | '-' | '×' | '÷';
  answer: number;
  choices: number[];
}

export const MathAdventureGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const totalRounds = 7;

  const [opMode, setOpMode] = useState<Operation>('all');
  const [round, setRound] = useState(0);
  const [puzzle, setPuzzle] = useState<MathPuzzle | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongPicks, setWrongPicks] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);

  const createPuzzle = useCallback((): MathPuzzle => {
    const allowedOps: ('+' | '-' | '×' | '÷')[] =
      opMode !== 'all'
        ? [opMode]
        : state.difficulty === 'easy'
          ? ['+', '-']
          : state.difficulty === 'medium'
            ? ['+', '-', '×']
            : ['+', '-', '×', '÷'];

    const op = allowedOps[Math.floor(Math.random() * allowedOps.length)];
    let a = 1;
    let b = 1;
    let answer = 2;

    const maxBase = state.difficulty === 'easy' ? 9 : state.difficulty === 'medium' ? 20 : 40;

    if (op === '+') {
      a = Math.floor(Math.random() * maxBase) + 1;
      b = Math.floor(Math.random() * maxBase) + 1;
      answer = a + b;
    } else if (op === '-') {
      a = Math.floor(Math.random() * maxBase) + 3;
      b = Math.floor(Math.random() * (a - 1)) + 1;
      answer = a - b;
    } else if (op === '×') {
      const mulMax = state.difficulty === 'easy' ? 5 : state.difficulty === 'medium' ? 9 : 12;
      a = Math.floor(Math.random() * mulMax) + 1;
      b = Math.floor(Math.random() * mulMax) + 1;
      answer = a * b;
    } else {
      const divMax = state.difficulty === 'medium' ? 8 : 12;
      b = Math.floor(Math.random() * divMax) + 1;
      answer = Math.floor(Math.random() * divMax) + 1;
      a = b * answer;
    }

    const opts = new Set<number>([answer]);
    while (opts.size < 4) {
      const delta = Math.floor(Math.random() * 9) - 4;
      const cand = Math.max(0, answer + delta);
      opts.add(cand);
    }

    return {
      a,
      b,
      op,
      answer,
      choices: Array.from(opts).sort((x, y) => x - y),
    };
  }, [opMode, state.difficulty]);

  const startRound = useCallback(() => {
    const next = createPuzzle();
    setPuzzle(next);
    setWrongPicks([]);
    setLocked(false);
    const opWordEn = next.op === '+' ? 'plus' : next.op === '-' ? 'minus' : next.op === '×' ? 'times' : 'divided by';
    const opWordBn = next.op === '+' ? 'যোগ' : next.op === '-' ? 'বিয়োগ' : next.op === '×' ? 'গুণ' : 'ভাগ';
    speakBilingual(
      `${next.a} ${opWordBn} ${next.b} কত হয়?`,
      `What is ${next.a} ${opWordEn} ${next.b}?`
    );
  }, [createPuzzle]);

  useEffect(() => {
    setRound(0);
    setScore(0);
    setCorrectCount(0);
    startRound();
  }, [startRound]);

  const handleSelect = (choice: number) => {
    if (!puzzle || locked) return;
    if (choice === puzzle.answer) {
      setLocked(true);
      audioManager.playCorrect();
      fireMiniConfetti();
      const firstTry = wrongPicks.length === 0;
      const nextScore = score + (firstTry ? 15 : 10);
      const nextCorrect = correctCount + (firstTry ? 1 : 0);
      setScore(nextScore);
      setCorrectCount(nextCorrect);
      speakBilingual(
        `সঠিক উত্তর! উত্তর হবে ${puzzle.answer}!`,
        `Correct! The answer is ${puzzle.answer}!`
      );

      setTimeout(() => {
        if (round + 1 >= totalRounds) {
          recordGameResult({
            gameId: 'math-adventure',
            score: nextScore,
            correctCount: Math.max(1, nextCorrect),
            totalCount: totalRounds,
          });
        } else {
          setRound((r) => r + 1);
          startRound();
        }
      }, 850);
    } else {
      audioManager.playWrong();
      if (!wrongPicks.includes(choice)) {
        setWrongPicks((prev) => [...prev, choice]);
      }
      speakBilingual(
        'আবার গুনে দেখো! তুমি সঠিক উত্তর পারবে।',
        'Oops! Try counting carefully.'
      );
    }
  };

  if (!puzzle) return null;

  const ops: { id: Operation; label: string; labelBn: string }[] = [
    { id: 'all', label: 'Mix', labelBn: 'সব মিশ্রণ' },
    { id: '+', label: 'Add (+)', labelBn: 'যোগ (+)' },
    { id: '-', label: 'Sub (−)', labelBn: 'বিয়োগ (−)' },
    { id: '×', label: 'Mul (×)', labelBn: 'গুণ (×)' },
    { id: '÷', label: 'Div (÷)', labelBn: 'ভাগ (÷)' },
  ];

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          {ops.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                audioManager.playClick();
                setOpMode(o.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                opMode === o.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              {isEn ? o.label : o.labelBn}
            </button>
          ))}
        </div>

        <div className="text-sm font-bold text-slate-600 tabular-nums">
          {isEn ? `Puzzle ${round + 1} / ${totalRounds} · Score ${score}` : `ধাঁধা ${round + 1} / ${totalRounds} · স্কোর ${score}`}
        </div>
      </div>

      <div className="rounded-3xl bg-emerald-50 border-2 border-emerald-200 p-8 mb-6">
        <div className="font-display text-5xl sm:text-6xl font-extrabold text-slate-900 tabular-nums tracking-tight">
          {puzzle.a} <span className="text-emerald-600">{puzzle.op}</span> {puzzle.b}{' '}
          <span className="text-slate-400">=</span>{' '}
          <span className="inline-block min-w-16 px-3 py-1 rounded-2xl bg-white border-2 border-emerald-300 text-emerald-700">
            {locked ? puzzle.answer : '?'}
          </span>
        </div>

        {state.difficulty === 'easy' && puzzle.op === '+' && puzzle.a <= 9 && puzzle.b <= 9 && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xl">
            <div className="flex flex-wrap gap-1 max-w-44 justify-center">
              {Array.from({ length: puzzle.a }).map((_, i) => (
                <span key={i} className="w-3.5 h-3.5 rounded-full bg-sky-500 inline-block" />
              ))}
            </div>
            <span className="font-bold text-slate-400">+</span>
            <div className="flex flex-wrap gap-1 max-w-44 justify-center">
              {Array.from({ length: puzzle.b }).map((_, i) => (
                <span key={i} className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block" />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {puzzle.choices.map((c) => {
          const isRight = locked && c === puzzle.answer;
          const isWrong = wrongPicks.includes(c);
          return (
            <motion.button
              key={c}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => handleSelect(c)}
              className={`min-h-20 rounded-3xl border-2 font-display text-3xl font-extrabold tabular-nums cursor-pointer transition-colors ${
                isRight
                  ? 'bg-emerald-500 border-emerald-600 text-white shadow-[0_5px_0_#047857]'
                  : isWrong
                    ? 'bg-rose-50 border-rose-200 text-rose-400'
                    : 'bg-white border-emerald-300 text-slate-900 shadow-[0_5px_0_#6EE7B7] hover:bg-emerald-50'
              }`}
            >
              {c}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
