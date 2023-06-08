/* global describe, it */
const assert = require('assert');

const conversions = require('../lib/index');

describe('displayFormula function', () => {
  describe('valueKey', () => {
    it('Should generate an error for an invalid valueKey', () => {
      console.log('put this log above it statement');
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

      assert(result === expectedResult);
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

      assert(result === expectedResult);
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

      assert(result === expectedResult);
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

      assert(result === expectedResult);
    });

    it('Should generate the correct value for bindicator 1/4', () => {
      const formula = 'binLevel';
      const multiplier = 1;
      const precision = 2;
      const context = {};
      const valueKey = '131';
      const readingCurrent = { 131: 1 };
      const readingLast = { 131: 1 };
      const physical = {
        debounce: 1,
        powered: false,
        bins: 4,
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

      const expectedResult = '1/4';

      assert(result === expectedResult);
    });

    it('Should generate the correct value for bindicator 2/3', () => {
      const formula = 'binLevel';
      const multiplier = 1;
      const precision = 2;
      const context = {};
      const valueKey = '131';
      const readingCurrent = { 131: 7 };
      const readingLast = { 131: 7 };
      const physical = {
        debounce: 1,
        powered: true,
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

      const expectedResult = '2/3';

      assert(result === expectedResult);
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
      assert(result === expectedResult);
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
      assert(result === expectedResult);
    });
  });
  describe('fourToTwentySD_', () => {
    let formula = 'fourToTwentySD1';
    let multiplier = 10000;
    let precision = 1;
    let context = {};
    let valueKey = 150;
    let readingCurrent = { 150: 3960 };
    let readingLast = { 150: 3960 };
    let physical = {};

    beforeEach(() => {
      formula = 'fourToTwentySD1';
      multiplier = 10000;
      precision = 1;
      context = {};
      valueKey = 150;
      readingCurrent = { 150: 3960 };
      readingLast = { 150: 3960 };
      physical = {};
    })
    it('Should calculate correctly with defaults', () => {
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
      assert.strictEqual(result, 26);
    });
    it('Should calculate correctly with defaults', () => {
      physical.minSD1 = 10;
      physical.maxSD1 = 90;
      physical.zeroSD1 = 0;
      physical.precisionSD1 = 2;
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
      assert.strictEqual(result, 30.6);
    });

  });
  describe('voltage0To10', () => {
    let formula = 'voltage0To10';
    let multiplier = 1;
    let precision = 1;
    let context = {};
    let valueKey = 133;
    let readingCurrent = { 133: 0.1 };
    let readingLast = { 133: 0.1 };
    let physical = {}

    beforeEach(() => {
      formula = 'voltage0To10';
      multiplier = 1;
      precision = 1;
      context = {};
      valueKey = 150;
      readingCurrent = { 150: 0.180 };
      readingLast = { 150: 0.180 };
      physical = {};
    })
    it('Should calculate 0 correctly', () => {
      readingCurrent = { 150: 0.180 };
      readingLast = { 150: 0.180 };
      physical = {
        inSigMin: 0.180,
        inSigMax: 0.9,
        inMin: 0,
        inMax: 50,
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
      assert.strictEqual(result, 0);
    });
    it('Should calculate 5 PSI on 50 PSI range (10%)', () => {
      readingCurrent = { 150: 0.252 };
      readingLast = { 150: 0.252 };
      physical = {
        inSigMin: 0.180,
        inSigMax: 0.9,
        inMin: 0,
        inMax: 50,
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
      assert.strictEqual(result, 5);
    });
    it('Should calculate 10 PSI on 50 PSI range (20%)', () => {
      readingCurrent = { 150: 0.324 };
      readingLast = { 150: 0.324 };
      physical = {
        inSigMin: 0.180,
        inSigMax: 0.9,
        inMin: 0,
        inMax: 50,
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
      assert.strictEqual(result, 10);
    });
    it('Should calculate LOW PSI as 0', () => {
      readingCurrent = { 150: 0.0 };
      readingLast = { 150: 0.0 };
      physical = {
        inSigMin: 0.180,
        inSigMax: 0.9,
        inMin: 0,
        inMax: 50,
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
      assert.strictEqual(result, 0);
    });
    it('Should calculate HIGH PSI as 50', () => {
      readingCurrent = { 150: 1.0 };
      readingLast = { 150: 1.0 };
      physical = {
        inSigMin: 0.180,
        inSigMax: 0.9,
        inMin: 0,
        inMax: 50,
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
      assert.strictEqual(result, 50);
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
      assert(result === expectedResult);
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
      assert(result === expectedResult);
    });
  });

  describe('stateToBoolean', () => {
    it('Should generate true when value >= 9 and <= 13', () => {
      const
        formula = 'stateToBoolean';
      const multiplier = null;
      const precision = null;
      const context = {};
      const valueKey = 'R1S';
      const readingCurrent = { R1S: 9 };
      const readingLast = { R1S: 9 };
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

      const expectedResult = true;
      assert(result === expectedResult);

      readingCurrent.R1S = 13;
      readingLast.R1S = 13;
      const result2 = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical,
      );

      assert(result2 === expectedResult);
    });

    it('Should generate false when value < 9 and > 13', () => {
      const
        formula = 'stateToBoolean';
      const multiplier = null;
      const precision = null;
      const context = {};
      const valueKey = 'R1S';
      const readingCurrent = { R1S: 1 };
      const readingLast = { R1S: 1 };
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

      const expectedResult = false;
      assert(result === expectedResult);

      readingCurrent.R1S = 14;
      readingLast.R1S = 14;
      const result2 = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical,
      );

      assert(result2 === expectedResult);
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
      assert(result === expectedResult);
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
      assert(result === expectedResult);
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
      assert(result === expectedResult);
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
      assert(result === expectedResult);
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
      assert(result === expectedResult);
    });

    it('should generate zero when an input value is invalid', () => {
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
      assert(result === expectedResult);
    });

    it('should generate zero when current and last flow time have the same value', () => {
      const
        formula = 'flowRate';
      const multiplier = 1;
      const precision = null;
      const context = {};
      const valueKey = '132';
      const readingCurrent = { A: 200, 132: 1685193065, date: '2023-05-29T13:08:54.000Z' };
      const readingLast = { A: 100, 132: 1685193065, date: '2023-05-29T13:03:51.000Z' };
      const physical = { unitsPerPulse: 100 };

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
      assert(result === expectedResult);
    });

    it('should generate zero when time of data is out of sync between flow time and machine date', () => {
      const
        formula = 'flowRate';
      const multiplier = 1;
      const precision = null;
      const context = {};
      const valueKey = '132';
      const readingCurrent = { A: 200, 132: 1685369367, date: '2023-05-29T14:09:29.000Z' };
      const readingLast = { A: 100, 132: 1685193065, date: '2023-05-29T14:04:26.000Z' };
      const physical = { unitsPerPulse: 100 };

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
      assert(result === expectedResult);
    });

    it('should also calculate flowRate correctly', () => {
      const
        formula = 'flowRate';
      const multiplier = 1;
      const precision = null;
      const context = {};
      const valueKey = 'A';
      const epoch = 1663949598;
      const readingCurrent = { A: 200, 132: epoch, date: '2020-01-01T00:20:00.000Z' };
      const readingLast = { A: 100, 132: epoch - 10 * 60, date: '2020-01-01T00:10:00.000Z' };
      const physical = { unitsPerPulse: 100 };

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

      const expectedResult = 1000;
      assert(result === expectedResult);
    });
    it('should also calculate flowRateLiters correctly', () => {
      const
        formula = 'flowRateLiters';
      const multiplier = 1;
      const precision = 2;
      const context = {};
      const valueKey = 'A';
      const epoch = 1663949598;
      const readingCurrent = { A: 200, 132: epoch, date: '2020-01-01T00:20:00.000Z' };
      const readingLast = { A: 100, 132: epoch - 10 * 60, date: '2020-01-01T00:10:00.000Z' };
      const physical = { unitsPerPulse: 100 };

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

      const expectedResult = Math.round(1000 * 3.78541 * 100) / 100;
      assert(result === expectedResult);
    });
    it('should also calculate flowCumulative correctly', () => {
      const
        formula = 'flowCumulative';
      const multiplier = 1;
      const precision = 2;
      const context = {};
      const valueKey = 'A';
      const epoch = 1663949598;
      const readingCurrent = { A: 200, 132: epoch, date: '2020-01-01T00:20:00.000Z' };
      const readingLast = { A: 100, 132: epoch - 10 * 60, date: '2020-01-01T00:10:00.000Z' };
      const physical = { unitsPerPulse: 100 };

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

      const expectedResult = (readingCurrent.A - readingLast.A) * physical.unitsPerPulse;
      assert(result === expectedResult);
    });
    it('should also calculate flowCumulativeLiters correctly', () => {
      const
        formula = 'flowCumulativeLiters';
      const multiplier = 1;
      const precision = 2;
      const context = {};
      const valueKey = 'A';
      const epoch = 1663949598;
      const readingCurrent = { A: 200, 132: epoch, date: '2020-01-01T00:20:00.000Z' };
      const readingLast = { A: 100, 132: epoch - 10 * 60, date: '2020-01-01T00:10:00.000Z' };
      const physical = { unitsPerPulse: 100 };

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

      // eslint-disable-next-line max-len
      const expectedResult = ((readingCurrent.A - readingLast.A) * physical.unitsPerPulse) * 3.78541;
      assert(result === expectedResult);
    });
  });

  describe('rounding', () => {
    it('should generate the correct value no digits', () => {
      const formula = 'default';
      const multiplier = 1;
      const precision = 0;
      const context = {};
      const valueKey = 'A';
      const readingCurrent = { A: 1.09934 };
      const readingLast = { A: 1.09934 };
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
      assert(result === expectedResult);
    });
    it('should generate the correct value one digit', () => {
      const formula = 'default';
      const multiplier = 1;
      const precision = 1;
      const context = {};
      const valueKey = 'A';
      const readingCurrent = { A: 1.09934 };
      const readingLast = { A: 1.09934 };
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

      const expectedResult = 1.1;
      assert(result === expectedResult);
    });
    it('should generate the correct value two digits', () => {
      const formula = 'default';
      const multiplier = 1;
      const precision = 2;
      const context = {};
      const valueKey = 'A';
      const readingCurrent = { A: 1.11934 };
      const readingLast = { A: 1.11934 };
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

      const expectedResult = 1.12;
      assert(result === expectedResult);
    });
  });
});
