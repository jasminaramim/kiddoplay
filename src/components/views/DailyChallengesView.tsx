import React from 'react';
import { Calendar, CheckCircle2, Gift, Sparkles } from 'lucide-react';
import { useKiddo } from '../../context/KiddoContext';

export const DailyChallengesView: React.FC = () => {
  const { state, claimDailyChallenge, setView } = useKiddo();
  const isEn = state.language === 'en';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 mb-1">
            {isEn ? 'Daily Learning Quests' : 'আজকের দৈনিক চ্যালেঞ্জ'}
          </h1>
          <p className="text-sm font-semibold text-slate-600">
            {isEn
              ? 'Finish today’s learning missions to claim bonus stars for your Star Bank.'
              : 'প্রতিদিন মজার কুইজ ও খেলা শেষ করে অতিরিক্ত তারা সংগ্রহ করো!'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border-2 border-amber-200 rounded-2xl px-4 py-2 text-amber-900 font-display font-bold text-sm">
          <Calendar className="w-4 h-4 text-amber-600" />
          <span className="tabular-nums">
            {isEn ? `${state.streakDays} Day Streak` : `${state.streakDays} দিনের ধারাবাহিকতা`}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {state.dailyChallenges.map((ch) => {
          const done = ch.progress >= ch.targetCount;
          const pct = Math.min(100, Math.round((ch.progress / ch.targetCount) * 100));

          return (
            <div
              key={ch.id}
              className={`bg-white rounded-3xl border-[3px] p-5 sm:p-6 shadow-[0_6px_0_#E2E8F0] transition-colors ${
                ch.claimed
                  ? 'border-emerald-300 bg-emerald-50/40'
                  : done
                    ? 'border-amber-300'
                    : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-lg font-bold text-slate-900 mb-1">
                    {isEn ? ch.title : ch.titleBn}
                  </h2>
                  <p className="text-sm text-slate-600 mb-3">
                    {isEn ? ch.description : ch.descriptionBn || ch.description}
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          done ? 'bg-emerald-500' : 'bg-sky-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700 tabular-nums shrink-0">
                      {ch.progress}/{ch.targetCount}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {ch.claimed ? (
                    <div className="flex items-center gap-1.5 text-emerald-700 font-display font-bold text-sm px-4 py-2.5 bg-emerald-100 rounded-2xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isEn ? `Claimed +${ch.rewardStars} ⭐` : `সংগৃহীত +${ch.rewardStars} ⭐`}</span>
                    </div>
                  ) : done ? (
                    <button
                      type="button"
                      onClick={() => claimDailyChallenge(ch.id)}
                      className="min-h-11 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-display font-bold text-sm border-2 border-amber-500 shadow-[0_4px_0_#D97706] active:translate-y-0.5 flex items-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <Gift className="w-4 h-4" />
                      <span>{isEn ? `Claim +${ch.rewardStars} Stars` : `+${ch.rewardStars} তারা নাও!`}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setView('hub')}
                      className="min-h-11 px-4 py-2.5 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-display font-bold text-sm border-2 border-sky-200 flex items-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isEn ? `Reward: +${ch.rewardStars} ⭐` : `পুরস্কার: +${ch.rewardStars} ⭐`}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
