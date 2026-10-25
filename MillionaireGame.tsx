/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QuizQuestion, QuizOption } from './types';
import { QUIZ_QUESTIONS } from './quizData';
import { sound } from './soundEffects';
import { triggerConfetti } from './confetti';
import NumberGuessingGame from './NumberGuessingGame';
import {
  HelpCircle,
  Users,
  Percent,
  Volume2,
  Trophy,
  ArrowRight,
  RotateCcw,
  Languages,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Flame,
  Award,
} from 'lucide-react';

export default function MillionaireGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [bank, setBank] = useState(0);

  // Translation visibility toggles
  const [showQuestionArm, setShowQuestionArm] = useState(false);
  const [showOptionArm, setShowOptionArm] = useState<Record<string, boolean>>({});
  const [allTranslationsActive, setAllTranslationsActive] = useState(false);

  // Lifelines
  const [lifelineFiftyFiftyUsed, setLifelineFiftyFiftyUsed] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);
  const [lifelineCoachUsed, setLifelineCoachUsed] = useState(false);
  const [coachHint, setCoachHint] = useState<string | null>(null);
  const [lifelineAudienceUsed, setLifelineAudienceUsed] = useState(false);
  const [audiencePoll, setAudiencePoll] = useState<Record<string, number> | null>(null);

  // Bonus number guessing modal state
  const [showNumberGuesser, setShowNumberGuesser] = useState(false);

  const currentQuestion: QuizQuestion = QUIZ_QUESTIONS[currentIndex] || QUIZ_QUESTIONS[0];
  const isLastQuestion = currentIndex >= QUIZ_QUESTIONS.length - 1;

  // Toggle single option translation
  const toggleOptionTranslation = (letter: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playSelect();
    setShowOptionArm((prev) => ({
      ...prev,
      [letter]: !prev[letter],
    }));
  };

  // Toggle question translation
  const toggleQuestionTranslation = () => {
    sound.playSelect();
    setShowQuestionArm((prev) => !prev);
  };

  // Toggle all translations
  const toggleAllTranslations = () => {
    sound.playSelect();
    const nextState = !allTranslationsActive;
    setAllTranslationsActive(nextState);
    setShowQuestionArm(nextState);
    const newOptionsMap: Record<string, boolean> = {};
    currentQuestion.options.forEach((opt) => {
      newOptionsMap[opt.letter] = nextState;
    });
    setShowOptionArm(newOptionsMap);
  };

  // Handle Option Click (Locking answer)
  const handleSelectOption = (letter: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswerLocked) return;
    sound.playSelect();
    setSelectedOption(letter);
    setIsAnswerLocked(true);

    const correct = letter === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      sound.playCorrect();
      setBank(currentQuestion.prizeAmount);
      // Auto open Number Guessing screen after short delay
      setTimeout(() => {
        setShowNumberGuesser(true);
      }, 1200);
    } else {
      sound.playWrong();
    }
  };

  // Lifeline: 50:50
  const useFiftyFifty = () => {
    if (lifelineFiftyFiftyUsed || isAnswerLocked) return;
    sound.playSelect();
    setLifelineFiftyFiftyUsed(true);

    const incorrectOptions = currentQuestion.options
      .filter((opt) => opt.letter !== currentQuestion.correctAnswer)
      .map((opt) => opt.letter);

    // Pick 2 random wrong options to hide
    const shuffled = [...incorrectOptions].sort(() => 0.5 - Math.random());
    setHiddenOptions(shuffled.slice(0, 2));
  };

  // Lifeline: Coach Hint
  const useCoach = () => {
    if (lifelineCoachUsed || isAnswerLocked) return;
    sound.playSelect();
    setLifelineCoachUsed(true);
    setCoachHint(
      `🗣️ Մարզչի խորհուրդը / Consejo del míster: «Հիշի՛ր՝ ${currentQuestion.explanationEs} / ${currentQuestion.explanationArm}»`
    );
  };

  // Lifeline: Audience Poll
  const useAudience = () => {
    if (lifelineAudienceUsed || isAnswerLocked) return;
    sound.playSelect();
    setLifelineAudienceUsed(true);

    const letters = ['A', 'B', 'C', 'D'];
    const correct = currentQuestion.correctAnswer;
    const poll: Record<string, number> = {};

    let remaining = 100;
    const correctScore = Math.floor(Math.random() * 20) + 65; // 65-85% for correct
    poll[correct] = correctScore;
    remaining -= correctScore;

    const wrongLetters = letters.filter((l) => l !== correct);
    const split1 = Math.floor(Math.random() * remaining);
    const split2 = Math.floor(Math.random() * (remaining - split1));
    const split3 = remaining - split1 - split2;

    poll[wrongLetters[0]] = split1;
    poll[wrongLetters[1]] = split2;
    poll[wrongLetters[2]] = split3;

    setAudiencePoll(poll);
  };

  // Proceed to next question
  const handleNextQuestion = () => {
    sound.playSelect();
    sound.playTension();
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerLocked(false);
      setIsCorrect(null);
      setShowQuestionArm(false);
      setShowOptionArm({});
      setAllTranslationsActive(false);
      setHiddenOptions([]);
      setCoachHint(null);
      setAudiencePoll(null);
      setShowNumberGuesser(false);
    }
  };

  // Restart / Reset Quiz
  const handleRestart = () => {
    sound.playSelect();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerLocked(false);
    setIsCorrect(null);
    setBank(0);
    setShowQuestionArm(false);
    setShowOptionArm({});
    setAllTranslationsActive(false);
    setLifelineFiftyFiftyUsed(false);
    setLifelineCoachUsed(false);
    setLifelineAudienceUsed(false);
    setHiddenOptions([]);
    setCoachHint(null);
    setAudiencePoll(null);
    setShowNumberGuesser(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* BONUS NUMBER GUESSING SCREEN - ONLY OPENS ON CORRECT ANSWER */}
      {showNumberGuesser && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center p-4 backdrop-blur-md">
          <NumberGuessingGame
            questionNumber={currentQuestion.id}
            prizeAmount={currentQuestion.prizeAmount}
            onSuccess={(attempts) => {
              setShowNumberGuesser(false);
              handleNextQuestion();
            }}
            onSkip={() => {
              setShowNumberGuesser(false);
              handleNextQuestion();
            }}
          />
        </div>
      )}

      {/* TOP HEADER: QUIZ SHOW HUD */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <span>¿Quién quiere ser millonario?</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300">Ֆուտբոլիստ</span>
            </div>
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <span>Հարց {currentIndex + 1} / {QUIZ_QUESTIONS.length}</span>
              <span className="text-xs font-mono text-amber-400/90 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                €{currentQuestion.prizeAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* BANK & LIFELINES */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Lifeline 1: 50:50 */}
          <button
            onClick={useFiftyFifty}
            disabled={lifelineFiftyFiftyUsed || isAnswerLocked}
            title="50:50 (Հեռացնել 2 սխալ պատասխան)"
            className={`px-3 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 border ${
              lifelineFiftyFiftyUsed
                ? 'bg-slate-900 text-slate-600 border-slate-800 opacity-40 line-through'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-amber-500/30 hover:border-amber-400 shadow-sm cursor-pointer'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            50:50
          </button>

          {/* Lifeline 2: Coach Hint */}
          <button
            onClick={useCoach}
            disabled={lifelineCoachUsed || isAnswerLocked}
            title="Խորհրդակցել մարզչի հետ"
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              lifelineCoachUsed
                ? 'bg-slate-900 text-slate-600 border-slate-800 opacity-40 line-through'
                : 'bg-slate-800 hover:bg-slate-700 text-sky-400 border-sky-500/30 hover:border-sky-400 shadow-sm cursor-pointer'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Մարզիչ
          </button>

          {/* Lifeline 3: Audience Poll */}
          <button
            onClick={useAudience}
            disabled={lifelineAudienceUsed || isAnswerLocked}
            title="Երկրպագուների կարծիքը"
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              lifelineAudienceUsed
                ? 'bg-slate-900 text-slate-600 border-slate-800 opacity-40 line-through'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-emerald-500/30 hover:border-emerald-400 shadow-sm cursor-pointer'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Տրիբունա
          </button>

          {/* Global Translation Toggle */}
          <button
            onClick={toggleAllTranslations}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${
              allTranslationsActive
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">
              {allTranslationsActive ? 'Թաքցնել թարգմանությունները' : 'Բոլոր թարգմանությունները'}
            </span>
            <span className="sm:hidden">ARM</span>
          </button>
        </div>
      </div>

      {/* COACH HINT NOTIFICATION */}
      {coachHint && (
        <div className="p-4 bg-sky-950/40 border border-sky-500/30 rounded-xl text-sky-200 text-sm leading-relaxed animate-in fade-in">
          {coachHint}
        </div>
      )}

      {/* AUDIENCE POLL RESULTS */}
      {audiencePoll && (
        <div className="p-4 bg-slate-900/90 border border-emerald-500/30 rounded-xl space-y-2 animate-in fade-in">
          <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>Տրիբունայի քվեարկության արդյունքները (Votación del público):</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['A', 'B', 'C', 'D'].map((letter) => (
              <div key={letter} className="bg-slate-800/80 p-2 rounded-lg text-center border border-slate-700">
                <div className="font-bold text-white text-sm">{letter}</div>
                <div className="text-xs font-mono text-emerald-400 font-semibold">{audiencePoll[letter]}%</div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full"
                    style={{ width: `${audiencePoll[letter]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAIN GAME ARENA (GRID: QUESTION + LADDER) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* LEFT 3 COLUMNS: THE QUESTION & OPTIONS */}
        <div className="lg:col-span-3 space-y-6">
          {/* THE QUESTION DISPLAY BOX */}
          <div className="relative group p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10">
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
              <span className="font-semibold text-amber-400 uppercase tracking-wider">
                {currentQuestion.part} · {currentQuestion.categoryEs}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => sound.speakSpanish(currentQuestion.questionEs)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition-colors"
                  title="Լսել իսպաներեն արտասանությունը"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleQuestionTranslation}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-amber-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
                  title="Սեղմեք հայերեն թարգմանությունը տեսնելու համար"
                >
                  {showQuestionArm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showQuestionArm ? 'Թաքցնել հայերենը' : 'Հայերեն թարգմանություն'}</span>
                </button>
              </div>
            </div>

            {/* Question Title & Spanish Text (Click to toggle translation) */}
            <div className="pt-4 space-y-3">
              <div className="text-amber-400/90 font-semibold text-sm">
                #{currentQuestion.id}. {currentQuestion.titleEs}
              </div>

              {/* Clickable Spanish Question */}
              <div
                onClick={toggleQuestionTranslation}
                className="text-lg sm:text-2xl font-bold text-white leading-relaxed cursor-pointer hover:text-amber-200 transition-colors"
                title="Սեղմիր իսպաներենի վրա՝ հայերեն թարգմանությունը բացելու համար"
              >
                {currentQuestion.questionEs}
              </div>

              {/* Armenian translation (reveals upon click) */}
              {showQuestionArm && (
                <div className="p-3.5 bg-amber-500/10 border-l-2 border-amber-400 rounded-r-xl text-amber-200 text-sm sm:text-base leading-relaxed animate-in fade-in">
                  <div className="text-xs uppercase tracking-wider text-amber-400/70 font-semibold mb-1">
                    Հայերեն թարգմանություն · {currentQuestion.titleArm}:
                  </div>
                  {currentQuestion.questionArm}
                </div>
              )}
            </div>
          </div>

          {/* 4 OPTIONS (A, B, C, D) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQuestion.options.map((opt) => {
              const isHidden = hiddenOptions.includes(opt.letter);
              const isSelected = selectedOption === opt.letter;
              const isOptionCorrect = opt.letter === currentQuestion.correctAnswer;
              const isRevealed = showOptionArm[opt.letter] || allTranslationsActive;

              if (isHidden) {
                return (
                  <div
                    key={opt.letter}
                    className="p-5 rounded-xl border border-slate-800 bg-slate-950/40 opacity-20 pointer-events-none"
                  >
                    <span className="font-mono text-slate-700 font-bold">{opt.letter}) ---</span>
                  </div>
                );
              }

              // Color styles depending on state
              let containerStyle =
                'bg-slate-900/90 hover:bg-slate-850 border-slate-700/80 hover:border-amber-500/60 text-slate-100';
              let badgeStyle = 'bg-slate-800 text-amber-400 border-slate-700';

              if (isAnswerLocked) {
                if (isOptionCorrect) {
                  containerStyle = 'bg-emerald-950/70 border-emerald-500 text-white shadow-lg shadow-emerald-500/20';
                  badgeStyle = 'bg-emerald-500 text-slate-950 border-emerald-400 font-black';
                } else if (isSelected && !isOptionCorrect) {
                  containerStyle = 'bg-rose-950/70 border-rose-500 text-white shadow-lg shadow-rose-500/20';
                  badgeStyle = 'bg-rose-500 text-white border-rose-400 font-black';
                } else {
                  containerStyle = 'bg-slate-950/50 border-slate-800 text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                containerStyle = 'bg-amber-500/20 border-amber-400 text-white';
                badgeStyle = 'bg-amber-400 text-slate-950 font-black';
              }

              return (
                <div
                  key={opt.letter}
                  onClick={() => !isAnswerLocked && handleSelectOption(opt.letter)}
                  className={`relative group p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${containerStyle}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Letter badge */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 border ${badgeStyle}`}
                    >
                      {opt.letter}
                    </div>

                    {/* Spanish Option Text */}
                    <div className="flex-1 space-y-1">
                      <div className="text-sm sm:text-base font-semibold leading-snug">
                        {opt.es}
                      </div>

                      {/* Revealed Armenian Translation */}
                      {isRevealed && (
                        <div className="text-xs sm:text-sm text-amber-300/90 pt-1 border-t border-slate-700/60 leading-relaxed">
                          🇦🇲 {opt.arm}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Independent Translation Toggle & Audio Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.speakSpanish(opt.es);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-amber-400 transition-colors"
                      title="Լսել արտասանությունը"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => toggleOptionTranslation(opt.letter, e)}
                      className={`px-2 py-0.5 rounded text-xs transition-colors flex items-center gap-1 ${
                        isRevealed
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
                      }`}
                      title="Սեղմիր՝ միայն այս տարբերակի հայերեն թարգմանությունը տեսնելու համար"
                    >
                      {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{isRevealed ? 'Թաքցնել' : 'Թարգմանել'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* POST-ANSWER FEEDBACK & CONTINUATION (Even if wrong, player CONTINUES!) */}
          {isAnswerLocked && (
            <div
              className={`p-5 rounded-2xl border-2 space-y-4 animate-in fade-in duration-300 ${
                isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-100'
                  : 'bg-amber-950/30 border-amber-500/60 text-amber-100'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  {isCorrect ? (
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                  )}

                  <div>
                    <div className="font-bold text-lg sm:text-xl">
                      {isCorrect
                        ? '¡RESPUESTA CORRECTA! · ՃԻՇՏ ՊԱՏԱՍԽԱՆ'
                        : '¡Casi! No te preocupes · Ոչ այնքան ճիշտ է, բայց խաղը շարունակվում է!'}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300">
                      Ճիշտ տարբերակն է{' '}
                      <span className="font-bold text-amber-400 font-mono">
                        {currentQuestion.correctAnswer}){' '}
                        {
                          currentQuestion.options.find(
                            (o) => o.letter === currentQuestion.correctAnswer
                          )?.es
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Continue Buttons */}
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <button
                      onClick={() => setShowNumberGuesser(true)}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>Բոնուս Թվերի Գուշակում (100–100,000)</span>
                      <Flame className="w-4 h-4 text-slate-950" />
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-600 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>Շարունակել խաղը</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Explanations */}
              <div className="pt-2 border-t border-slate-700/60 text-xs sm:text-sm space-y-1">
                <p className="text-slate-200">
                  <span className="font-semibold text-amber-400">Տակտիկական մեկնաբանություն:</span>{' '}
                  {currentQuestion.explanationArm}
                </p>
                <p className="text-slate-400 italic">
                  <span className="font-semibold text-slate-300 not-italic">Explicación táctica:</span>{' '}
                  {currentQuestion.explanationEs}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: MONEY LADDER */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>Escalera de Premios</span>
            </span>
            <span className="text-xs font-mono text-slate-400 font-semibold">
              €{bank.toLocaleString()}
            </span>
          </div>

          {/* Ladder levels (reversed so highest level is on top) */}
          <div className="space-y-1">
            {[...QUIZ_QUESTIONS].reverse().map((q, revIdx) => {
              const actualIdx = QUIZ_QUESTIONS.length - 1 - revIdx;
              const isCurrent = actualIdx === currentIndex;
              const isPassed = actualIdx < currentIndex;
              const isSafeHaven = actualIdx === 4 || actualIdx === 9 || actualIdx === 14;

              let rowClass = 'text-slate-500 hover:bg-slate-800/40';
              if (isCurrent) {
                rowClass =
                  'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold shadow-md shadow-amber-500/20';
              } else if (isPassed) {
                rowClass = 'text-emerald-400 font-medium bg-emerald-950/20';
              } else if (isSafeHaven) {
                rowClass = 'text-amber-300 font-semibold';
              }

              return (
                <div
                  key={q.id}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${rowClass}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-right opacity-70">{actualIdx + 1}</span>
                    <span className="truncate max-w-[110px] text-[11px]">
                      {q.titleEs}
                    </span>
                  </div>
                  <span className="font-bold">€{q.prizeAmount.toLocaleString()}</span>
                </div>
              );
            })}
          </div>

          {/* Reset Game button */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={handleRestart}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Վերսկսել խաղը (Reiniciar)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
