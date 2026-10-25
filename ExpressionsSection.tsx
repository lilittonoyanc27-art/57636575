/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FOOTBALL_EXPRESSIONS } from './expressionsData';
import { sound } from './soundEffects';
import { Volume2, Eye, EyeOff, Search, Sparkles } from 'lucide-react';

export default function ExpressionsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [revealedIds, setRevealedIds] = useState<Record<number, boolean>>({});
  const [revealAll, setRevealAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'all', titleEs: 'Todas', titleArm: 'Բոլորը (40)' },
    { key: 'partido', titleEs: 'Durante el partido', titleArm: 'Խաղի ընթացքում (1-10)' },
    { key: 'defensa_ataque', titleEs: 'Defensa y ataque', titleArm: 'Պաշտպանություն և հարձակում (11-20)' },
    { key: 'entrenador', titleEs: 'Hablar con el entrenador', titleArm: 'Զրույց մարզչի հետ (21-30)' },
    { key: 'emociones', titleEs: 'Comunicación y emociones', titleArm: 'Հաղորդակցություն և զգացմունքներ (31-40)' },
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
    FOOTBALL_EXPRESSIONS.forEach((item) => {
      map[item.id] = next;
    });
    setRevealedIds(map);
  };

  const filtered = FOOTBALL_EXPRESSIONS.filter((item) => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchQuery =
      item.es.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.arm.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Title & Introduction Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-400 font-bold">
              Nivel A2–B1 · Español de España · Հայերեն
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              ⚽ Ֆուտբոլիստների կարևոր խոսակցական արտահայտություններ
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Սեղմեք իսպաներեն արտահայտության վրա՝ հայերեն թարգմանությունը բացելու համար։
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

        {/* Filter and Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Որոնել արտահայտություն (Buscar expresión)..."
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
                {cat.titleEs}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of 40 Expressions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.map((item) => {
          const isRevealed = revealedIds[item.id] || revealAll;

          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 ${
                isRevealed
                  ? 'bg-slate-900/90 border-amber-500/50 shadow-md'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-800 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-slate-700">
                    {item.id}
                  </span>

                  <div>
                    {/* Spanish phrase */}
                    <div className="text-base font-bold text-white hover:text-amber-300 transition-colors">
                      {item.es}
                    </div>

                    {/* Armenian Translation */}
                    {isRevealed ? (
                      <div className="text-sm font-medium text-amber-300 pt-1.5 border-t border-slate-800 mt-1.5 animate-in fade-in leading-relaxed">
                        🇦🇲 {item.arm}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 pt-1 flex items-center gap-1">
                        <span>Սեղմեք թարգմանության համար</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Icons */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.speakSpanish(item.es);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    title="Լսել արտասանությունը"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <div className="p-1.5 text-slate-500">
                    {isRevealed ? (
                      <EyeOff className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Sub-label */}
              <div className="text-[11px] text-slate-500 font-mono">
                {item.categoryTitleEs} · {item.categoryTitleArm}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
