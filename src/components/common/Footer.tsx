import React from 'react';
import { useKiddo } from '../../context/KiddoContext';
import { audioManager } from '../../utils/audioManager';
import { speakBangla } from '../../utils/speechUtils';
import { ShieldCheck, Sparkles, Heart, Star, BookOpen, Gamepad2, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setView, setActiveCategory, launchGame } = useKiddo();

  const handleBanglaVoiceGreeting = () => {
    audioManager.playVoicePrompt();
    speakBangla('কিডোপ্লেতে আসার জন্য ধন্যবাদ! প্রতিদিন নতুন কিছু শেখো আর অনেক আনন্দ করো!');
  };

  return (
    <footer className="mt-16 border-t-[4px] border-sky-200 bg-white/95 backdrop-blur-md pt-12 pb-8 text-slate-700 relative overflow-hidden">
      {/* Decorative top color bar */}
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-rose-400 via-amber-400 via-emerald-400 to-sky-500" />

      {/* Floating cute background stickers */}
      <div className="absolute -left-4 top-10 text-6xl opacity-20 pointer-events-none animate-float-slow">🎈</div>
      <div className="absolute -right-4 top-24 text-6xl opacity-20 pointer-events-none animate-wiggle">⭐</div>
      <div className="absolute right-1/3 bottom-4 text-5xl opacity-15 pointer-events-none animate-bounce-soft">🚀</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 relative z-10">
        {/* Top Highlight Banner */}
        <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-teal-50 rounded-[2.5rem] border-[3px] border-amber-300 p-6 sm:p-8 shadow-[0_8px_0_#FDE68A] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <button
              onClick={handleBanglaVoiceGreeting}
              className="w-16 h-16 rounded-3xl bg-amber-400 hover:bg-amber-500 border-2 border-amber-500 flex items-center justify-center text-4xl shadow-md cursor-pointer hover:scale-110 active:scale-95 transition-transform shrink-0"
              title="টিয়া বন্ধুর মুখে বিদায়ী বার্তা শোনো!"
            >
              🦜
            </button>
            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                কিডোপ্লে — শিশুদের রঙিন শেখার জগৎ 🎈
              </h3>
              <p className="text-sm font-bold text-slate-600 mt-1 max-w-xl">
                খাঁটি বাংলাদেশি বাংলা উচ্চারণ, রঙিন কার্টুন ছবি এবং ২২টিরও বেশি শিক্ষামূলক খেলার মাধ্যমে ৩ থেকে ১২ বছর বয়সী শিশুদের বুদ্ধি বিকাশের সেরা ঠিকানা!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                audioManager.playClick();
                setView('challenges');
              }}
              className="px-5 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-display font-bold text-sm border-2 border-rose-600 shadow-[0_4px_0_#BE123C] cursor-pointer transition-transform active:translate-y-0.5"
            >
              আজকের চ্যালেঞ্জ 🏆
            </button>
            <button
              onClick={() => {
                audioManager.playClick();
                setView('parents');
              }}
              className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-display font-bold text-sm border-2 border-slate-300 shadow-[0_4px_0_#CBD5E1] cursor-pointer transition-transform active:translate-y-0.5"
            >
              অভিভাবক প্যানেল 👨‍👩‍👧
            </button>
          </div>
        </div>

        {/* 4 Feature Value Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xl shrink-0">
              🇧🇩
            </div>
            <div>
              <p className="font-display font-bold text-sm text-emerald-950">খাঁটি বাংলা কণ্ঠ</p>
              <p className="text-xs font-semibold text-emerald-700">শুদ্ধ বাংলাদেশি উচ্চারণ</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-sky-950">১০০% নিরাপদ</p>
              <p className="text-xs font-semibold text-sky-700">সম্পূর্ণ বিজ্ঞাপনহীন</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-amber-950">তারা ও পুরস্কার</p>
              <p className="text-xs font-semibold text-amber-700">খেলতে খেলতে পুরস্কৃত</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center text-xl shrink-0">
              🎨
            </div>
            <div>
              <p className="font-display font-bold text-sm text-purple-950">কার্টুন গ্রাফিক্স</p>
              <p className="text-xs font-semibold text-purple-700">শিশুবান্ধব রঙের সমাহার</p>
            </div>
          </div>
        </div>

        {/* 4 Rich Content Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4 border-t-2 border-slate-100">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src="/kiddoplay.png" alt="KiddoPlay" className="h-9 w-auto object-contain" />
            </div>
            <p className="text-xs font-semibold text-slate-600 leading-relaxed">
              কিডোপ্লে হলো শিশুদের প্রথম ও পূর্ণাঙ্গ বাংলা ডিজিটাল শিক্ষার আনন্দভুবন। খেলা, ছড়া, অঙ্ক ও কল্পনার মেলবন্ধনে বেড়ে উঠুক প্রতিটি শিশু।
            </p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
              <Heart className="w-4 h-4 fill-current text-rose-500" />
              <span>শিশুদের ভালোবাসায় তৈরি</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <span className="text-emerald-500">🇧🇩</span>
              <span>বাংলা শিক্ষা ও ছড়া</span>
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <button
                  onClick={() => launchGame('bangla-rhymes')}
                  className="hover:text-emerald-600 hover:underline cursor-pointer"
                >
                  🎶 আতা গাছে তোতা পাখি ও ছড়া মেলা
                </button>
              </li>
              <li>
                <button
                  onClick={() => launchGame('bangla-english')}
                  className="hover:text-emerald-600 hover:underline cursor-pointer"
                >
                  🔤 বাংলা বর্ণমালা (অ–ঔ, ক–ম)
                </button>
              </li>
              <li>
                <button
                  onClick={() => launchGame('bangla-numbers')}
                  className="hover:text-emerald-600 hover:underline cursor-pointer"
                >
                  🔢 ১–১০ সংখ্যা ও নামতা মেলা
                </button>
              </li>
              <li>
                <button
                  onClick={() => launchGame('bangla-words')}
                  className="hover:text-emerald-600 hover:underline cursor-pointer"
                >
                  🧩 বাংলা শব্দ জাদুকর
                </button>
              </li>
              <li>
                <button
                  onClick={() => launchGame('bangla-drawing')}
                  className="hover:text-emerald-600 hover:underline cursor-pointer"
                >
                  🎨 রংধনু আর্ট ও ড্রয়িং প্যাড
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <span className="text-sky-500">🧠</span>
              <span>জ্ঞান, বিজ্ঞান ও গণিত</span>
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <button
                  onClick={() => launchGame('space-explorer')}
                  className="hover:text-sky-600 hover:underline cursor-pointer"
                >
                  🚀 মহাকাশ ও সৌরজগত অভিযান
                </button>
              </li>
              <li>
                <button
                  onClick={() => launchGame('math-adventure')}
                  className="hover:text-sky-600 hover:underline cursor-pointer"
                >
                  ➕ গণিত অভিযান (যোগ, বিয়োগ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => launchGame('world-explorer')}
                  className="hover:text-sky-600 hover:underline cursor-pointer"
                >
                  🌍 বিশ্ব ভ্রমণ ও জাতীয় পতাকা
                </button>
              </li>
              <li>
                <button
                  onClick={() => launchGame('animal-sounds')}
                  className="hover:text-sky-600 hover:underline cursor-pointer"
                >
                  🐮 প্রাণীর ডাক কুইজ ও তথ্য
                </button>
              </li>
              <li>
                <button
                  onClick={() => launchGame('food-sorter')}
                  className="hover:text-sky-600 hover:underline cursor-pointer"
                >
                  🥗 স্বাস্থ্যকর খাদ্য ও পুষ্টি জ্ঞান
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <span className="text-rose-500">🕹️</span>
              <span>মজার আর্কেড জোন</span>
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <button
                  onClick={() => launchGame('balloon-pop')}
                  className="hover:text-rose-600 hover:underline cursor-pointer"
                >
                  🎈 বেলুন ফাটানো মেলা
                </button>
              </li>
              <li>
                <button
                  onClick={() => launchGame('memory-cards')}
                  className="hover:text-rose-600 hover:underline cursor-pointer"
                >
                  🃏 স্মৃতিশক্তি ও কার্ড ম্যাচিং
                </button>
              </li>
              <li>
                <button
                  onClick={() => launchGame('fruit-catcher')}
                  className="hover:text-rose-600 hover:underline cursor-pointer"
                >
                  🍓 তাজা ফল ধরার আর্কেড
                </button>
              </li>
              <li>
                <button
                  onClick={() => launchGame('dino-jump')}
                  className="hover:text-rose-600 hover:underline cursor-pointer"
                >
                  🦖 ডাইনো স্টার ড্যাশ
                </button>
              </li>
              <li>
                <button
                  onClick={() => launchGame('tic-tac-toe')}
                  className="hover:text-rose-600 hover:underline cursor-pointer"
                >
                  🐶 বিড়ালছানা বনাম কুকুরছানা
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} KiddoPlay. সর্বস্বত্ব সংরক্ষিত।</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>নিরাপদ আর্লি লার্নিং</span>
            <span>•</span>
            <span>খাঁটি বাংলা কণ্ঠ</span>
            <span>•</span>
            <span>অফলাইন ডেটা সুরক্ষা</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
