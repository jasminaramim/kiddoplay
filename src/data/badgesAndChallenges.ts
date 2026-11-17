import { BadgeDefinition, DailyChallenge, ProgressState } from '../types';

export function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function generateDailyChallenges(): DailyChallenge[] {
  return [
    {
      id: 'daily-play-3',
      title: 'Play 3 Learning or Arcade Rounds',
      titleBn: 'আজ ৩টি গেম রাউন্ড সম্পূর্ণ করো',
      description: 'Finish any 3 game rounds today to earn a Star Burst bonus.',
      descriptionBn: 'আজ যেকোনো ৩টি গেম খেলে বোনাস তারা সংগ্রহ করো।',
      targetCount: 3,
      progress: 0,
      rewardStars: 10,
      claimed: false,
      type: 'plays',
    },
    {
      id: 'daily-math-1',
      title: 'Complete a Math or Counting Quest',
      titleBn: 'একটি গণিত বা গণনা খেলা শেষ করো',
      description: 'Practice numbers in Counting Safari, Math Adventure, or Time Clock.',
      descriptionBn: 'গণনা সাফারি, গণিত অভিযান বা ঘড়ি শেখা গেম খেলে অনুশীলন করো।',
      targetCount: 1,
      progress: 0,
      rewardStars: 8,
      claimed: false,
      type: 'subject',
      subjectFilter: 'math',
    },
    {
      id: 'daily-bangla-1',
      title: 'Explore Bangla or Phonics Words',
      titleBn: 'বাংলা বা ইংরেজি শব্দ অনুশীলন করো',
      description: 'Play Bangla & English Learning, ABC Phonics, or Word Builder.',
      descriptionBn: 'বাংলা বর্ণমালা, এ-বি-সি বা শব্দ তৈরি খেলা শেষ করো।',
      targetCount: 1,
      progress: 0,
      rewardStars: 8,
      claimed: false,
      type: 'subject',
      subjectFilter: 'bangla',
    },
  ];
}

export const BADGES_CATALOG: BadgeDefinition[] = [
  {
    id: 'first-star',
    title: 'First Sparkle',
    titleBn: 'প্রথম তারা',
    description: 'Complete your very first game in KiddoPlay.',
    descriptionBn: 'কিডোপ্লে-তে তোমার প্রথম খেলা সম্পূর্ণ করো।',
    emoji: '🌟',
    colorClass: 'bg-amber-50 border-amber-200 text-amber-800',
    requirementText: 'Finish 1 game round',
    requirementTextBn: '১টি খেলা শেষ করো',
    checkUnlocked: (s: ProgressState) => s.stars >= 1,
  },
  {
    id: 'star-collector-25',
    title: 'Star Collector',
    titleBn: 'তারা সংগ্রাহক',
    description: 'Gather 25 shiny stars across any games.',
    descriptionBn: 'যেকোনো গেম খেলে মোট ২৫টি ঝলমলে তারা জমাও।',
    emoji: '✨',
    colorClass: 'bg-sky-50 border-sky-200 text-sky-800',
    requirementText: 'Earn 25 total stars',
    requirementTextBn: 'মোট ২৫টি তারা অর্জন',
    checkUnlocked: (s: ProgressState) => s.stars >= 25,
  },
  {
    id: 'superstar-75',
    title: 'Superstar Champion',
    titleBn: 'সুপারস্টার চ্যাম্পিয়ন',
    description: 'Reach 75 total stars in your Star Bank.',
    descriptionBn: 'তোমার তারা ব্যাংকে মোট ৭৫টি তারা জমা করো।',
    emoji: '🏆',
    colorClass: 'bg-yellow-50 border-yellow-300 text-yellow-900',
    requirementText: 'Earn 75 total stars',
    requirementTextBn: 'মোট ৭৫টি তারা অর্জন',
    checkUnlocked: (s: ProgressState) => s.stars >= 75,
  },
  {
    id: 'phonics-explorer',
    title: 'Phonics & Words Whiz',
    titleBn: 'শব্দ ও অক্ষর বন্ধু',
    description: 'Play at least 3 English, Phonics, or Tracing rounds.',
    descriptionBn: 'কমপক্ষে ৩ বার অক্ষর, শব্দ বা হাতের লেখা খেলা খেলো।',
    emoji: '🔤',
    colorClass: 'bg-rose-50 border-rose-200 text-rose-800',
    requirementText: '3 English/Phonics plays',
    requirementTextBn: '৩ বার অক্ষর ও শব্দ খেলা',
    checkUnlocked: (s: ProgressState) => {
      const ids = ['alphabet-phonics', 'word-builder', 'picture-word-match', 'letter-tracing'];
      const plays = ids.reduce((sum, id) => sum + (s.gameStats[id]?.plays || 0), 0);
      return plays >= 3;
    },
  },
  {
    id: 'math-wizard',
    title: 'Math Explorer',
    titleBn: 'গণিত অভিযাত্রী',
    description: 'Complete 3 rounds across Counting, Math, or Clock games.',
    descriptionBn: 'গণনা, গণিত বা ঘড়ির খেলা মোট ৩ বার শেষ করো।',
    emoji: '🧮',
    colorClass: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    requirementText: '3 Math/Counting plays',
    requirementTextBn: '৩ বার গণিত খেলা',
    checkUnlocked: (s: ProgressState) => {
      const ids = ['counting-safari', 'math-adventure', 'time-learning'];
      const plays = ids.reduce((sum, id) => sum + (s.gameStats[id]?.plays || 0), 0);
      return plays >= 3;
    },
  },
  {
    id: 'bilingual-hero',
    title: 'Bilingual Hero',
    titleBn: 'বাংলা বর্ণমালা বন্ধু',
    description: 'Play Bangla & English Learning at least twice.',
    descriptionBn: 'বাংলা বর্ণমালা ও ইংরেজি খেলা কমপক্ষে ২ বার খেলো।',
    emoji: '🇧🇩',
    colorClass: 'bg-teal-50 border-teal-200 text-teal-800',
    requirementText: '2 Bangla & English plays',
    requirementTextBn: '২ বার বাংলা বর্ণমালা খেলা',
    checkUnlocked: (s: ProgressState) => (s.gameStats['bangla-english']?.plays || 0) >= 2,
  },
  {
    id: 'science-captain',
    title: 'Curious Scientist',
    titleBn: 'খুদে বিজ্ঞানী',
    description: 'Explore Space, World, Animals, Vehicles, or Healthy Food 3 times.',
    descriptionBn: 'মহাকাশ, বিশ্ব ভ্রমণ, প্রাণী, যানবাহন বা খাবার খেলা ৩ বার খেলো।',
    emoji: '🚀',
    colorClass: 'bg-violet-50 border-violet-200 text-violet-800',
    requirementText: '3 Science & World plays',
    requirementTextBn: '৩ বার বিজ্ঞান ও বিশ্ব খেলা',
    checkUnlocked: (s: ProgressState) => {
      const ids = ['space-explorer', 'world-explorer', 'animal-sounds', 'food-sorter', 'vehicle-quiz'];
      const plays = ids.reduce((sum, id) => sum + (s.gameStats[id]?.plays || 0), 0);
      return plays >= 3;
    },
  },
  {
    id: 'arcade-ace',
    title: 'Arcade Ace',
    titleBn: 'আর্কেড চ্যাম্পিয়ন',
    description: 'Play 3 Fun Arcade games like Balloon Pop, Memory, or Dino Dash.',
    descriptionBn: 'বেলুন ফাটানো, মেমোরি বা ডাইনো ড্যাশ আর্কেড ৩ বার খেলো।',
    emoji: '🕹️',
    colorClass: 'bg-pink-50 border-pink-200 text-pink-800',
    requirementText: '3 Arcade game plays',
    requirementTextBn: '৩ বার আর্কেড খেলা',
    checkUnlocked: (s: ProgressState) => {
      const ids = ['balloon-pop', 'memory-cards', 'fruit-catcher', 'tic-tac-toe', 'whack-a-mole', 'simon-says', 'dino-jump'];
      const plays = ids.reduce((sum, id) => sum + (s.gameStats[id]?.plays || 0), 0);
      return plays >= 3;
    },
  },
];
