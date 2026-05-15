import { generateProblem, type Op, type ProblemConfig } from '../problems';

function seededRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function runMany(op: Op, config: ProblemConfig, count: number) {
  const rng = seededRng(0xC0FFEE);
  return Array.from({ length: count }, () => generateProblem(op, config, rng));
}

describe('generateProblem', () => {
  describe('count', () => {
    it('returns a single value equal to the answer in [0, until]', () => {
      for (const p of runMany('count', { until: 10, includeZero: true }, 500)) {
        expect(p.op).toBe('count');
        expect(p.b).toBe(0);
        expect(p.a).toBe(p.answer);
        expect(p.answer).toBeGreaterThanOrEqual(0);
        expect(p.answer).toBeLessThanOrEqual(10);
      }
    });

    it('excludes 0 when includeZero is false', () => {
      for (const p of runMany('count', { until: 5, includeZero: false }, 500)) {
        expect(p.answer).toBeGreaterThanOrEqual(1);
        expect(p.answer).toBeLessThanOrEqual(5);
      }
    });
  });

  describe('addition', () => {
    it('keeps both addends and the sum in [0, until]', () => {
      for (const p of runMany('add', { until: 10, includeZero: true }, 500)) {
        expect(p.a).toBeGreaterThanOrEqual(0);
        expect(p.b).toBeGreaterThanOrEqual(0);
        expect(p.answer).toBe(p.a + p.b);
        expect(p.answer).toBeLessThanOrEqual(10);
      }
    });

    it('respects a larger ceiling', () => {
      for (const p of runMany('add', { until: 50, includeZero: true }, 500)) {
        expect(p.answer).toBeLessThanOrEqual(50);
        expect(p.answer).toBe(p.a + p.b);
      }
    });

    it('excludes 0 from addends when includeZero is false', () => {
      for (const p of runMany('add', { until: 10, includeZero: false }, 500)) {
        expect(p.a).toBeGreaterThanOrEqual(1);
        expect(p.b).toBeGreaterThanOrEqual(1);
        expect(p.answer).toBeGreaterThanOrEqual(2);
        expect(p.answer).toBeLessThanOrEqual(10);
      }
    });
  });

  describe('subtraction', () => {
    it('never produces a negative answer', () => {
      for (const p of runMany('sub', { until: 10, includeZero: true }, 500)) {
        expect(p.a).toBeGreaterThanOrEqual(0);
        expect(p.b).toBeGreaterThanOrEqual(0);
        expect(p.b).toBeLessThanOrEqual(p.a);
        expect(p.answer).toBe(p.a - p.b);
        expect(p.answer).toBeGreaterThanOrEqual(0);
        expect(p.answer).toBeLessThanOrEqual(10);
      }
    });

    it('keeps the answer >= 1 when includeZero is false', () => {
      for (const p of runMany('sub', { until: 10, includeZero: false }, 500)) {
        expect(p.a).toBeGreaterThanOrEqual(2);
        expect(p.b).toBeGreaterThanOrEqual(1);
        expect(p.answer).toBeGreaterThanOrEqual(1);
        expect(p.answer).toBe(p.a - p.b);
      }
    });
  });

  describe('choices', () => {
    it.each(['count', 'add', 'sub'] as const)(
      'returns 4 unique choices in the allowed range including the answer (%s)',
      (op) => {
        for (const p of runMany(op, { until: 10, includeZero: true }, 500)) {
          expect(p.choices).toHaveLength(4);
          expect(new Set(p.choices).size).toBe(4);
          expect(p.choices).toContain(p.answer);
          for (const c of p.choices) {
            expect(c).toBeGreaterThanOrEqual(0);
            expect(c).toBeLessThanOrEqual(10);
          }
        }
      },
    );
  });
});
