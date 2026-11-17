import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Eraser, CheckCircle2, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBilingual } from '../../utils/speechUtils';
import { fireMiniConfetti } from '../../utils/confettiUtils';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const BANGLA_CHARS = ['অ', 'আ', 'ই', 'ঈ', 'উ', 'এ', 'ক', 'খ', 'গ', 'চ', 'ত', 'ন', 'প', 'ব', 'ম'];
const NUMBERS = Array.from({ length: 20 }, (_, i) => String(i + 1));
const PEN_COLORS = [
  { name: 'Sky', hex: '#0EA5E9' },
  { name: 'Coral', hex: '#F43F5E' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Violet', hex: '#8B5CF6' },
  { name: 'Orange', hex: '#F97316' },
];

export const TracingGame: React.FC = () => {
  const { state, recordGameResult } = useKiddo();
  const isEn = state.language === 'en';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [setType, setSetType] = useState<'bangla' | 'letters' | 'numbers'>('bangla');
  const [itemIndex, setItemIndex] = useState(0);
  const [penColor, setPenColor] = useState(PEN_COLORS[0].hex);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const items = setType === 'bangla' ? BANGLA_CHARS : setType === 'letters' ? LETTERS : NUMBERS;
  const currentChar = items[itemIndex];

  const drawTemplate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    [90, 170, 250].forEach((y) => {
      ctx.beginPath();
      ctx.moveTo(24, y);
      ctx.lineTo(canvas.width - 24, y);
      ctx.stroke();
    });
    ctx.restore();

    ctx.save();
    const fontSize = currentChar.length > 1 ? 185 : 210;
    ctx.font = `700 ${fontSize}px Fredoka, "Noto Sans Bengali", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#F1F5F9';
    ctx.fillText(currentChar, canvas.width / 2, canvas.height / 2 + 6);
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.strokeText(currentChar, canvas.width / 2, canvas.height / 2 + 6);
    ctx.restore();

    setStrokeCount(0);
  }, [currentChar]);

  useEffect(() => {
    drawTemplate();
    speakBilingual(
      `${currentChar} এর ওপর হাত ঘুরিয়ে সুন্দর করে আঁকো!`,
      `Trace ${setType === 'letters' ? 'the letter' : 'the number'} ${currentChar}!`
    );
  }, [drawTemplate, setType, currentChar]);

  const getCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.setPointerCapture(e.pointerId);
    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 18;
    ctx.strokeStyle = penColor;
    setIsDrawing(true);
    setStrokeCount((c) => c + 1);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const handleCompleteTracing = () => {
    if (strokeCount === 0) {
      speakBilingual(
        `প্রথমে আঙুল বা মাউস দিয়ে ${currentChar} লিখে দেখাও!`,
        `Use your finger or mouse to trace ${currentChar} first!`
      );
      return;
    }
    audioManager.playCorrect();
    fireMiniConfetti();
    const nextDone = completedCount + 1;
    setCompletedCount(nextDone);
    speakBilingual(
      `বাহ! খুব সুন্দর ${currentChar} লিখেছো!`,
      `Wonderful writing! You traced ${currentChar}!`
    );

    if (nextDone >= 3) {
      recordGameResult({
        gameId: 'letter-tracing',
        score: nextDone * 20,
        correctCount: nextDone,
        totalCount: nextDone,
        customStars: 3,
      });
      setCompletedCount(0);
    } else {
      setItemIndex((i) => (i + 1) % items.length);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              setSetType('bangla');
              setItemIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
              setType === 'bangla' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            বাংলা বর্ণ
          </button>
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              setSetType('letters');
              setItemIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
              setType === 'letters' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            {isEn ? 'A–Z Letters' : 'ইংরেজি A–Z'}
          </button>
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              setSetType('numbers');
              setItemIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
              setType === 'numbers' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            {isEn ? '1–20 Numbers' : '১–২০ সংখ্যা'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {PEN_COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => setPenColor(c.hex)}
              aria-label={`${c.name} pen`}
              className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-transform ${
                penColor === c.hex ? 'border-slate-900 scale-115' : 'border-white shadow-sm'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>

        <div className="text-xs font-bold text-slate-600 tabular-nums">
          {isEn ? `Star Goal: ${completedCount} / 3 traced` : `তারা লক্ষ্য: ${completedCount} / ৩ টি লেখা`}
        </div>
      </div>

      <div className="relative bg-white rounded-3xl border-2 border-orange-200 overflow-hidden shadow-inner mb-5">
        <canvas
          ref={canvasRef}
          width={560}
          height={340}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-72 sm:h-80 touch-none cursor-crosshair block"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setItemIndex((i) => (i - 1 + items.length) % items.length)}
            className="min-h-11 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{isEn ? 'Prev' : 'আগের'}</span>
          </button>
          <span className="font-display text-xl font-extrabold text-slate-900 px-3 tabular-nums">
            {currentChar}
          </span>
          <button
            type="button"
            onClick={() => setItemIndex((i) => (i + 1) % items.length)}
            className="min-h-11 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center gap-1 cursor-pointer"
          >
            <span>{isEn ? 'Next' : 'পরের'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => speakBilingual(currentChar, currentChar)}
            className="min-h-11 px-4 py-2 rounded-2xl bg-sky-50 border-2 border-sky-200 text-sky-800 font-bold text-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isEn ? 'Hear' : 'শোনো'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              drawTemplate();
            }}
            className="min-h-11 px-4 py-2 rounded-2xl bg-slate-100 border-2 border-slate-200 text-slate-700 font-bold text-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Eraser className="w-4 h-4" />
            <span>{isEn ? 'Clear' : 'মুছে ফেলো'}</span>
          </button>

          <button
            type="button"
            onClick={handleCompleteTracing}
            className="min-h-11 px-5 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold text-sm border-2 border-emerald-600 shadow-[0_4px_0_#047857] active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isEn ? 'Done!' : 'লেখা শেষ!'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
