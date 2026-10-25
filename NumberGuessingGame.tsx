/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { sound } from './soundEffects';
import { triggerConfetti } from './confetti';
import { ArrowUp, ArrowDown, CheckCircle2, RotateCcw, ArrowRight, Zap } from 'lucide-react';

interface NumberGuessingGameProps {
  onSuccess: (attempts: number) => void;
  onSkip: () => void;
  questionNumber: number;
  prizeAmount: number;
}

export default function NumberGuessingGame({
  onSuccess,
  onSkip,
  questionNumber,
  prizeAmount,
}: NumberGuessingGameProps) {
  const [minBound, setMinBound] = useState(100);
  const [maxBound, setMaxBound] = useState(100000);
  const [targetNumber, setTargetNumber] = useState<number>(50000);
  const [inputValue, setInputValue] = useState<string>('');
  const [lastFeedback, setLastFeedback] = useState<'higher' | 'lower' | 'correct' | null>(null);
  const [history, setHistory] = useState<Array<{ guess: number; result: 'higher' | 'lower' | 'correct' }>>([]);
  const [solved, setSolved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize secret number on mount: 100 - 100,000
  useEffect(() => {
    const secret = Math.floor(Math.random() * (100000 - 100 + 1)) + 100;
    setTargetNumber(secret);
    setMinBound(100);
    setMaxBound(100000);
    setHistory([]);
    setSolved(false);
    setLastFeedback(null);
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [questionNumber]);

  const handleGuess = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const num = parseInt(inputValue, 10);
    if (isNaN(num) || num < 100 || num > 100000 || solved) return;

    if (num < targetNumber) {
      sound.playHigher();
      setLastFeedback('higher');
      setMinBound((prev) => Math.max(prev, num + 1));
      setHistory((prev) => [{ guess: num, result: 'higher' }, ...prev.slice(0, 9)]);
      setInputValue('');
    } else if (num > targetNumber) {
      sound.playLower();
      setLastFeedback('lower');
      setMaxBound((prev) => Math.min(prev, num - 1));
      setHistory((prev) => [{ guess: num, result: 'lower' }, ...prev.slice(0, 9)]);
      setInputValue('');
    } else {
      // Solved!
      sound.playJackpot();
      triggerConfetti();
      setLastFeedback('correct');
      setSolved(true);
      setHistory((prev) => [{ guess: num, result: 'correct' }, ...prev]);
    }
  };

  const applyDelta = (delta: number) => {
    const current = parseInt(inputValue, 10) || Math.floor((minBound + maxBound) / 2);
    const next = Math.min(100000, Math.max(100, current + delta));
    setInputValue(next.toString());
  };

  const setMidpoint = () => {
    const mid = Math.floor((minBound + maxBound) / 2);
    setInputValue(mid.toString());
  };

  // Percentage narrowed down
  const totalRange = 100000 - 100;
  const currentSpan = maxBound - minBound;
  const progressPercent = Math.min(100, Math.max(0, Math.round(((totalRange - currentSpan) / totalRange) * 100)));

  return (
    <div className="w-full max-w-3xl mx-auto my-auto p-4 sm:p-6 bg-slate-900/90 border border-amber-500/30 rounded-2xl shadow-2xl backdrop-blur-md">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
              Bonus Round · 100 — 100.000
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Adivina el Número
            </h2>
          </div>
        </div>

        <button
          onClick={onSkip}
          className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors px-3 py-1.5 rounded-lg border border-slate-700/60 hover:border-slate-500"
        >
          Saltar →
        </button>
      </div>

      {/* Target range display */}
      <div className="my-6">
        <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-slate-400 mb-2">
          <span className="text-amber-400 font-semibold">{minBound.toLocaleString()}</span>
          <span className="text-slate-500 text-xs">Intervalo ({progressPercent}% acotado)</span>
          <span className="text-amber-400 font-semibold">{maxBound.toLocaleString()}</span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Big Feedback Zone */}
      <div className="text-center py-4">
        {solved ? (
          <div className="space-y-3 animate-in fade-in zoom-in duration-300">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-300 text-lg sm:text-xl font-bold">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ¡CORRECTO! El número era {targetNumber.toLocaleString()}
            </div>
            <p className="text-slate-300 text-sm">
              Conseguido en <span className="text-amber-400 font-bold">{history.length}</span> intentos.
            </p>
          </div>
        ) : lastFeedback === 'higher' ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-300 font-bold text-lg animate-bounce">
            <ArrowUp className="w-6 h-6 text-blue-400" />
            MAYOR ▲ (El número secreto es más alto)
          </div>
        ) : lastFeedback === 'lower' ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 font-bold text-lg animate-bounce">
            <ArrowDown className="w-6 h-6 text-rose-400" />
            MENOR ▼ (El número secreto es más bajo)
          </div>
        ) : (
          <p className="text-slate-300 text-sm font-medium">
            Introduce un número entre <span className="text-amber-400 font-mono font-bold">{minBound.toLocaleString()}</span> y <span className="text-amber-400 font-mono font-bold">{maxBound.toLocaleString()}</span>:
          </p>
        )}
      </div>

      {/* Input & Form */}
      {!solved ? (
        <form onSubmit={handleGuess} className="space-y-4">
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              ref={inputRef}
              type="number"
              min={100}
              max={100000}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`${Math.floor((minBound + maxBound) / 2)}`}
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 rounded-xl text-center text-xl font-mono text-white placeholder-slate-600 outline-none transition-all"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Probar
            </button>
          </div>

          {/* Quick Adjustment Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs font-mono text-slate-300">
            <button
              type="button"
              onClick={setMidpoint}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
            >
              Mitad ({Math.floor((minBound + maxBound) / 2).toLocaleString()})
            </button>
            <button
              type="button"
              onClick={() => applyDelta(-10000)}
              className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
            >
              -10.000
            </button>
            <button
              type="button"
              onClick={() => applyDelta(-1000)}
              className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
            >
              -1.000
            </button>
            <button
              type="button"
              onClick={() => applyDelta(-100)}
              className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
            >
              -100
            </button>
            <button
              type="button"
              onClick={() => applyDelta(100)}
              className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
            >
              +100
            </button>
            <button
              type="button"
              onClick={() => applyDelta(1000)}
              className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
            >
              +1.000
            </button>
            <button
              type="button"
              onClick={() => applyDelta(10000)}
              className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
            >
              +10.000
            </button>
          </div>
        </form>
      ) : (
        <div className="flex justify-center pt-3">
          <button
            onClick={() => onSuccess(history.length)}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-base uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            Continuar al siguiente nivel
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Attempts History */}
      {history.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 mb-2 font-medium">Intentos anteriores:</div>
          <div className="flex flex-wrap gap-2">
            {history.map((item, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium border ${
                  item.result === 'correct'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : item.result === 'higher'
                    ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                    : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                }`}
              >
                {item.guess.toLocaleString()}
                {item.result === 'higher' && <ArrowUp className="w-3 h-3 text-blue-400" />}
                {item.result === 'lower' && <ArrowDown className="w-3 h-3 text-rose-400" />}
                {item.result === 'correct' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
