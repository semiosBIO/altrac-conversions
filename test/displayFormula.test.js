/* global describe, it */
const assert = require('assert');

const conversions = require('../lib/index.js');

describe('displayFormula function', () => {
  describe('valueKey', () => {
    it('Should generate an error for an invalid valueKey', () => {
      console.log('put this log above it statement')
      const formula = undefined;
      const multiplier = 1;
      const precision = 2;
      const context = {};
      const valueKey = 'x';
      const readingCurrent = {};
      const readingLast = {};
      const physical = {};

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical,
      );

      const expectedResult = 'ERR';

      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it('Should generate an error for invalid value', () => {
      const formula = undefined;
      const multiplier = 1;
      const precision = 2;
      const context = {};
      const valueKey = '1';
      const readingCurrent = { 1: 65535 };
      const readingLast = {};
      const physical = {};

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical,
      );

      const expectedResult = 'ERR';

      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it('Should accept a valueKey Array', () => {
      const formula = 'soilMoistureSensorAverage';
      const multiplier = 1;
      const precision = 2;
      const context = {};
      const valueKey = [1, 2, 3, 4];
      const readingCurrent = {
        1: 16, 2: 16, 3: 16, 4: 16,
      };
      const readingLast = {};
      const physical = {
        moistureSensorSettings: {
          moistureCombined: {
            goalMax: 31,
            goalMin: 1,
          },
        },
      };

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical,
      );

      const expectedResult = 16;

      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });
  });

  describe('bindicator', () => {
    it('Should generate the correct value for bindicator', () => {
      const formula = undefined;
      const multiplier = 1;
      const precision = 2;
      const context = {};
      const valueKey = '131';
      const readingCurrent = { 131: 1 };
      const readingLast = { 131: 1 };
      const physical = {
        debounce: 1,
        powered: 1,
        bins: 3,
      };

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical,
      );

      const expectedResult = 1;

      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });
  });

  describe('toBoolean', () => {
    it('Should generate true when value > 0', () => {
      const
        formula = 'toBoolean';
      const multiplier = null;
      const precision = null;
      const context = {};
      const valueKey = 1;
      const readingCurrent = { 1: 1 };
      const readingLast = { 1: 1 };
      const physical = { };

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical,
      );


      const expectedResult = true;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it('Should generate false when value === 0', () => {
      const
        formula = 'toBoolean';
      const multiplier = null;
      const precision = null;
      const context = {};
      const valueKey = 1;
      const readingCurrent = { 1: 0 };
      const readingLast = { 1: 0 };
      const physical = { };

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical,
      );


      const expectedResult = false;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });
  });

  describe('mAToBoolean', () => {
    it('Should generate true when value >= 5', () => {
      const
        formula = 'mAToBoolean';
      const multiplier = null;
      const precision = null;
      const context = {};
      const valueKey = 1;
      const readingCurrent = { 1: 12 };
      const readingLast = { 1: 12 };
      const physical = { };

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical,
      );

      const expectedResult = true;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it('Should generate false when value < 5', () => {
      const
        formula = 'mAToBoolean';
      const multiplier = null;
      const precision = null;
      const context = {};
      const valueKey = 1;
      const readingCurrent = { 1: 0.01 };
      const readingLast = { 1: 0.02 };
      const physical = { };

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical,
      );

      const expectedResult = false;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });
  });

  describe('difference', () => {
    it('should generate the correct difference between two values', () => {
      const
        formula = 'difference';
      const multiplier = null;
      const precision = null;
      const context = {};
      const valueKey = [
        {
          formula: 'default',
          multiplier: 1,
          precision: 1,
          valueKey: 'A',
        },
        {
          formula: 'default',
          multiplier: 2,
          precision: 1,
          valueKey: 'B',
        },
      ];
      const readingCurrent = { A: 100, B: 202 };
      const readingLast = {};
      const physical = {};

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical,
      );

      const expectedResult = 1;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it('should generate the correct difference between two values, using string valueKeys', () => {
      const
        formula = 'difference';
      const multiplier = 1;
      const precision = 1;
      const context = {};
      const valueKey = ['A', 'B'];
      const readingCurrent = { A: 100, B: 101 };
      const readingLast = {};
      const physical = {};

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical,
      );

      const expectedResult = 1;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it('should generate zero when values are equal', () => {
      const
        formula = 'difference';
      const multiplier = null;
      const precision = null;
      const context = {};
      const valueKey = [
        {
          formula: 'default',
          multiplier: 1,
          precision: 1,
          valueKey: 'A',
        },
        {
          formula: 'default',
          multiplier: 1,
          precision: 1,
          valueKey: 'B',
        },
      ];
      const readingCurrent = { A: 100, B: 100 };
      const readingLast = {};
      const physical = {};

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical,
      );

      const expectedResult = 0;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it('should generate an error when values are non-numeric', () => {
      const
        formula = 'difference';
      const multiplier = null;
      const precision = null;
      const context = {};
      const valueKey = [
        {
          formula: 'default',
          multiplier: 1,
          precision: 1,
          valueKey: 'A',
        },
        {
          formula: 'default',
          multiplier: 1,
          precision: 1,
          valueKey: 'B',
        },
      ];
      const readingCurrent = { A: 'a', B: 'b' };
      const readingLast = {};
      const physical = {};

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical,
      );

      const expectedResult = 'ERR';
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });
  });

  describe('pumpOutput', () => {
    it('should generate the correct value', () => {
      const formula = 'pumpOutput';
      const multiplier = 1;
      const precision = null;
      const context = {};
      const valueKey = 'A';
      const readingCurrent = { A: 200, date: '2020-01-01T00:20:00.000Z' };
      const readingLast = { A: 100, date: '2020-01-01T00:10:00.000Z' };
      const physical = {};

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical,
      );

      const expectedResult = 10;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it('should generate generate zero when an input value is invalid', () => {
      const
        formula = 'pumpOutput';
      const multiplier = 1;
      const precision = null;
      const context = {};
      const valueKey = 'A';
      const readingCurrent = { A: 200, date: '2020-01-01T00:20:00.000Z' };
      const readingLast = { A: undefined, date: '2020-01-01T00:10:00.000Z' };
      const physical = {};

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical,
      );

      const expectedResult = 0;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });
  });
});
