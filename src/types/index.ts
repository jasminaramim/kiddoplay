export type AgeGroup = '3-5' | '6-8' | '9-12';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type LanguageMode = 'en' | 'bn' | 'both';
export type ThemeId = 'rainbow' | 'ocean' | 'candy' | 'safari';
export type GameCategory = 'all' | 'bangla' | 'learn' | 'arcade';
export type SubjectArea = 'english' | 'math' | 'science' | 'bangla' | 'logic' | 'arcade' | 'creative';
export type AppView = 'hub' | 'challenges' | 'badges' | 'parents' | 'game';

export type GameId =
  | 'alphabet-phonics'
  | 'counting-safari'
  | 'color-shape-match'
  | 'word-builder'
  | 'math-adventure'
  | 'animal-sounds'
  | 'picture-word-match'
  | 'letter-tracing'
  | 'world-explorer'
  | 'space-explorer'
  | 'time-learning'
  | 'food-sorter'
  | 'bangla-english'
  | 'bangla-rhymes'
  | 'bangla-words'
  | 'bangla-numbers'
  | 'bangla-drawing'
  | 'vehicle-quiz'
  | 'brain-booster'
  | 'balloon-pop'
  | 'memory-cards'
  | 'fruit-catcher'
  | 'tic-tac-toe'
  | 'whack-a-mole'
  | 'simon-says'
  | 'dino-jump';

export interface GameMetadata {
  id: GameId;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  category: 'learn' | 'arcade';
  subject: SubjectArea;
  subjectLabel: string;
  subjectLabelBn: string;
  recommendedAges: AgeGroup[];
  emoji: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  buttonShadow: string;
}

export interface GameStats {
  plays: number;
  highScore: number;
  starsEarned: number;
  correctCount: number;
  totalCount: number;
  lastPlayedAt: string | null;
}

export interface ActivityLogItem {
  id: string;
  gameId: GameId;
  gameTitle: string;
  subject: SubjectArea;
  starsEarned: number;
  score: number;
  accuracy: number;
  timestamp: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn?: string;
  targetCount: number;
  progress: number;
  rewardStars: number;
  claimed: boolean;
  type: 'plays' | 'subject' | 'stars';
  subjectFilter?: SubjectArea;
  gameIdFilter?: GameId;
}

export interface BadgeDefinition {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn?: string;
  emoji: string;
  colorClass: string;
  requirementText: string;
  requirementTextBn?: string;
  checkUnlocked: (state: ProgressState) => boolean;
}

export interface VictorySummary {
  gameId: GameId;
  title: string;
  starsEarned: 1 | 2 | 3;
  score: number;
  accuracy: number;
  message: string;
  newlyUnlockedBadges: BadgeDefinition[];
}

export interface ProgressState {
  stars: number;
  streakDays: number;
  lastActiveDate: string;
  ageGroup: AgeGroup;
  difficulty: Difficulty;
  language: LanguageMode;
  theme: ThemeId;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  unlockedBadges: string[];
  dailyChallengeDate: string;
  dailyChallenges: DailyChallenge[];
  gameStats: Record<string, GameStats>;
  recentActivity: ActivityLogItem[];
}
