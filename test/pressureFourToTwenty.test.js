/* global describe, it */
const assert = require('assert');

const conversions = require('../lib/index.js');

describe('pressureFourToTwenty function', () => {
  describe('value', () => {
    it('Should generate an error for an invalid valueKey', () => {
      const valueKey = 'x';
      const value = null;
      const physical = {};

      const result = conversions.pressureFourToTwenty(
        valueKey,
        value,
        physical,
      );

      const expectedResult = 'ERR';

      assert(result === expectedResult);
    });

    it('Should generate an error for large numbers (Pump)', () => {
        const valueKey = 'R1F';
        const value = 1000;
        const physical = {};

        const result = conversions.pressureFourToTwenty(
            valueKey,
            value,
            physical,
          );

      const expectedResult = 'ERR';

      assert(result === expectedResult);
    });

    it('Should generate an error for large numbers (Valve)', () => {
        const valueKey = '142';
        const value = 1000;
        const physical = {};

        const result = conversions.pressureFourToTwenty(
            valueKey,
            value,
            physical,
          );

      const expectedResult = 'ERR';

      assert(result === expectedResult);
    });

    it('Should generate an error for negative numbers (Pump)', () => {
        const valueKey = 'R1F';
        const value = -10;
        const physical = {};

        const result = conversions.pressureFourToTwenty(
            valueKey,
            value,
            physical,
          );

      const expectedResult = 'ERR';

      assert(result === expectedResult);
    });

    it('Should generate an error for negative numbers (Valve)', () => {
        const valueKey = '142';
        const value = -10;
        const physical = {};

        const result = conversions.pressureFourToTwenty(
            valueKey,
            value,
            physical,
          );

      const expectedResult = 'ERR';

      assert(result === expectedResult);
    });

  });

});
