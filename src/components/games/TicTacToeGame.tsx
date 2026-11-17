import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Users, Bot, RotateCcw } from 'lucide-react';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';
import { fireMiniConfetti } from '../../utils/confettiUtils';

type Cell = 'P' | 'K' | null;

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner(board: Cell[]): { winner: Cell | 'DRAW'; line: number[] | null } {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  if (board.every((cell) => cell !== null)) {
    return { winner: 'DRAW', line: null };
  }
  return { winner: null, line: null };
}

export const TicTacToeGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const [vsMode, setVsMode] = useState<'bot' | '2p'>('bot');
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<'P' | 'K'>('P');
  const [outcome, setOutcome] = useState<{ winner: Cell | 'DRAW'; line: number[] | null }>({
    winner: null,
    line: null,
  });

  const resetBoard = useCallback(() => {
    audioManager.playClick();
    setBoard(Array(9).fill(null));
    setTurn('P');
    setOutcome({ winner: null, line: null });
  }, []);

  const finishMatch = useCallback(
    (winner: Cell | 'DRAW') => {
      if (winner === 'P') {
        fireMiniConfetti();
        speakBilingual('কুকুরছানা জিতে গেছে! দারুণ খেলেছো!', 'Puppy wins! Awesome job!');
        setTimeout(() => {
          recordGameResult({
            gameId: 'tic-tac-toe',
            score: 30,
            correctCount: 1,
            totalCount: 1,
            customStars: 3,
          });
        }, 900);
      } else if (winner === 'K') {
        if (vsMode === '2p') {
          fireMiniConfetti();
          speakBilingual('বিড়ালছানা জিতে গেছে!', 'Kitty wins!');
          setTimeout(() => {
            recordGameResult({
              gameId: 'tic-tac-toe',
              score: 30,
              correctCount: 1,
              totalCount: 1,
              customStars: 3,
            });
          }, 900);
        } else {
          audioManager.playWrong();
          speakBilingual(
            'এই রাউন্ডে বিড়ালছানা জিতেছে! আবার খেলতে নতুন বোর্ডে ট্যাপ করো!',
            'Kitty won this round! Tap Reset to play again!'
          );
        }
      } else {
        speakBilingual('খেলাটি ড্র হয়েছে! আবার খেলো!', 'It is a friendly tie!');
      }
    },
    [recordGameResult, vsMode]
  );

  useEffect(() => {
    if (vsMode !== 'bot' || turn !== 'K' || outcome.winner) return;

    const timer = setTimeout(() => {
      const empty = board.map((v, i) => (v === null ? i : -1)).filter((i) => i !== -1);
      if (empty.length === 0) return;

      let chosenIdx = empty[Math.floor(Math.random() * empty.length)];

      if (state.difficulty !== 'easy') {
        for (const i of empty) {
          const copy = [...board];
          copy[i] = 'K';
          if (checkWinner(copy).winner === 'K') {
            chosenIdx = i;
            break;
          }
        }
        if (
          board[chosenIdx] !== null ||
          checkWinner([...board.slice(0, chosenIdx), 'K', ...board.slice(chosenIdx + 1)]).winner !== 'K'
        ) {
          for (const i of empty) {
            const copy = [...board];
            copy[i] = 'P';
            if (checkWinner(copy).winner === 'P') {
              chosenIdx = i;
              break;
            }
          }
        }
      }

      const nextBoard = [...board];
      nextBoard[chosenIdx] = 'K';
      audioManager.playPop();
      setBoard(nextBoard);
      const res = checkWinner(nextBoard);
      if (res.winner) {
        setOutcome(res);
        finishMatch(res.winner);
      } else {
        setTurn('P');
      }
    }, 520);

    return () => clearTimeout(timer);
  }, [vsMode, turn, board, outcome.winner, state.difficulty, finishMatch]);

  const handleCellTap = (idx: number) => {
    if (board[idx] || outcome.winner) return;
    if (vsMode === 'bot' && turn === 'K') return;

    audioManager.playPop();
    const nextBoard = [...board];
    nextBoard[idx] = turn;
    setBoard(nextBoard);

    const res = checkWinner(nextBoard);
    if (res.winner) {
      setOutcome(res);
      finishMatch(res.winner);
    } else {
      setTurn(turn === 'P' ? 'K' : 'P');
    }
  };

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setVsMode('bot');
              resetBoard();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
              vsMode === 'bot' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-orange-500" />
            <span>{isEn ? '1 Player vs Kitty' : '১ প্লেয়ার বনাম কিটি'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setVsMode('2p');
              resetBoard();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
              vsMode === '2p' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-sky-500" />
            <span>{isEn ? '2 Players' : '২ প্লেয়ার'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={resetBoard}
          className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isEn ? 'New Board' : 'নতুন বোর্ড'}</span>
        </button>
      </div>

      <div className="mb-5 font-display text-xl font-extrabold text-slate-900">
        {outcome.winner === 'P'
          ? isEn
            ? '🐶 Puppy Wins!'
            : '🐶 কুকুরছানা জিতেছে!'
          : outcome.winner === 'K'
            ? isEn
              ? '🐱 Kitty Wins!'
              : '🐱 বিড়ালছানা জিতেছে!'
            : outcome.winner === 'DRAW'
              ? isEn
                ? '🤝 Friendly Tie! Play Again!'
                : '🤝 দারুণ ড্র! আবার খেলো!'
              : turn === 'P'
                ? isEn
                  ? '🐶 Puppy’s Turn'
                  : '🐶 কুকুরছানার চাল'
                : vsMode === 'bot'
                  ? isEn
                    ? '🐱 Kitty is thinking...'
                    : '🐱 বিড়ালছানা ভাবছে...'
                  : isEn
                    ? '🐱 Kitty’s Turn'
                    : '🐱 বিড়ালছানার চাল'}
      </div>

      <div className="grid grid-cols-3 gap-3.5 max-w-xs mx-auto">
        {board.map((cell, idx) => {
          const isWinCell = outcome.line?.includes(idx);
          return (
            <motion.button
              key={idx}
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => handleCellTap(idx)}
              className={`h-24 rounded-3xl border-2 text-5xl flex items-center justify-center cursor-pointer transition-colors ${
                isWinCell
                  ? 'bg-emerald-100 border-emerald-400 ring-4 ring-emerald-200'
                  : 'bg-orange-50/50 border-orange-200 shadow-[0_5px_0_#FED7AA] hover:bg-orange-50'
              }`}
              aria-label={
                cell === 'P'
                  ? isEn
                    ? 'Puppy'
                    : 'কুকুরছানা'
                  : cell === 'K'
                    ? isEn
                      ? 'Kitty'
                      : 'বিড়ালছানা'
                    : isEn
                      ? `Empty square ${idx + 1}`
                      : `খালি ঘর ${idx + 1}`
              }
            >
              {cell === 'P' ? '🐶' : cell === 'K' ? '🐱' : ''}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
