/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MINI_DIALOGUES } from './dialoguesData';
import { sound } from './soundEffects';
import { MessageCircle, Volume2, Eye, EyeOff, Play, Users } from 'lucide-react';

export default function DialoguesSection() {
  const [activeDialogueId, setActiveDialogueId] = useState<number>(1);
  const [revealedLines, setRevealedLines] = useState<Record<string, boolean>>({});
  const [revealAll, setRevealAll] = useState(false);

  const activeDialogue = MINI_DIALOGUES.find((d) => d.id === activeDialogueId) || MINI_DIALOGUES[0];

  const toggleLine = (lineKey: string) => {
    sound.playSelect();
    setRevealedLines((prev) => ({
      ...prev,
      [lineKey]: !prev[lineKey],
    }));
  };

  const toggleAllLines = () => {
    sound.playSelect();
    const next = !revealAll;
    setRevealAll(next);
    const map: Record<string, boolean> = {};
    activeDialogue.lines.forEach((_, idx) => {
      map[`${activeDialogue.id}-${idx}`] = next;
    });
    setRevealedLines(map);
  };

  const playFullDialogue = async () => {
    sound.playSelect();
    for (let i = 0; i < activeDialogue.lines.length; i++) {
      sound.speakSpanish(activeDialogue.lines[i].es);
      // Wait roughly based on text length
      await new Promise((resolve) => setTimeout(resolve, Math.max(2200, activeDialogue.lines[i].es.length * 90)));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Title banner */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-400 font-bold">
              🎤 Mini diálogos · Կարճ իրական երկխոսություններ
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Իսպաներեն ֆուտբոլային երկխոսություններ
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Սեղմեք յուրաքանչյուր արտահայտության վրա՝ հայերեն թարգմանությունը բացելու համար։
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={playFullDialogue}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Լսել ամբողջը</span>
            </button>

            <button
              onClick={toggleAllLines}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {revealAll ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{revealAll ? 'Թաքցնել' : 'Բացել բոլորը'}</span>
            </button>
          </div>
        </div>

        {/* Tab selection for 3 dialogues */}
        <div className="mt-6 flex flex-wrap gap-2">
          {MINI_DIALOGUES.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                sound.playSelect();
                setActiveDialogueId(d.id);
                setRevealAll(false);
                setRevealedLines({});
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeDialogueId === d.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {d.titleEs}
            </button>
          ))}
        </div>
      </div>

      {/* Dialogue Conversation Container */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
          <span className="font-bold text-lg text-white">
            {activeDialogue.titleEs} · {activeDialogue.titleArm}
          </span>
          <span className="text-xs font-mono text-slate-400">
            {activeDialogue.lines.length} արտահայտություն
          </span>
        </div>

        <div className="space-y-4">
          {activeDialogue.lines.map((line, idx) => {
            const lineKey = `${activeDialogue.id}-${idx}`;
            const isRevealed = revealedLines[lineKey] || revealAll;
            const isAlternate = idx % 2 === 1;

            return (
              <div
                key={idx}
                onClick={() => toggleLine(lineKey)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isAlternate
                    ? 'bg-slate-950/70 border-slate-800 ml-0 sm:ml-8'
                    : 'bg-slate-800/60 border-slate-700/80 mr-0 sm:mr-8'
                } ${isRevealed ? 'border-amber-500/50 shadow-md' : 'hover:border-slate-600'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>{line.speaker}</span>
                    </div>

                    {/* Spanish line */}
                    <div className="text-base sm:text-lg font-semibold text-white hover:text-amber-200 transition-colors">
                      {line.es}
                    </div>

                    {/* Armenian Translation */}
                    {isRevealed && (
                      <div className="text-sm font-medium text-amber-300 pt-2 border-t border-slate-700/60 animate-in fade-in leading-relaxed">
                        🇦🇲 {line.arm}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.speakSpanish(line.es);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                      title="Լսել արտասանությունը"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <div className="p-1.5 text-slate-500">
                      {isRevealed ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
