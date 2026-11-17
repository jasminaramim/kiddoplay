import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Rocket, Compass } from 'lucide-react';
import { SOLAR_PLANETS, PlanetInfo } from '../../data/learningContent';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';
import { fireMiniConfetti } from '../../utils/confettiUtils';

const PLANETS_BN: Record<string, { factBn: string; questionBn: string }> = {
  Sun: { factBn: 'সূর্য একটি উজ্জ্বল নক্ষত্র যা সৌরজগতের কেন্দ্রে থাকে এবং আমাদের আলো ও তাপ দেয়!', questionBn: 'সৌরজগতের কেন্দ্রে কোন উজ্জ্বল নক্ষত্র রয়েছে?' },
  Mercury: { factBn: 'বুধ হলো সবচেয়ে ছোট গ্রহ এবং সূর্যের সবচেয়ে কাছে অবস্থিত!', questionBn: 'সবচেয়ে ছোট এবং সূর্যের সবচেয়ে কাছের গ্রহ কোনটি?' },
  Venus: { factBn: 'শুক্র গ্রহ আকাশের সবচেয়ে উজ্জ্বল এবং সবচেয়ে গরম গ্রহ!', questionBn: 'সৌরজগতের সবচেয়ে গরম গ্রহ কোনটি?' },
  Earth: { factBn: 'পৃথিবী আমাদের সুন্দর নীল গ্রহ, যেখানে পানি, বাতাস ও প্রাণ আছে!', questionBn: 'কোন নীল গ্রহে আমরা বসবাস করি?' },
  Mars: { factBn: 'লাল ধুলোর কারণে মঙ্গল গ্রহকে লাল গ্রহ বলা হয়!', questionBn: 'কোন গ্রহকে লাল গ্রহ বলা হয়?' },
  Jupiter: { factBn: 'বৃহস্পতি হলো সৌরজগতের সবচেয়ে বড় গ্রহ!', questionBn: 'সৌরজগতের সবচেয়ে বড় গ্রহ কোনটি?' },
  Saturn: { factBn: 'শনি গ্রহের চারপাশে সুন্দর বরফের বলয় বা রিং রয়েছে!', questionBn: 'কোন গ্রহের চারপাশে সুন্দর রিং বা বলয় আছে?' },
  Uranus: { factBn: 'ইউরেনাস হলো বরফের নীল গ্রহ যা পাশ ফিরে ঘোরে!', questionBn: 'কোন বরফের গ্রহ একপাশে কাত হয়ে ঘোরে?' },
  Neptune: { factBn: 'নেপচুন হলো সূর্য থেকে সবচেয়ে দূরের নীল ঝড়ো গ্রহ!', questionBn: 'সূর্য থেকে সবচেয়ে দূরের নীল গ্রহ কোনটি?' },
};

export const SpaceExplorerGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const [mode, setMode] = useState<'tour' | 'quiz'>('tour');
  const [activePlanet, setActivePlanet] = useState<PlanetInfo>(SOLAR_PLANETS[3]);

  const totalQuestions = 6;
  const [qIndex, setQIndex] = useState(0);
  const [quizTarget, setQuizTarget] = useState<PlanetInfo>(SOLAR_PLANETS[0]);
  const [options, setOptions] = useState<PlanetInfo[]>([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongNames, setWrongNames] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);

  const setupQuizQuestion = useCallback(() => {
    const shuffled = [...SOLAR_PLANETS].sort(() => Math.random() - 0.5);
    const target = shuffled[0];
    const choices = shuffled.slice(0, 4).sort((a, b) => a.order - b.order);
    setQuizTarget(target);
    setOptions(choices);
    setWrongNames([]);
    setLocked(false);
    speakBilingual(
      PLANETS_BN[target.name]?.questionBn || target.question,
      target.question
    );
  }, []);

  useEffect(() => {
    if (mode === 'quiz') {
      setQIndex(0);
      setScore(0);
      setCorrectCount(0);
      setupQuizQuestion();
    }
  }, [mode, setupQuizQuestion]);

  const handleSelectPlanetTour = (p: PlanetInfo) => {
    audioManager.playPop();
    setActivePlanet(p);
    speakBilingual(
      `${p.nameBn}! ${PLANETS_BN[p.name]?.factBn || ''}`,
      `${p.name}! ${p.fact}`
    );
  };

  const handleQuizChoice = (p: PlanetInfo) => {
    if (locked) return;
    if (p.name === quizTarget.name) {
      setLocked(true);
      audioManager.playCorrect();
      fireMiniConfetti();
      const firstTry = wrongNames.length === 0;
      const nextScore = score + (firstTry ? 15 : 10);
      const nextCorrect = correctCount + (firstTry ? 1 : 0);
      setScore(nextScore);
      setCorrectCount(nextCorrect);
      speakBilingual(`দারুণ! ${p.nameBn} একদম ঠিক!`, `Blast off! ${p.name} is right!`);

      setTimeout(() => {
        if (qIndex + 1 >= totalQuestions) {
          recordGameResult({
            gameId: 'space-explorer',
            score: nextScore,
            correctCount: Math.max(1, nextCorrect),
            totalCount: totalQuestions,
          });
        } else {
          setQIndex((q) => q + 1);
          setupQuizQuestion();
        }
      }, 950);
    } else {
      audioManager.playWrong();
      setWrongNames((prev) => [...prev, p.name]);
      speakBilingual(`ওটা ${p.nameBn}। অন্য গ্রহটি খুঁজে দেখো!`, `That is ${p.name}. Try another planet!`);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              setMode('tour');
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 cursor-pointer ${
              mode === 'tour' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Compass className="w-4 h-4 text-violet-600" />
            <span>{isEn ? 'Solar System Tour' : 'সৌরজগৎ ভ্রমণ'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              setMode('quiz');
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 cursor-pointer ${
              mode === 'quiz' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Rocket className="w-4 h-4 text-sky-600" />
            <span>{isEn ? 'Space Quiz' : 'মহাকাশ কুইজ'}</span>
          </button>
        </div>

        {mode === 'quiz' && (
          <div className="text-sm font-bold text-slate-600 tabular-nums">
            {isEn ? `Mission ${qIndex + 1} / ${totalQuestions} · Score ${score}` : `অভিযান ${qIndex + 1} / ${totalQuestions} · স্কোর ${score}`}
          </div>
        )}
      </div>

      {mode === 'tour' ? (
        <div className="space-y-6">
          <div className="rounded-3xl bg-slate-900 border-2 border-slate-800 p-5 sm:p-7 overflow-x-auto">
            <p className="text-xs font-bold text-sky-300 mb-4">
              {isEn ? 'Tap any planet or the Sun to explore facts:' : 'যেকোনো গ্রহ বা সূর্য ট্যাপ করে মজার তথ্য শোনো:'}
            </p>
            <div className="flex items-center justify-between gap-4 min-w-[600px] py-4">
              {SOLAR_PLANETS.map((p) => {
                const selected = activePlanet.name === p.name;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleSelectPlanetTour(p)}
                    className={`flex flex-col items-center gap-2 p-2 rounded-2xl cursor-pointer transition-transform ${
                      selected ? 'bg-white/15 scale-110 ring-2 ring-sky-400' : 'hover:scale-105'
                    }`}
                  >
                    <div
                      className="rounded-full flex items-center justify-center shadow-md relative"
                      style={{
                        width: p.sizePx,
                        height: p.sizePx,
                        backgroundColor: p.color,
                      }}
                    >
                      {p.name === 'Saturn' && (
                        <span className="absolute w-14 h-3 border-2 border-amber-200 rounded-full -rotate-12 pointer-events-none" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-white whitespace-nowrap">
                      {isEn ? p.name : p.nameBn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl bg-violet-50 border-2 border-violet-200 p-6 flex flex-col sm:flex-row items-center gap-5">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shrink-0 shadow-md"
              style={{ backgroundColor: activePlanet.color }}
              aria-hidden="true"
            >
              {activePlanet.emoji}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="font-display text-2xl font-extrabold text-slate-900">
                {isEn ? `${activePlanet.name} (${activePlanet.nameBn})` : `${activePlanet.nameBn} (${activePlanet.name})`}
              </h2>
              <p className="text-sm font-semibold text-violet-800 mb-1">
                {activePlanet.order === 0
                  ? isEn ? 'Center Star' : 'সৌরজগতের কেন্দ্র নক্ষত্র'
                  : isEn ? `Planet #${activePlanet.order} from the Sun` : `সূর্য থেকে ${activePlanet.order} নম্বর গ্রহ`}
              </p>
              <p className="text-base text-slate-700">
                {isEn ? activePlanet.fact : PLANETS_BN[activePlanet.name]?.factBn || activePlanet.fact}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto text-center">
          <div className="rounded-3xl bg-slate-900 text-white p-7 mb-6">
            <div className="text-5xl mb-3" aria-hidden="true">🪐</div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold leading-snug">
              {isEn ? quizTarget.question : PLANETS_BN[quizTarget.name]?.questionBn || quizTarget.question}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {options.map((p) => {
              const isRight = locked && p.name === quizTarget.name;
              const isWrong = wrongNames.includes(p.name);
              return (
                <motion.button
                  key={p.name}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuizChoice(p)}
                  className={`min-h-24 rounded-3xl border-2 p-4 flex items-center justify-center gap-3 cursor-pointer transition-colors ${
                    isRight
                      ? 'bg-emerald-500 border-emerald-600 text-white'
                      : isWrong
                        ? 'bg-rose-50 border-rose-200 text-rose-400'
                        : 'bg-white border-violet-200 text-slate-900 shadow-[0_5px_0_#C4B5FD] hover:bg-violet-50'
                  }`}
                >
                  <span
                    className="w-9 h-9 rounded-full shrink-0"
                    style={{ backgroundColor: p.color }}
                  />
                  <div className="text-left">
                    <div className="font-display text-lg font-extrabold">
                      {isEn ? p.name : p.nameBn}
                    </div>
                    {state.language === 'both' && (
                      <div className="text-xs opacity-75">{p.name}</div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
