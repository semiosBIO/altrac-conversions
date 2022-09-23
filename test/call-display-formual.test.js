const assert = require('assert');

const { displayFormula } = require('../lib/index');

function callDisplayFormula(options, args) {
  if (typeof options == 'string' && args)
    return callDisplayFormulaByName(options, args);

  const { formula } = options;
  return callDisplayFormulaByName(formula, options);
}

function callDisplayFormulaByName(formula, {
  multiplier,
  precision,
  context,
  valueKey,
  readingCurrent,
  readingLast,
  physical,
  mapValues,
}) {
  return displayFormula(
    formula,
    multiplier,
    precision,
    context,
    valueKey,
    readingCurrent,
    readingLast,
    physical,
    mapValues
  )
}

const options = {
  formula: undefined,
  multiplier:  1,
  precision: 2,
  context: {},
  valueKey:  'x',
  readingCurrent: {},
  readingLast: {},
  physical: {},
}

describe('DisplayFormulaFunction', () => {
  describe('value key', () => {
    it('Should generate an error for an invalid valueKey', () => {
      assert(callDisplayFormula(options) === 'ERR');
    });

    it('Should generate an error for an invalid value', () => {
      const actual = callDisplayFormula({
        ...options,
        valueKey: '1',
        readingCurrent: { 1: 65535 }
      });
      assert(actual === 'ERR');
    });

    it('Should accept a valueKey array', () => {
      const actual = callDisplayFormula({
        ...options,
        formula: 'soilMoistureSensorAverage',
        valueKey: [1, 2, 3, 4],
        readingCurrent: { 1: 16, 2: 16, 3: 16, 4: 16 },
        physical: {
          moistureSensorSettings: {
            moistureCombined: { goalMax: 31, goalMin: 1 }
          }
        }
      });
      assert(actual === 16);
    });
  });

  describe('bindicator', () => {
    const bindicator = {
      ...options,
      valueKey: '131',
      readingCurrent: { 131: 1 },
      readingLast: { 131: 1 },
      physical: { debounce: 1, powered: 1, bins: 3 }
    }
    it('Should generate the correct value for bindicator', () => {
      assert(callDisplayFormula(bindicator) === 1);
    });
    it('should generate the correct value for bindicator 1/4', () => {
      const actual = callDisplayFormula({
        ...bindicator,
        formula: 'binLevel',
        physical: { debounce: 1, powered: false, bins: 4 }
      });
      console.log(actual)
      assert(actual === '1/4');
    });
    it('should generate the correct value for bindicator 2/3', () => {
      const actual = callDisplayFormula({
        ...bindicator,
        formula: 'binLevel',
        readingCurrent: { 131: 7 },
        readingLast: { 131: 7 },
        physical: { debounce: 1, powered: true, bins: 3 }
      });
      assert(actual === '2/3');
    });
  });
});
