import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  AgeGroup,
  AppView,
  BadgeDefinition,
  Difficulty,
  GameCategory,
  GameId,
  LanguageMode,
  ProgressState,
  ThemeId,
  VictorySummary,
} from '../types';
import { GAMES_CATALOG } from '../data/gamesCatalog';
import { BADGES_CATALOG, generateDailyChallenges, getTodayKey } from '../data/badgesAndChallenges';
import { audioManager } from '../utils/audioManager';
import { setSpeechMode, setVoiceEnabled, speakBilingual, stopSpeech } from '../utils/speechUtils';
import { fireVictoryConfetti } from '../utils/confettiUtils';

const STORAGE_KEY = 'kiddoplay_progress_v2';
const LEGACY_STORAGE_KEY = 'kiddoplay_progress_v1';

const createInitialState = (): ProgressState => {
  const today = getTodayKey();
  return {
    stars: 0,
    streakDays: 1,
    lastActiveDate: today,
    ageGroup: '6-8',
    difficulty: 'easy',
    language: 'bn',
    theme: 'rainbow',
    soundEnabled: true,
    voiceEnabled: true,
    unlockedBadges: [],
    dailyChallengeDate: today,
    dailyChallenges: generateDailyChallenges(),
    gameStats: {},
    recentActivity: [],
  };
};

function loadPersistedState(): ProgressState {
  if (typeof window === 'undefined') return createInitialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const legacyRaw = !raw ? window.localStorage.getItem(LEGACY_STORAGE_KEY) : null;
    const sourceRaw = raw || legacyRaw;
    if (!sourceRaw) return createInitialState();

    const parsed = JSON.parse(sourceRaw) as ProgressState;
    const today = getTodayKey();
    let streakDays = parsed.streakDays || 1;

    if (parsed.lastActiveDate && parsed.lastActiveDate !== today) {
      const prev = new Date(parsed.lastActiveDate);
      const curr = new Date(today);
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streakDays += 1;
      } else if (diffDays > 1) {
        streakDays = 1;
      }
    }

    const dailyChallenges =
      parsed.dailyChallengeDate === today && Array.isArray(parsed.dailyChallenges)
        ? parsed.dailyChallenges
        : generateDailyChallenges();

    return {
      ...createInitialState(),
      ...parsed,
      // Ensure migrating users from v1 start in pure Bangla mode as requested
      language: raw ? parsed.language || 'bn' : 'bn',
      streakDays,
      lastActiveDate: today,
      dailyChallengeDate: today,
      dailyChallenges,
    };
  } catch {
    return createInitialState();
  }
}

interface RecordResultInput {
  gameId: GameId;
  score: number;
  correctCount: number;
  totalCount: number;
  customStars?: 1 | 2 | 3;
}

interface KiddoContextValue {
  state: ProgressState;
  view: AppView;
  setView: (view: AppView) => void;
  activeCategory: GameCategory;
  setActiveCategory: (cat: GameCategory) => void;
  activeGameId: GameId | null;
  launchGame: (id: GameId) => void;
  exitGame: () => void;
  setAgeGroup: (age: AgeGroup) => void;
  setDifficulty: (diff: Difficulty) => void;
  setLanguage: (lang: LanguageMode) => void;
  setTheme: (theme: ThemeId) => void;
  toggleSoundAndVoice: () => void;
  recordGameResult: (input: RecordResultInput) => void;
  claimDailyChallenge: (challengeId: string) => void;
  victorySummary: VictorySummary | null;
  dismissVictory: () => void;
  resetProgress: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

const KiddoContext = createContext<KiddoContextValue | null>(null);

export const KiddoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ProgressState>(loadPersistedState);
  const [view, setView] = useState<AppView>('hub');
  const [activeCategory, setActiveCategory] = useState<GameCategory>('all');
  const [activeGameId, setActiveGameId] = useState<GameId | null>(null);
  const [victorySummary, setVictorySummary] = useState<VictorySummary | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    audioManager.setEnabled(state.soundEnabled);
    setVoiceEnabled(state.voiceEnabled);
    setSpeechMode(state.language);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage quota errors
    }
  }, [state]);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  const launchGame = useCallback((id: GameId) => {
    audioManager.playClick();
    stopSpeech();
    setVictorySummary(null);
    setActiveGameId(id);
    setView('game');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const exitGame = useCallback(() => {
    audioManager.playClick();
    stopSpeech();
    setVictorySummary(null);
    setActiveGameId(null);
    setView('hub');
  }, []);

  const setAgeGroup = useCallback((ageGroup: AgeGroup) => {
    audioManager.playClick();
    setState((prev) => ({ ...prev, ageGroup }));
  }, []);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    audioManager.playClick();
    setState((prev) => ({ ...prev, difficulty }));
  }, []);

  const setLanguage = useCallback((language: LanguageMode) => {
    audioManager.playClick();
    setSpeechMode(language);
    setState((prev) => ({ ...prev, language }));
  }, []);

  const setTheme = useCallback((theme: ThemeId) => {
    audioManager.playClick();
    setState((prev) => ({ ...prev, theme }));
  }, []);

  const toggleSoundAndVoice = useCallback(() => {
    setState((prev) => {
      const next = !prev.soundEnabled;
      audioManager.setEnabled(next);
      setVoiceEnabled(next);
      if (next) {
        audioManager.playClick();
        setTimeout(() => {
          speakBilingual('বাংলা ভয়েস চালু হয়েছে! চলো খেলি!', 'Voice enabled! Let us play!');
        }, 60);
      }
      return { ...prev, soundEnabled: next, voiceEnabled: next };
    });
  }, []);

  const recordGameResult = useCallback(
    (input: RecordResultInput) => {
      const gameMeta = GAMES_CATALOG.find((g) => g.id === input.gameId);
      const total = Math.max(1, input.totalCount);
      const accuracy = Math.min(100, Math.round((input.correctCount / total) * 100));

      let starsEarned: 1 | 2 | 3 = input.customStars ?? 1;
      if (!input.customStars) {
        if (accuracy >= 85) starsEarned = 3;
        else if (accuracy >= 55) starsEarned = 2;
        else starsEarned = 1;
      }

      let unlockedNow: BadgeDefinition[] = [];

      setState((prev) => {
        const existingStats = prev.gameStats[input.gameId] || {
          plays: 0,
          highScore: 0,
          starsEarned: 0,
          correctCount: 0,
          totalCount: 0,
          lastPlayedAt: null,
        };

        const updatedStats = {
          plays: existingStats.plays + 1,
          highScore: Math.max(existingStats.highScore, input.score),
          starsEarned: existingStats.starsEarned + starsEarned,
          correctCount: existingStats.correctCount + input.correctCount,
          totalCount: existingStats.totalCount + total,
          lastPlayedAt: new Date().toISOString(),
        };

        const updatedChallenges = prev.dailyChallenges.map((ch) => {
          if (ch.progress >= ch.targetCount) return ch;
          if (ch.type === 'plays') {
            return { ...ch, progress: Math.min(ch.targetCount, ch.progress + 1) };
          }
          if (ch.type === 'subject' && gameMeta) {
            const matchesMath = ch.subjectFilter === 'math' && gameMeta.subject === 'math';
            const matchesBangla =
              ch.subjectFilter === 'bangla' &&
              (gameMeta.subject === 'bangla' || gameMeta.subject === 'english');
            if (matchesMath || matchesBangla) {
              return { ...ch, progress: Math.min(ch.targetCount, ch.progress + 1) };
            }
          }
          return ch;
        });

        const logItem = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          gameId: input.gameId,
          gameTitle: prev.language === 'en' ? gameMeta?.title || input.gameId : gameMeta?.titleBn || input.gameId,
          subject: gameMeta?.subject || 'arcade',
          starsEarned,
          score: input.score,
          accuracy,
          timestamp: new Date().toISOString(),
        };

        const draftState: ProgressState = {
          ...prev,
          stars: prev.stars + starsEarned,
          gameStats: {
            ...prev.gameStats,
            [input.gameId]: updatedStats,
          },
          dailyChallenges: updatedChallenges,
          recentActivity: [logItem, ...prev.recentActivity].slice(0, 30),
        };

        unlockedNow = BADGES_CATALOG.filter(
          (b) => !prev.unlockedBadges.includes(b.id) && b.checkUnlocked(draftState)
        );

        return {
          ...draftState,
          unlockedBadges: [...prev.unlockedBadges, ...unlockedNow.map((b) => b.id)],
        };
      });

      audioManager.playWin();
      fireVictoryConfetti();
      speakBilingual('দারুণ করেছো, চ্যাম্পিয়ন! তুমি অসাধারণ খেলেছো!', 'Awesome job, Superstar!');

      const isEn = state.language === 'en';
      setVictorySummary({
        gameId: input.gameId,
        title: isEn ? gameMeta?.title || 'Game Complete!' : gameMeta?.titleBn || 'খেলা সম্পন্ন!',
        starsEarned,
        score: input.score,
        accuracy,
        message: isEn
          ? starsEarned === 3
            ? 'Awesome job, Superstar! You nailed it!'
            : starsEarned === 2
              ? 'Great work! Keep shining bright!'
              : 'Nice try! Practice makes you even stronger!'
          : starsEarned === 3
            ? 'অসাধারণ খেলেছো! সব প্রশ্নের উত্তর দারুণ দিয়েছো!'
            : starsEarned === 2
              ? 'খুব ভালো হয়েছে! এভাবেই এগিয়ে যাও!'
              : 'দারুণ চেষ্টা! আরও অনুশীলন করলে আরও ভালো হবে!',
        newlyUnlockedBadges: unlockedNow,
      });
    },
    [state.language]
  );

  const claimDailyChallenge = useCallback((challengeId: string) => {
    setState((prev) => {
      const target = prev.dailyChallenges.find((c) => c.id === challengeId);
      if (!target || target.claimed || target.progress < target.targetCount) return prev;
      audioManager.playWin();
      fireVictoryConfetti();
      speakBilingual(
        `শাবাশ! তুমি ${target.rewardStars}টি বোনাস তারা জিতেছো!`,
        `Yay! You earned ${target.rewardStars} bonus stars!`
      );
      return {
        ...prev,
        stars: prev.stars + target.rewardStars,
        dailyChallenges: prev.dailyChallenges.map((c) =>
          c.id === challengeId ? { ...c, claimed: true } : c
        ),
      };
    });
  }, []);

  const dismissVictory = useCallback(() => {
    setVictorySummary(null);
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = createInitialState();
    setState(fresh);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // ignore
    }
  }, []);

  return (
    <KiddoContext.Provider
      value={{
        state,
        view,
        setView,
        activeCategory,
        setActiveCategory,
        activeGameId,
        launchGame,
        exitGame,
        setAgeGroup,
        setDifficulty,
        setLanguage,
        setTheme,
        toggleSoundAndVoice,
        recordGameResult,
        claimDailyChallenge,
        victorySummary,
        dismissVictory,
        resetProgress,
        isFullscreen,
        toggleFullscreen,
      }}
    >
      {children}
    </KiddoContext.Provider>
  );
};

export function useKiddo() {
  const ctx = useContext(KiddoContext);
  if (!ctx) throw new Error('useKiddo must be used within KiddoProvider');
  return ctx;
}
