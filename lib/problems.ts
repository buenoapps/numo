export type Op = 'count' | 'add' | 'sub';

export type Problem = {
  op: Op;
  /** Primary value: the count for `count`, first addend for `add`, minuend for `sub`. */
  a: number;
  /** Secondary value: 0 for `count`, second addend for `add`, subtrahend for `sub`. */
  b: number;
  answer: number;
  /** Always four unique values within the allowed range; includes `answer`. */
  choices: number[];
};

export type ProblemConfig = {
  /** Upper bound of the answer range. */
  until: number;
  /** When false, 0 is excluded from all values (operands and answer). */
  includeZero: boolean;
};

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickDistractors(
  answer: number,
  config: ProblemConfig,
  rng: () => number,
): number[] {
  const lo = config.includeZero ? 0 : 1;
  const hi = config.until;

  // Prefer near neighbours first so the distractors feel plausible.
  const near = [answer - 2, answer - 1, answer + 1, answer + 2].filter(
    (n) => n >= lo && n <= hi && n !== answer,
  );
  const distractors = shuffle(near, rng).slice(0, 3);

  if (distractors.length < 3) {
    const pool: number[] = [];
    for (let n = lo; n <= hi; n++) {
      if (n !== answer && !distractors.includes(n)) pool.push(n);
    }
    distractors.push(...shuffle(pool, rng).slice(0, 3 - distractors.length));
  }
  return distractors;
}

function randInt(lo: number, hi: number, rng: () => number): number {
  return Math.floor(rng() * (hi - lo + 1)) + lo;
}

export function generateProblem(
  op: Op,
  config: ProblemConfig,
  rng: () => number = Math.random,
): Problem {
  const lo = config.includeZero ? 0 : 1;
  const hi = config.until;

  let a: number;
  let b: number;
  let answer: number;

  if (op === 'count') {
    a = randInt(lo, hi, rng);
    b = 0;
    answer = a;
  } else if (op === 'add') {
    // Pick a so there's room for at least the minimum b on top.
    const aMax = hi - lo; // leaves space for `b >= lo`
    a = randInt(lo, Math.max(lo, aMax), rng);
    b = randInt(lo, hi - a, rng);
    answer = a + b;
  } else {
    // sub: answer >= lo, b >= lo, a in [lo + lo, hi].
    const aMin = lo === 0 ? lo : lo + lo; // when !includeZero, a >= 2 so answer can still be >= 1
    a = randInt(Math.min(aMin, hi), hi, rng);
    b = randInt(lo, a - lo, rng);
    answer = a - b;
  }

  const choices = shuffle([answer, ...pickDistractors(answer, config, rng)], rng);
  return { op, a, b, answer, choices };
}
