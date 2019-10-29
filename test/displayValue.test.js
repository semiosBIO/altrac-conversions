const path = require('path');
const CWD = p => path.resolve(process.cwd(), p);

const sinon = require('sinon');
const assert = require('assert');
const should = require('should');
const moment = require('moment');

const noop = ()=>{};

const conversions = require(CWD('../altrac-conversions'));

describe('displayValue function', () => {
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

});
