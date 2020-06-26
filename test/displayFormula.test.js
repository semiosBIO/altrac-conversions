const path = require('path');
const CWD = p => path.resolve(process.cwd(), p);

const sinon = require('sinon');
const assert = require('assert');
const should = require('should');
const moment = require('moment');

const noop = ()=>{};

const conversions = require(CWD('../altrac-conversions'));

describe('displayFormula function', () => {
  describe('valueKey', () => {

    it("Should generate an error for an invalid valueKey" , () => {
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
        physical
      );

      const expectedResult = 'ERR';

      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it("Should generate an error for invalid value" , () => {
      const formula = undefined;
      const multiplier = 1;
      const precision = 2;
      const context = {};
      const valueKey = '1';
      const readingCurrent = { '1': 65535 };
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
        physical
      );

      const expectedResult = 'ERR';

      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it("Should accept a valueKey Array" , () => {
      const formula = 'soilMoistureSensorAverage';
      const multiplier = 1;
      const precision = 2;
      const context = {};
      const valueKey = [1, 2, 3, 4];
      const readingCurrent = { '1': 16, '2': 16, '3': 16, '4': 16 };
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
        physical
      );

      const expectedResult = 16;

      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

  });

  describe('bindicator', () => {

    it("Should generate the correct value for bindicator" , () => {
      const formula = undefined;
      const multiplier = 1;
      const precision = 2;
      const context = {};
      const valueKey = '131';
      const readingCurrent = { '131': 1 };
      const readingLast = { '131': 1 };
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
        physical
      );

      const expectedResult = 1;

      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

  });

  describe('toBoolean', () => {
    it("Should generate true when value > 0" , () => {
      const
        formula = 'toBoolean',
        multiplier = null,
        precision = null,
        context = {},
        valueKey = 1,
        readingCurrent = { 1: 1 },
        readingLast = { 1: 1 },
        physical = { };

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical
      );


      const expectedResult = true;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it("Should generate false when value === 0" , () => {
      const 
        formula = 'toBoolean',
        multiplier = null,
        precision = null,
        context = {},
        valueKey = 1,
        readingCurrent = { 1: 0 },
        readingLast = { 1: 0 },
        physical = { };

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical
      );


      const expectedResult = false;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

  });

  describe('mAToBoolean', () => {
    it("Should generate true when value >= 5" , () => {
      const
        formula = 'mAToBoolean',
        multiplier = null,
        precision = null,
        context = {},
        valueKey = 1,
        readingCurrent = { 1: 12 },
        readingLast = { 1: 12 },
        physical = { };

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical
      );

      const expectedResult = true;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it("Should generate false when value < 5" , () => {
      const
        formula = 'mAToBoolean',
        multiplier = null,
        precision = null,
        context = {},
        valueKey = 1,
        readingCurrent = { 1: 0.01 },
        readingLast = { 1: 0.02 },
        physical = { };

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical
      );

      const expectedResult = false;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

  });

  describe('difference', () => {
    it("should generate the correct difference between two values" , () => {
      const
        formula = 'difference',
        multiplier = null,
        precision = null,
        context = {},
        valueKey = [
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
          }
        ],
        readingCurrent = { A: 100, B:202 },
        readingLast = {},
        physical = {};

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical
      );

      const expectedResult = 1;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it("should generate the correct difference between two values, using string valueKeys" , () => {
      const
        formula = 'difference',
        multiplier = 1,
        precision = 1,
        context = {},
        valueKey = ['A', 'B'],
        readingCurrent = { A: 100, B:101 },
        readingLast = {},
        physical = {};

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical
      );

      const expectedResult = 1;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it("should generate zero when values are equal", () => {
      const
        formula = 'difference',
        multiplier = null,
        precision = null,
        context = {},
        valueKey = [
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
          }
        ],
        readingCurrent = { A: 100, B: 100 },
        readingLast = {},
        physical = {};

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical
      );

      const expectedResult = 0;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it("should generate an error when values are non-numeric", () => {
      const
        formula = 'difference',
        multiplier = null,
        precision = null,
        context = {},
        valueKey = [
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
          }
        ],
        readingCurrent = { A: 'a', B: 'b' },
        readingLast = {},
        physical = {};

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical
      );

      const expectedResult = 'ERR';
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

  });

  describe('pumpRunning', () => {
    it("should generate generate true if pump is running" , () => {
      const
        formula = 'pumpRunning',
        multiplier = null,
        precision = null,
        context = {},
        valueKey = [
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
          }
        ],
        readingCurrent = { A: 1, B: 2 },
        readingLast = {},
        physical = {};

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical
      );

      const expectedResult = true;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it("should generate generate false if pump is not running" , () => {
      const
        formula = 'pumpRunning',
        multiplier = null,
        precision = null,
        context = {},
        valueKey = [
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
          }
        ],
        readingCurrent = { A: 1, B: 0 },
        readingLast = {},
        physical = {};

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical
      );

      const expectedResult = false;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it("should generate an error when values are non-numeric", () => {
      const
        formula = 'pumpRunning',
        multiplier = null,
        precision = null,
        context = {},
        valueKey = [
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
          }
        ],
        readingCurrent = { A: 'a', B: 'b' },
        readingLast = {},
        physical = {};

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical
      );

      const expectedResult = 'ERR';
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

  });

  describe('pumpShouldBeRunning', () => {
    it("should generate generate true if pump should be running" , () => {
      const
        formula = 'pumpShouldBeRunning',
        multiplier = null,
        precision = null,
        context = {},
        valueKey = [
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
          }
        ],
        readingCurrent = { A: 1, B: 0 },
        readingLast = {},
        physical = {};

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical
      );

      const expectedResult = true;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it("should generate generate false if pump should not be running" , () => {
      const
        formula = 'pumpShouldBeRunning',
        multiplier = null,
        precision = null,
        context = {},
        valueKey = [
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
          }
        ],
        readingCurrent = { A: 1, B: 2 },
        readingLast = {},
        physical = {};

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical
      );

      const expectedResult = false;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });
  });

  describe('pumpStopped', () => {
    it("should generate generate true if pump is stopped" , () => {
      const
        formula = 'pumpStopped',
        multiplier = null,
        precision = null,
        context = {},
        valueKey = [
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
          }
        ],
        readingCurrent = { A: 0, B: 0 },
        readingLast = {},
        physical = {};

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical
      );

      const expectedResult = true;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it("should generate generate false if pump is not stopped" , () => {
      const
        formula = 'pumpStopped',
        multiplier = null,
        precision = null,
        context = {},
        valueKey = [
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
          }
        ],
        readingCurrent = { A: 1, B: 2 },
        readingLast = {},
        physical = {};

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical
      );

      const expectedResult = false;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

  });

  describe('pumpOutput', () => {
    it("should generate generate the correct value" , () => {
      const
        formula = 'pumpOutput',
        multiplier = 1,
        precision = null,
        context = {},
        valueKey = 'A',
        readingCurrent = { A: 200, date: '2020-01-01T00:20:00.000Z' },
        readingLast =    { A: 100, date: '2020-01-01T00:10:00.000Z' },
        physical = {};

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical
      );

      const expectedResult = 10;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it("should generate generate zero when an input value is invalid" , () => {
      const
        formula = 'pumpOutput',
        multiplier = 1,
        precision = null,
        context = {},
        valueKey = 'A',
        readingCurrent = { A: 200, date: '2020-01-01T00:20:00.000Z' },
        readingLast =    { A: undefined, date: '2020-01-01T00:10:00.000Z' },
        physical = {};

      const result = conversions.displayFormula(
        formula,
        multiplier,
        precision,
        context,
        valueKey,
        readingCurrent,
        readingLast,
        physical
      );

      const expectedResult = 0;
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

  });

});
