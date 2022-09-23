"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

// index.js
var round = function round(n, d) {
  var decimalPlaces;

  switch (d) {
    case 0:
      decimalPlaces = 1;
      break;

    case 1:
      decimalPlaces = 10;
      break;

    case 2:
      decimalPlaces = 100;
      break;

    case 3:
      decimalPlaces = 1000;
      break;

    default:
      return n;
  }

  return Math.round(n * decimalPlaces) / decimalPlaces;
};

var isNumber = function isNumber(n) {
  return !Number.isNaN(parseFloat(n)) && Number.isFinite(parseFloat(n));
};

var isNumberFormat = function isNumberFormat(n) {
  return !Number.isNaN(parseFloat(n)) && Number.isFinite(n);
};

var splitTemplate = function split(input, physical, string) {
  if (!input) return null;
  if (typeof input !== 'string') return input;
  var output = input.match(/\{\{([a-zA-Z0-9. _]*\|[a-zA-Z0-9. _]*)\}\}/);

  if (!output) {
    return input;
  }

  var arr = output[1].split('|');
  var returnValue;

  if (physical && _typeof(physical) === 'object' && Object.prototype.hasOwnProperty.call(physical, arr[0])) {
    returnValue = physical[arr[0]];
  } else {
    var _arr2 = _slicedToArray(arr, 1);

    returnValue = _arr2[0];
  }

  if (isNumber(returnValue) && !string) returnValue = Number(returnValue);
  return returnValue;
};

var map = function map(value, x1, y1, x2, y2) {
  return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
};

var voltToVWC = function voltToVWC(v) {
  /*
    0 to 1.1V VWC= 10*V-1
    1.1V to 1.3V  VWC= 25*V- 17.5
    1.3V  to 1.82V  VWC= 48.08*V- 47.5
    1.82V to 2.2V VWC= 26.32*V- 7.89
  */
  if (v < 0.1) {
    return 0;
  }

  if (v >= 0.1 && v < 1.1) {
    return 10 * v - 1;
  }

  if (v >= 1.1 && v < 1.3) {
    return 25 * v - 17.5;
  }

  if (v >= 1.3 && v < 1.82) {
    return 48.04 * v - 47.5;
  }

  if (v >= 1.82 && v <= 3) {
    // went to 3, since this is supposedly the max
    return 26.32 * v - 7.89;
  }

  return 'ERR';
};

var percentToVWC = function percentToVWC(p) {
  var v = p * 5;
  return voltToVWC(v);
};

var analogToVWC = function analogToVWC(a) {
  var v = a / 1023 * 5;
  return voltToVWC(v);
};

var percentToDigital = function percentToDigital(a) {
  if (a > 0.5) {
    return 1;
  }

  return 0;
};

var analogToDigital = function analogToDigital(a) {
  if (a > 511) {
    return 1;
  }

  return 0;
};

var percentToDigitalInverse = function percentToDigitalInverse(a) {
  return percentToDigital(a) === 1 ? 0 : 1;
};

var analogToDigitalInverse = function analogToDigitalInverse(a) {
  return analogToDigital(a) === 1 ? 0 : 1;
};

var voltToCentibar = function voltToCentibar(v) {
  var centibar = 'ERR';

  if (v < 0) {
    centibar = 'VLO';
  } else if (v >= 0 && v <= 3.1) {
    centibar = 1 / 0.0117155 * v;
  } else {
    centibar = 'VHI';
  }

  return round(centibar, 0);
};

var percentToCentibar = function percentToCentibar(p) {
  var v = p * 5;
  return voltToCentibar(v);
};

var analogToCentibar = function analogToCentibar(a) {
  var v = a / 1023 * 5;
  return voltToCentibar(v);
};

var metersPerSecondToMilesPerHour = function metersPerSecondToMilesPerHour(ms, precision) {
  var precisionValue = 0;

  if (precision && !Number.isNaN(precision)) {
    precisionValue = Number(precision);
  }

  return round(ms * 2.23694, precisionValue);
};

var millimetersToInches = function millimetersToInches(mm, precision) {
  var precisionValue = 0;

  if (precision && !Number.isNaN(precision)) {
    precisionValue = Number(precision);
  }

  return round(mm * 0.0393701, precisionValue);
};

var kilometersToMiles = function kilometersToMiles(km, precision) {
  var precisionValue = 0;

  if (precision && !Number.isNaN(precision)) {
    precisionValue = Number(precision);
  }

  return round(km * 0.621371, precisionValue);
};

var kPaToInchesMercury = function kPaToInchesMercury(kpa, precision) {
  var precisionValue = 0;

  if (precision && !Number.isNaN(precision)) {
    precisionValue = Number(precision);
  }

  return round(kpa * 0.2953, precisionValue);
};

var numberMap = function numberMap(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};

var valveStatus = function valveStatus(status) {
  if (status === 0xFFFF) {
    return 0;
  }

  return status & 1 ? 1 : 0;
};

var valveStatusString = function valveStatusString(status) {
  if (status === 0xFFFF) {
    return 'ERR';
  }

  return valveStatus(status) ? 'ON' : 'OFF';
};

var cToF = function cToF(c) {
  return c * 1.8 + 32;
};

var fToC = function fToC(f) {
  return (f - 32) / 1.8;
};

var cellSignalToRssi = function cellSignalToRssi(signal) {
  return signal >>> 8;
};

var cellSignalToQuality = function cellSignalToQuality(signal) {
  return (signal & 0xFF) >>> 0;
};

var cellSignalToBars = function cellSignalToBars(signal, signalType, quality, qualityType, service) {
  var signalStrength = 0;
  var signalQuality = 0; //  Strength of the signal

  if (service === 'LTE Cat-M1' || service === 'LTE' || service === 'LTE_OLD') {
    if (signalType === 'RSRP' && qualityType === 'RSRQ' || signal > 0 && quality > 0) {
      if (signal <= 90 && signal > 0) {
        signalStrength = 5;
      } else if (signal < 105) {
        signalStrength = 4;
      } else if (signal < 111) {
        signalStrength = 3;
      } else if (signal < 116) {
        signalStrength = 2;
      } else if (signal <= 119) {
        signalStrength = 1;
      } else if (signal >= 120) {
        signalStrength = 0;
      }

      if (quality <= 5 && quality > 0) {
        signalQuality = 5;
      } else if (quality <= 10) {
        signalQuality = 4;
      } else if (quality <= 15) {
        signalQuality = 3;
      } else if (quality < 17) {
        signalQuality = 2;
      } else if (quality <= 19) {
        signalQuality = 1;
      } else if (quality > 19) {
        signalQuality = 0;
      } else {
        signalQuality = -1;
      }
    } else {
      signalStrength = -1;
      signalQuality = -1;
    }
  } else if (service === 'UMTS' || signalType === 'RSCP' && qualityType === 'ECN0') {
    if (signal === 0) {
      signalStrength = 0;
    } else if (signal <= 70) {
      signalStrength = 5;
    } else if (signal <= 85) {
      signalStrength = 4;
    } else if (signal < 100) {
      signalStrength = 3;
    } else if (signal < 105) {
      signalStrength = 2;
    } else if (signal <= 110) {
      signalStrength = 1;
    } else if (signal >= 110) {
      signalStrength = 0;
    }

    if (quality <= 5 && quality > 0) {
      signalQuality = 5;
    } else if (quality <= 10) {
      signalQuality = 4;
    } else if (quality <= 15) {
      signalQuality = 3;
    } else if (quality < 20) {
      signalQuality = 2;
    } else {
      signalQuality = -1;
    }
  } else if (signalType === 'RXLEV' || quality === 0 && signal > 10) {
    // 2G
    if (signal <= 70) {
      signalStrength = 5;
      signalQuality = 5;
    } else if (signal <= 85) {
      signalStrength = 4;
      signalQuality = 4;
    } else if (signal < 100) {
      signalStrength = 3;
      signalQuality = 3;
    } else if (signal < 105) {
      signalStrength = 2;
      signalQuality = 2;
    } else if (signal <= 110) {
      signalStrength = 1;
      signalQuality = 1;
    } else if (signal >= 110) {
      signalStrength = 0;
      signalQuality = 0;
    } else if (signal === 0) {
      signalStrength = 0;
      signalQuality = 0;
    }
  } else if (quality > 0 && signal > 0) {
    // old 3G calculation
    if (signal <= 80) {
      signalStrength = 5;
    } else if (signal <= 90) {
      signalStrength = 4;
    } else if (signal < 100) {
      signalStrength = 3;
    } else if (signal < 105) {
      signalStrength = 2;
    } else if (signal <= 110) {
      signalStrength = 1;
    } else if (signal >= 110) {
      signalStrength = 0;
    } else if (signal === 0) {
      signalStrength = 0;
    }

    if (quality <= 5 && quality > 0) {
      signalQuality = 0;
    } else if (quality <= 10) {
      signalQuality = 1;
    } else if (quality <= 15) {
      signalQuality = 2;
    } else if (quality < 23) {
      signalQuality = 3;
    } else if (quality <= 30) {
      signalQuality = 4;
    } else if (quality < 100) {
      signalQuality = 5;
    } else {
      signalQuality = -1;
    }
  } else {
    signalStrength = -1;
    signalQuality = -1;
  } // Get average of the signal if Strength or Quality of the signal
  // drops into the red zone return the SignalTotal as 1 if no
  // connection return 0


  var totalSignal = 0;

  if (signalStrength >= 1 && signalQuality >= 1) {
    totalSignal = Math.floor((signalStrength + signalQuality) / 2);
  } else if (signalStrength === 0 && signalQuality === 0) {
    totalSignal = 0;
  } else if (signalStrength === -1 || signalQuality === -1) {
    totalSignal = -1;
  } else {
    totalSignal = 1;
  }

  return totalSignal;
};

var fromC = function fromC(c, tempConv, precision) {
  var returnValue = null;

  if (c <= 120 && c >= -50) {
    if (tempConv === 'f') {
      returnValue = round(cToF(c), precision);
    } else if (tempConv === 'c') {
      returnValue = round(c, precision);
    }
  }

  return returnValue;
};

var fromCMultiplier = function fromCMultiplier(c, tempConv, precision) {
  return fromC(c / 100, tempConv, precision);
};

var toC = function toC(v, tempConv, precision) {
  var returnValue = -99;

  if (tempConv === 'f') {
    returnValue = fToC(v);
  } else if (tempConv === 'c') {
    returnValue = v;
  }

  return round(returnValue, precision);
};

var valveTimeToValveNumber = function valveTimeToValveNumber(valveTime) {
  return (Number(valveTime) >> 28 & 0x7) >>> 0;
};

var valveTimeToEpoch = function valveTimeToEpoch(valveTime) {
  return (Number(valveTime) & 0xFFFFFFF) * 60;
};

var valveTimeToEpochMillis = function valveTimeToEpochMillis(valveTime) {
  return (Number(valveTime) & 0xFFFFFFF) * 60 * 1000;
};

var valveTimeToDate = function valveTimeToDate(valveTime) {
  return new Date(valveTimeToEpochMillis(valveTime));
};

var lastValveTime = function lastValveTime(valveTimeArr, valveNumber) {
  var valveNumberC = 1;

  if (valveNumber && valveNumber >= 0 && valveNumber <= 8) {
    valveNumberC = valveNumber;
  }

  var returnValue = [0, 0];

  if (valveTimeArr) {
    for (var i = 0; i < valveTimeArr.length; i += 2) {
      if (valveTimeToValveNumber(valveTimeArr[i]) === valveNumberC && valveTimeToValveNumber(valveTimeArr[i + 1]) === valveNumberC && valveTimeToEpochMillis(valveTimeArr[i]) < new Date().getTime() && valveTimeToEpochMillis(valveTimeArr[i + 1]) < new Date().getTime()) {
        if (valveTimeToValveNumber(valveTimeArr[i]) === valveNumberC && valveTimeToValveNumber(valveTimeArr[i + 1]) === valveNumberC && (valveTimeArr[i] > returnValue[0] || returnValue[0] === 0)) {
          returnValue[0] = valveTimeArr[i];
          returnValue[1] = valveTimeArr[i + 1];
        } else {// do nothing
        }
      } else {// do nothing
      }
    }
  }

  return returnValue;
};

var nextValveTime = function nextValveTime(valveTimeArr, valveNumber) {
  var valveNumberC = 1;

  if (valveNumber && valveNumber >= 0 && valveNumber <= 8) {
    valveNumberC = valveNumber;
  }

  var returnValue = [0, 0];

  if (valveTimeArr) {
    for (var i = 0; i < valveTimeArr.length; i += 2) {
      if (valveTimeToEpochMillis(valveTimeArr[i]) < new Date().getTime() && valveTimeToEpochMillis(valveTimeArr[i + 1]) < new Date().getTime()) {// nothing to do here
      } else if (valveTimeToValveNumber(valveTimeArr[i]) === valveNumberC && valveTimeToValveNumber(valveTimeArr[i + 1]) === valveNumberC && (valveTimeArr[i] < returnValue[0] || returnValue[0] === 0)) {
        returnValue[0] = valveTimeArr[i];
        returnValue[1] = valveTimeArr[i + 1];
      } else {// do nothing
      }
    }
  }

  return returnValue;
};

var nextValveTimeToEpochMillis = function nextValveTimeToEpochMillis(valveTimeArr, valveNumber) {
  var nextTimes = nextValveTime(valveTimeArr, valveNumber);
  var returnValue = [0, 0];
  returnValue[0] = valveTimeToEpochMillis(nextTimes[0]);
  returnValue[1] = valveTimeToEpochMillis(nextTimes[1]);
  return returnValue;
};

var lastValveTimeToEpochMillis = function lastValveTimeToEpochMillis(valveTimeArr, valveNumber) {
  var nextTimes = lastValveTime(valveTimeArr, valveNumber);
  var returnValue = [0, 0];
  returnValue[0] = valveTimeToEpochMillis(nextTimes[0]);
  returnValue[1] = valveTimeToEpochMillis(nextTimes[1]);
  return returnValue;
};

var toValveTime = function toValveTime(state, valve, epoch) {
  var statePrep = state << 31 >>> 0;
  var valvePrep = valve << 28 >>> 0;
  var epochPrep = epoch / 60;
  var returnVal = (statePrep | valvePrep | epochPrep) >>> 0;
  return returnVal;
};

var secondsToHHMMSS = function secondsToHHMMSS(totalSeconds) {
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  var seconds = totalSeconds - hours * 3600 - minutes * 60;
  var result = ''; // round seconds

  seconds = Math.round(seconds * 100) / 100;
  result += hours > 0 ? "".concat(hours, " hours, ") : '';
  result += minutes > 0 ? "".concat(minutes, " minutes, ") : '';
  result += seconds > 0 ? "".concat(seconds, " seconds") : '';
  return result;
};

var percentTo20V = function percentTo20V(p, precision, resistor1, resistor2, voltageReference) {
  var resistor1Temp = typeof resistor1 !== 'undefined' ? resistor1 : 1800;
  var resistor2Temp = typeof resistor2 !== 'undefined' ? resistor2 : 10000;
  var voltageReferenceTemp = typeof voltageReference !== 'undefined' ? voltageReference : 3.3;
  return round(p * (1 / (resistor1Temp / (resistor1Temp + resistor2Temp))) * voltageReferenceTemp, precision || 2);
};

var fourToTwenty = function fourToTwenty(p, min, max, zero, precision) {
  var reference = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 3.34;
  var minNumber = 0;
  var maxNumber = 100;
  var precisionNumber = 0;

  if (!Number.isNaN(min)) {
    minNumber = Number(min);
  }

  if (!Number.isNaN(max)) {
    maxNumber = Number(max);
  }

  var zeroNumber = minNumber;

  if (!Number.isNaN(zero)) {
    zeroNumber = Number(zero);
  }

  if (!Number.isNaN(precision)) {
    precisionNumber = Number(precision);
  }

  var volt = p * reference;
  var mA = volt * 10;
  var mAP = (mA - 4) / 16;
  var returnValue = mAP * (maxNumber - minNumber) + minNumber;

  if (mA > 3.5 && returnValue < zeroNumber) {
    return 0;
  }

  if (returnValue < zeroNumber) {
    return 'OFF';
  }

  if (returnValue > maxNumber) {
    return 'ERH';
  }

  return round(returnValue, precisionNumber);
};

var fuelLevel = function fuelLevel(percent, size, maxSize) {
  return percent * (1 / (size / maxSize));
};

var ftToM = function ftToM(ft) {
  return ft * 0.3048;
};

var mToFt = function mToFt(m) {
  return m * 3.28084;
};

var millisecondsPastExpectedConnection = function millisecondsPastExpectedConnection(lastConnection, sleepTime) {
  var currentTime = new Date().getTime();
  var sleepInterval = sleepTime * 1000;

  if (!sleepTime || sleepTime === 0) {
    sleepInterval = 60 * 10 * 1000 + 20000; // checks in every ten minutes, max
  }

  var nextSeen = new Date(new Date(lastConnection).getTime() + sleepInterval).getTime();

  if (nextSeen < currentTime) {
    return currentTime - nextSeen;
  }

  return 0;
};

var spaceCamel = function spaceCamel(s) {
  return s.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
    return str.toUpperCase();
  });
};

var dewPoint = function dewPoint(t, rh) {
  var h = (Math.log10(rh) - 2) / 0.4343 + 17.62 * t / (243.12 + t);
  var dp = 243.12 * h / (17.62 - h); // this is the dew point in Celsius

  return dp;
};

var pumpState = function pumpState(state) {
  var deviceStatus = '';

  switch (state & 0xF) {
    case 1:
      deviceStatus = 'FWD';
      break;

    case 2:
      deviceStatus = 'REV';
      break;

    case 4:
      deviceStatus = 'BRK';
      break;

    case 8:
      deviceStatus = 'STP';
      break;

    default:
      deviceStatus = 'ERR';
  }

  return deviceStatus;
};

var flowMeterState = function flowMeterState(value) {
  if (value > 0) {
    return 'RUN';
  }

  return 'STP';
};

var pulseDiff = function pulseDiff(readingCurrent, readingLast, currentTime, lastTime) {
  var diff = readingCurrent - readingLast;

  if (readingCurrent - readingLast < 0 && readingCurrent - readingLast >= -60000) {
    return 0;
  }

  if (readingCurrent - readingLast < -60000) {
    diff = readingCurrent - readingLast + 65535;
  }

  if (currentTime === lastTime) {
    return 0;
  }

  return diff;
};

var pumpOutput = function pumpOutput(readingCurrent, readingLast, currentTime, lastTime, multiplierValue) {
  var diff = pulseDiff(readingCurrent, readingLast, currentTime, lastTime) / multiplierValue;
  var current = new Date(isNumberFormat(currentTime) ? currentTime * 1000 : currentTime).getTime();
  var previous = new Date(isNumberFormat(lastTime) ? lastTime * 1000 : lastTime).getTime();
  var diffMinutes = (current - previous) / 1000 / 60;
  var output = diff / diffMinutes;
  return Number.isNaN(output) ? 0 : output;
};

var rpmToState = function rpmToState(rpm, off, high) {
  var returnValue = 'OFF';
  var offTest = 150;

  if (off) {
    offTest = off;
  }

  var highTest = 350;

  if (high) {
    highTest = high;
  }

  var rpmTest = 0;

  if (rpm) {
    rpmTest = rpm;
  }

  if (rpmTest < offTest) {
    returnValue = 'OFF';
  } else if (rpmTest >= offTest && rpmTest < highTest) {
    returnValue = 'LOW';
  } else {
    returnValue = 'HIGH';
  }

  return returnValue;
};

var autoSwitchAnalog = function autoSwitchAnalog(value) {
  return value > 9000 ? 1 : 0;
};

var autoSwitchMPC20 = function autoSwitchMPC20(value) {
  return ((value & 0xFF) >>> 0) - 10 === 1 ? 1 : 0;
};

var powerGood = function powerGood(value) {
  return value & 0x4 ? 1 : 0;
};

var engineStateCalculator = function engineStateCalculator(rpm, intention, timestamp, offRpm, highRpm) {
  var rpmTemp = !rpm ? 0 : rpm;
  var intentionTemp = !intention ? 0 : intention;
  var timestampTemp = !timestamp ? new Date().getTime() / 1000 : timestamp;
  var offRpmTemp = !offRpm ? 750 : offRpm;
  var highRpmTemp = !highRpm ? 1600 : highRpm;
  var returnValue = 0;
  var timeDiff = new Date().getTime() / 1000 - timestampTemp;

  if (intentionTemp) {
    if (rpmTemp < offRpmTemp) {
      if (timeDiff >= 120) {
        returnValue = 8; // STATE_FALSE_START
      } else {
        returnValue = 6; // STATE_CRANK_ON
      }
    } else if (rpmTemp >= offRpmTemp && rpmTemp <= highRpmTemp) {
      returnValue = 9; // STATE_WARMUP_DELAY
    } else {
      returnValue = 12; // STATE_RUNNING_LOADED
    }
  } else if (rpmTemp < offRpmTemp) {
    returnValue = 1; // STATE_ENGINE_STOPPED
  } else if (rpmTemp >= offRpmTemp && rpmTemp <= highRpmTemp) {
    returnValue = 9; // STATE_WARMUP_DELAY
  } else {
    returnValue = 13; // STATE_COOLDOWN_DELAY
  }

  return returnValue;
};

var rpmOrchardRiteAutometer9117 = function rpmOrchardRiteAutometer9117(rpm) {
  var returnValue = Math.round((rpm / -170.1244909 + 8.572735138) * rpm);

  if (returnValue < 0) {
    return 0;
  }

  if (returnValue > 3000) {
    return 3000;
  }

  return returnValue;
};

var lineFit = function lineFit(val, m, b, precision, max, min) {
  var maxValue = max || 4294967295;
  var minValue = min || 0;
  var returnValue = val * m + b;
  returnValue = round(returnValue, precision || 0);

  if (returnValue < minValue) {
    return minValue;
  }

  if (returnValue > maxValue) {
    return maxValue;
  }

  return returnValue;
};

var binLevel = function binLevel(binLevelCurrent, binLevelLast, debounce, powered, numberOfBins) {
  var fullness = 0;

  if (!debounce) {
    fullness = binLevelCurrent;
  } else if (binLevelCurrent === binLevelLast) {
    fullness = binLevelCurrent;
  } else if (binLevelCurrent < binLevelLast) {
    fullness = binLevelCurrent;
  } else {
    fullness = binLevelLast;
  }

  var iterations = 4;
  var totalBins = 4;

  if (numberOfBins && numberOfBins > 0 && numberOfBins < 5) {
    iterations = numberOfBins;
    totalBins = numberOfBins;
  }

  var i = 1;

  if (powered) {
    i = 2;
    iterations += 1;
  }

  var numberFull = 0;

  for (i; i <= iterations; i += 1) {
    if ((fullness & Math.pow(2, i - 1)) === Math.pow(2, i - 1)) {
      numberFull += 1;
    } else {
      numberFull += 0;
    }
  }

  return "".concat(numberFull, "/").concat(totalBins);
};

var windMachineChangeStatus = function windMachineChangeStatus(cs) {
  var returnValue = '';

  switch (cs) {
    case 0:
      returnValue = 'No Change';
      break;

    case 1:
      returnValue = 'A/S New';
      break;

    case 2:
      returnValue = 'EP New';
      break;

    case 254:
      returnValue = 'Error';
      break;

    case 255:
      returnValue = 'No A/S';
      break;

    default:
      returnValue = cs;
  }

  return returnValue;
};

var windMachineCommunicationStatus = function windMachineCommunicationStatus(cs) {
  var returnValue = '';

  switch (cs) {
    case -2:
      returnValue = 'Comm Error';
      break;

    case -1:
      returnValue = 'Not Connected';
      break;

    case 0:
      returnValue = 'No Attempt';
      break;

    case 1:
      returnValue = 'Connected';
      break;

    default:
      returnValue = cs;
  }

  return returnValue;
};

var windMachineEngineState = function windMachineEngineState(cs) {
  var returnValue = '';

  switch (cs) {
    case 0:
      returnValue = 'ECU Delay';
      break;

    case 1:
      returnValue = 'Engine Stopped';
      break;

    case 2:
      returnValue = 'Controller Standby';
      break;

    case 3:
      returnValue = 'Prestart 1';
      break;

    case 4:
      returnValue = 'Checksafe';
      break;

    case 5:
      returnValue = 'Prestart 2';
      break;

    case 6:
      returnValue = 'Crank on';
      break;

    case 7:
      returnValue = 'Crank Rest';
      break;

    case 8:
      returnValue = 'False Start';
      break;

    case 9:
      returnValue = 'Warmup';
      break;

    case 10:
      returnValue = 'Line Fill 1';
      break;

    case 11:
      returnValue = 'Line Fill 2';
      break;

    case 12:
      returnValue = 'Running';
      break;

    case 13:
      returnValue = 'Cooldown';
      break;

    case 14:
      returnValue = 'Stopping';
      break;

    case 15:
      returnValue = 'Spindown';
      break;

    case 16:
      returnValue = 'Wait To Start';
      break;

    default:
      returnValue = cs;
  }

  return returnValue;
};

var windMachineMPC20ShutdownStatus = function windMachineMPC20ShutdownStatus(sd) {
  var returnArray = [];

  if (sd & Math.pow(2, 0)) {
    returnArray.push('Overspeed SD');
  }

  if (sd & Math.pow(2, 1)) {
    returnArray.push('Underspeed SD');
  }

  if (sd & Math.pow(2, 2)) {
    returnArray.push('Overcrank SD');
  }

  if (sd & Math.pow(2, 3)) {
    returnArray.push('Low Oil Pressure SD');
  }

  if (sd & Math.pow(2, 4)) {
    returnArray.push('High Engine Temp SD');
  }

  if (sd & Math.pow(2, 5)) {
    returnArray.push('Low Fuel SD');
  }

  if (sd & Math.pow(2, 6)) {
    returnArray.push('Low Discharge Pressure SD');
  }

  if (sd & Math.pow(2, 7)) {
    returnArray.push('High Discharge Pressure SD');
  }

  if (sd & Math.pow(2, 8)) {
    returnArray.push('Speed Signal Lost SD');
  }

  if (sd & Math.pow(2, 9)) {
    returnArray.push('Low Lube Level SD');
  }

  if (sd & Math.pow(2, 10)) {
    returnArray.push('Fuel Leak SD');
  }

  if (sd & Math.pow(2, 11)) {
    returnArray.push('Fuel Filter Restriction SD');
  }

  if (sd & Math.pow(2, 12)) {
    returnArray.push('Air Damper Closed SD no');
  }

  if (sd & Math.pow(2, 13)) {
    returnArray.push('Air Filter Restriction SD');
  }

  if (sd & Math.pow(2, 14)) {
    returnArray.push('Oil Filter Restriction SD');
  }

  if (sd & Math.pow(2, 15)) {
    returnArray.push('Remote Stop SD');
  }

  if (sd & Math.pow(2, 16)) {
    returnArray.push('Coolant Level SD');
  }

  if (sd & Math.pow(2, 17)) {
    returnArray.push('High Level SD');
  }

  if (sd & Math.pow(2, 18)) {
    returnArray.push('Low Level SD');
  }

  if (sd & Math.pow(2, 19)) {
    returnArray.push('High Flow SD');
  }

  if (sd & Math.pow(2, 20)) {
    returnArray.push('Low Flow SD');
  }

  if (sd & Math.pow(2, 21)) {
    returnArray.push('High Pump Oil Temp SD');
  }

  if (sd & Math.pow(2, 22)) {
    returnArray.push('High Pump Housing Temp SD');
  }

  if (sd & Math.pow(2, 23)) {
    returnArray.push('Water in Fuel SD');
  }

  if (sd & Math.pow(2, 24)) {
    returnArray.push('Low Suction SD');
  }

  if (sd & Math.pow(2, 25)) {
    returnArray.push('High Suction SD');
  }

  if (sd & Math.pow(2, 26)) {
    returnArray.push('High Engine Oil Pressure SD');
  }

  if (sd & Math.pow(2, 27)) {
    returnArray.push('High Engine Oil Temp SD');
  }

  if (sd & Math.pow(2, 28)) {
    returnArray.push('Low Gear Box Pressure SD');
  }

  if (sd & Math.pow(2, 29)) {
    returnArray.push('High Gear Box Pressure SD');
  }

  if (sd & Math.pow(2, 30)) {
    returnArray.push('Battery Charger Fail SD');
  }

  if (sd & Math.pow(2, 31)) {
    returnArray.push('Red Lamp Status');
  }

  return returnArray;
};

var windMachineMPC20WarningStatus = function windMachineMPC20WarningStatus(wd) {
  var returnArray = [];

  if (wd & Math.pow(2, 0)) {
    returnArray.push('Low Fuel Warn');
  }

  if (wd & Math.pow(2, 1)) {
    returnArray.push('Fuel Leak Warn');
  }

  if (wd & Math.pow(2, 2)) {
    returnArray.push('Fuel Filter Restriction Warn');
  }

  if (wd & Math.pow(2, 3)) {
    returnArray.push('Low Lube Level W arn');
  }

  if (wd & Math.pow(2, 4)) {
    returnArray.push('Coolant Level Warn');
  }

  if (wd & Math.pow(2, 5)) {
    returnArray.push('Water in Fuel Warn');
  }

  if (wd & Math.pow(2, 6)) {
    returnArray.push('No Flow Warn');
  }

  if (wd & Math.pow(2, 7)) {
    returnArray.push('High Engine Oil Temp Warn');
  }

  if (wd & Math.pow(2, 8)) {
    returnArray.push('Low Oil Pressure Warn');
  }

  if (wd & Math.pow(2, 9)) {
    returnArray.push('High Engine Temp Warn');
  }

  if (wd & Math.pow(2, 10)) {
    returnArray.push('High Discharge Pressure Warn');
  }

  if (wd & Math.pow(2, 11)) {
    returnArray.push('Low Discharge Pressure Warn');
  }

  if (wd & Math.pow(2, 12)) {
    returnArray.push('High Suction Warn');
  }

  if (wd & Math.pow(2, 13)) {
    returnArray.push('Low Suction Warn');
  }

  if (wd & Math.pow(2, 14)) {
    returnArray.push('High Level Warn');
  }

  if (wd & Math.pow(2, 15)) {
    returnArray.push('Low Level Warn');
  }

  if (wd & Math.pow(2, 16)) {
    returnArray.push('High Flow Warn');
  }

  if (wd & Math.pow(2, 17)) {
    returnArray.push('Low Flow Warn');
  }

  if (wd & Math.pow(2, 18)) {
    returnArray.push('High Pump Oil Temp Warn');
  }

  if (wd & Math.pow(2, 19)) {
    returnArray.push('High Pump Housing Temp Warn');
  }

  if (wd & Math.pow(2, 20)) {
    returnArray.push('Low Gear Box Pressure Warn');
  }

  if (wd & Math.pow(2, 21)) {
    returnArray.push('High Gear Box Pressure Warn');
  }

  if (wd & Math.pow(2, 22)) {
    returnArray.push('Air Damper Closed Warn');
  }

  if (wd & Math.pow(2, 23)) {
    returnArray.push('Air Filter Restriction Warn');
  }

  if (wd & Math.pow(2, 24)) {
    returnArray.push('Oil Filter Restriction Warn');
  }

  if (wd & Math.pow(2, 25)) {
    returnArray.push('Low Engine Temp Warn');
  }

  if (wd & Math.pow(2, 26)) {
    returnArray.push('High Engine Oil Pressure Warn');
  }

  if (wd & Math.pow(2, 27)) {
    returnArray.push('Battery Charger Fail Warn');
  }

  if (wd & Math.pow(2, 28)) {
    returnArray.push('Run To Destruct Warn');
  }

  if (wd & Math.pow(2, 29)) {
    returnArray.push('Battery High Warn');
  }

  if (wd & Math.pow(2, 30)) {
    returnArray.push('Battery Low Warn');
  }

  if (wd & Math.pow(2, 31)) {
    returnArray.push('Amber Lamp Status');
  }

  return returnArray;
};

var chartDimensions = function chartDimensions(windowWidth) {
  var windowWidthTemp = windowWidth;
  var chartWidth = 288;
  var chartHeight = 288 - 30;

  if (windowWidthTemp >= 600) {
    chartWidth = 614;
    chartHeight = 470;
  } else if (windowWidthTemp >= 375) {
    chartWidth = 350;
    chartHeight = 320;
  }

  chartWidth -= 20;
  chartHeight -= 20;
  return {
    width: "".concat(chartWidth, "px"),
    height: "".concat(chartHeight, "px"),
    widthNumber: chartWidth,
    heightNumber: chartHeight
  };
};

var numberToBinary = function numberToBinary(value, bit) {
  return (value & Math.pow(2, bit)) >>> 0;
};

var numberToBinaryFE = function numberToBinaryFE(value, bit) {
  return numberToBinary(value, bit) ? 'F' : 'E';
};

var numberToBinaryOnOff = function numberToBinaryOnOff(value, bit) {
  return numberToBinary(value, bit) ? 'ON' : 'OFF';
};
/**
 * @param {number} mA value > 0
 * @returns true when value > 5 else false
 */


var mAToBoolean = function mAToBoolean(mA) {
  return isNumber(mA) && Number(mA) > 5;
};
/**
 * @param {number} state value > 0
 * @returns true when value > 5 else false
 */


var stateToBoolean = function stateToBoolean(state) {
  return isNumber(state) && Number(state) >= 9 && Number(state) <= 13;
};
/**
 * @param {any} value - 1/0, true/false, 'string'/'', thing/undefined
 * @returns true when value is truthy.
 */


var toBoolean = function toBoolean(value) {
  if (!value) return false; // matches '', 0, false, undefined

  if (typeof value === 'boolean') return value;
  if (isNumber(value) && Number.isFinite(value)) return !!value;
  if (typeof value === 'string') return !!/^(true|t|on)$/i.test(value);
  return !!value;
};

var gallonsToAcreFeet = function gallonsToAcreFeet(value, precision) {
  var returnValue = 0;

  if (!Number.isNaN(value) && Number(value) > 0) {
    returnValue = round(Number(value) / 325851, precision);
  }

  return returnValue;
};

function litersToUserPreference(value, userPreference, unitType, precision) {
  var returnValue = 0;

  if (!Number.isNaN(value) && Number(value) > 0) {
    if (unitType === 'volume') {
      if (userPreference === 'liters') {
        returnValue = value;
      } else if (userPreference === 'gallons') {
        returnValue = round(Number(value) / 3.78541, precision);
      } else if (userPreference === 'acreInch') {
        returnValue = round(Number(value) / 102790.15313, precision);
      } else if (userPreference === 'cubicFeet') {
        returnValue = round(Number(value) / 28.316846592, precision);
      } else if (userPreference === 'hectareM') {
        returnValue = round(Number(value) / 10000000, precision);
      } else if (userPreference === 'cubicM') {
        returnValue = round(Number(value) / 1000, precision);
      } else {
        returnValue = round(Number(value) / 1233481.8553199936, precision);
      }
    } else if (unitType === 'flow') {
      if (userPreference === 'lpm') {
        returnValue = round(Number(value), precision);
      } else {
        returnValue = round(Number(value) / 3.78541, precision);
      }
    }
  }

  return returnValue;
}
/**
 * Generates the display value for a collection of moisture sensor readings.
 * @param {*} reading
 * @param {*} physical
 * @param {*} multiplier
 * @param {*} precision
 * @param {*} valueKey
 */


var moistureSensor = function moistureSensor(reading, physical, multiplier, precision, valueKey) {
  var total = 0;
  var denominator = 0;
  var keyList;

  if (valueKey && Array.isArray(valueKey) && valueKey.length) {
    keyList = valueKey;
  } else {
    keyList = [];

    for (var i = 1; i <= 16; i++) {
      keyList.push(i);
    }
  }

  keyList.forEach(function (key) {
    var rawValue = reading[key];
    var rawDate = reading["".concat(key, "Date")] || new Date();

    if (isNumber(rawValue) && Date.parse(rawDate) > new Date().getTime() - 86400000) {
      var value = Number(rawValue) / multiplier;

      if (value > 2 && value < 99) {
        total += value;
        denominator += 1;
      }
    }
  });
  if (denominator === 0) return 'ERR';
  var average = total / denominator;

  if (new Date().getTime() - Date.parse(reading['1Date']) > 21600000) {
    // 6 hours
    return 'NC';
  }

  var moistureSensorSettings = physical.moistureSensorSettings || {};
  var moistureCombined = moistureSensorSettings.moistureCombined || {};
  var goalMax = moistureCombined.goalMax || 0;
  var goalMin = moistureCombined.goalMin || 0;

  if (isNumber(goalMax) && Number(goalMax) > 0 && isNumber(goalMin) && Number(goalMin) > 0 && Number(goalMax) > Number(goalMin)) {
    goalMax = Number(goalMax);
    goalMin = Number(goalMin);
  } else {
    return 'NOT\nSET';
  }

  var returnValue = round((average - goalMin) / (goalMax - goalMin) * 100, precision);
  return returnValue;
};
/**
 * Generates the average of a collection of moisture sensor readings.
 * @param {*} reading
 * @param {*} physical
 * @param {*} multiplier
 * @param {*} precision
 * @param {*} valueKey
 */


var soilMoistureSensorAverage = function soilMoistureSensorAverage(reading, physical, multiplier, precision, valueKey) {
  var total = 0;
  var denominator = 0;
  var keyList;

  if (valueKey && Array.isArray(valueKey)) {
    keyList = valueKey;
  } else {
    keyList = [];

    for (var i = 1; i <= 16; i++) {
      keyList.push(i);
    }
  }

  keyList.forEach(function (key) {
    var rawValue = reading[key];

    if (isNumber(rawValue)) {
      var value = Number(rawValue) / multiplier;

      if (value > 10 && value < 99) {
        total += value;
        denominator += 1;
      }
    }
  });
  if (denominator === 0) return undefined;
  var average = round(total / denominator);
  return average;
};
/**
 * Generates the average of a collection of salinity sensor readings.
 * @param {*} reading
 * @param {*} physical
 * @param {*} multiplier
 * @param {*} precision
 * @param {*} valueKey
 */


var soilSalinitySensorAverage = function soilSalinitySensorAverage(reading, physical, multiplier, precision, valueKey) {
  var total = 0;
  var denominator = 0;
  var keyList;

  if (valueKey && Array.isArray(valueKey)) {
    keyList = valueKey;
  } else {
    keyList = [];

    for (var i = 1; i <= 16; i++) {
      keyList.push(i);
    }
  }

  keyList.forEach(function (key) {
    var rawValue = reading[key];

    if (isNumber(rawValue)) {
      var value = Number(rawValue) / multiplier;

      if (value > 10 && value < 99) {
        total += value;
        denominator += 1;
      }
    }
  });
  if (denominator === 0) return undefined;
  var average = round(total / denominator, precision);
  return average;
};
/**
 * Generates the average of a collection of soil temperature readings.
 * @param {*} reading
 * @param {*} physical
 * @param {*} multiplier
 * @param {*} precision
 * @param {*} tempConv
 */


var soilTemperatureSensorAverage = function soilTemperatureSensorAverage(reading, physical, multiplier, precision, valueKey, tempConv) {
  var total = 0;
  var denominator = 0;
  var keyList;

  if (valueKey && Array.isArray(valueKey)) {
    keyList = valueKey;
  } else {
    keyList = [];

    for (var i = 1; i <= 16; i++) {
      keyList.push(i);
    }
  }

  keyList.forEach(function (key) {
    var rawValue = reading[key];

    if (isNumber(rawValue)) {
      var value = Number(rawValue) / multiplier;

      if (value > 10 && value < 99) {
        total += value;
        denominator += 1;
      }
    }
  });
  if (denominator === 0) return undefined;
  var average = total / denominator;
  var returnResult = round(tempConv === 'f' ? cToF(average) : average, precision);
  return returnResult;
};

var windDirection = function windDirection(wd) {
  if (wd > 360 || wd < 0) {
    return 'ERR';
  }

  var dir = 'ERR';

  if (wd < 0 || wd > 360) {
    // eslint-disable-next-line no-console
    console.error('Enter a degree between 0 and 360 degrees.');
  } else if (wd >= 0 && wd <= 11.25) {
    dir = 'N';
  } else if (wd > 348.75 && wd <= 360) {
    dir = 'N';
  } else if (wd > 11.25 && wd <= 33.75) {
    dir = 'NNE';
  } else if (wd > 33.75 && wd <= 56.25) {
    dir = 'NE';
  } else if (wd > 56.25 && wd <= 78.75) {
    dir = 'ENE';
  } else if (wd > 78.75 && wd <= 101.25) {
    dir = 'E';
  } else if (wd > 101.25 && wd <= 123.75) {
    dir = 'ESE';
  } else if (wd > 123.75 && wd <= 146.25) {
    dir = 'SE';
  } else if (wd > 146.25 && wd <= 168.75) {
    dir = 'SSE';
  } else if (wd > 168.75 && wd <= 191.25) {
    dir = 'S';
  } else if (wd > 191.25 && wd <= 213.75) {
    dir = 'SSW';
  } else if (wd > 213.75 && wd <= 236.25) {
    dir = 'SW';
  } else if (wd > 236.25 && wd <= 258.75) {
    dir = 'WSW';
  } else if (wd > 258.75 && wd <= 281.25) {
    dir = 'W';
  } else if (wd > 281.25 && wd <= 303.75) {
    dir = 'WNW';
  } else if (wd > 303.75 && wd <= 326.25) {
    dir = 'NW';
  } else if (wd > 326.25 && wd <= 348.75) {
    dir = 'NNW';
  }

  return dir;
};

function valueCalculator(formula, value, context, unitType, userPreference, precision) {
  var returnValue = value;

  switch (formula) {
    case 'valveStatus':
      returnValue = valveStatus(value);
      break;

    case 'valveStatusString':
      returnValue = valveStatusString(value);
      break;

    case 'fromC':
    case 'temperature':
      returnValue = fromC(value, context.tempConv, precision);
      break;

    case 'temperatureF':
      returnValue = fromC(value, 'f', precision);
      break;

    case 'temperatureC':
      returnValue = fromC(value, 'c', precision);
      break;

    case 'percentToCentibar':
      returnValue = percentToCentibar(value);
      break;

    case 'percentToVWC':
      returnValue = percentToVWC(value);
      break;

    case 'metersPerSecondToMilesPerHour':
      returnValue = metersPerSecondToMilesPerHour(value, precision);
      break;

    case 'windDirection':
      returnValue = windDirection(value);
      break;

    case 'mAToBoolean':
      returnValue = mAToBoolean(value);
      break;

    case 'stateToBoolean':
      returnValue = stateToBoolean(value);
      break;

    case 'toBoolean':
      returnValue = toBoolean(value);
      break;

    case 'millimetersToInches':
      returnValue = millimetersToInches(value, precision);
      break;

    case 'kilometersToMiles':
      returnValue = kilometersToMiles(value, precision);
      break;

    case 'kPaToInchesMercury':
      returnValue = kPaToInchesMercury(value, precision);
      break;

    case 'analogToCentibar':
      returnValue = analogToCentibar(value);
      break;

    case 'analogToVWC':
      returnValue = analogToVWC(value);
      break;

    case 'analogToDigitalInverseString':
      returnValue = analogToDigitalInverse(value) === 1 ? 'ON' : 'OFF';
      break;

    case 'percentToDigitalInverseString':
      returnValue = percentToDigitalInverse(value) === 1 ? 'ON' : 'OFF';
      break;

    case 'analogToDigitalInverse':
      returnValue = analogToDigitalInverse(value);
      break;

    case 'percentToDigitalInverse':
      returnValue = percentToDigitalInverse(value);
      break;

    case 'analogToDigitalString':
      returnValue = analogToDigital(value) === 1 ? 'ON' : 'OFF';
      break;

    case 'percentToDigitalString':
      returnValue = percentToDigital(value) === 1 ? 'ON' : 'OFF';
      break;

    case 'percentToDigitalStringFullEmpty':
      returnValue = percentToDigital(value) === 1 ? 'FULL' : 'EMP';
      break;

    case 'lowPercentToDigital':
      returnValue = percentToDigital(value + 0.3);
      break;

    case 'lowPercentToDigitalString':
      returnValue = percentToDigital(value + 0.3) === 1 ? 'ON' : 'OFF';
      break;

    case 'analogToDigital':
      returnValue = analogToDigital(value);
      break;

    case 'percentToDigital':
      returnValue = percentToDigital(value);
      break;

    case 'pumpState':
      returnValue = pumpState(value);
      break;

    case 'autoSwitchAnalog':
      returnValue = autoSwitchAnalog(value);
      break;

    case 'autoSwitchMPC20':
      returnValue = autoSwitchMPC20(value);
      break;

    case 'rpmOrchardRiteAutometer9117':
      returnValue = rpmOrchardRiteAutometer9117(value);
      break;

    case 'powerGood':
      returnValue = powerGood(value);
      break;

    case 'gallonsToAcreFeet':
      returnValue = gallonsToAcreFeet(value, precision);
      break;

    case 'litersToUserPreference':
      returnValue = litersToUserPreference(value, userPreference, unitType, precision);
      break;

    case 'flowMeterState':
      returnValue = flowMeterState(value);
      break;

    case 'cellSignalToRssi':
      returnValue = cellSignalToRssi(value);
      break;

    case 'cellSignalToQuality':
      returnValue = cellSignalToQuality(value);
      break;

    case 'numberToBinary0':
      returnValue = numberToBinary(value, 0);
      break;

    case 'numberToBinary1':
      returnValue = numberToBinary(value, 1);
      break;

    case 'numberToBinary2':
      returnValue = numberToBinary(value, 2);
      break;

    case 'numberToBinary3':
      returnValue = numberToBinary(value, 3);
      break;

    case 'numberToBinary4':
      returnValue = numberToBinary(value, 4);
      break;

    case 'numberToBinary5':
      returnValue = numberToBinary(value, 5);
      break;

    case 'numberToBinary6':
      returnValue = numberToBinary(value, 6);
      break;

    case 'numberToBinary7':
      returnValue = numberToBinary(value, 7);
      break;

    case 'numberToBinaryFE0':
      returnValue = numberToBinaryFE(value, 0);
      break;

    case 'numberToBinaryFE1':
      returnValue = numberToBinaryFE(value, 1);
      break;

    case 'numberToBinaryFE2':
      returnValue = numberToBinaryFE(value, 2);
      break;

    case 'numberToBinaryFE3':
      returnValue = numberToBinaryFE(value, 3);
      break;

    case 'numberToBinaryFE4':
      returnValue = numberToBinaryFE(value, 4);
      break;

    case 'numberToBinaryFE5':
      returnValue = numberToBinaryFE(value, 5);
      break;

    case 'numberToBinaryFE6':
      returnValue = numberToBinaryFE(value, 6);
      break;

    case 'numberToBinaryFE7':
      returnValue = numberToBinaryFE(value, 7);
      break;

    case 'numberToBinaryOnOff0':
      returnValue = numberToBinaryOnOff(value, 0);
      break;

    case 'numberToBinaryOnOff1':
      returnValue = numberToBinaryOnOff(value, 1);
      break;

    case 'numberToBinaryOnOff2':
      returnValue = numberToBinaryOnOff(value, 2);
      break;

    case 'numberToBinaryOnOff3':
      returnValue = numberToBinaryOnOff(value, 3);
      break;

    case 'numberToBinaryOnOff4':
      returnValue = numberToBinaryOnOff(value, 4);
      break;

    case 'numberToBinaryOnOff5':
      returnValue = numberToBinaryOnOff(value, 5);
      break;

    case 'numberToBinaryOnOff6':
      returnValue = numberToBinaryOnOff(value, 6);
      break;

    case 'numberToBinaryOnOff7':
      returnValue = numberToBinaryOnOff(value, 7);
      break;

    default:
      returnValue = round(value, precision);
  }

  return returnValue;
}

var displayFormula = function displayFormula(formula, multiplier, precision, context, _valueKey, readingCurrent, readingLast, physical, mapValues) {
  var ERROR = 'ERR';

  var isInvalidReading = function isInvalidReading(x) {
    return x === 4294967295 || x === 65535 || x === -32768 || !isNumber(x);
  };

  var returnValue;
  var valueKey = _valueKey;

  if (typeof _valueKey === 'string' && (_valueKey.startsWith('[') || _valueKey.startsWith('{'))) {
    valueKey = JSON.parse(_valueKey);
  }

  switch (_typeof(valueKey)) {
    case 'number':
    case 'string':
      returnValue = readingCurrent[valueKey];
      if (isInvalidReading(returnValue)) return ERROR;
      break;

    case 'object':
      break;

    default:
      return ERROR;
  }

  var multiplierValue = 1;

  if (multiplier) {
    multiplierValue = multiplier;
  }

  var precisionValue = 0;

  if (precision) {
    precisionValue = precision;
  }

  var formulaValue = formula;
  var formulaValueSecondary = '';

  if (formula && formula.substr(formula.length - 'Rolling'.length) === 'Rolling') {
    formulaValue = 'rolling';
    formulaValueSecondary = formula.substr(0, formula.length - 'Rolling'.length);
  }

  var physicalValue = {};

  if (physical && _typeof(physical) === 'object') {
    physicalValue = physical;
  }

  switch (formulaValue) {
    case 'difference':
      {
        var valueKey0 = valueKey[0];
        var valueKey1 = valueKey[1];
        var value0;
        var value1;

        if (_typeof(valueKey0) === 'object') {
          value0 = valueCalculator(valueKey0.formula, readingCurrent[valueKey0.valueKey] / (valueKey0.multiplier || 1), valueKey0.context || '', valueKey0.precision || 0);
          value1 = valueCalculator(valueKey1.formula, readingCurrent[valueKey1.valueKey] / (valueKey1.multiplier || 1), valueKey1.context || '', valueKey1.precision || 0);
        } else {
          value0 = valueCalculator(formula, readingCurrent[valueKey0] / multiplierValue, context, precisionValue);
          value1 = valueCalculator(formula, readingCurrent[valueKey1] / multiplierValue, context, precisionValue);
        }

        if (isNumber(value0) && isNumber(value1)) {
          returnValue = Math.abs(value0 - value1);
        } else {
          returnValue = 'ERR';
        }
      }
      break;

    case 'toBoolean':
      returnValue = toBoolean(readingCurrent[valueKey] / multiplierValue);
      break;

    case 'mAToBoolean':
      returnValue = mAToBoolean(readingCurrent[valueKey] / multiplierValue);
      break;

    case 'stateToBoolean':
      returnValue = stateToBoolean(readingCurrent[valueKey] / multiplierValue);
      break;

    case 'percentToDigitalStringAND':
      returnValue = 'ON';

      if (Array.isArray(valueKey)) {
        returnValue = valueKey.reduce(function (acc, key) {
          var output = percentToDigital(readingCurrent[key] / multiplierValue) === 1 ? 'ON' : 'OFF';
          if (output === 'OFF') return output;
          return acc;
        }, 'OFF');
      } else {
        returnValue = 'OFF';
      }

      break;

    case 'percentToDigitalStringOR':
      returnValue = 'OFF';

      if (Array.isArray(valueKey)) {
        returnValue = valueKey.reduce(function (acc, key) {
          var output = percentToDigital(readingCurrent[key] / multiplierValue) === 1 ? 'ON' : 'OFF';
          if (output === 'ON') return output;
          return acc;
        }, 'OFF');
      } else {
        returnValue = 'OFF';
      }

      break;

    case 'binLevel':
      returnValue = binLevel(readingCurrent['131'], readingLast['131'], physicalValue.debounce, physicalValue.powered, physicalValue.bins);
      break;

    case 'pumpOutput':
      {
        var flowTime = 132;

        if (physicalValue.flowTimestampKey) {
          flowTime = physicalValue.flowTimestampKey;
        }

        returnValue = pumpOutput(readingCurrent[valueKey], readingLast[valueKey], readingCurrent[flowTime] || readingCurrent.date, readingLast[flowTime] || readingLast.date, multiplierValue);
      }
      break;

    case 'flowRate':
      {
        var _flowTime = 132;

        if (physicalValue.flowTimestampKey) {
          _flowTime = physicalValue.flowTimestampKey;
        }

        if (physicalValue.unitsPerPulse) {
          multiplierValue = 1 / Number(physicalValue.unitsPerPulse);
        } else if (physicalValue.pulseMultiplier) {
          multiplierValue = Number(physicalValue.pulseMultiplier);
        }

        returnValue = pumpOutput(readingCurrent[valueKey], readingLast[valueKey], readingCurrent[_flowTime] || readingCurrent.date, readingLast[_flowTime] || readingLast.date, multiplierValue);
      }
      break;

    case 'flowRateLiters':
      {
        var _flowTime2 = 132;

        if (physicalValue.flowTimestampKey) {
          _flowTime2 = physicalValue.flowTimestampKey;
        }

        if (physicalValue.unitsPerPulse) {
          multiplierValue = 1 / Number(physicalValue.unitsPerPulse);
        } else if (physicalValue.pulseMultiplier) {
          multiplierValue = Number(physicalValue.pulseMultiplier);
        }

        var flowUnit = 'gallons';

        if (physicalValue.flowUnits) {
          flowUnit = physicalValue.flowUnits;
        }

        if (flowUnit === 'gallons') {
          multiplierValue /= 3.78541;
        }

        returnValue = pumpOutput(readingCurrent[valueKey], readingLast[valueKey], readingCurrent[_flowTime2] || readingCurrent.date, readingLast[_flowTime2] || readingLast.date, multiplierValue);
      }
      break;

    case 'flowCumulative':
      {
        var _flowTime3 = 132;

        if (physicalValue.flowTimestampKey) {
          _flowTime3 = physicalValue.flowTimestampKey;
        }

        if (physicalValue.unitsPerPulse) {
          multiplierValue = Number(physicalValue.unitsPerPulse);
        } else if (physicalValue.pulseMultiplier) {
          multiplierValue = 1 / Number(physicalValue.pulseMultiplier);
        }

        returnValue = pulseDiff(readingCurrent[valueKey], readingLast[valueKey], readingCurrent[_flowTime3] || readingCurrent.date, readingLast[_flowTime3] || readingLast.date);
        returnValue *= multiplierValue;
      }
      break;

    case 'flowCumulativeLiters':
      {
        var _flowTime4 = 132;

        if (physicalValue.flowTimestampKey) {
          _flowTime4 = physicalValue.flowTimestampKey;
        }

        if (physicalValue.unitsPerPulse) {
          multiplierValue = Number(physicalValue.unitsPerPulse);
        } else if (physicalValue.pulseMultiplier) {
          multiplierValue = 1 / Number(physicalValue.pulseMultiplier);
        }

        var _flowUnit = 'gallons';

        if (physicalValue.flowUnits) {
          _flowUnit = physicalValue.flowUnits;
        }

        if (_flowUnit === 'gallons') {
          multiplierValue *= 3.78541;
        }

        returnValue = pulseDiff(readingCurrent[valueKey], readingLast[valueKey], readingCurrent[_flowTime4] || readingCurrent.date, readingLast[_flowTime4] || readingLast.date);
        returnValue *= multiplierValue;
      }
      break;

    case 'temperatureAutoDecimal':
      returnValue = fromC(readingCurrent[valueKey] / multiplierValue, context.tempConv);

      if (returnValue < 10 && returnValue > -10) {
        precisionValue = 1;
      } else {
        precisionValue = 0;
      }

      break;

    case 'fuelLevel':
      {
        var fuelTankSize = 5.0;

        if (physicalValue && physicalValue.fuelTankSize) {
          fuelTankSize = physicalValue.fuelTankSize;
        }

        var fuelSensorRange = 5.557;

        if (physicalValue && physicalValue.fuelSensorRange) {
          fuelSensorRange = physicalValue.fuelSensorRange;
        } // 0.25V is based on the Rochester R3D-LP + 5V from ISBD
        // 0.25V = 5% * 5V


        var fuelSensorMinV = 0.25; // based on the Rochester R3D-LP Gauge

        if (physicalValue && physicalValue.fuelSensorMinV) {
          fuelSensorMinV = physicalValue.fuelSensorMinV;
        } // 4.6V is based on the Rochester R3D-LP + 5V + Experience with Zirkle
        // Rochester says 80% of in voltage is max, so 5V * 80% = 4V
        // But @ Zirkle, some gauges show 4.6V, and look like they are working


        var fuelSensorMaxV = 4.6; // based on the Rochester R3D-LP Gauge

        if (physicalValue && physicalValue.fuelSensorMaxV) {
          fuelSensorMaxV = physicalValue.fuelSensorMaxV;
        }

        var fuelSensorVCal = 5.557;

        if (physicalValue && physicalValue.fuelSensorVCal) {
          fuelSensorVCal = physicalValue.fuelSensorVCal;
        }

        if (readingCurrent[valueKey] * fuelSensorVCal > fuelSensorMaxV) {
          returnValue = 'Error High';
        } else if (readingCurrent[valueKey] * fuelSensorVCal < fuelSensorMinV) {
          returnValue = 'Not Connected';
        } else {
          returnValue = round(fuelLevel(readingCurrent[valueKey] / multiplierValue, fuelTankSize, fuelSensorRange));
        }
      }
      break;

    case 'fourToTwenty':
      returnValue = fourToTwenty(readingCurrent[valueKey] / multiplierValue, physicalValue.min || 0, physicalValue.max || 100, physicalValue.zero || 0, physicalValue.precision || 0);
      break;

    case 'fourToTwentySD1':
      returnValue = fourToTwenty(readingCurrent[valueKey] / multiplierValue, physicalValue.minSD1 || 0, physicalValue.maxSD1 || 100, physicalValue.zeroSD1 || 0, physicalValue.precisionSD1 || 0, 2.048);
      break;

    case 'fourToTwentySD2':
      returnValue = fourToTwenty(readingCurrent[valueKey] / multiplierValue, physicalValue.minSD2 || 0, physicalValue.maxSD2 || 100, physicalValue.zeroSD2 || 0, physicalValue.precisionSD2 || 0, 2.048);
      break;

    case 'current4To20':
      if (valueKey === 'AN1') {
        returnValue = map(readingCurrent[valueKey] / multiplierValue, physicalValue.anIn1SigMin || 4, physicalValue.anIn1SigMax || 20, physicalValue.anIn1Min || 0, physicalValue.anIn1Max || 100);
        if (returnValue < physicalValue.anIn1Min) returnValue = physicalValue.anIn1Min;
        if (returnValue > physicalValue.anIn1Max) returnValue = physicalValue.anIn1Max;
      } else if (valueKey === 'AN2') {
        returnValue = map(readingCurrent[valueKey] / multiplierValue, physicalValue.anIn2SigMin || 4, physicalValue.anIn2SigMax || 20, physicalValue.anIn2Min || 0, physicalValue.anIn2Max || 100);
        if (returnValue < physicalValue.anIn2Min) returnValue = physicalValue.anIn2Min;
        if (returnValue > physicalValue.anIn2Max) returnValue = physicalValue.anIn2Max;
      } else if (valueKey === 'R1F') {
        returnValue = map(readingCurrent[valueKey] / multiplierValue, physicalValue.r1FSigMin || 4, physicalValue.r1FSigMax || 20, physicalValue.r1FMin || 0, physicalValue.r1FMax || 100);
        if (returnValue < physicalValue.r1FMin) returnValue = physicalValue.r1FMin;
        if (returnValue > physicalValue.r1FMax) returnValue = physicalValue.r1FMax;
      } else if (valueKey === 'R2F') {
        returnValue = map(readingCurrent[valueKey] / multiplierValue, physicalValue.r2FSigMin || 4, physicalValue.r2FSigMax || 20, physicalValue.r2FMin || 0, physicalValue.r2FMax || 100);
        if (returnValue < physicalValue.r2FMin) returnValue = physicalValue.r2FMin;
        if (returnValue > physicalValue.r2FMax) returnValue = physicalValue.r2FMax;
      }

      break;

    case 'voltage0To10':
      if (valueKey === 'AN1') {
        returnValue = map(readingCurrent[valueKey] / multiplierValue, physicalValue.anIn1SigMin || 0, physicalValue.anIn1SigMax || 10, physicalValue.anIn1Min || 0, physicalValue.anIn1Max || 100);
        if (returnValue < physicalValue.anIn1Min) returnValue = physicalValue.anIn1Min;
        if (returnValue > physicalValue.anIn1Max) returnValue = physicalValue.anIn1Max;
      } else if (valueKey === 'AN2') {
        returnValue = map(readingCurrent[valueKey] / multiplierValue, physicalValue.anIn2SigMin || 0, physicalValue.anIn2SigMax || 10, physicalValue.anIn2Min || 0, physicalValue.anIn2Max || 100);
        if (returnValue < physicalValue.anIn2Min) returnValue = physicalValue.anIn2Min;
        if (returnValue > physicalValue.anIn2Max) returnValue = physicalValue.anIn2Max;
      } else if (valueKey === 'R1F') {
        returnValue = map(readingCurrent[valueKey] / multiplierValue, physicalValue.r1FSigMin || 0, physicalValue.r1FSigMax || 10, physicalValue.r1FMin || 0, physicalValue.r1FMax || 100);
        if (returnValue < physicalValue.r1FMin) returnValue = physicalValue.r1FMin;
        if (returnValue > physicalValue.r1FMax) returnValue = physicalValue.r1FMax;
      } else if (valueKey === 'R2F') {
        returnValue = map(readingCurrent[valueKey] / multiplierValue, physicalValue.r2FSigMin || 0, physicalValue.r2FSigMax || 10, physicalValue.r2FMin || 0, physicalValue.r2FMax || 100);
        if (returnValue < physicalValue.r2FMin) returnValue = physicalValue.r2FMin;
        if (returnValue > physicalValue.r2FMax) returnValue = physicalValue.r2FMax;
      } else {
        returnValue = map(readingCurrent[valueKey] / multiplierValue, physicalValue.inSigMin || 0, physicalValue.inSigMax || 10, physicalValue.inMin || 0, physicalValue.inMax || 100);
        if (returnValue < physicalValue.inMin) returnValue = physicalValue.inMin;
        if (returnValue > physicalValue.inMax) returnValue = physicalValue.inMax;
      }

      break;

    case 'closure':
      returnValue = mAToBoolean(readingCurrent[valueKey]);
      break;

    case 'rpmToState':
      returnValue = rpmToState(readingCurrent[valueKey] / multiplierValue, physicalValue.offRpm, physicalValue.highRpm);
      break;

    case 'percentTo20V':
      returnValue = percentTo20V(readingCurrent[valueKey] / multiplierValue, precision, physicalValue.batteryExternalCalibrationResistor1 || 1800, physicalValue.batteryExternalCalibrationResistor2 || 10000, physicalValue.batteryExternalCalibrationVoltageReference || 3.3);
      break;

    case 'dewPoint':
      returnValue = dewPoint(readingCurrent['128'], readingCurrent[valueKey] / multiplierValue);
      returnValue = fromC(returnValue, context.tempConv, precisionValue);
      break;

    case 'moistureSensor':
      returnValue = moistureSensor(readingCurrent, physicalValue, multiplierValue, precisionValue, valueKey);
      break;

    case 'soilMoistureSensorAverage':
      returnValue = soilMoistureSensorAverage(readingCurrent, physicalValue, multiplierValue, precisionValue, valueKey) || ERROR;
      break;

    case 'soilSalinitySensorAverage':
      returnValue = soilSalinitySensorAverage(readingCurrent, physicalValue, multiplierValue, precisionValue, valueKey) || ERROR;
      break;

    case 'soilTemperatureSensorAverageC':
      returnValue = soilTemperatureSensorAverage(readingCurrent, physicalValue, multiplierValue, precisionValue, valueKey, 'c') || ERROR;
      break;

    case 'soilTemperatureSensorAverageF':
      returnValue = soilTemperatureSensorAverage(readingCurrent, physicalValue, multiplierValue, precisionValue, valueKey, 'f') || ERROR;
      break;

    case 'startMode':
      returnValue = readingCurrent[valueKey] ? 'AUTO' : 'MANUAL';
      break;

    case 'cellularSignalToBars':
      returnValue = cellSignalToBars(cellSignalToRssi(readingCurrent[valueKey]), physicalValue.cellularStrengthType, cellSignalToQuality(readingCurrent[valueKey]), physicalValue.cellularQualityType, physicalValue.cellularAccessTechnologyDetail);
      break;

    case 'millisecondsPastExpectedConnection':
      returnValue = millisecondsPastExpectedConnection(readingCurrent.date, readingCurrent['135']);
      break;

    case 'rolling':
      returnValue = valueCalculator(formulaValueSecondary, readingCurrent[valueKey] / multiplierValue, context);
      returnValue += valueCalculator(formulaValueSecondary, readingLast[valueKey] / multiplierValue, context);
      returnValue /= 2;
      break;

    default:
      returnValue = valueCalculator(formula, readingCurrent[valueKey] / multiplierValue, context);
  }

  if (mapValues && _typeof(mapValues) === 'object' && isNumber(mapValues.inMin) && isNumber(mapValues.inMax) && isNumber(mapValues.outMin) && isNumber(mapValues.outMax)) {
    returnValue = map(returnValue, mapValues.inMin, mapValues.inMax, mapValues.outMin, mapValues.outMax);
  }

  if (isNumber(returnValue) && !(typeof returnValue === 'string' && returnValue.includes('/'))) {
    returnValue = round(returnValue, precisionValue);
  }

  return returnValue;
};
/**
 * Pads a value with 0.
 * @param {int} value to be padded.
 * @param {int} size
 * @returns {string} padded with leading zeros up to size.
 */


var pad = function pad(value, size) {
  var s = String(value);

  while (s.length < (size || 2)) {
    s = "0".concat(s);
  }

  return s;
};
/**
 * @param {int} hr
 * @param {int} min
 * @returns {string} 'hh:mm'
 */


var formatTime = function formatTime(hr, min) {
  return "".concat(pad(hr), ":").concat(pad(min));
};

var scheduleStartDecode = function scheduleStartDecode(value) {
  return value >> 16 >>> 0;
};

var scheduleStopDecode = function scheduleStopDecode(value) {
  return (value & 0xFFFF) >>> 0;
};

var scheduleEncode = function scheduleEncode(start, stop) {
  return start << 16 >>> 0 | (stop & 0xFFFF) >>> 0;
};
/**
 * @param {int} value in minutes from start of week.
 * @returns event time as binary representation.
 */


var scheduleRing = function scheduleRing(value) {
  var LIMIT = 10080;
  var result = value;

  if (result >= LIMIT) {
    result -= LIMIT;
  } else if (result < 0) {
    result += LIMIT;
  }

  if (result < 0 || result >= LIMIT) {
    throw new Error("Input value invalid: ".concat(value));
  }

  return result & 0xFFFF;
};
/**
 * Join 2 scheduled events if they overlap.
 * @param {int} nStart - minutes from start of week
 * @param {int} nStop - minutes from start of week
 * @param {int} oStart - minutes from start of week
 * @param {int} oStop - minutes from start of week
 * @returns {Event} - undefined if no overlap
 */


var scheduleRingUnion = function scheduleRingUnion(_nStart, _nStop, _oStart, _oStop) {
  var MINUTES_MAXIMUM = 7 * 24 * 60;

  var isInvalid = function isInvalid(value) {
    return value < 0 || value > MINUTES_MAXIMUM;
  };

  var oStart = _oStart;
  var oStop = _oStop;
  var nStart = _nStart;
  var nStop = _nStop;
  if (isInvalid(nStart)) throw new Error("Invalid nStart: ".concat(nStart));
  if (isInvalid(nStop)) throw new Error("Invalid nStop: ".concat(nStop));
  if (isInvalid(oStart)) throw new Error("Invalid oStart: ".concat(oStart));
  if (isInvalid(oStop)) throw new Error("Invalid oStop: ".concat(oStop));
  if (nStart > nStop) nStop += MINUTES_MAXIMUM;
  if (oStart > oStop) oStop += MINUTES_MAXIMUM;

  var shiftRelative = function shiftRelative(stop, value) {
    return stop - MINUTES_MAXIMUM > value ? value + MINUTES_MAXIMUM : value;
  };

  oStart = shiftRelative(nStop, oStart);
  oStop = shiftRelative(nStop, oStop);
  nStart = shiftRelative(oStop, nStart);
  nStop = shiftRelative(oStop, nStop);

  var isBetween = function isBetween(value, low, high) {
    return value >= low && value <= high;
  };

  var result;

  if (isBetween(nStart, oStart, oStop) || isBetween(oStart, nStart, nStop)) {
    result = {
      start: scheduleRing(Math.min(nStart, oStart)),
      stop: scheduleRing(Math.max(nStop, oStop))
    };
  }

  return result;
};
/**
 * Insert a new scheduled event into an array of schedule Events.
 * @param {Array.<Event>} scheduleEvents
 * @param {int} dayStart
 * @param {int} hourStart
 * @param {int} minStart
 * @param {int} dayStop
 * @param {int} hourStop
 * @param {int} minStop
 * @param {int} utcDifferenceMinutes
 */


var insertTime = function insertTime(scheduleEvents, dayStart, hourStart, minStart, dayStop, hourStop, minStop, utcDifferenceMinutes) {
  if (!Array.isArray(scheduleEvents)) throw new Error('Invalid scheduleEvents array');

  var isOutOfRange = function isOutOfRange(x, low, high) {
    return x < low || x > high;
  };

  var isInvalid = function isInvalid(x, high) {
    return isOutOfRange(x, 0, high);
  };

  if (isInvalid(dayStart, 6)) throw new Error("Invalid dayStart: ".concat(dayStart));
  if (isInvalid(dayStop, 6)) throw new Error("Invalid dayStop: ".concat(dayStop));
  if (isInvalid(hourStart, 23)) throw new Error("Invalid hourStart: ".concat(hourStart));
  if (isInvalid(hourStop, 23)) throw new Error("Invalid hourStop: ".concat(hourStop));
  if (isInvalid(minStart, 59)) throw new Error("Invalid minStart: ".concat(minStart));
  if (isInvalid(minStop, 59)) throw new Error("Invalid minStop: ".concat(minStop));
  if (isOutOfRange(utcDifferenceMinutes, -840, 720)) throw new Error("Invalid utcDifferenceMinutes: ".concat(utcDifferenceMinutes)); // create our start minutes value

  var start = dayStart * 24 * 60;
  start += hourStart * 60;
  start += minStart; // create our stop minutes value

  var stop = dayStop * 24 * 60;
  stop += hourStop * 60;
  stop += minStop; // adjust for UTC

  start += utcDifferenceMinutes;
  stop += utcDifferenceMinutes; // limit to between 0 and HIGH_LIMIT

  start = scheduleRing(start);
  stop = scheduleRing(stop); // create array for the new schedule

  var result = [];

  if (scheduleEvents.length < 1) {
    // no previous scheduleEvents, so nothing to de-dupe
    result.push(scheduleEncode(start, stop));
  } else {
    // the rest of this is to de-dupe intervals
    var newStart = start;
    var newStop = stop; // loop through old schedule and figure out where to put new value

    scheduleEvents.map(function (schedEvent) {
      var oldStart = scheduleStartDecode(schedEvent);
      var oldStop = scheduleStopDecode(schedEvent);
      var intervalCombined = false; // check if the intervals overlap

      var ringUnion = scheduleRingUnion(newStart, newStop, oldStart, oldStop);

      if (ringUnion) {
        newStart = ringUnion.start;
        newStop = ringUnion.stop;
        intervalCombined = true;
      }

      if (!intervalCombined) {
        // if there was no overlap, insert our old values into the array
        oldStart = scheduleRing(oldStart);
        oldStop = scheduleRing(oldStop);
        result.push(scheduleEncode(oldStart, oldStop));
      }

      return 1;
    }); // don't do this until the end or we will get dupe values

    newStart = scheduleRing(newStart);
    newStop = scheduleRing(newStop);
    result.push(scheduleEncode(newStart, newStop));
  } // sort for consistency


  result.sort(function (a, b) {
    return a - b;
  });
  return result;
};
/**
 * Convert schedule Event to time object.
 * @param {Event} schedEvent
 * @param {int} offset
 * @param {int} key
 * @returns {Time}
 */


var decodeTime = function decodeTime(schedEvent, offset, _key) {
  var key = 0;

  if (_key) {
    key = _key;
  }

  var ONE_WEEK = 7 * 24 * 60;
  var start = scheduleRing(scheduleStartDecode(schedEvent) - offset);
  var stop = scheduleRing(scheduleStopDecode(schedEvent) - offset);
  var positiveStop = stop;
  if (start > stop) positiveStop = stop + ONE_WEEK;

  var DAY = function DAY(date) {
    return Math.floor(date / (24 * 60));
  };

  var HOUR = function HOUR(date) {
    return Math.floor(date / 60) - DAY(date) * 24;
  };

  var MINUTE = function MINUTE(date) {
    return date % 60;
  };

  var dayStart = DAY(start);
  var hrStart = HOUR(start);
  var minStart = MINUTE(start);
  var dayStop = DAY(stop);
  var hrStop = HOUR(stop);
  var minStop = MINUTE(stop); // put our basic calculated values in place

  var timesDecoded = {
    start: {
      day: dayStart,
      hr: hrStart,
      min: minStart,
      human: ''
    },
    stop: {
      day: dayStop,
      hr: hrStop,
      min: minStop,
      human: ''
    },
    duration: {
      hrs: Math.round((positiveStop - start) / 60),
      mins: positiveStop - start,
      size: positiveStop - start > 4 * 60 ? 1 : 0,
      cross: false,
      crossWeek: false
    },
    human: ''
  };
  if (Number(key) || Number(key) === 0) timesDecoded.key = Number(key); // determine if it crosses an end of day

  timesDecoded.duration.cross = dayStart !== dayStop && dayStart <= dayStop;
  timesDecoded.duration.crossWeek = dayStart > dayStop; // write out our human readable values

  var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  var HUMAN = function HUMAN(x) {
    return "".concat(daysOfWeek[x.day], " ").concat(x.hr > 12 ? x.hr - 12 : x.hr, ":").concat(pad(x.min)).concat(x.hr >= 12 ? ' PM' : ' AM');
  };

  var humanStart = HUMAN(timesDecoded.start);
  var humanStop = HUMAN(timesDecoded.stop);
  timesDecoded.start.human = humanStart;
  timesDecoded.stop.human = humanStop;
  timesDecoded.human = "Start: ".concat(humanStart, ", Stop: ").concat(humanStop, " (").concat(schedEvent, ")"); // calculate if a scheduled item lasts 7 days, as this item is wonky

  var sevenDay = dayStart === dayStop && hrStart > hrStop; // calculate number of days we are running for

  if (dayStart <= dayStop && !sevenDay) {
    timesDecoded.duration.days = dayStop - dayStart;
  } else {
    timesDecoded.duration.days = dayStop + 7 - dayStart; // cross is always true if start > stop or we have 7 day run

    timesDecoded.duration.cross = true;
  }

  return timesDecoded;
};
/**
 * Insert a new scheduled event into an array of schedule Events.
 * @param {int} scheduleEvents
 * @param {int} dayStart
 * @param {int} hourStart
 * @param {int} minStart
 * @param {int} duration - minutes
 * @param {int} utcDifferenceMinutes - UTC offset
 */


var insertTimeDuration = function insertTimeDuration(scheduleEvents, dayStart, hourStart, minStart, duration, utcDifferenceMinutes) {
  // create our start minutes value
  var start = dayStart * 24 * 60;
  start += hourStart * 60;
  start += minStart;
  var stop = start + duration; // 0 for UTC offset, due to this doubling up on offset.

  var decoded = decodeTime(scheduleEncode(start, stop), 0);
  return insertTime(scheduleEvents, decoded.start.day, decoded.start.hr, decoded.start.min, decoded.stop.day, decoded.stop.hr, decoded.stop.min, utcDifferenceMinutes);
};
/**
 * @param {Array.<Event>} schedule
 * @param {int} offset - UTC offset
 * @returns {Array.<Event>}
 */


var decodeScheduleUI = function decodeScheduleUI(schedule, _offset) {
  var offset = 0;

  if (_offset) {
    offset = _offset;
  }

  if (schedule && Array.isArray(schedule) && schedule.length) {
    var answers = [];

    for (var i = 0; i < schedule.length; i++) {
      var event = schedule[i];
      var answer = decodeTime(event, offset, i);
      var durationDays = answer.duration && answer.duration.days;
      var dayStart = answer.start && answer.start.day;
      var hrStart = answer.start && answer.start.hr;
      var dayStop = answer.stop && answer.stop.day;

      if (dayStart <= dayStop && durationDays !== 7) {
        answers.push(answer);
      } else {
        // if a multi-day run, we need to split for our UI
        var answer2 = JSON.parse(JSON.stringify(answer));
        var SATURDAY = 6;
        var SUNDAY = 0;
        answer.stop.day = SATURDAY;
        answer.duration.days = SATURDAY - dayStart;
        answer2.start.day = SUNDAY;
        answer2.duration.days = answer2.stop.day;

        if (dayStart === SATURDAY) {
          answer.duration.size = 24 - hrStart >= 4 ? 1 : 0;
          answer.duration.cross = false;
        }

        if (dayStop === SUNDAY) {
          answer2.duration.size = answer2.stop.hr >= 4 ? 1 : 0;
          answer2.duration.cross = false;
        }

        answers.push(answer, answer2);
      }
    }

    return answers;
  }

  return undefined;
};

module.exports = {
  analogToCentibar: analogToCentibar,
  analogToDigital: analogToDigital,
  analogToDigitalInverse: analogToDigitalInverse,
  analogToVWC: analogToVWC,
  binLevel: binLevel,
  cToF: cToF,
  cellSignalToRssi: cellSignalToRssi,
  cellSignalToQuality: cellSignalToQuality,
  cellSignalToBars: cellSignalToBars,
  chartDimensions: chartDimensions,
  decodeScheduleUI: decodeScheduleUI,
  decodeTime: decodeTime,
  displayFormula: displayFormula,
  engineStateCalculator: engineStateCalculator,
  flowMeterState: flowMeterState,
  formatTime: formatTime,
  fourToTwenty: fourToTwenty,
  fromC: fromC,
  fromCMultiplier: fromCMultiplier,
  fToC: fToC,
  ftToM: ftToM,
  fuelLevel: fuelLevel,
  gallonsToAcreFeet: gallonsToAcreFeet,
  litersToUserPreference: litersToUserPreference,
  insertTime: insertTime,
  insertTimeDuration: insertTimeDuration,
  isNumber: isNumber,
  splitTemplate: splitTemplate,
  kilometersToMiles: kilometersToMiles,
  kPaToInchesMercury: kPaToInchesMercury,
  lastValveTime: lastValveTime,
  lastValveTimeToEpochMillis: lastValveTimeToEpochMillis,
  lineFit: lineFit,
  map: map,
  mAToBoolean: mAToBoolean,
  stateToBoolean: stateToBoolean,
  metersPerSecondToMilesPerHour: metersPerSecondToMilesPerHour,
  millimetersToInches: millimetersToInches,
  moistureSensor: moistureSensor,
  mToFt: mToFt,
  nextValveTime: nextValveTime,
  nextValveTimeToEpochMillis: nextValveTimeToEpochMillis,
  numberMap: numberMap,
  numberToBinary: numberToBinary,
  numberToBinaryFE: numberToBinaryFE,
  numberToBinaryOnOff: numberToBinaryOnOff,
  pad: pad,
  percentTo20V: percentTo20V,
  percentToCentibar: percentToCentibar,
  percentToDigital: percentToDigital,
  percentToDigitalInverse: percentToDigitalInverse,
  percentToVWC: percentToVWC,
  pumpOutput: pumpOutput,
  pumpState: pumpState,
  round: round,
  rpmOrchardRiteAutometer9117: rpmOrchardRiteAutometer9117,
  rpmToState: rpmToState,
  scheduleRing: scheduleRing,
  scheduleRingUnion: scheduleRingUnion,
  secondsToHHMMSS: secondsToHHMMSS,
  soilMoistureSensorAverage: soilMoistureSensorAverage,
  soilSalinitySensorAverage: soilSalinitySensorAverage,
  soilTemperatureSensorAverage: soilTemperatureSensorAverage,
  spaceCamel: spaceCamel,
  toBoolean: toBoolean,
  toC: toC,
  toValveTime: toValveTime,
  valveStatus: valveStatus,
  valveStatusString: valveStatusString,
  valveTimeToDate: valveTimeToDate,
  valveTimeToEpoch: valveTimeToEpoch,
  valveTimeToEpochMillis: valveTimeToEpochMillis,
  valveTimeToValveNumber: valveTimeToValveNumber,
  voltToCentibar: voltToCentibar,
  voltToVWC: voltToVWC,
  windDirection: windDirection,
  windMachineChangeStatus: windMachineChangeStatus,
  windMachineCommunicationStatus: windMachineCommunicationStatus,
  windMachineEngineState: windMachineEngineState,
  windMachineMPC20ShutdownStatus: windMachineMPC20ShutdownStatus,
  windMachineMPC20WarningStatus: windMachineMPC20WarningStatus
};