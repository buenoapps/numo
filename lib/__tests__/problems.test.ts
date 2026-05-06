import { generateProblem, type Op } from '../problems';

function seededRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function runMany(op: Op, count: number) {
  const rng = seededRng(0xC0FFEE);
  return Array.from({ length: count }, () => generateProblem(op, rng));
}

describe('generateProblem', () => {
  it('defaults to addition when no op is given', () => {
    const p = generateProblem(undefined, seededRng(1));
    expect(p.op).toBe('add');
    expect(p.a + p.b).toBe(p.answer);
  });

  describe('addition', () => {
    const problems = runMany('add', 500);

    it('keeps addends and answer in 0..10', () => {
      for (const p of problems) {
        expect(p.a).toBeGreaterThanOrEqual(0);
        expect(p.a).toBeLessThanOrEqual(9);
        expect(p.b).toBeGreaterThanOrEqual(0);
        expect(p.b).toBeLessThanOrEqual(10);
        expect(p.answer).toBeGreaterThanOrEqual(0);
        expect(p.answer).toBeLessThanOrEqual(10);
      }
    });

    it('answers equal a + b', () => {
      for (const p of problems) {
        expect(p.answer).toBe(p.a + p.b);
      }
    });
  });

  describe('subtraction', () => {
    const problems = runMany('sub', 500);

    it('never produces a negative answer', () => {
      for (const p of problems) {
        expect(p.a).toBeGreaterThanOrEqual(0);
        expect(p.a).toBeLessThanOrEqual(10);
        expect(p.b).toBeGreaterThanOrEqual(0);
        expect(p.b).toBeLessThanOrEqual(p.a);
        expect(p.answer).toBe(p.a - p.b);
        expect(p.answer).toBeGreaterThanOrEqual(0);
        expect(p.answer).toBeLessThanOrEqual(10);
      }
    });
  });

  describe('choices', () => {
    it.each(['add', 'sub'] as const)('returns 4 unique choices in 0..10 including the answer (%s)', (op) => {
      for (const p of runMany(op, 500)) {
        expect(p.choices).toHaveLength(4);
        expect(new Set(p.choices).size).toBe(4);
        expect(p.choices).toContain(p.answer);
        for (const c of p.choices) {
          expect(c).toBeGreaterThanOrEqual(0);
          expect(c).toBeLessThanOrEqual(10);
        }
      }
    });
  });
});
