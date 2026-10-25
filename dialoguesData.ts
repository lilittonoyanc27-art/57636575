/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DialogueItem } from './types';

export const MINI_DIALOGUES: DialogueItem[] = [
  {
    id: 1,
    titleEs: 'Diálogo 1 — En el campo',
    titleArm: 'Երկխոսություն 1 — Խաղադաշտում',
    lines: [
      {
        speaker: 'Jugador 1',
        es: '¡Estoy solo! ¡Pásamela!',
        arm: 'Ազատ եմ։ Փոխանցի՛ր ինձ։',
      },
      {
        speaker: 'Jugador 2',
        es: '¡Cuidado, tienes uno detrás!',
        arm: 'Զգո՛ւյշ, հետևումդ մրցակից կա։',
      },
      {
        speaker: 'Jugador 1',
        es: '¡Devuélvemela! ¡Ahora, chuta!',
        arm: 'Հետ փոխանցի՛ր ինձ։ Հիմա հարվածի՛ր։',
      },
      {
        speaker: 'Jugador 2',
        es: '¡Qué buena jugada!',
        arm: 'Ի՜նչ լավ խաղարկում էր։',
      },
    ],
  },
  {
    id: 2,
    titleEs: 'Diálogo 2 — Con el entrenador',
    titleArm: 'Երկխոսություն 2 — Մարզչի հետ',
    lines: [
      {
        speaker: 'Jugador',
        es: 'Míster, ¿qué tengo que mejorar?',
        arm: 'Մարզի՛չ, ի՞նչ պետք է բարելավեմ։',
      },
      {
        speaker: 'Entrenador',
        es: 'Tienes que levantar más la cabeza antes de pasar.',
        arm: 'Փոխանցում կատարելուց առաջ պետք է ավելի հաճախ գլուխդ բարձրացնես։',
      },
      {
        speaker: 'Jugador',
        es: '¿Y cómo puedo mejorar mi visión de juego?',
        arm: 'Իսկ ինչպե՞ս կարող եմ բարելավել խաղադաշտը տեսնելու և իրավիճակը գնահատելու կարողությունս։',
      },
      {
        speaker: 'Entrenador',
        es: 'Observa a tus compañeros y toma decisiones más rápido.',
        arm: 'Հետևի՛ր թիմակիցներիդ դիրքերին և ավելի արագ որոշումներ կայացրու։',
      },
      {
        speaker: 'Jugador',
        es: 'Vale, míster. Voy a trabajar en ello.',
        arm: 'Լա՛վ, մարզիչ։ Կաշխատեմ դրա վրա։',
      },
    ],
  },
  {
    id: 3,
    titleEs: 'Diálogo 3 — Después de perder',
    titleArm: 'Երկխոսություն 3 — Պարտությունից հետո',
    lines: [
      {
        speaker: 'Jugador 1',
        es: 'Hemos perdido otra vez. Estoy decepcionado.',
        arm: 'Նորից պարտվեցինք։ Հիասթափված եմ։',
      },
      {
        speaker: 'Jugador 2',
        es: '¡Ánimo! No hemos jugado tan mal.',
        arm: 'Մի՛ հուսահատվիր։ Այնքան էլ վատ չենք խաղացել։',
      },
      {
        speaker: 'Jugador 1',
        es: 'Pero he fallado una ocasión muy clara.',
        arm: 'Բայց ես գոլ խփելու շատ լավ հնարավորություն բաց թողեցի։',
      },
      {
        speaker: 'Jugador 2',
        es: 'No pasa nada. Todos cometemos errores. Tenemos que seguir trabajando.',
        arm: 'Ոչինչ։ Բոլորս էլ սխալվում ենք։ Պետք է շարունակենք աշխատել։',
      },
    ],
  },
];
