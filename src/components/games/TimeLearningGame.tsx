import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';
import { fireMiniConfetti } from '../../utils/confettiUtils';

interface ClockQuestion {
  type: 'clock' | 'calendar';
  hour: number;
  minute: number;
  prompt: string;
  promptBn: string;
  answer: string;
  choices: string[];
}

const CALENDAR_QUESTIONS = [
  {
    prompt: 'Which day comes right after Monday?',
    promptBn: 'সোমবারের ঠিক পরের দিন কী বার?',
    answer: 'Tuesday',
    answerBn: 'মঙ্গলবার',
    choices: ['Sunday', 'Tuesday', 'Friday', 'Thursday'],
    choicesBn: ['রবিবার', 'মঙ্গলবার', 'শুক্রবার', 'বৃহস্পতিবার'],
  },
  {
    prompt: 'Which month is the very first month of the year?',
    promptBn: 'ইংরেজি বছরের প্রথম মাস কোনটি?',
    answer: 'January',
    answerBn: 'জানুয়ারি',
    choices: ['January', 'March', 'July', 'December'],
    choicesBn: ['জানুয়ারি', 'মার্চ', 'জুলাই', 'ডিসেম্বর'],
  },
  {
    prompt: 'How many days are there in one week?',
    promptBn: 'এক সপ্তাহে কয়টি দিন থাকে?',
    answer: '7 Days',
    answerBn: '৭ দিন',
    choices: ['5 Days', '6 Days', '7 Days', '10 Days'],
    choicesBn: ['৫ দিন', '৬ দিন', '৭ দিন', '১০ দিন'],
  },
  {
    prompt: 'Which day comes right before Sunday?',
    promptBn: 'রবিবারের ঠিক আগের দিন কী বার?',
    answer: 'Saturday',
    answerBn: 'শনিবার',
    choices: ['Friday', 'Saturday', 'Monday', 'Wednesday'],
    choicesBn: ['শুক্রবার', 'শনিবার', 'সোমবার', 'বুধবার'],
  },
];

function formatTimeLabel(h: number, m: number): string {
  return `${h}:${String(m).padStart(2, '0')}`;
}

export const TimeLearningGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const totalRounds = 6;

  const [round, setRound] = useState(0);
  const [question, setQuestion] = useState<ClockQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);

  const buildQuestion = useCallback(
    (roundNum: number): ClockQuestion => {
      if (roundNum % 3 === 2) {
        const cal = CALENDAR_QUESTIONS[Math.floor(Math.random() * CALENDAR_QUESTIONS.length)];
        speakBilingual(cal.promptBn, cal.prompt);
        return {
          type: 'calendar',
          hour: 12,
          minute: 0,
          prompt: cal.prompt,
          promptBn: cal.promptBn,
          answer: isEn ? cal.answer : cal.answerBn,
          choices: [...(isEn ? cal.choices : cal.choicesBn)].sort(() => Math.random() - 0.5),
        };
      }

      const hour = Math.floor(Math.random() * 12) + 1;
      const minuteOptions =
        state.difficulty === 'easy'
          ? [0]
          : state.difficulty === 'medium'
            ? [0, 30]
            : [0, 15, 30, 45];
      const minute = minuteOptions[Math.floor(Math.random() * minuteOptions.length)];
      const answer = formatTimeLabel(hour, minute);

      const setChoices = new Set<string>([answer]);
      while (setChoices.size < 4) {
        const rh = Math.floor(Math.random() * 12) + 1;
        const rm = minuteOptions[Math.floor(Math.random() * minuteOptions.length)];
        setChoices.add(formatTimeLabel(rh, rm));
      }

      const qEn = 'What time does the clock show?';
      const qBn = 'ঘড়িতে এখন কয়টা বাজে?';
      speakBilingual(qBn, qEn);
      return {
        type: 'clock',
        hour,
        minute,
        prompt: qEn,
        promptBn: qBn,
        answer,
        choices: Array.from(setChoices).sort(),
      };
    },
    [state.difficulty, isEn]
  );

  useEffect(() => {
    setRound(0);
    setScore(0);
    setCorrectCount(0);
    setQuestion(buildQuestion(0));
    setWrongPicks([]);
    setLocked(false);
  }, [buildQuestion]);

  const handleSelect = (choice: string) => {
    if (!question || locked) return;
    if (choice === question.answer) {
      setLocked(true);
      audioManager.playCorrect();
      fireMiniConfetti();
      const firstTry = wrongPicks.length === 0;
      const nextScore = score + (firstTry ? 15 : 10);
      const nextCorrect = correctCount + (firstTry ? 1 : 0);
      setScore(nextScore);
      setCorrectCount(nextCorrect);
      speakBilingual(`শাবাশ! উত্তর হলো ${choice}!`, `Awesome! It is ${choice}!`);

      setTimeout(() => {
        if (round + 1 >= totalRounds) {
          recordGameResult({
            gameId: 'time-learning',
            score: nextScore,
            correctCount: Math.max(1, nextCorrect),
            totalCount: totalRounds,
          });
        } else {
          const nextR = round + 1;
          setRound(nextR);
          setQuestion(buildQuestion(nextR));
          setWrongPicks([]);
          setLocked(false);
        }
      }, 950);
    } else {
      audioManager.playWrong();
      setWrongPicks((prev) => [...prev, choice]);
      speakBilingual(
        'ছোট ঘণ্টার কাঁটা এবং বড় মিনিটের কাঁটা ভালো করে দেখো!',
        'Look at the short hour hand and long minute hand!'
      );
    }
  };

  if (!question) return null;

  const hourAngle = ((question.hour % 12) + question.minute / 60) * 30;
  const minuteAngle = question.minute * 6;

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="flex items-center justify-between mb-4 text-sm font-bold text-slate-600 tabular-nums">
        <span>{isEn ? `Clock ${round + 1} / ${totalRounds}` : `পর্ব ${round + 1} / ${totalRounds}`}</span>
        <span>{isEn ? `Score: ${score}` : `স্কোর: ${score}`}</span>
      </div>

      <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-5">
        {isEn ? question.prompt : question.promptBn}
      </h2>

      {question.type === 'clock' ? (
        <div className="flex justify-center mb-7">
          <svg viewBox="0 0 220 220" className="w-52 h-52 sm:w-60 sm:h-60 drop-shadow-sm">
            <circle cx="110" cy="110" r="98" fill="#FFFFFF" stroke="#0D9488" strokeWidth="10" />
            <circle cx="110" cy="110" r="88" fill="#F0FDFA" />
            {Array.from({ length: 12 }).map((_, idx) => {
              const num = idx + 1;
              const angle = (num * 30 - 90) * (Math.PI / 180);
              const x = 110 + Math.cos(angle) * 70;
              const y = 110 + Math.sin(angle) * 70;
              return (
                <text
                  key={num}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-display font-extrabold fill-slate-800 text-[15px]"
                >
                  {num}
                </text>
              );
            })}
            <line
              x1="110"
              y1="110"
              x2={110 + Math.sin((hourAngle * Math.PI) / 180) * 44}
              y2={110 - Math.cos((hourAngle * Math.PI) / 180) * 44}
              stroke="#0F766E"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <line
              x1="110"
              y1="110"
              x2={110 + Math.sin((minuteAngle * Math.PI) / 180) * 66}
              y2={110 - Math.cos((minuteAngle * Math.PI) / 180) * 66}
              stroke="#F43F5E"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="110" cy="110" r="7" fill="#0F172A" />
          </svg>
        </div>
      ) : (
        <div className="rounded-3xl bg-teal-50 border-2 border-teal-200 p-8 mb-7 text-6xl" aria-hidden="true">
          📅
        </div>
      )}

      <div className="grid grid-cols-2 gap-3.5 max-w-md mx-auto">
        {question.choices.map((c) => {
          const isRight = locked && c === question.answer;
          const isWrong = wrongPicks.includes(c);
          return (
            <motion.button
              key={c}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(c)}
              className={`min-h-16 rounded-2xl border-2 px-4 py-3 font-display text-xl font-extrabold tabular-nums cursor-pointer transition-colors ${
                isRight
                  ? 'bg-emerald-500 border-emerald-600 text-white'
                  : isWrong
                    ? 'bg-rose-50 border-rose-200 text-rose-400'
                    : 'bg-white border-teal-200 text-slate-900 shadow-[0_4px_0_#5EEAD4] hover:bg-teal-50'
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
