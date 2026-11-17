import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, Award, Sparkles, Hash, Calculator, HelpCircle } from 'lucide-react';
import { BANGLA_NUMBERS, BANGLA_NAMTA_DATA, BanglaNumberCard } from '../../data/learningContent';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBangla } from '../../utils/speechUtils';
import { fireCelebrationConfetti } from '../../utils/confettiUtils';

export const BanglaNumbersGame: React.FC = () => {
  const { recordGameResult } = useKiddo();
  const [tab, setTab] = useState<'count' | 'namta' | 'quiz'>('count');
  const [selectedNum, setSelectedNum] = useState<BanglaNumberCard>(BANGLA_NUMBERS[0]);
  const [activeNamtaIdx, setActiveNamtaIdx] = useState(0);

  // Quiz state
  const [quizTarget, setQuizTarget] = useState<number>(3);
  const [quizItem, setQuizItem] = useState<{ emoji: string; name: string }>({ emoji: '🥭', name: 'আম' });
  const [quizScore, setQuizScore] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);

  const initQuiz = () => {
    const randomCount = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const items = [
      { emoji: '🥭', name: 'আম' },
      { emoji: '🌸', name: 'ফুল' },
      { emoji: '⭐', name: 'তারা' },
      { emoji: '🎈', name: 'বেলুন' },
      { emoji: '🍎', name: 'আপেল' },
      { emoji: '🐱', name: 'বিড়াল' },
    ];
    const chosen = items[Math.floor(Math.random() * items.length)];
    setQuizTarget(randomCount);
    setQuizItem(chosen);
    setAnswered(null);

    const bnWord = BANGLA_NUMBERS.find((n) => n.num === randomCount)?.bnWord || '';
    speakBangla(`গুনে বলো তো, এখানে কয়টি ${chosen.name} আছে?`);
  };

  const handleCardClick = (num: BanglaNumberCard) => {
    setSelectedNum(num);
    audioManager.playPop();
    speakBangla(`${num.bnDigit}! ${num.bnWord}! ${num.itemBn}!`);
  };

  const handleNamtaRowClick = (text: string, voice: string) => {
    audioManager.playClick();
    speakBangla(voice);
  };

  const handleQuizAnswer = (num: number) => {
    if (answered !== null) return;
    setAnswered(num);

    const targetCard = BANGLA_NUMBERS.find((n) => n.num === quizTarget);
    if (num === quizTarget) {
      audioManager.playCorrect();
      audioManager.playStarSuccess();
      fireCelebrationConfetti();
      setQuizScore((s) => s + 1);
      speakBangla(`শাবাশ! একদম সঠিক! এখানে ${targetCard?.bnDigit} অর্থাৎ ${targetCard?.bnWord}টি ${quizItem.name} আছে!`);

      recordGameResult({
        gameId: 'bangla-numbers',
        score: (quizScore + 1) * 15,
        customStars: 2,
        correctCount: 1,
        totalCount: 1,
      });
    } else {
      audioManager.playWrong();
      speakBangla(`হলো না! আবার ভালো করে গুনে দেখো।`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Tabs */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => {
            audioManager.playClick();
            setTab('count');
          }}
          className={`px-5 py-2.5 rounded-2xl font-display font-bold text-sm sm:text-base border-2 flex items-center gap-2 cursor-pointer transition-transform ${
            tab === 'count'
              ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-[0_4px_0_#D97706]'
              : 'bg-white border-slate-200 text-slate-700 hover:border-amber-300'
          }`}
        >
          <Hash className="w-5 h-5 text-amber-600" />
          <span>১–১০ গণনা</span>
        </button>
        <button
          onClick={() => {
            audioManager.playClick();
            setTab('namta');
          }}
          className={`px-5 py-2.5 rounded-2xl font-display font-bold text-sm sm:text-base border-2 flex items-center gap-2 cursor-pointer transition-transform ${
            tab === 'namta'
              ? 'bg-teal-500 border-teal-600 text-white shadow-[0_4px_0_#0F766E]'
              : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300'
          }`}
        >
          <Calculator className="w-5 h-5 text-teal-600" />
          <span>মজার নামতা</span>
        </button>
        <button
          onClick={() => {
            audioManager.playClick();
            setTab('quiz');
            initQuiz();
          }}
          className={`px-5 py-2.5 rounded-2xl font-display font-bold text-sm sm:text-base border-2 flex items-center gap-2 cursor-pointer transition-transform ${
            tab === 'quiz'
              ? 'bg-rose-500 border-rose-600 text-white shadow-[0_4px_0_#BE123C]'
              : 'bg-white border-slate-200 text-slate-700 hover:border-rose-300'
          }`}
        >
          <HelpCircle className="w-5 h-5 text-rose-600" />
          <span>গণনা কুইজ</span>
        </button>
      </div>

      {/* View 1: 1-10 Counting Grid */}
      {tab === 'count' && (
        <div className="space-y-6">
          {/* Spotlight Hero Card */}
          <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-[2.5rem] border-[3px] border-amber-300 p-6 sm:p-8 shadow-[0_8px_0_#FCD34D] text-center relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
              <div className="text-center sm:text-left">
                <span className="font-display font-black text-7xl sm:text-9xl text-amber-900 block leading-none">
                  {selectedNum.bnDigit}
                </span>
                <p className="font-display font-extrabold text-3xl sm:text-4xl text-rose-600 mt-2">
                  {selectedNum.bnWord}
                </p>
                <p className="text-sm font-bold text-slate-500 uppercase">
                  {selectedNum.enWord} ({selectedNum.num})
                </p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="flex flex-wrap justify-center gap-2 max-w-xs p-4 bg-white/80 rounded-3xl border-2 border-amber-200 shadow-inner">
                  {Array.from({ length: selectedNum.num }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="text-4xl sm:text-5xl inline-block"
                    >
                      {selectedNum.emoji}
                    </motion.span>
                  ))}
                </div>
                <p className="font-display font-bold text-lg text-slate-800">
                  {selectedNum.itemBn}
                </p>
                <button
                  onClick={() => speakBangla(`${selectedNum.bnDigit}! ${selectedNum.bnWord}! ${selectedNum.itemBn}!`)}
                  className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-display font-bold text-sm border-2 border-amber-600 shadow-[0_3px_0_#D97706] flex items-center gap-2 cursor-pointer transition-transform active:translate-y-0.5"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>বাংলায় শোনো 📢</span>
                </button>
              </div>
            </div>
          </div>

          {/* 1 to 10 Numbers Button Strip */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 sm:gap-3">
            {BANGLA_NUMBERS.map((n) => {
              const active = selectedNum.num === n.num;
              return (
                <button
                  key={n.num}
                  onClick={() => handleCardClick(n)}
                  className={`p-3 rounded-2xl border-[3px] flex flex-col items-center justify-center transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-400 border-amber-600 shadow-[0_5px_0_#B45309] scale-105'
                      : 'bg-white border-slate-200 hover:border-amber-300 shadow-[0_3px_0_#E2E8F0]'
                  }`}
                >
                  <span className="font-display font-black text-2xl sm:text-3xl text-slate-900">
                    {n.bnDigit}
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    {n.bnWord}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* View 2: Namta / Multiplication */}
      {tab === 'namta' && (
        <div className="bg-white rounded-[2.5rem] border-[3px] border-teal-300 p-6 sm:p-8 shadow-[0_8px_0_#99F6E4] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
            <div>
              <h3 className="font-display text-2xl font-extrabold text-slate-900">
                বাংলা গুণের মজার নামতা 📐
              </h3>
              <p className="text-xs sm:text-sm font-bold text-slate-500">
                লাইনে ক্লিক করলেই মিষ্টি সুরে নামতা আবৃত্তি শোনা যাবে!
              </p>
            </div>
            <div className="flex gap-2">
              {BANGLA_NAMTA_DATA.map((namta, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    audioManager.playClick();
                    setActiveNamtaIdx(idx);
                    speakBangla(`${namta.title}! এসো একসাথে আবৃত্তি করি!`);
                  }}
                  className={`px-4 py-2 rounded-2xl font-display font-bold text-sm border-2 cursor-pointer ${
                    activeNamtaIdx === idx
                      ? 'bg-teal-500 border-teal-600 text-white shadow-[0_3px_0_#0F766E]'
                      : 'bg-teal-50 border-teal-200 text-teal-800'
                  }`}
                >
                  {namta.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BANGLA_NAMTA_DATA[activeNamtaIdx].rows.map((row, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleNamtaRowClick(row.text, row.voice)}
                className="p-3.5 rounded-2xl bg-teal-50/60 border-2 border-teal-200 hover:border-teal-400 flex items-center justify-between cursor-pointer transition-all shadow-sm"
              >
                <span className="font-display font-bold text-lg text-slate-800">
                  {row.text}
                </span>
                <span className="text-xs font-bold text-teal-700 bg-white px-2.5 py-1 rounded-xl border border-teal-200">
                  🗣️ {row.voice}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: Counting Quiz */}
      {tab === 'quiz' && (
        <div className="bg-white rounded-[2.5rem] border-[3px] border-rose-300 p-6 sm:p-8 shadow-[0_8px_0_#FECDD3] text-center space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-500">
              সঠিক উত্তর: <strong className="text-rose-600">{quizScore}</strong>
            </span>
            <button
              onClick={initQuiz}
              className="text-xs font-bold text-sky-600 hover:underline cursor-pointer"
            >
              অন্য প্রশ্ন 🔄
            </button>
          </div>

          <div className="bg-rose-50 rounded-3xl border-2 border-rose-200 p-6 space-y-3">
            <p className="font-display font-bold text-xl text-slate-800">
              গুনে বলো তো, এখানে কয়টি <span className="text-rose-600">{quizItem.name}</span> আছে?
            </p>
            <div className="flex flex-wrap justify-center gap-3 p-4 bg-white/90 rounded-2xl max-w-md mx-auto">
              {Array.from({ length: quizTarget }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="text-5xl"
                >
                  {quizItem.emoji}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
              const card = BANGLA_NUMBERS.find((bn) => bn.num === n);
              const isSelected = answered === n;
              const isCorrectChoice = n === quizTarget;

              let style = 'bg-white border-slate-200 text-slate-800 hover:border-rose-300 shadow-[0_4px_0_#E2E8F0]';
              if (answered !== null) {
                if (isCorrectChoice) {
                  style = 'bg-emerald-500 border-emerald-600 text-white shadow-[0_4px_0_#059669]';
                } else if (isSelected) {
                  style = 'bg-rose-500 border-rose-600 text-white shadow-[0_4px_0_#E11D48]';
                }
              }

              return (
                <button
                  key={n}
                  onClick={() => handleQuizAnswer(n)}
                  disabled={answered !== null}
                  className={`p-3 sm:p-4 rounded-2xl border-[3px] font-display font-black text-2xl sm:text-3xl cursor-pointer transition-transform active:translate-y-0.5 ${style}`}
                >
                  {card?.bnDigit}
                </button>
              );
            })}
          </div>

          {answered !== null && (
            <div className="pt-2">
              <button
                onClick={initQuiz}
                className="px-6 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-display font-bold text-sm border-2 border-rose-600 shadow-[0_3px_0_#BE123C] cursor-pointer"
              >
                পরবর্তী কুইজ ➡️
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
