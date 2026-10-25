/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuizOption {
  letter: 'A' | 'B' | 'C' | 'D';
  arm: string;
  es: string;
}

export interface QuizQuestion {
  id: number;
  part: string;
  categoryArm: string;
  categoryEs: string;
  titleArm: string;
  titleEs: string;
  questionArm: string;
  questionEs: string;
  options: QuizOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanationArm: string;
  explanationEs: string;
  prizeAmount: number;
}

export interface ExpressionItem {
  id: number;
  category: 'partido' | 'defensa_ataque' | 'entrenador' | 'emociones';
  categoryTitleEs: string;
  categoryTitleArm: string;
  es: string;
  arm: string;
}

export interface SpeakingQuestion {
  id: number;
  categoryCode: 'A' | 'B' | 'C' | 'D' | 'E';
  categoryTitleEs: string;
  categoryTitleArm: string;
  arm: string;
  es: string;
  suggestedPhrases?: string[];
}

export interface DialogueLine {
  speaker: string;
  es: string;
  arm: string;
}

export interface DialogueItem {
  id: number;
  titleEs: string;
  titleArm: string;
  lines: DialogueLine[];
}

export type TabMode = 'millionaire' | 'expressions' | 'speaking' | 'dialogues';
