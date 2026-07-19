/* ═══════════════════════════════════════════════
   PLANTILLA — Examen ENURM por año
   
   Cómo usarla:
   1. Duplica este archivo y renómbralo, ej: data-enurm2021.js
   2. Cambia "ENURM_2021" por el año que corresponda (debe
      coincidir EXACTO con lo que espera script.js, ej: ENURM_2021,
      ENURM_2022, ENURM_2023 ... hasta ENURM_2026)
   3. Llena el arreglo con las preguntas reales de ese examen
      (idealmente múltiplos de 10, ya que se dividen en bloques
      de 10 preguntas cada uno)
   4. En index.html, descomenta la línea:
      <!-- <script src="data-enurm2021.js"></script> -->
   5. En script.js, dentro de EXAMS, busca la entrada de ese año
      y cambia avail:false → avail:true

   Campos de cada pregunta:
   · text  → enunciado de la pregunta
   · opts  → arreglo con las 4 opciones (A, B, C, D)
   · ans   → índice (0-3) de la opción correcta
   · exp   → explicación que se muestra al responder
   · sub   → especialidad: 'interna' | 'cirugia' | 'pediatria' |
             'ginecologia' | 'ciencias_basicas' | 'salud_publica' |
             'farmacologia'
   · diff  → dificultad: 'easy' | 'medium' | 'hard'
══════════════════════════════════════════════ */
var ENURM_2021 = [
  {
    text: 'Pregunta de ejemplo 1: reemplaza este texto con la pregunta real del examen ENURM 2021.',
    opts: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
    ans: 0,
    exp: 'Explicación de por qué la opción A es la correcta.',
    sub: 'interna',
    diff: 'medium'
  },
  {
    text: 'Pregunta de ejemplo 2: reemplaza este texto con la pregunta real del examen ENURM 2021.',
    opts: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
    ans: 2,
    exp: 'Explicación de por qué la opción C es la correcta.',
    sub: 'ginecologia',
    diff: 'easy'
  },

  // ...continúa agregando preguntas aquí (ideal: múltiplos de 10)
];
