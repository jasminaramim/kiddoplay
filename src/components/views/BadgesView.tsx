import React from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';
import { useKiddo } from '../../context/KiddoContext';
import { BADGES_CATALOG } from '../../data/badgesAndChallenges';

export const BadgesView: React.FC = () => {
  const { state } = useKiddo();
  const isEn = state.language === 'en';
  const unlockedCount = state.unlockedBadges.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 mb-1">
            {isEn ? 'Badges & Trophy Shelf' : 'ট্রফি ও ব্যাজ সংগ্রহ'}
          </h1>
          <p className="text-sm font-semibold text-slate-600">
            {isEn
              ? 'Collect special achievement badges as you learn and play across KiddoPlay.'
              : 'খেলা এবং অনুশীলনের মাধ্যমে সবগুলো ব্যাজ আনলক করো!'}
          </p>
        </div>

        <div className="text-sm font-bold text-slate-700 tabular-nums">
          {unlockedCount} / {BADGES_CATALOG.length} {isEn ? 'Unlocked' : 'অর্জিত'}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {BADGES_CATALOG.map((badge) => {
          const unlocked = state.unlockedBadges.includes(badge.id);

          return (
            <div
              key={badge.id}
              className={`rounded-3xl border-[3px] p-5 flex flex-col justify-between transition-all ${
                unlocked
                  ? 'bg-white border-amber-300 shadow-[0_6px_0_#FDE68A]'
                  : 'bg-white/80 border-slate-200 opacity-85'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-3xl ${
                      unlocked ? badge.colorClass : 'bg-slate-100 border-slate-200 grayscale'
                    }`}
                    aria-hidden="true"
                  >
                    {badge.emoji}
                  </div>
                  {unlocked ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      {isEn ? 'Earned' : 'অর্জিত'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                      <Lock className="w-3.5 h-3.5" />
                      {isEn ? 'Locked' : 'তালাবদ্ধ'}
                    </span>
                  )}
                </div>

                <h2 className="font-display text-lg font-bold text-slate-900 mb-1">
                  {isEn ? badge.title : badge.titleBn}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {isEn ? badge.description : badge.descriptionBn || badge.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
                {isEn ? `Goal: ${badge.requirementText}` : `লক্ষ্য: ${badge.requirementTextBn || badge.requirementText}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
