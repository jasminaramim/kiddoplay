import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Palette, Trash2, Download, Undo, Sparkles, Volume2 } from 'lucide-react';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBangla } from '../../utils/speechUtils';
import { fireCelebrationConfetti } from '../../utils/confettiUtils';

interface ColorOption {
  name: string;
  bnName: string;
  hex: string;
  bgClass: string;
}

const COLORS: ColorOption[] = [
  { name: 'Red', bnName: 'লাল রং', hex: '#EF4444', bgClass: 'bg-red-500' },
  { name: 'Blue', bnName: 'নীল রং', hex: '#3B82F6', bgClass: 'bg-blue-500' },
  { name: 'Green', bnName: 'সবুজ রং', hex: '#10B981', bgClass: 'bg-emerald-500' },
  { name: 'Yellow', bnName: 'হলুদ রং', hex: '#F59E0B', bgClass: 'bg-amber-500' },
  { name: 'Pink', bnName: 'গোলাপি রং', hex: '#EC4899', bgClass: 'bg-pink-500' },
  { name: 'Purple', bnName: 'বেগুনি রং', hex: '#8B5CF6', bgClass: 'bg-purple-500' },
  { name: 'Orange', bnName: 'কমলা রং', hex: '#F97316', bgClass: 'bg-orange-500' },
  { name: 'Black', bnName: 'কালো রং', hex: '#1E293B', bgClass: 'bg-slate-800' },
];

const STAMPS = [
  { emoji: '⭐', name: 'তারা' },
  { emoji: '🌸', name: 'সুন্দর ফুল' },
  { emoji: '🎈', name: 'উড়ন্ত বেলুন' },
  { emoji: '🦋', name: 'রঙিন প্রজাপতি' },
  { emoji: '🐱', name: 'কিউট বিড়াল' },
  { emoji: '👑', name: 'সোনার মুকুট' },
];

export const BanglaDrawingGame: React.FC = () => {
  const { recordGameResult } = useKiddo();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(COLORS[0]);
  const [brushSize, setBrushSize] = useState<number>(8);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState<'brush' | 'stamp' | 'eraser'>('brush');
  const [selectedStamp, setSelectedStamp] = useState(STAMPS[0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions with high DPI support
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, rect.width, rect.height);

    speakBangla('রংধনু আর্ট বোর্ডে স্বাগতম! তুলি নাও আর ইচ্ছেমতো ছবি আঁকো!');
  }, []);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);

    if (activeTool === 'stamp') {
      audioManager.playPop();
      ctx.font = `${brushSize * 5}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedStamp.emoji, x, y);
      speakBangla(selectedStamp.name);
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);

    if (activeTool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = brushSize * 2.5;
    } else {
      ctx.strokeStyle = selectedColor.hex;
      ctx.lineWidth = brushSize;
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTool === 'stamp') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.closePath();
  };

  const handleColorSelect = (color: ColorOption) => {
    setSelectedColor(color);
    setActiveTool('brush');
    audioManager.playClick();
    speakBangla(`${color.bnName} বেছে নিয়েছো!`);
  };

  const handleStampSelect = (stamp: typeof STAMPS[0]) => {
    setSelectedStamp(stamp);
    setActiveTool('stamp');
    audioManager.playClick();
    speakBangla(`${stamp.name} স্ট্যাম্প! এবার ক্যানভাসে ট্যাপ করো!`);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, rect.width, rect.height);
    audioManager.playWrong();
    speakBangla('ক্যানভাস পরিষ্কার করা হলো! নতুন ছবি আঁকো!');
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    audioManager.playStarSuccess();
    fireCelebrationConfetti();
    speakBangla('দারুণ ছবি এঁকেছো! ছবি ডাউনলোড হচ্ছে!');

    const link = document.createElement('a');
    link.download = 'kiddoplay-drawing.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    recordGameResult({
      gameId: 'bangla-drawing',
      score: 100,
      customStars: 3,
      correctCount: 1,
      totalCount: 1,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-5">
      {/* Tools & Palette Top Bar */}
      <div className="bg-white rounded-3xl border-[3px] border-violet-300 p-4 sm:p-5 shadow-[0_6px_0_#DDD6FE] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Color Palette */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-display font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Palette className="w-4 h-4 text-violet-500" />
              <span>রং:</span>
            </span>
            {COLORS.map((color) => {
              const active = selectedColor.hex === color.hex && activeTool === 'brush';
              return (
                <button
                  key={color.hex}
                  onClick={() => handleColorSelect(color)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl ${color.bgClass} transition-transform cursor-pointer border-2 ${
                    active ? 'scale-115 border-slate-900 shadow-md ring-2 ring-violet-400' : 'border-white hover:scale-105'
                  }`}
                  title={color.bnName}
                />
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTool('eraser');
                audioManager.playClick();
                speakBangla('ইরেজার টুল! মুছে ফেলার জন্য প্রস্তুত!');
              }}
              className={`px-3 py-2 rounded-xl border-2 font-display font-bold text-xs cursor-pointer ${
                activeTool === 'eraser'
                  ? 'bg-rose-500 text-white border-rose-600'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              মুছনি (Eraser)
            </button>
            <button
              onClick={handleClear}
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 border border-slate-200 cursor-pointer"
              title="পুরো বোর্ড মোছো"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>ছবি সংরক্ষণ</span>
            </button>
          </div>
        </div>

        {/* Brush Size & Stamp Palette */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">তুলির সাইজ:</span>
            {[4, 8, 14, 22].map((size) => (
              <button
                key={size}
                onClick={() => {
                  setBrushSize(size);
                  audioManager.playClick();
                }}
                className={`w-8 h-8 rounded-xl border-2 font-display font-bold text-xs flex items-center justify-center cursor-pointer ${
                  brushSize === size
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                {size === 4 ? '১' : size === 8 ? '২' : size === 14 ? '৩' : '৪'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">মজার স্ট্যাম্প:</span>
            {STAMPS.map((stamp) => (
              <button
                key={stamp.name}
                onClick={() => handleStampSelect(stamp)}
                className={`w-9 h-9 rounded-xl border-2 text-xl flex items-center justify-center cursor-pointer transition-transform ${
                  activeTool === 'stamp' && selectedStamp.name === stamp.name
                    ? 'bg-amber-100 border-amber-400 scale-110 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:bg-white'
                }`}
                title={stamp.name}
              >
                {stamp.emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Drawing Pad */}
      <div className="bg-white rounded-[2.5rem] border-[4px] border-violet-300 p-2 sm:p-3 shadow-[0_10px_0_#DDD6FE] overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-[420px] sm:h-[480px] rounded-[2rem] bg-white cursor-crosshair touch-none"
        />
      </div>
    </div>
  );
};
