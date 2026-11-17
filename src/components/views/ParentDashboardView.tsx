import React, { useState } from 'react';
import { BarChart3, Award, Star, RotateCcw, Clock, BookOpen } from 'lucide-react';
import { useKiddo } from '../../context/KiddoContext';
import { GAMES_CATALOG } from '../../data/gamesCatalog';
import { SubjectArea } from '../../types';

export const ParentDashboardView: React.FC = () => {
  const { state, resetProgress, launchGame } = useKiddo();
  const [confirmReset, setConfirmReset] = useState(false);
  const isEn = state.language === 'en';

  const gameIds = Object.keys(state.gameStats);
  const totalPlays = gameIds.reduce((sum, id) => sum + (state.gameStats[id]?.plays || 0), 0);
  const totalCorrect = gameIds.reduce((sum, id) => sum + (state.gameStats[id]?.correctCount || 0), 0);
  const totalQuestions = gameIds.reduce((sum, id) => sum + (state.gameStats[id]?.totalCount || 0), 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const subjectMeta: { key: SubjectArea; label: string; labelBn: string; barColor: string }[] = [
    { key: 'english', label: 'English, Phonics & Writing', labelBn: 'ইংরেজি, ধ্বনি ও হাতের লেখা', barColor: 'bg-rose-500' },
    { key: 'math', label: 'Mathematics, Counting & Time', labelBn: 'গণিত, গণনা ও সময় শেখা', barColor: 'bg-emerald-500' },
    { key: 'science', label: 'Science, Space, World & Health', labelBn: 'বিজ্ঞান, মহাকাশ, বিশ্ব ও স্বাস্থ্য', barColor: 'bg-cyan-500' },
    { key: 'bangla', label: 'Bangla & Bilingual Learning', labelBn: 'বাংলা বর্ণমালা ও শব্দভাণ্ডার', barColor: 'bg-teal-500' },
    { key: 'logic', label: 'Shapes, Colors & Brain Logic', labelBn: 'রং, আকৃতি ও বুদ্ধির খেলা', barColor: 'bg-purple-500' },
    { key: 'arcade', label: 'Fun Arcade & Memory', labelBn: 'মজার আর্কেড ও মেমোরি', barColor: 'bg-amber-500' },
    { key: 'creative', label: 'Drawing & Creative Arts', labelBn: 'ছবি আঁকা ও সৃজনশীল আর্ট', barColor: 'bg-violet-500' },
  ];

  const subjectBreakdown = subjectMeta.map((sub) => {
    const matchingGames = GAMES_CATALOG.filter((g) => g.subject === sub.key);
    let plays = 0;
    let correct = 0;
    let total = 0;
    matchingGames.forEach((g) => {
      const s = state.gameStats[g.id];
      if (s) {
        plays += s.plays;
        correct += s.correctCount;
        total += s.totalCount;
      }
    });
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const masteryPct = Math.min(100, plays * 15 + (accuracy > 0 ? Math.round(accuracy * 0.25) : 0));
    return { ...sub, plays, accuracy, masteryPct, gameCount: matchingGames.length };
  });

  const recommendedGames = GAMES_CATALOG.filter((g) =>
    g.recommendedAges.includes(state.ageGroup)
  ).slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 mb-1">
            {isEn ? 'Parent Learning Dashboard' : 'অভিভাবক অগ্রগতি ড্যাশবোর্ড'}
          </h1>
          <p className="text-sm font-semibold text-slate-600">
            {isEn
              ? `Track skills, accuracy, subject balance, and active preferences (${state.ageGroup} yrs · ${state.difficulty}).`
              : `শিশুর শেখার অগ্রগতি, সঠিকতা ও বিষয়ভিত্তিক দক্ষতা দেখুন (বয়স ${state.ageGroup} বছর)`}
          </p>
        </div>

        <div>
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="min-h-10 px-4 py-2 rounded-2xl bg-white border-2 border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-700 font-display font-bold text-sm flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isEn ? 'Reset Progress' : 'সব অগ্রগতি রিসেট'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-rose-50 border-2 border-rose-200 rounded-2xl p-1.5">
              <span className="text-xs font-bold text-rose-800 px-2">
                {isEn ? 'Clear all saved stars?' : 'সব সংরক্ষিত তারা মুছবেন?'}
              </span>
              <button
                type="button"
                onClick={() => {
                  resetProgress();
                  setConfirmReset(false);
                }}
                className="px-3 py-1 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer"
              >
                {isEn ? 'Confirm' : 'হ্যাঁ, মুছুন'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1 rounded-xl bg-white text-slate-700 text-xs font-bold border border-slate-200 cursor-pointer"
              >
                {isEn ? 'Cancel' : 'বাতিল'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Top KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-3xl border-[3px] border-amber-200 p-5 shadow-[0_5px_0_#FDE68A]">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>{isEn ? 'Total Stars' : 'মোট তারা'}</span>
          </div>
          <div className="font-display text-3xl font-extrabold text-slate-900 tabular-nums">
            {state.stars}
          </div>
        </div>

        <div className="bg-white rounded-3xl border-[3px] border-sky-200 p-5 shadow-[0_5px_0_#BAE6FD]">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
            <BarChart3 className="w-4 h-4 text-sky-500" />
            <span>{isEn ? 'Rounds Completed' : 'সম্পন্ন খেলা'}</span>
          </div>
          <div className="font-display text-3xl font-extrabold text-slate-900 tabular-nums">
            {totalPlays}
          </div>
        </div>

        <div className="bg-white rounded-3xl border-[3px] border-emerald-200 p-5 shadow-[0_5px_0_#A7F3D0]">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span>{isEn ? 'Overall Accuracy' : 'গড় সঠিকতা'}</span>
          </div>
          <div className="font-display text-3xl font-extrabold text-slate-900 tabular-nums">
            {totalPlays > 0 ? `${overallAccuracy}%` : '—'}
          </div>
        </div>

        <div className="bg-white rounded-3xl border-[3px] border-purple-200 p-5 shadow-[0_5px_0_#DDD6FE]">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
            <Award className="w-4 h-4 text-purple-500" />
            <span>{isEn ? 'Badges & Streak' : 'ব্যাজ ও ধারাবাহিকতা'}</span>
          </div>
          <div className="font-display text-3xl font-extrabold text-slate-900 tabular-nums">
            {state.unlockedBadges.length}{' '}
            <span className="text-base font-bold text-slate-500">/ {state.streakDays} দিন</span>
          </div>
        </div>
      </div>

      {/* Main Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl border-[3px] border-slate-200 p-6 shadow-[0_6px_0_#E2E8F0]">
          <h2 className="font-display text-xl font-bold text-slate-900 mb-4">
            {isEn ? 'Subject Mastery & Engagement' : 'বিষয়ভিত্তিক দক্ষতা ও অগ্রগতি'}
          </h2>

          <div className="space-y-4">
            {subjectBreakdown.map((sub) => (
              <div key={sub.key}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-semibold text-slate-800">{isEn ? sub.label : sub.labelBn}</span>
                  <span className="text-xs font-bold text-slate-500 tabular-nums">
                    {isEn
                      ? `${sub.plays} plays · ${sub.plays > 0 ? `${sub.accuracy}% accuracy` : 'Not started'}`
                      : `${sub.plays} বার · ${sub.plays > 0 ? `${sub.accuracy}% সঠিকতা` : 'এখনো শুরু হয়নি'}`}
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${sub.barColor}`}
                    style={{ width: `${Math.max(4, sub.masteryPct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <h3 className="font-display text-sm font-bold text-slate-800 mb-3">
              {isEn ? `Recommended Next for Ages ${state.ageGroup}` : `বয়স ${state.ageGroup} বছরের জন্য উপযোগী খেলা`}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {recommendedGames.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => launchGame(g.id)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-200 text-left cursor-pointer transition-colors"
                >
                  <span className="text-2xl">{g.emoji}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {isEn ? g.title : g.titleBn}
                    </div>
                    <div className="text-xs text-slate-500">
                      {isEn ? g.subjectLabel : g.subjectLabelBn}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-3xl border-[3px] border-slate-200 p-6 shadow-[0_6px_0_#E2E8F0]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-slate-900">
              {isEn ? 'Recent Learning Log' : 'সাম্প্রতিক খেলার তালিকা'}
            </h2>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          {state.recentActivity.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              {isEn
                ? 'No games completed yet. Play any learning or arcade round to see detailed progress here!'
                : 'এখনো কোনো খেলা শেষ হয়নি। যেকোনো গেম খেললে এখানে অগ্রগতি দেখা যাবে!'}
            </div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {state.recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {item.gameTitle}
                    </div>
                    <div className="text-xs text-slate-500 tabular-nums">
                      {isEn
                        ? `Score ${item.score} · ${item.accuracy}% accuracy`
                        : `স্কোর ${item.score} · ${item.accuracy}% সঠিক`}
                    </div>
                  </div>
                  <div className="text-sm font-display font-bold text-amber-700 tabular-nums shrink-0">
                    +{item.starsEarned} ⭐
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
