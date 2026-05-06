export type Op = 'add' | 'sub';

export type Problem = {
  op: Op;
  a: number;
  b: number;
  answer: number;
  choices: number[];
};

const MAX = 10;

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickDistractors(answer: number, rng: () => number): number[] {
  const candidates = [answer - 2, answer - 1, answer + 1, answer + 2].filter(
    (n) => n >= 0 && n <= MAX && n !== answer,
  );
  const distractors = shuffle(candidates, rng).slice(0, 3);
  if (distractors.length < 3) {
    const pool: number[] = [];
    for (let n = 0; n <= MAX; n++) {
      if (n !== answer && !distractors.includes(n)) pool.push(n);
    }
    distractors.push(...shuffle(pool, rng).slice(0, 3 - distractors.length));
  }
  return distractors;
}

export function generateProblem(op: Op = 'add', rng: () => number = Math.random): Problem {
  let a: number;
  let b: number;
  let answer: number;
  if (op === 'add') {
    a = Math.floor(rng() * 10);
    b = Math.floor(rng() * (MAX - a + 1));
    answer = a + b;
  } else {
    a = Math.floor(rng() * (MAX + 1));
    b = Math.floor(rng() * (a + 1));
    answer = a - b;
  }
  const choices = shuffle([answer, ...pickDistractors(answer, rng)], rng);
  return { op, a, b, answer, choices };
}
