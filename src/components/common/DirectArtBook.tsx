import React, { useRef, useState, useEffect } from 'react';
import { Palette, Trash2, Download, Sparkles, Volume2, Stamp } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';
import { speakBangla } from '../../utils/speechUtils';

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
  { name: 'Black', bnName: 'কালো রং', hex: '#0F172A', bgClass: 'bg-slate-900' },
];

const STAMPS = [
  { emoji: '⭐', name: 'সোনার তারা' },
  { emoji: '🌸', name: 'সুন্দর ফুল' },
  { emoji: '🎈', name: 'উড়ন্ত বেলুন' },
  { emoji: '🦋', name: 'রঙিন প্রজাপতি' },
  { emoji: '🐱', name: 'কিউট বিড়ালছানা' },
  { emoji: '👑', name: 'মুকুট' },
];

export const DirectArtBook: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(COLORS[0]);
  const [brushSize, setBrushSize] = useState<number>(6);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState<'brush' | 'stamp' | 'eraser'>('brush');
  const [selectedStamp, setSelectedStamp] = useState(STAMPS[0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = (rect.height || 360) * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, rect.width, rect.height || 360);
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
    speakBangla(`${stamp.name} স্ট্যাম্প! ক্যানভাসে ট্যাপ করো!`);
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
    speakBangla('আর্ট বুক পরিষ্কার করা হলো! নতুন কিছু আঁকো!');
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    audioManager.playStarSuccess();
    speakBangla('চমৎকার ছবি এঁকেছো! ছবি ডাউনলোড হচ্ছে!');

    const link = document.createElement('a');
    link.download = 'kiddoplay-artbook.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <section className="mb-14" aria-labelledby="direct-artbook-heading">
      <div className="bg-gradient-to-br from-violet-500 via-pink-500 to-amber-400 p-1 sm:p-1.5 rounded-[2.5rem] shadow-[0_10px_0_#CBD5E1]">
        <div className="bg-white rounded-[2.2rem] p-4 sm:p-6 space-y-4 overflow-hidden">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl animate-bounce-soft">🎨</span>
              <div>
                <h3
                  id="direct-artbook-heading"
                  className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight"
                >
                  শিশুদের সরাসরি ছবি আঁকার আর্ট বুক 🖌️
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-500">
                  নিচেই সরাসরি ইচ্ছেমতো ছবি আঁকো, রঙ করো আর স্ট্যাম্প বসাও!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-600 font-display font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                title="বোর্ড পরিষ্কার করো"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>পরিষ্কার</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer transition-transform active:translate-y-0.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>সংরক্ষণ</span>
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Colors */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-violet-500" />
                <span>রং:</span>
              </span>
              {COLORS.map((color) => {
                const active = selectedColor.hex === color.hex && activeTool === 'brush';
                return (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => handleColorSelect(color)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl ${color.bgClass} transition-transform cursor-pointer border-2 ${
                      active ? 'scale-115 border-slate-900 ring-2 ring-violet-400' : 'border-white hover:scale-105'
                    }`}
                    title={color.bnName}
                  />
                );
              })}
            </div>

            {/* Brush sizes & stamps */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-500">তুলি:</span>
                {[3, 6, 12, 18].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setBrushSize(size);
                      setActiveTool('brush');
                      audioManager.playClick();
                    }}
                    className={`w-7 h-7 rounded-lg border-2 font-display font-bold text-xs flex items-center justify-center cursor-pointer ${
                      brushSize === size && activeTool === 'brush'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    {size === 3 ? '১' : size === 6 ? '২' : size === 12 ? '৩' : '৪'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-500">স্ট্যাম্প:</span>
                {STAMPS.map((stamp) => (
                  <button
                    key={stamp.name}
                    type="button"
                    onClick={() => handleStampSelect(stamp)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border text-base flex items-center justify-center cursor-pointer transition-transform ${
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

          {/* Embedded Drawing Canvas */}
          <div className="rounded-2xl border-[3px] border-violet-200 bg-white overflow-hidden shadow-inner">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-[280px] sm:h-[360px] bg-white cursor-crosshair touch-none block"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

