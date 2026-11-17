import React from 'react';
import { motion } from 'motion/react';
import { Play, Star } from 'lucide-react';
import { GameId, GameMetadata, LanguageMode } from '../../types';

interface GameCardProps {
  game: GameMetadata;
  language: LanguageMode;
  starsEarned: number;
  playsCount: number;
  isAgeRecommended: boolean;
  onPlay: (id: GameMetadata['id']) => void;
}

type BannerScene = 'hills' | 'cosmos' | 'clouds' | 'rainbow' | 'waves' | 'checkers';

interface BannerArtConfig {
  gradient: string;
  scene: BannerScene;
  stickers: [string, string, string];
  isDarkBg?: boolean;
}

const GAME_BANNER_ART: Record<GameId, BannerArtConfig> = {
  'alphabet-phonics': {
    gradient: 'from-rose-400 via-pink-400 to-amber-300',
    scene: 'rainbow',
    stickers: ['🍎', '⚽', '🐝'],
  },
  'counting-safari': {
    gradient: 'from-amber-400 via-orange-300 to-lime-300',
    scene: 'hills',
    stickers: ['🦒', '🐘', '🌴'],
  },
  'color-shape-match': {
    gradient: 'from-sky-400 via-cyan-300 to-indigo-400',
    scene: 'clouds',
    stickers: ['🔴', '⭐', '🔺'],
  },
  'word-builder': {
    gradient: 'from-indigo-500 via-violet-400 to-sky-400',
    scene: 'clouds',
    stickers: ['🅰️', '📖', '✨'],
  },
  'math-adventure': {
    gradient: 'from-emerald-400 via-teal-400 to-lime-300',
    scene: 'hills',
    stickers: ['🔢', '🌟', '🎯'],
  },
  'animal-sounds': {
    gradient: 'from-lime-400 via-emerald-400 to-teal-400',
    scene: 'hills',
    stickers: ['🦁', '🐶', '🐸'],
  },
  'picture-word-match': {
    gradient: 'from-fuchsia-500 via-pink-400 to-orange-300',
    scene: 'rainbow',
    stickers: ['🦋', '🌸', '🎨'],
  },
  'letter-tracing': {
    gradient: 'from-orange-400 via-amber-300 to-rose-300',
    scene: 'waves',
    stickers: ['✏️', '🖍️', '🌟'],
  },
  'world-explorer': {
    gradient: 'from-cyan-500 via-sky-400 to-emerald-400',
    scene: 'waves',
    stickers: ['🇧🇩', '🗼', '✈️'],
  },
  'space-explorer': {
    gradient: 'from-indigo-900 via-violet-800 to-sky-700',
    scene: 'cosmos',
    stickers: ['🪐', '👨‍🚀', '🌙'],
    isDarkBg: true,
  },
  'time-learning': {
    gradient: 'from-teal-500 via-cyan-400 to-amber-300',
    scene: 'clouds',
    stickers: ['⏰', '☀️', '🌙'],
  },
  'food-sorter': {
    gradient: 'from-green-500 via-lime-400 to-amber-300',
    scene: 'hills',
    stickers: ['🍎', '🥦', '🍌'],
  },
  'bangla-english': {
    gradient: 'from-emerald-500 via-teal-400 to-rose-400',
    scene: 'hills',
    stickers: ['🥭', '⛵', '🌸'],
  },
  'bangla-rhymes': {
    gradient: 'from-rose-400 via-pink-400 to-amber-300',
    scene: 'rainbow',
    stickers: ['🦜', '🎶', '🌸'],
  },
  'bangla-words': {
    gradient: 'from-teal-400 via-emerald-400 to-sky-300',
    scene: 'clouds',
    stickers: ['🧩', '📖', '✨'],
  },
  'bangla-numbers': {
    gradient: 'from-amber-400 via-orange-300 to-lime-300',
    scene: 'hills',
    stickers: ['🔢', '🥭', '⭐'],
  },
  'bangla-drawing': {
    gradient: 'from-violet-500 via-fuchsia-400 to-pink-300',
    scene: 'rainbow',
    stickers: ['🎨', '🖌️', '🌈'],
  },
  'vehicle-quiz': {
    gradient: 'from-red-400 via-orange-400 to-sky-400',
    scene: 'clouds',
    stickers: ['🚂', '✈️', '🚌'],
  },
  'brain-booster': {
    gradient: 'from-purple-700 via-indigo-600 to-fuchsia-500',
    scene: 'cosmos',
    stickers: ['💡', '🧩', '✨'],
    isDarkBg: true,
  },
  'balloon-pop': {
    gradient: 'from-pink-400 via-sky-400 to-amber-300',
    scene: 'rainbow',
    stickers: ['🎈', '🎊', '✨'],
  },
  'memory-cards': {
    gradient: 'from-sky-500 via-indigo-400 to-purple-400',
    scene: 'checkers',
    stickers: ['🐶', '🐱', '🍓'],
  },
  'fruit-catcher': {
    gradient: 'from-amber-400 via-rose-400 to-lime-400',
    scene: 'hills',
    stickers: ['🍎', '🍓', '🧺'],
  },
  'tic-tac-toe': {
    gradient: 'from-orange-400 via-amber-400 to-yellow-300',
    scene: 'checkers',
    stickers: ['🐶', '⭕', '🐱'],
  },
  'whack-a-mole': {
    gradient: 'from-emerald-500 via-green-400 to-lime-300',
    scene: 'hills',
    stickers: ['🐰', '🥕', '🌻'],
  },
  'simon-says': {
    gradient: 'from-indigo-600 via-blue-500 to-rose-500',
    scene: 'waves',
    stickers: ['🎵', '🎶', '🌟'],
    isDarkBg: true,
  },
  'dino-jump': {
    gradient: 'from-amber-500 via-orange-400 to-lime-500',
    scene: 'hills',
    stickers: ['🌵', '⭐', '🌋'],
  },
};

const CARD_THEMES: Record<string, { cardBorder: string; cardShadow: string; btnBg: string; tagText: string }> = {
  english: {
    cardBorder: 'border-rose-300',
    cardShadow: 'shadow-[0_7px_0_#FDA4AF]',
    btnBg: 'bg-rose-500 hover:bg-rose-600 border-rose-600 text-white shadow-[0_4px_0_#BE123C]',
    tagText: 'text-rose-700',
  },
  math: {
    cardBorder: 'border-emerald-300',
    cardShadow: 'shadow-[0_7px_0_#6EE7B7]',
    btnBg: 'bg-emerald-500 hover:bg-emerald-600 border-emerald-600 text-white shadow-[0_4px_0_#047857]',
    tagText: 'text-emerald-700',
  },
  science: {
    cardBorder: 'border-sky-300',
    cardShadow: 'shadow-[0_7px_0_#7DD3FC]',
    btnBg: 'bg-sky-500 hover:bg-sky-600 border-sky-600 text-white shadow-[0_4px_0_#0369A1]',
    tagText: 'text-sky-700',
  },
  bangla: {
    cardBorder: 'border-teal-300',
    cardShadow: 'shadow-[0_7px_0_#5EEAD4]',
    btnBg: 'bg-teal-600 hover:bg-teal-700 border-teal-700 text-white shadow-[0_4px_0_#115E59]',
    tagText: 'text-teal-700',
  },
  logic: {
    cardBorder: 'border-violet-300',
    cardShadow: 'shadow-[0_7px_0_#C4B5FD]',
    btnBg: 'bg-violet-500 hover:bg-violet-600 border-violet-600 text-white shadow-[0_4px_0_#6D28D9]',
    tagText: 'text-violet-700',
  },
  arcade: {
    cardBorder: 'border-amber-300',
    cardShadow: 'shadow-[0_7px_0_#FCD34D]',
    btnBg: 'bg-orange-500 hover:bg-orange-600 border-orange-600 text-white shadow-[0_4px_0_#C2410C]',
    tagText: 'text-orange-700',
  },
};

const SceneBackdrop: React.FC<{ scene: BannerScene }> = ({ scene }) => {
  if (scene === 'cosmos') {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 176" preserveAspectRatio="none" aria-hidden="true">
        <circle cx="48" cy="36" r="2.5" fill="#FDE047" opacity="0.9" />
        <circle cx="122" cy="24" r="2" fill="#FFFFFF" opacity="0.85" />
        <circle cx="210" cy="40" r="3" fill="#BAE6FD" opacity="0.9" />
        <circle cx="282" cy="28" r="2.2" fill="#FDE047" opacity="0.9" />
        <circle cx="88" cy="72" r="1.8" fill="#FFFFFF" opacity="0.7" />
        <circle cx="255" cy="84" r="2.5" fill="#FFFFFF" opacity="0.75" />
        <ellipse cx="245" cy="78" rx="68" ry="22" fill="none" stroke="white" strokeWidth="2" strokeDasharray="6 6" opacity="0.25" transform="rotate(-14 245 78)" />
      </svg>
    );
  }
  if (scene === 'rainbow') {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 176" preserveAspectRatio="none" aria-hidden="true">
        <path d="M 30 155 A 130 115 0 0 1 290 155" fill="none" stroke="#FDE047" strokeWidth="10" opacity="0.32" />
        <path d="M 48 155 A 112 97 0 0 1 272 155" fill="none" stroke="#BAE6FD" strokeWidth="10" opacity="0.32" />
        <path d="M 66 155 A 94 79 0 0 1 254 155" fill="none" stroke="#F9A8D4" strokeWidth="10" opacity="0.32" />
        <circle cx="268" cy="38" r="22" fill="#FEF08A" opacity="0.45" />
      </svg>
    );
  }
  if (scene === 'waves') {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 176" preserveAspectRatio="none" aria-hidden="true">
        <circle cx="265" cy="36" r="24" fill="#FEF08A" opacity="0.42" />
        <path d="M0 118 Q 55 96, 110 118 T 220 118 T 330 118 L 330 176 L 0 176 Z" fill="white" opacity="0.18" />
        <path d="M0 134 Q 70 114, 140 134 T 280 134 T 330 134 L 330 176 L 0 176 Z" fill="white" opacity="0.22" />
      </svg>
    );
  }
  if (scene === 'checkers') {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 176" preserveAspectRatio="none" aria-hidden="true">
        <rect x="18" y="18" width="38" height="38" rx="10" fill="white" opacity="0.16" transform="rotate(-10 37 37)" />
        <rect x="148" y="22" width="32" height="32" rx="8" fill="white" opacity="0.14" transform="rotate(14 164 38)" />
        <rect x="256" y="42" width="44" height="44" rx="12" fill="white" opacity="0.18" transform="rotate(-12 278 64)" />
        <circle cx="96" cy="96" r="28" fill="white" opacity="0.12" />
      </svg>
    );
  }
  if (scene === 'clouds') {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 176" preserveAspectRatio="none" aria-hidden="true">
        <circle cx="272" cy="36" r="24" fill="#FEF08A" opacity="0.55" />
        <g fill="white" opacity="0.35">
          <circle cx="56" cy="48" r="18" />
          <circle cx="76" cy="42" r="22" />
          <circle cx="98" cy="49" r="16" />
          <circle cx="205" cy="60" r="16" />
          <circle cx="224" cy="54" r="20" />
          <circle cx="244" cy="61" r="14" />
        </g>
      </svg>
    );
  }
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 176" preserveAspectRatio="none" aria-hidden="true">
      <circle cx="274" cy="34" r="22" fill="#FEF08A" opacity="0.55" />
      <path d="M-10 142 Q 80 96, 175 138 T 330 124 L 330 176 L -10 176 Z" fill="white" opacity="0.22" />
      <path d="M0 152 Q 120 118, 235 148 T 330 142 L 330 176 L 0 176 Z" fill="white" opacity="0.24" />
    </svg>
  );
};

export const GameCard: React.FC<GameCardProps> = ({
  game,
  language,
  starsEarned,
  playsCount,
  isAgeRecommended,
  onPlay,
}) => {
  const isEn = language === 'en';
  const showBoth = language === 'both';

  const title = isEn ? game.title : game.titleBn;
  const description = isEn ? game.description : game.descriptionBn;
  const subjectText = isEn ? game.subjectLabel : game.subjectLabelBn;
  const theme = CARD_THEMES[game.subject] || CARD_THEMES.arcade;
  const bannerArt = GAME_BANNER_ART[game.id];

  return (
    <motion.div
      whileHover={{ y: -6, rotate: -0.4 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className={`group bg-white rounded-3xl border-[3px] overflow-hidden flex flex-col justify-between ${theme.cardBorder} ${theme.cardShadow}`}
    >
      <div>
        {/* Illustrated Cartoon Game Poster Banner with Game Name */}
        <button
          type="button"
          onClick={() => onPlay(game.id)}
          aria-label={title}
          className={`relative w-full h-44 text-left overflow-hidden block cursor-pointer bg-gradient-to-br ${bannerArt.gradient}`}
        >
          <SceneBackdrop scene={bannerArt.scene} />

          {/* Floating Cartoon Stickers */}
          <span
            className="absolute right-4 top-3 text-3xl sm:text-4xl drop-shadow-md rotate-12 group-hover:scale-115 group-hover:rotate-6 transition-transform pointer-events-none select-none"
            aria-hidden="true"
          >
            {bannerArt.stickers[0]}
          </span>
          <span
            className="absolute right-16 top-12 text-2xl sm:text-3xl drop-shadow-md -rotate-12 group-hover:scale-110 transition-transform pointer-events-none select-none"
            aria-hidden="true"
          >
            {bannerArt.stickers[1]}
          </span>
          <span
            className="absolute left-24 top-4 text-2xl drop-shadow-sm rotate-6 opacity-90 pointer-events-none select-none"
            aria-hidden="true"
          >
            {bannerArt.stickers[2]}
          </span>

          {/* Top Row: Subject Badge & Stars Earned */}
          <div className="relative z-10 flex items-start justify-between p-3.5 pb-0">
            <div className="flex items-center gap-2">
              <div
                className="w-14 h-14 rounded-2xl bg-white/95 border-[3px] border-white shadow-lg flex items-center justify-center text-3xl group-hover:scale-110 group-hover:-rotate-3 transition-transform"
                aria-hidden="true"
              >
                {game.emoji}
              </div>
              <span
                className={`px-2.5 py-1 rounded-xl bg-white/95 text-[11px] font-display font-bold shadow-sm border border-white ${theme.tagText}`}
              >
                {subjectText}
              </span>
            </div>

            {starsEarned > 0 && (
              <div className="flex items-center gap-1 rounded-2xl bg-white/95 border-2 border-amber-300 px-2.5 py-1 text-xs font-display font-bold text-amber-800 tabular-nums shadow-sm">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{starsEarned}</span>
              </div>
            )}
          </div>

          {/* Banner Title Overlay Plaque */}
          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-slate-950/88 via-slate-900/58 to-transparent px-4 pt-8 pb-3">
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-white leading-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.65)]">
              {title}
            </h3>
            {showBoth && (
              <p className="text-xs font-bold text-amber-200 leading-tight mt-0.5 drop-shadow">
                {game.title}
              </p>
            )}
          </div>
        </button>

        {/* Card Details */}
        <div className="px-4 pt-3.5 pb-2">
          <p className="text-xs font-bold text-slate-500 mb-1.5">
            <span>{isEn ? `Ages ${game.recommendedAges.join(', ')}` : `বয়স ${game.recommendedAges.join(', ')}`}</span>
            {playsCount > 0 && (
              <>
                <span aria-hidden="true"> · </span>
                <span className="tabular-nums">{isEn ? `${playsCount} plays` : `${playsCount} বার`}</span>
              </>
            )}
            {isAgeRecommended && (
              <>
                <span aria-hidden="true"> · </span>
                <span className="text-emerald-700">{isEn ? 'Great Match' : 'উপযোগী'}</span>
              </>
            )}
          </p>

          <p className="text-sm font-medium text-slate-600 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      <div className="p-4 pt-2">
        <button
          type="button"
          onClick={() => onPlay(game.id)}
          className={`w-full min-h-11 py-2.5 px-4 rounded-2xl font-display font-bold text-base flex items-center justify-center gap-2 border-2 transition-transform active:translate-y-0.5 cursor-pointer whitespace-nowrap ${theme.btnBg}`}
        >
          <Play className="w-4 h-4 fill-current shrink-0" />
          <span>{isEn ? 'Play Now!' : 'খেলো!'}</span>
        </button>
      </div>
    </motion.div>
  );
};
