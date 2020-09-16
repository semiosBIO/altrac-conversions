/* global describe, it */
const assert = require('assert');

const conversions = require('../lib/index.js');

describe('schedule event functions', () => {
  describe('formatTime(hh, mm)', () => {
    it('should generate a correctly formatted time, when inputs are zeroes', () => {
      const actual = conversions.formatTime(0, 0);
      const expected = '00:00';
      assert.strictEqual(actual, expected);
    });

    it('should generate a correctly formatted time, when inputs are single digit integers', () => {
      const actual = conversions.formatTime(1, 5);
      const expected = '01:05';
      assert.strictEqual(actual, expected);
    });

    it('should generate a correctly formatted time, when inputs are double digit integers', () => {
      const actual = conversions.formatTime(23, 59);
      const expected = '23:59';
      assert.strictEqual(actual, expected);
    });
  });

  describe('scheduleRing(value)', () => {
    const HIGH_LIMIT = 10080;
    const LOW_LIMIT = -10080;
    it('should return correct value when input value is low', () => {
      const actual = conversions.scheduleRing(LOW_LIMIT + 1);
      const expected = 1;
      assert.strictEqual(actual, expected);
    });

    it('should return correct value when input value is between the limits', () => {
      const actual = conversions.scheduleRing(1);
      const expected = 1;
      assert.strictEqual(actual, expected);
    });

    it('should return correct value when input value is high', () => {
      const actual = conversions.scheduleRing(HIGH_LIMIT + 1);
      const expected = 1;
      assert.strictEqual(actual, expected);
    });

    it('should throw an exception when the input value is too low', () => {
      let actual = false;
      const expected = true;
      try {
        conversions.scheduleRing(2 * LOW_LIMIT - 1);
      } catch (exception) {
        actual = exception.message.startsWith('Input value invalid');
      }
      assert.strictEqual(actual, expected);
    });

    it('should throw an exception when the input value is too high', () => {
      let actual = false;
      const expected = true;
      try {
        conversions.scheduleRing(2 * HIGH_LIMIT + 1);
      } catch (exception) {
        actual = exception.message.startsWith('Input value invalid');
      }
      assert.strictEqual(actual, expected);
    });
  });

  describe('insertTime()', () => {
    const INVALID_DAY = 7;
    const INVALID_HOUR = 24;
    const INVALID_MIN = 60;
    const INVALID_UTC_DIFFERENCE_MINUTES_1 = -841;
    const INVALID_UTC_DIFFERENCE_MINUTES_2 = 721;

    it('should insert an event into an empty schedule', () => {
      const scheduleEvents = [];
      const dayStart = 1; const hourStart = 1; const minStart = 1;
      const dayStop = 2; const hourStop = 0; const minStop = 0;
      const utcDifferenceMinutes = 300;

      const actual = conversions.insertTime(
        scheduleEvents,
        dayStart, hourStart, minStart,
        dayStop, hourStop, minStop,
        utcDifferenceMinutes,
      );
      const expected = [118033516];
      assert.deepStrictEqual(actual, expected, 'wrong result');
    });

    it('should insert an event into a non-empty schedule', () => {
      const scheduleEvents = [118033516];
      const dayStart = 3; const hourStart = 1; const minStart = 1;
      const dayStop = 4; const hourStop = 0; const minStop = 0;
      const utcDifferenceMinutes = 300;

      const actual = conversions.insertTime(
        scheduleEvents,
        dayStart, hourStart, minStart,
        dayStop, hourStop, minStop,
        utcDifferenceMinutes,
      );
      const expected = [118033516, 306780076];
      assert.deepStrictEqual(actual, expected, 'wrong result');
    });

    it('should insert a new event that overlaps an existing event', () => {
      const scheduleEvents = [118033516];
      const dayStart = 1; const hourStart = 1; const minStart = 30;
      const dayStop = 2; const hourStop = 2; const minStop = 30;
      const utcDifferenceMinutes = 300;

      const actual = conversions.insertTime(
        scheduleEvents,
        dayStart, hourStart, minStart,
        dayStop, hourStop, minStop,
        utcDifferenceMinutes,
      );
      const expected = [118033666];
      assert.deepStrictEqual(actual, expected, 'wrong result');
    });

    it('should throw an error when dayStart is invalid', () => {
      const scheduleEvents = [];
      const dayStart = INVALID_DAY; const hourStart = 0; const minStart = 0;
      const dayStop = 0; const hourStop = 0; const minStop = 0;
      const utcDifferenceMinutes = 300;

      let actual = false;

      try {
        conversions.insertTime(
          scheduleEvents,
          dayStart, hourStart, minStart,
          dayStop, hourStop, minStop,
          utcDifferenceMinutes,
        );
      } catch (exception) {
        actual = exception.message.startsWith('Invalid dayStart');
      }
      const expected = true;
      assert.strictEqual(actual, expected, 'should have caught thrown error');
    });

    it('should throw an error when hourStart is invalid', () => {
      const scheduleEvents = [];
      const dayStart = 0; const hourStart = INVALID_HOUR; const minStart = 0;
      const dayStop = 0; const hourStop = 0; const minStop = 0;
      const utcDifferenceMinutes = 300;

      let actual = false;

      try {
        conversions.insertTime(
          scheduleEvents,
          dayStart, hourStart, minStart,
          dayStop, hourStop, minStop,
          utcDifferenceMinutes,
        );
      } catch (exception) {
        actual = exception.message.startsWith('Invalid hourStart');
      }
      const expected = true;
      assert.strictEqual(actual, expected, 'should have caught thrown error');
    });

    it('should throw an error when minStart is invalid', () => {
      const scheduleEvents = [];
      const dayStart = 0; const hourStart = 0; const minStart = INVALID_MIN;
      const dayStop = 0; const hourStop = 0; const minStop = 0;
      const utcDifferenceMinutes = 300;

      let actual = false;

      try {
        conversions.insertTime(
          scheduleEvents,
          dayStart, hourStart, minStart,
          dayStop, hourStop, minStop,
          utcDifferenceMinutes,
        );
      } catch (exception) {
        actual = exception.message.startsWith('Invalid minStart');
      }
      const expected = true;
      assert.strictEqual(actual, expected, 'should have caught thrown error');
    });

    it('should throw an error when dayStop is invalid', () => {
      const scheduleEvents = [];
      const dayStart = 0; const hourStart = 0; const minStart = 0;
      const dayStop = INVALID_DAY; const hourStop = 0; const minStop = 0;
      const utcDifferenceMinutes = 300;

      let actual = false;

      try {
        conversions.insertTime(
          scheduleEvents,
          dayStart, hourStart, minStart,
          dayStop, hourStop, minStop,
          utcDifferenceMinutes,
        );
      } catch (exception) {
        actual = exception.message.startsWith('Invalid dayStop');
      }
      const expected = true;
      assert.strictEqual(actual, expected, 'should have caught thrown error');
    });

    it('should throw an error when hourStop is invalid', () => {
      const scheduleEvents = [];
      const dayStart = 0; const hourStart = 0; const minStart = 0;
      const dayStop = 0; const hourStop = INVALID_HOUR; const minStop = 0;
      const utcDifferenceMinutes = 300;

      let actual = false;

      try {
        conversions.insertTime(
          scheduleEvents,
          dayStart, hourStart, minStart,
          dayStop, hourStop, minStop,
          utcDifferenceMinutes,
        );
      } catch (exception) {
        actual = exception.message.startsWith('Invalid hourStop');
      }
      const expected = true;
      assert.strictEqual(actual, expected, 'should have caught thrown error');
    });

    it('should throw an error when minStop is invalid', () => {
      const scheduleEvents = [];
      const dayStart = 0; const hourStart = 0; const minStart = 0;
      const dayStop = 0; const hourStop = 0; const minStop = INVALID_MIN;
      const utcDifferenceMinutes = 300;

      let actual = false;

      try {
        conversions.insertTime(
          scheduleEvents,
          dayStart, hourStart, minStart,
          dayStop, hourStop, minStop,
          utcDifferenceMinutes,
        );
      } catch (exception) {
        actual = exception.message.startsWith('Invalid minStop');
      }
      const expected = true;
      assert.strictEqual(actual, expected, 'should have caught thrown error');
    });

    it('should throw an error when utcDifferenceMinutes is too low', () => {
      const scheduleEvents = [];
      const dayStart = 0; const hourStart = 0; const minStart = 0;
      const dayStop = 0; const hourStop = 0; const minStop = 0;
      const utcDifferenceMinutes = INVALID_UTC_DIFFERENCE_MINUTES_1;

      let actual = false;

      try {
        conversions.insertTime(
          scheduleEvents,
          dayStart, hourStart, minStart,
          dayStop, hourStop, minStop,
          utcDifferenceMinutes,
        );
      } catch (exception) {
        actual = exception.message.startsWith('Invalid utcDifferenceMinutes');
      }
      const expected = true;
      assert.strictEqual(actual, expected, 'should have caught thrown error');
    });

    it('should throw an error when utcDifferenceMinutes is too high', () => {
      const scheduleEvents = [];
      const dayStart = 0; const hourStart = 0; const minStart = 0;
      const dayStop = 0; const hourStop = 0; const minStop = 0;
      const utcDifferenceMinutes = INVALID_UTC_DIFFERENCE_MINUTES_2;

      let actual = false;

      try {
        conversions.insertTime(
          scheduleEvents,
          dayStart, hourStart, minStart,
          dayStop, hourStop, minStop,
          utcDifferenceMinutes,
        );
      } catch (exception) {
        actual = exception.message.startsWith('Invalid utcDifferenceMinutes');
      }
      const expected = true;
      assert.strictEqual(actual, expected, 'should have caught thrown error');
    });
  });

  describe('insertTimeDuration()', () => {
    it('should insert a time duration', () => {
      const scheduleEvents = [118033516];
      const dayStart = 3; const hourStart = 0; const minStart = 0;
      const duration = 100;
      const utcDifferenceMinutes = 300;

      const actual = conversions.insertTimeDuration(
        scheduleEvents,
        dayStart, hourStart, minStart,
        duration,
        utcDifferenceMinutes,
      );

      const expected = [118033516, 302781040];
      assert.deepStrictEqual(actual, expected, 'wrong result');
    });
  });

  describe('decodeTime()', () => {
    it('should decode a time', () => {
      const schedEvent = 118033516;
      const offset = 300;
      const key = 1;

      const actual = conversions.decodeTime(schedEvent, offset, key);

      const expected = {
        duration: {
          cross: true,
          crossWeek: false,
          days: 1,
          hrs: 23,
          mins: 1379,
          size: 1,
        },
        human: 'Start: Mon 1:01 AM, Stop: Tue 0:00 AM (118033516)',
        key: 1,
        start: {
          day: 1,
          hr: 1,
          min: 1,
          human: 'Mon 1:01 AM',
        },
        stop: {
          day: 2,
          hr: 0,
          min: 0,
          human: 'Tue 0:00 AM',
        },
      };
      assert.deepStrictEqual(actual, expected, 'wrong result');
    });
  });

  describe('decodeScheduleUI()', () => {
    it('should decode a schedule for UI', () => {
      const schedule = [118033516];

      const actual = conversions.decodeScheduleUI(schedule);

      const expected = [
        {
          duration: {
            cross: true,
            crossWeek: false,
            days: 1,
            hrs: 23,
            mins: 1379,
            size: 1,
          },
          human: 'Start: Mon 6:01 AM, Stop: Tue 5:00 AM (118033516)',
          key: 0,
          start: {
            day: 1,
            hr: 6,
            min: 1,
            human: 'Mon 6:01 AM',
          },
          stop: {
            day: 2,
            hr: 5,
            min: 0,
            human: 'Tue 5:00 AM',
          },
        },
      ];
      assert.deepStrictEqual(actual, expected, 'wrong result');
    });
  });
});
