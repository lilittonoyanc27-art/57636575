/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabMode } from './types';
import MillionaireGame from './MillionaireGame';
import ExpressionsSection from './ExpressionsSection';
import SpeakingSection from './SpeakingSection';
import DialoguesSection from './DialoguesSection';
import { sound } from './soundEffects';
import {
  Trophy,
  BookOpen,
  MessageSquare,
  MessagesSquare,
  Volume2,
  VolumeX,
  HelpCircle,
  X,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabMode>('millionaire');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sound.enabled = nextState;
    if (nextState) {
      sound.playSelect();
    }
  };

  const selectTab = (tab: TabMode) => {
    sound.playSelect();
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Stadium Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-amber-500/20 rounded-full blur-[140px]" />
      </div>

      {/* TOP BAR CONTRACT: 3 Zones */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand title */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 font-bold">
              ⚽
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg text-white tracking-tight leading-none">
                Futbolista Millonario
              </span>
              <span className="text-[11px] text-amber-400 font-semibold leading-tight">
                Ֆուտբոլային Միլիոնատեր
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Single-Line) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => selectTab('millionaire')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'millionaire'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Միլիոնատեր Խաղ</span>
            </button>

            <button
              onClick={() => selectTab('expressions')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'expressions'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Արտահայտություններ (40)</span>
            </button>

            <button
              onClick={() => selectTab('speaking')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'speaking'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Հարցեր (30)</span>
            </button>

            <button
              onClick={() => selectTab('dialogues')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'dialogues'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MessagesSquare className="w-3.5 h-3.5" />
              <span>Երկխոսություններ (3)</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action / Audio Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-colors ${
                soundEnabled
                  ? 'bg-slate-800 text-amber-400 border-amber-500/30 hover:border-amber-400'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
              title={soundEnabled ? 'Անջատել ձայնը (Silenciar)' : 'Միացնել ձայնը (Activar sonido)'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowInfoModal(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Կանոններ</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 px-2 py-1.5 bg-slate-950/95 overflow-x-auto">
          <button
            onClick={() => selectTab('millionaire')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'millionaire'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400'
            }`}
          >
            Միլիոնատեր
          </button>
          <button
            onClick={() => selectTab('expressions')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'expressions'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400'
            }`}
          >
            Արտահայտություն
          </button>
          <button
            onClick={() => selectTab('speaking')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'speaking'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400'
            }`}
          >
            30 Հարց
          </button>
          <button
            onClick={() => selectTab('dialogues')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'dialogues'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400'
            }`}
          >
            Երկխոսություն
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative z-10 flex flex-col justify-start">
        {activeTab === 'millionaire' && <MillionaireGame />}
        {activeTab === 'expressions' && <ExpressionsSection />}
        {activeTab === 'speaking' && <SpeakingSection />}
        {activeTab === 'dialogues' && <DialoguesSection />}
      </main>

      {/* RULES / INFO MODAL */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-lg text-white">Խաղի Կանոններն ու Հատկանիշները</h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400">1. Իսպաներենից Հայերեն թարգմանություն՝</span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Հարցը և յուրաքանչյուր պատասխանն ունեն անկախ թարգմանության կոճակ։ Կարող եք սեղմել իսպաներեն տեքստի կամ «Թարգմանել» կոճակի վրա։
                </p>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400">2. Սխալ պատասխանի դեպքում՝</span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Խաղը չի ավարտվում։ Կարող եք տեսնել ճիշտ տարբերակն ու մեկնաբանությունը և անմիջապես շարունակել խաղալ։
                </p>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-bold text-emerald-400">3. Ճիշտ պատասխանի բոնուս (100–100,000)՝</span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Միայն ճիշտ պատասխանի դեպքում բացվում է թվերի գուշակման բոնուս-խաղը 100-ից մինչև 100,000 առանց թարգմանության՝ իսկական մարտահրավեր։
                </p>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400">4. Օգնության հնարավորություններ (Lifelines)՝</span>
                <p className="text-xs text-slate-400 mt-0.5">
                  50:50 (հեռացնում է 2 սխալ պատասխան), Մարզչի խորհուրդ, Տրիբունայի քվեարկություն։
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors text-sm"
            >
              Հասկանալի է, սկսենք!
            </button>
          </div>
        </div>
      )}

      {/* Quiet Minimal Footer */}
      <footer className="border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-600">
        ⚽ Futbolista Millonario · Nivel A2–B1 Condicional Simple · Իսպաներեն և Հայերեն
      </footer>
    </div>
  );
}
