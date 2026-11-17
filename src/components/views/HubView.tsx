import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Gamepad2, BookOpen, Calendar, Search, Play, Shuffle, Palette, Volume2 } from 'lucide-react';
import { useKiddo } from '../../context/KiddoContext';
import { GAMES_CATALOG } from '../../data/gamesCatalog';
import { BANGLA_RHYMES } from '../../data/learningContent';
import { AgeGroup, Difficulty, GameCategory, GameId, LanguageMode, ThemeId } from '../../types';
import { GameCard } from '../common/GameCard';
import { DirectArtBook } from '../common/DirectArtBook';
import { audioManager } from '../../utils/audioManager';
import { speakBangla } from '../../utils/speechUtils';

interface FeaturedItem {
  id: GameId;
  image: string;
  tagline: string;
  taglineBn: string;
  cardClass: string;
  btnClass: string;
}

const FEATURED_GAMES: FeaturedItem[] = [
  {
    id: 'bangla-english',
    image: '/src/assets/images/featured_bangla_learning_1794884439171.jpg',
    tagline: 'Learn বাংলা বর্ণমালা & English words!',
    taglineBn: 'বাংলা বর্ণমালা (অ–ঔ, ক–ম) ও শব্দ শিখো!',
    cardClass: 'border-emerald-300 bg-emerald-50/90 shadow-[0_8px_0_#6EE7B7]',
    btnClass: 'bg-emerald-500 hover:bg-emerald-600 border-emerald-600 text-white shadow-[0_4px_0_#047857]',
  },
  {
    id: 'alphabet-phonics',
    image: '/src/assets/images/featured_phonics_adventure_1794884437504.jpg',
    tagline: 'Tap A–Z cards & hear cheerful phonics!',
    taglineBn: 'রঙিন এ–জেড কার্ড ট্যাপ করে ধ্বনি শোনো!',
    cardClass: 'border-rose-300 bg-rose-50/90 shadow-[0_8px_0_#FDA4AF]',
    btnClass: 'bg-rose-500 hover:bg-rose-600 border-rose-600 text-white shadow-[0_4px_0_#BE123C]',
  },
  {
    id: 'balloon-pop',
    image: '/src/assets/images/featured_balloon_fiesta_1794884438193.jpg',
    tagline: 'Pop floating letter & number balloons!',
    taglineBn: 'রঙিন উড়ন্ত অক্ষর ও সংখ্যার বেলুন ফাটাও!',
    cardClass: 'border-sky-300 bg-sky-50/90 shadow-[0_8px_0_#7DD3FC]',
    btnClass: 'bg-sky-500 hover:bg-sky-600 border-sky-600 text-white shadow-[0_4px_0_#0369A1]',
  },
  {
    id: 'space-explorer',
    image: '/src/assets/images/featured_space_explorer_1794884438005.jpg',
    tagline: 'Fly past Saturn, stars & the Moon!',
    taglineBn: 'গ্রহ, চাঁদ ও সূর্যের মহাকাশ ভ্রমণ কুইজ!',
    cardClass: 'border-violet-300 bg-violet-50/90 shadow-[0_8px_0_#C4B5FD]',
    btnClass: 'bg-violet-500 hover:bg-violet-600 border-violet-600 text-white shadow-[0_4px_0_#6D28D9]',
  },
];

export const HubView: React.FC = () => {
  const {
    state,
    activeCategory,
    setActiveCategory,
    launchGame,
    setAgeGroup,
    setDifficulty,
    setLanguage,
    setTheme,
    setView,
  } = useKiddo();

  const [searchQuery, setSearchQuery] = useState('');
  const [onlyMyAge, setOnlyMyAge] = useState(false);
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [failedFeatured, setFailedFeatured] = useState<Record<string, boolean>>({});

  const isEn = state.language === 'en';

  const ages: { id: AgeGroup; label: string; labelBn: string }[] = [
    { id: '3-5', label: 'Ages 3–5', labelBn: 'বয়স ৩–৫' },
    { id: '6-8', label: 'Ages 6–8', labelBn: 'বয়স ৬–৮' },
    { id: '9-12', label: 'Ages 9–12', labelBn: 'বয়স ৯–১২' },
  ];

  const difficulties: { id: Difficulty; label: string; labelBn: string }[] = [
    { id: 'easy', label: 'Easy', labelBn: 'সহজ' },
    { id: 'medium', label: 'Medium', labelBn: 'মাঝারি' },
    { id: 'hard', label: 'Hard', labelBn: 'কঠিন' },
  ];

  const languages: { id: LanguageMode; label: string }[] = [
    { id: 'bn', label: 'বাংলা' },
    { id: 'both', label: 'বাংলা + EN' },
    { id: 'en', label: 'English' },
  ];

  const themes: { id: ThemeId; label: string; labelBn: string; dot: string }[] = [
    { id: 'rainbow', label: 'Rainbow', labelBn: 'রংধনু', dot: 'bg-gradient-to-r from-rose-400 via-amber-400 to-sky-400' },
    { id: 'ocean', label: 'Ocean', labelBn: 'সাগর', dot: 'bg-gradient-to-r from-teal-400 to-sky-500' },
    { id: 'candy', label: 'Candy', labelBn: 'ক্যান্ডি', dot: 'bg-gradient-to-r from-pink-400 to-purple-400' },
    { id: 'safari', label: 'Safari', labelBn: 'সাফারি', dot: 'bg-gradient-to-r from-lime-400 to-emerald-500' },
  ];

  const banglaGames = GAMES_CATALOG.filter((g) => g.subject === 'bangla' || g.id === 'bangla-drawing');
  const learnGames = GAMES_CATALOG.filter((g) => g.category === 'learn' && g.subject !== 'bangla');
  const arcadeGames = GAMES_CATALOG.filter((g) => g.category === 'arcade');

  const filterGames = (list: typeof GAMES_CATALOG) =>
    list.filter((g) => {
      if (onlyMyAge && !g.recommendedAges.includes(state.ageGroup)) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        g.title.toLowerCase().includes(q) ||
        g.titleBn.toLowerCase().includes(q) ||
        g.subjectLabel.toLowerCase().includes(q) ||
        g.subjectLabelBn.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.descriptionBn.toLowerCase().includes(q)
      );
    });

  const filteredBangla = filterGames(banglaGames);
  const filteredLearn = filterGames(learnGames);
  const filteredArcade = filterGames(arcadeGames);

  const completedQuests = state.dailyChallenges.filter(
    (c) => c.progress >= c.targetCount
  ).length;

  const handleSurpriseGame = () => {
    const pool = GAMES_CATALOG.filter((g) => g.recommendedAges.includes(state.ageGroup));
    const list = pool.length > 0 ? pool : GAMES_CATALOG;
    const pick = list[Math.floor(Math.random() * list.length)];
    launchGame(pick.id);
  };

  const categoryTabs: { id: GameCategory; label: string; count: number; icon: React.ReactNode }[] = [
    {
      id: 'all',
      label: isEn ? 'All Games' : 'সব খেলা',
      count: GAMES_CATALOG.length,
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'bangla',
      label: isEn ? 'Bangla Games' : '🇧🇩 বাংলা খেলা',
      count: banglaGames.length,
      icon: <span className="text-base" aria-hidden="true">🇧🇩</span>,
    },
    {
      id: 'learn',
      label: isEn ? 'Learn & Phonics' : 'শেখা ও ধ্বনি',
      count: learnGames.length,
      icon: <BookOpen className="w-4 h-4 text-sky-600" />,
    },
    {
      id: 'arcade',
      label: isEn ? 'Fun Arcade' : 'মজার আর্কেড',
      count: arcadeGames.length,
      icon: <Gamepad2 className="w-4 h-4 text-pink-600" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Tia Bird Mascot Spoken Bangla Greeting Bar */}
      <motion.div
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 p-4 sm:p-5 rounded-[2rem] bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-white shadow-[0_8px_0_#0F766E] border-2 border-white/50 flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => {
              audioManager.playVoicePrompt();
              speakBangla('হ্যালো ছোট্ট বন্ধু! কিডোপ্লেতে তোমাকে স্বাগতম! চলো আজ নতুন কিছু শিখি আর অনেক মজা করি!');
            }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 hover:bg-white/30 border-2 border-white/60 flex items-center justify-center text-3xl sm:text-4xl shadow-inner hover:scale-105 active:scale-95 transition-transform cursor-pointer shrink-0"
            title="টিয়া বন্ধুর মুখে বাংলায় কথা শোনো!"
          >
            🦜
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-display font-extrabold text-lg sm:text-2xl text-white drop-shadow-sm">
                টিয়া বন্ধুর শুভেচ্ছা!
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-300 text-amber-950 font-display font-black text-xs shadow-sm animate-pulse">
                ট্যাপ করো 🔊
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-emerald-100 max-w-xl">
              "হ্যালো ছোট্ট বন্ধু! কিডোপ্লেতে তোমাকে স্বাগতম! চলো একসাথে সুন্দর সব বাংলা ছড়া, নামতা আর রঙিন খেলা খেলি!"
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              audioManager.playVoicePrompt();
              speakBangla('শাবাশ ছোট্ট বন্ধু! তুমি প্রতিদিন নতুন কিছু শিখছো আর অনেক সুন্দর খেলছো!');
            }}
            className="px-4 py-2.5 rounded-2xl bg-amber-300 hover:bg-amber-400 text-amber-950 font-display font-bold text-xs sm:text-sm border-2 border-amber-500 shadow-[0_3px_0_#D97706] cursor-pointer flex items-center gap-1.5 transition-transform active:translate-y-0.5"
          >
            <span>কথা বলো</span>
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              audioManager.playChoraMelody();
              speakBangla('আতা গাছে তোতা পাখি, ডালিম গাছে মৌ! এত ডাকি তবু কথা কও না কেন বউ?');
            }}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-teal-900 font-display font-bold text-xs sm:text-sm border-2 border-slate-200 shadow-[0_3px_0_#CBD5E1] cursor-pointer flex items-center gap-1.5 transition-transform active:translate-y-0.5"
          >
            <span>🎶 ছড়া শোনো</span>
          </button>
        </div>
      </motion.div>
      {/* Illustrated Cartoon Hero Split */}
      <section className="bg-white/95 rounded-[2rem] border-[3px] border-sky-300 p-5 sm:p-7 shadow-[0_9px_0_#7DD3FC] mb-9">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between gap-5">
            <div>
              <p className="text-xs sm:text-sm font-display font-bold text-rose-600 mb-2">
                {isEn
                  ? `Bilingual English & Bangla · ${state.streakDays} Day Streak · ${GAMES_CATALOG.length} Interactive Games`
                  : `বাংলা ও ইংরেজি শেখার জাদুঘর · ${state.streakDays} দিনের ধারাবাহিকতা · ${GAMES_CATALOG.length}টি মজার গেম`}
              </p>
              <h1 className="font-display text-3xl sm:text-5xl font-bold text-slate-900 leading-tight mb-3 [text-wrap:balance]">
                {isEn ? (
                  <>
                    Play, Laugh &amp; <span className="text-sky-600">Learn</span>{' '}
                    <span className="text-rose-500">Every Day!</span>
                  </>
                ) : (
                  <>
                    খেলতে খেলতে <span className="text-sky-600">শিখো</span>{' '}
                    <span className="text-rose-500">প্রতিদিন!</span>
                  </>
                )}
              </h1>
              <p className="text-base font-semibold text-slate-600 leading-relaxed mb-5">
                {isEn
                  ? 'Explore phonics, Bangla বর্ণমালা, math puzzles, space adventures, drawing, and bouncy arcade games made for curious minds.'
                  : 'বাংলা বর্ণমালা, ইংরেজি ধ্বনি, গণিতের ধাঁধা, মহাকাশ অভিযান, ছবি আঁকা ও দারুণ সব আর্কেড খেলা এক জায়গায়!'}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSurpriseGame}
                  className="min-h-12 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 hover:brightness-105 text-white font-display font-bold text-base border-2 border-rose-600 shadow-[0_5px_0_#BE123C] active:translate-y-0.5 flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Shuffle className="w-5 h-5" />
                  <span>{isEn ? 'Surprise Me & Play!' : 'সারপ্রাইজ গেম খেলো!'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    audioManager.playClick();
                    setView('challenges');
                  }}
                  className="min-h-12 px-5 py-3 rounded-2xl bg-amber-300 hover:bg-amber-400 text-amber-950 font-display font-bold text-base border-2 border-amber-500 shadow-[0_5px_0_#D97706] active:translate-y-0.5 flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="w-5 h-5" />
                  <span className="tabular-nums">
                    {isEn
                      ? `Daily Quests (${completedQuests}/${state.dailyChallenges.length})`
                      : `দৈনিক চ্যালেঞ্জ (${completedQuests}/${state.dailyChallenges.length})`}
                  </span>
                </button>
              </div>
            </div>

            {/* Colorful Theme Picker */}
            <div className="pt-4 border-t-2 border-slate-100 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-display font-bold text-slate-600 mr-1">
                <Palette className="w-4 h-4 text-violet-500" />
                <span>{isEn ? 'Color Theme:' : 'রঙের থিম:'}</span>
              </span>
              {themes.map((t) => {
                const active = state.theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`px-3 py-1.5 rounded-2xl border-2 text-xs font-display font-bold flex items-center gap-1.5 cursor-pointer transition-transform ${
                      active
                        ? 'bg-slate-900 border-slate-900 text-white scale-105'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${t.dot}`} />
                    <span>{isEn ? t.label : t.labelBn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-6 relative rounded-3xl border-[3px] border-amber-300 overflow-hidden bg-gradient-to-br from-sky-200 to-amber-100 min-h-[240px]">
            {!heroImgFailed ? (
              <img
                src="/hero.png"
                alt="কিডোপ্লে শিশুদের শেখার ও খেলার রঙিন কার্টুন জগৎ"
                onError={() => setHeroImgFailed(true)}
                className="w-full h-full object-cover lg:h-full block"
              />
            ) : (
              <div className="w-full h-full min-h-[260px] flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-sky-200 via-amber-100 to-rose-200">
                <div className="text-6xl mb-2">🦖🚀🌈</div>
                <p className="font-display text-xl font-bold text-slate-800">কিডোপ্লে খেলার জগৎ</p>
              </div>
            )}
          </div>
        </div>

        {/* Kid Age, Difficulty & Language Toolbar */}
        <div className="mt-6 pt-5 border-t-2 border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1 p-1 bg-sky-50 rounded-2xl border-2 border-sky-200">
              {ages.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAgeGroup(a.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold cursor-pointer whitespace-nowrap transition-colors ${
                    state.ageGroup === a.id
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-sky-900 hover:bg-white/70'
                  }`}
                >
                  {isEn ? a.label : a.labelBn}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 p-1 bg-emerald-50 rounded-2xl border-2 border-emerald-200">
              {difficulties.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDifficulty(d.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold cursor-pointer whitespace-nowrap transition-colors ${
                    state.difficulty === d.id
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-emerald-900 hover:bg-white/70'
                  }`}
                >
                  {isEn ? d.label : d.labelBn}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 p-1 bg-violet-50 rounded-2xl border-2 border-violet-200">
              {languages.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLanguage(l.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold cursor-pointer whitespace-nowrap transition-colors ${
                    state.language === l.id
                      ? 'bg-violet-500 text-white shadow-sm'
                      : 'text-violet-900 hover:bg-white/70'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <label className="flex items-center gap-2 text-xs font-display font-bold text-slate-700 cursor-pointer select-none px-3 py-2 rounded-2xl bg-amber-50 border-2 border-amber-200">
              <input
                type="checkbox"
                checked={onlyMyAge}
                onChange={(e) => setOnlyMyAge(e.target.checked)}
                className="accent-rose-500 w-4 h-4 rounded cursor-pointer"
              />
              <span>{isEn ? `Ages ${state.ageGroup} only` : `শুধু বয়স ${state.ageGroup}`}</span>
            </label>

            <div className="relative flex-1 sm:w-52">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? 'Find a game...' : 'গেম খুঁজুন...'}
                className="w-full pl-9 pr-3 py-2 rounded-2xl bg-slate-50 border-2 border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Highlighted Featured Games Spotlight */}
      <section className="mb-10" aria-labelledby="featured-games-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <h2
            id="featured-games-heading"
            className="font-display text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2"
          >
            <span aria-hidden="true">🌟</span>
            <span>{isEn ? 'Featured Kid-Favorite Games' : 'বিশেষ জনপ্রিয় খেলাসমূহ'}</span>
          </h2>
          <p className="text-sm font-bold text-slate-600">
            {isEn
              ? 'Handpicked colorful adventures to start right away'
              : 'শিশুদের সবচেয়ে পছন্দের বাছাইকৃত রঙিন খেলাসমূহ'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {FEATURED_GAMES.map((feat) => {
            const gameMeta = GAMES_CATALOG.find((g) => g.id === feat.id);
            if (!gameMeta) return null;
            const imgBroken = failedFeatured[feat.id];

            return (
              <motion.div
                key={feat.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className={`rounded-2xl sm:rounded-3xl border-2 sm:border-[3px] overflow-hidden flex flex-col justify-between ${feat.cardClass}`}
              >
                <div>
                  <div
                    onClick={() => launchGame(feat.id)}
                    className="relative aspect-[4/3] w-full overflow-hidden border-b-2 sm:border-b-[3px] border-white/70 bg-white cursor-pointer group"
                  >
                    {!imgBroken && feat.image ? (
                      <img
                        src={feat.image}
                        alt={isEn ? gameMeta.title : gameMeta.titleBn}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedFeatured((prev) => ({ ...prev, [feat.id]: true }))
                        }
                        className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-gradient-to-br from-amber-100 via-rose-100 to-sky-100 text-center">
                        <span className="text-4xl sm:text-6xl animate-bounce-soft">{gameMeta.emoji}</span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-900/55 to-transparent px-2.5 sm:px-4 pt-6 sm:pt-8 pb-2 sm:pb-3">
                      <span className="inline-block px-1.5 sm:px-2 py-0.5 rounded-lg bg-white/90 text-[9px] sm:text-[11px] font-display font-bold text-slate-900 mb-0.5 sm:mb-1">
                        {gameMeta.emoji} {isEn ? gameMeta.subjectLabel : gameMeta.subjectLabelBn}
                      </span>
                      <h3 className="font-display text-sm sm:text-xl font-extrabold text-white leading-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.65)] line-clamp-1 sm:line-clamp-none">
                        {isEn ? gameMeta.title : gameMeta.titleBn}
                      </h3>
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-4 pb-1 sm:pb-2">
                    <p className="text-[10px] sm:text-xs font-bold text-slate-500 mb-0.5 sm:mb-1 truncate">
                      {isEn ? `Ages ${gameMeta.recommendedAges.join(', ')}` : `বয়স ${gameMeta.recommendedAges.join(', ')}`}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 line-clamp-2">
                      {isEn ? feat.tagline : feat.taglineBn}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 sm:p-4 pt-1 sm:pt-2">
                  <button
                    type="button"
                    onClick={() => launchGame(feat.id)}
                    className={`w-full min-h-8 sm:min-h-11 py-1.5 sm:py-2.5 px-2 sm:px-4 rounded-xl sm:rounded-2xl font-display font-bold text-xs sm:text-base border sm:border-2 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer active:translate-y-0.5 transition-transform whitespace-nowrap ${feat.btnClass}`}
                  >
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0" />
                    <span>{isEn ? 'Play Spotlight' : 'এখনই খেলো!'}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-3 mb-7">
        {categoryTabs.map((tab) => {
          const active = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                audioManager.playClick();
                setActiveCategory(tab.id);
              }}
              className={`min-h-12 px-5 py-2.5 rounded-2xl border-[3px] font-display font-bold text-base flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
                active
                  ? 'bg-sky-500 border-sky-700 text-white shadow-[0_5px_0_#0369A1]'
                  : 'bg-white border-slate-300 text-slate-800 shadow-[0_5px_0_#CBD5E1] hover:border-sky-400'
              }`}
            >
              <span className={active ? 'brightness-125' : ''}>{tab.icon}</span>
              <span>{tab.label}</span>
              <span
                className={`text-xs tabular-nums ${
                  active ? 'text-sky-100' : 'text-slate-500'
                }`}
              >
                ({tab.count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Category: 🇧🇩 বাংলা শেখার রঙিন জাদুঘর (Bangla Learning & Magic Zone) */}
      {(activeCategory === 'all' || activeCategory === 'bangla') && (
        <section className="mb-14" aria-labelledby="bangla-zone-heading">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl" aria-hidden="true">🇧🇩</span>
                <h2
                  id="bangla-zone-heading"
                  className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900"
                >
                  {isEn ? 'Bangla Learning & Magic Zone' : 'বাংলা শেখার রঙিন জাদুঘর'}
                </h2>
              </div>
              <p className="text-sm font-bold text-slate-600 mt-1">
                {isEn
                  ? 'Bengali nursery rhymes, numbers & namta, word magic, alphabet & creative drawing'
                  : 'মজার বাংলা ছড়া ও গান, ১–১০ সংখ্যা ও নামতা, বর্ণমালা, শব্দ গঠন ও রংধনু আঁকাআঁকি'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                audioManager.playVoicePrompt();
                speakBangla('বাংলা আমাদের মাতৃভাষা! এসো সবাই একসাথে ছড়া পড়ি, বর্ণমালা শিখি আর অনেক মজা করি!');
              }}
              className="px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold text-xs sm:text-sm border-2 border-emerald-600 shadow-[0_3px_0_#047857] flex items-center gap-2 cursor-pointer transition-transform active:translate-y-0.5"
            >
              <Volume2 className="w-4 h-4" />
              <span>বাংলায় শোনো 📢</span>
            </button>
          </div>

          {/* Quick Rhymes Recitation Showcase */}
          <div className="mb-8 p-5 sm:p-6 rounded-[2rem] bg-gradient-to-br from-amber-50 via-rose-50 to-teal-50 border-[3px] border-amber-300 shadow-[0_7px_0_#FDE68A]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎶</span>
                <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900">
                  জনপ্রিয় বাংলা ছড়া — ট্যাপ করলেই মিষ্টি আবৃত্তি!
                </h3>
              </div>
              <button
                type="button"
                onClick={() => launchGame('bangla-rhymes')}
                className="text-xs font-display font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
              >
                সব ছড়া দেখতে ক্লিক করো ➡️
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {BANGLA_RHYMES.slice(0, 3).map((rhyme) => (
                <div
                  key={rhyme.id}
                  className="bg-white rounded-2xl border-2 border-amber-200 p-4 shadow-sm hover:border-rose-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{rhyme.emoji}</span>
                      <span className="text-[11px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                        {rhyme.poet}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-base text-slate-800 mb-1">
                      {rhyme.title}
                    </h4>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed mb-3">
                      "{rhyme.lines[0]} {rhyme.lines[1]}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        audioManager.playVoicePrompt();
                        speakBangla(`${rhyme.lines[0]}, ${rhyme.lines[1]}`);
                      }}
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-display font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>আবৃত্তি শোনো</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => launchGame('bangla-rhymes')}
                      className="py-1.5 px-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-display font-bold text-xs cursor-pointer shadow-sm"
                    >
                      খেলো
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bangla Games Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {filteredBangla.map((game) => {
              const stats = state.gameStats[game.id];
              return (
                <GameCard
                  key={game.id}
                  game={game}
                  language={state.language}
                  starsEarned={stats?.starsEarned || 0}
                  playsCount={stats?.plays || 0}
                  isAgeRecommended={game.recommendedAges.includes(state.ageGroup)}
                  onPlay={launchGame}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Category 1: Learn & Phonics Zone */}
      {(activeCategory === 'all' || activeCategory === 'learn') && (
        <section className="mb-12" aria-labelledby="learn-zone-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-5">
            <h2
              id="learn-zone-heading"
              className="font-display text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2"
            >
              <span aria-hidden="true">👶</span>
              <span>{isEn ? 'Learn & Phonics Playground' : 'শেখা ও ধ্বনি জোন'}</span>
            </h2>
            <p className="text-sm font-bold text-slate-600">
              {isEn
                ? `${filteredLearn.length} games · ABC, Math, Words, Science, Bangla & more`
                : `${filteredLearn.length}টি শিক্ষামূলক খেলা · বর্ণমালা, গণিত, শব্দ, বিজ্ঞান ও বাংলা`}
            </p>
          </div>

          {filteredLearn.length === 0 ? (
            <div className="bg-white rounded-3xl border-[3px] border-slate-200 p-8 text-center text-sm font-semibold text-slate-500">
              {isEn
                ? 'No learning games match your filter. Try clearing the search or age filter!'
                : 'কোনো খেলা খুঁজে পাওয়া যায়নি। অন্য কিছু লিখে চেষ্টা করো!'}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {filteredLearn.map((game) => {
                const stats = state.gameStats[game.id];
                return (
                  <GameCard
                    key={game.id}
                    game={game}
                    language={state.language}
                    starsEarned={stats?.starsEarned || 0}
                    playsCount={stats?.plays || 0}
                    isAgeRecommended={game.recommendedAges.includes(state.ageGroup)}
                    onPlay={launchGame}
                  />
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Direct Interactive Art Book Studio for Kids */}
      {(activeCategory === 'all' || activeCategory === 'learn') && (
        <DirectArtBook />
      )}

      {/* Video Preview Showcase Before Fun Arcade Zone */}
      {(activeCategory === 'all' || activeCategory === 'arcade') && (
        <section className="mb-12" aria-labelledby="arcade-video-heading">
          <div className="bg-gradient-to-r from-amber-400 via-rose-400 to-sky-400 p-1 sm:p-1.5 rounded-[2.2rem] shadow-[0_9px_0_#CBD5E1]">
            <div className="bg-white rounded-[2rem] p-4 sm:p-6 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl" aria-hidden="true">🎬</span>
                  <div>
                    <h2
                      id="arcade-video-heading"
                      className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight"
                    >
                      {isEn ? 'Arcade Game Highlights & Fun Preview' : 'মজার আর্কেড খেলার রঙিন ভিডিও ঝলক'}
                    </h2>
                    <p className="text-xs sm:text-sm font-bold text-slate-500">
                      {isEn
                        ? 'Watch exciting moments before jumping into the arcade!'
                        : 'আর্কেড খেলা শুরু করার আগে দেখে নাও দারুণ সব মজার দৃশ্য!'}
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-700 font-display font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>{isEn ? 'KiddoPlay Video' : 'কিডোপ্লে ভিডিও'}</span>
                </div>
              </div>

              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-200 shadow-inner">
                <video
                  src="/video.mp4"
                  controls
                  playsInline
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                >
                  {isEn
                    ? 'Your browser does not support the video tag.'
                    : 'আপনার ব্রাউজারে ভিডিওটি প্লে হচ্ছে না।'}
                </video>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category 2: Fun Arcade Zone */}
      {(activeCategory === 'all' || activeCategory === 'arcade') && (
        <section aria-labelledby="arcade-zone-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-5">
            <h2
              id="arcade-zone-heading"
              className="font-display text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2"
            >
              <span aria-hidden="true">🕹️</span>
              <span>{isEn ? 'Fun Arcade Zone' : 'মজার আর্কেড জোন'}</span>
            </h2>
            <p className="text-sm font-bold text-slate-600">
              {isEn
                ? `${filteredArcade.length} games · Balloon Pop, Memory, Fruit Catcher, Tic-Tac-Toe & more`
                : `${filteredArcade.length}টি মজার খেলা · বেলুন ফাটানো, মেমোরি, ফল ধরা ও টিক-ট্যাক-টো`}
            </p>
          </div>

          {filteredArcade.length === 0 ? (
            <div className="bg-white rounded-3xl border-[3px] border-slate-200 p-8 text-center text-sm font-semibold text-slate-500">
              {isEn
                ? 'No arcade games match your filter. Try clearing the search or age filter!'
                : 'কোনো আর্কেড খেলা পাওয়া যায়নি।'}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {filteredArcade.map((game) => {
                const stats = state.gameStats[game.id];
                return (
                  <GameCard
                    key={game.id}
                    game={game}
                    language={state.language}
                    starsEarned={stats?.starsEarned || 0}
                    playsCount={stats?.plays || 0}
                    isAgeRecommended={game.recommendedAges.includes(state.ageGroup)}
                    onPlay={launchGame}
                  />
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
