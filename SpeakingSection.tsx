/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SPEAKING_QUESTIONS } from './speakingData';
import { sound } from './soundEffects';
import { MessageSquare, Volume2, Eye, EyeOff, Search } from 'lucide-react';

export default function SpeakingSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [revealedIds, setRevealedIds] = useState<Record<number, boolean>>({});
  const [revealAll, setRevealAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'all', title: 'Բոլոր հարցերը (30)' },
    { key: 'A', title: 'A. Խաղի ընթացքում (1-6)' },
    { key: 'B', title: 'B. Պաշտպանություն & Հարձակում (7-12)' },
    { key: 'C', title: 'C. Զրույց մարզչի հետ (13-18)' },
    { key: 'D', title: 'D. Դժվար իրավիճակներ (19-24)' },
    { key: 'E', title: 'E. Խաղից հետո (25-30)' },
  ];

  const toggleItem = (id: number) => {
    sound.playSelect();
    setRevealedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAll = () => {
    sound.playSelect();
    const next = !revealAll;
    setRevealAll(next);
    const map: Record<number, boolean> = {};
    SPEAKING_QUESTIONS.forEach((q) => {
      map[q.id] = next;
    });
    setRevealedIds(map);
  };

  const filtered = SPEAKING_QUESTIONS.filter((item) => {
    const matchCat = selectedCategory === 'all' || item.categoryCode === selectedCategory;
    const matchQuery =
      item.es.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.arm.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-400 font-bold">
              Parte 3 · Preguntas para hablar
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              ⚽ 30 հարց ֆուտբոլիստի համար՝ հայերեն և իսպաներեն
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Այս հարցերն օգնում են ֆուտբոլիստին սովորել ճիշտ օգտագործել արտահայտությունները իրական խաղային իրավիճակներում։ Սեղմեք իսպաներենի վրա՝ հայերենը բացելու համար։
            </p>
          </div>

          <button
            onClick={toggleAll}
            className="self-start md:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
          >
            {revealAll ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{revealAll ? 'Թաքցնել բոլոր թարգմանությունները' : 'Բացել բոլոր թարգմանությունները'}</span>
          </button>
        </div>

        {/* Categories & Search */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Որոնել հարցեր (Buscar preguntas)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  sound.playSelect();
                  setSelectedCategory(cat.key);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                  selectedCategory === cat.key
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List of 30 Speaking Prompts */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isRevealed = revealedIds[item.id] || revealAll;

          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer space-y-3 ${
                isRevealed
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-lg'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-sm font-bold flex items-center justify-center shrink-0">
                    {item.id}
                  </span>

                  <div className="space-y-1.5 flex-1">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {item.categoryTitleEs} · {item.categoryTitleArm}
                    </div>

                    {/* Spanish Question (click to reveal Armenian) */}
                    <div className="text-base sm:text-lg font-bold text-white hover:text-amber-200 transition-colors">
                      {item.es}
                    </div>

                    {/* Armenian Translation */}
                    {isRevealed && (
                      <div className="text-sm font-medium text-amber-300 pt-2 border-t border-slate-800 animate-in fade-in leading-relaxed">
                        🇦🇲 {item.arm}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.speakSpanish(item.es);
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    title="Լսել արտասանությունը"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <div className="p-2 text-slate-500">
                    {isRevealed ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Suggested phrases (hints on what to say) */}
              {item.suggestedPhrases && item.suggestedPhrases.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Կարող ես ասել (Puedes decir):</span>
                  {item.suggestedPhrases.map((phrase, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.speakSpanish(phrase);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium border border-slate-700/80 flex items-center gap-1.5 transition-colors"
                      title="Սեղմիր լսելու համար"
                    >
                      <Volume2 className="w-3 h-3 text-amber-400" />
                      <span>{phrase}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
