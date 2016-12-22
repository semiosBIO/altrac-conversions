// index.js
var moment = require('moment');

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
      decimalPlaces = 1;
  }
  return Math.round(n * decimalPlaces) / decimalPlaces;
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
  } else if (v >= 0.1 && v < 1.1) {
    return ((10 * v) - 1);
  } else if (v >= 1.1 && v < 1.3) {
    return ((25 * v) - 17.5);
  } else if (v >= 1.3 && v < 1.82) {
    return ((48.04 * v) - 47.5);
  } else if (v >= 1.82 && v <= 3) { // went to 3, since this is suppsoedly the max
    return ((26.32 * v) - 7.89);
  } else {
    return 'ERR';
  }
};
var percentToVWC = function percentToVWC(p) {
  var v = (p) * 5;
  return voltToVWC(v);
};
var analogToVWC = function analogToVWC(a) {
  var v = (a / 1023) * 5;
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
  return (percentToDigital(a) === 1 ? 0 : 1);
};
var analogToDigitalInverse = function analogToDigitalInverse(a) {
  return (analogToDigital(a) === 1 ? 0 : 1);
};

var voltToCentibar = function voltToCentibar(v) {
  var centibar = 'ERR';
  if (v < 0) {
    centibar = 'VLO';
  } else if (v >= 0 && v <= 3.1) {
    centibar = (1 / 0.0117155) * v;
  } else {
    centibar = 'VHI';
  }
  return round(centibar, 0);
};
var percentToCentibar = function percentToCentibar(p) {
  var v = (p) * 5;
  return voltToCentibar(v);
};
var analogToCentibar = function analogToCentibar(a) {
  var v = (a / 1023) * 5;
  return voltToCentibar(v);
};

var numberMap = function numberMap(value, inMin, inMax, outMin, outMax) {
  return (((value - inMin) * (outMax - outMin)) / (inMax - inMin)) + outMin;
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
  return (c * 1.8) + 32;
};

var fToC = function fToC(f) {
  return (f - 32) / 1.8;
};

var cellSignalToRssi = function cellSignalToRssi(signal) {
  return signal >>> 8;
};
var cellSignalToQuality = function cellSignalToQuality(signal) {
  return signal & 0xFF >>> 0;
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

var valveTimeToEpoch = function valveTimeToEpoch(valveTime) {
  return (Number(valveTime) & 0xFFFFFFF) * 60;
};
var valveTimeToEpochMillis = function valveTimeToEpochMillis(valveTime) {
  return (Number(valveTime) & 0xFFFFFFF) * 60 * 1000;
};

var valveTimeToPretty = function valveTimeToPretty(valveTime) {
  return moment(valveTimeToEpochMillis(valveTime)).format('M/D h:mmA');
};

var valveTimeToDate = function valveTimeToDate(valveTime) {
  return (new Date(valveTimeToEpochMillis(valveTime)));
};

var nextValveTime = function nextValveTime(valveTimeArr) {
  var returnValue = [0, 0];
  if (valveTimeArr) {
    for (var i = 0; i < valveTimeArr.length; i += 1) {
      if (
        valveTimeToEpochMillis(valveTimeArr[i]) < (new Date().getTime()) &&
        valveTimeToEpochMillis(valveTimeArr[i + 1]) < (new Date().getTime())
      ) {
        // nothing to do here
        i += 1;
      } else {
        returnValue[0] = valveTimeArr[i];
        returnValue[1] = valveTimeArr[i += 1];
        break;
      }
    }
  }
  return returnValue;
};

var nextValveTimeToPretty = function nextValveTimeToPretty(valveTimeArr) {
  var nextTimes = nextValveTime(valveTimeArr);
  var returnValue = ['---', '---'];

  if (nextTimes[0] !== 0) {
    returnValue[0] = valveTimeToPretty(nextTimes[0]);
  }
  if (nextTimes[1] !== 0) {
    returnValue[1] = valveTimeToPretty(nextTimes[1]);
  }
  // console.log({ nextValveTimeToPretty: {
  //   valveTimeArr,
  //   nextTimes,
  //   returnValue,
  // } });
  return returnValue;
};

var nextValveTimeToEpochMillis = function nextValveTimeToEpochMillis(valveTimeArr) {
  var nextTimes = nextValveTime(valveTimeArr);
  var returnValue = [0, 0];
  returnValue[0] = valveTimeToEpochMillis(nextTimes[0]);
  returnValue[1] = valveTimeToEpochMillis(nextTimes[1]);
  return returnValue;
};

var toValveTime = function toValveTime(state, valve, epoch) {
  var statePrep = (state << 31) >>> 0;
  var valvePrep = (valve << 28) >>> 0;
  var epochPrep = epoch / 60;
  var returnVal = (statePrep | valvePrep | epochPrep) >>> 0;
  return returnVal;
};

var secondsToHHMMSS = function secondsToHHMMSS(totalSeconds) {
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
  var seconds = totalSeconds - (hours * 3600) - (minutes * 60);
  var result = '';

  // round seconds
  seconds = Math.round(seconds * 100) / 100;

  result += hours > 0 ? `${hours} hours, ` : '';
  result += minutes > 0 ? `${minutes} minutes, ` : '';
  result += seconds > 0 ? `${seconds} seconds` : '';

  return result;
};

var percentTo20V = function percentTo20V(p) {
  return round(p * (1 / (1800 / (1800 + 10000))) * 3.3);
};

var fourToTwenty = function fourToTwenty(p, min, max) {
  return round(
    (((((p * 3.34) / 100) * 1000) - 4) * (max - min)) / (20 - 4)
  );
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
  var currentTime = (new Date()).getTime();
  var sleepInterval = (sleepTime * 1000);

  if (!sleepTime || sleepTime === 0) {
    sleepInterval = (60 * 10 * 1000) + 20000; // checks in every ten minutes, max
  }

  var nextSeen = new Date(
    (new Date(lastConnection).getTime() + sleepInterval)
  ).getTime();

  if (nextSeen < currentTime) {
    return (currentTime - nextSeen);
  }
  return 0;
}

var spaceCamel = function spaceCamel(s) {
  return s.replace(/([A-Z])/g, ' $1').replace(/^./, function(str) { return str.toUpperCase(); });
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

var pumpOutput = function pumpOutput(gallonsPerPulse, currentTime, lastTime) {
  var current = new Date(currentTime).getTime();
  var previous = new Date(lastTime).getTime();
  var diffMinutes = (current - previous) / 1000 / 60;
  return Math.round(gallonsPerPulse / diffMinutes);
};

var binLevel = function binLevel(
  binLevelCurrent,
  binLevelLast,
  debounce,
  powered,
  numberOfBins
) {
  var fullness = 0;
  if (binLevelCurrent === binLevelLast) {
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
    if ((fullness & Math.pow(2, (i - 1))) === Math.pow(2, (i - 1))) {
      numberFull += 1;
    } else {
      numberFull += 0;
    }
  }
  return `${numberFull}/${totalBins}`;
};

var chartDimensions = function chartDimensions() {
  var windowWidth = $(window).width();
  var chartWidth = 288;
  if (windowWidth >= 472) {
    chartWidth = 464;
  } else if (windowWidth >= 415) {
    chartWidth = windowWidth - 8;
  } else if (windowWidth >= 375) {
    chartWidth = 346;
  }
  var chartHeight = chartWidth - 30;
  return ({
    width: chartWidth,
    height: chartHeight,
  });
};

function valueCalculator(
  formula,
  value,
  context,
  precision
) {
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
    case 'percentTo20V':
      returnValue = percentTo20V(value);
      break;
    case 'percentToCentibar':
      returnValue = percentToCentibar(value);
      break;
    case 'percentToVWC':
      returnValue = percentToVWC(value);
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
      returnValue = (analogToDigital(value) === 1) ? 'ON' : 'OFF';
      break;
    case 'percentToDigitalString':
      returnValue = (percentToDigital(value) === 1) ? 'ON' : 'OFF';
      break;
    case 'lowPercentToDigital':
      returnValue = percentToDigital(value + 0.3);
      break;
    case 'lowPercentToDigitalString':
      returnValue = (percentToDigital((value) + 0.3) === 1) ? 'ON' : 'OFF';
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
    case 'flowMeterState':
      returnValue = flowMeterState(value);
      break;
    case 'cellSignalToRssi':
      returnValue = cellSignalToRssi(value);
      break;
    case 'cellSignalToQuality':
      returnValue = cellSignalToQuality(value);
      break;
    default:
      returnValue = round(value);
  }
  return returnValue;
}

var displayFormula = function displayFormula(
  formula,
  multiplier,
  precision,
  context,
  valueKey,
  readingCurrent,
  readingLast,
  physical
) {
  // console.log({
  //   displayFormula_inputs: {
  //     formula,
  //     multiplier,
  //     context,
  //     valueKey,
  //     readingCurrent,
  //     readingLast,
  //     physical,
  //   },
  // });
  var returnValue = readingCurrent[valueKey];
  var multiplierValue = 1;
  if (multiplier) { multiplierValue = multiplier; }
  var precisionValue = 0;
  if (precision) { precisionValue = precision; }

  var formulaValue = formula;
  var formulaValueSecondary = '';
  if (formula.substr(formula.length - ('Rolling').length) === 'Rolling') {
    formulaValue = 'rolling';
    formulaValueSecondary = formula.substr(0, formula.length - ('Rolling').length);
  }

  switch (formulaValue) {
    case 'binLevel':
      returnValue = binLevel(
        readingCurrent['131'],
        readingLast['131'],
        physical.debounce,
        physical.powered,
        physical.bins
      );
      break;
    case 'pumpOutput':
      returnValue = pumpOutput(
        readingCurrent[valueKey] / multiplierValue,
        readingCurrent.date,
        readingLast.date
      );
      break;
    case 'fuelLevel':
      var fuelTankSize = 3;
      if (physical && physical.fuelTankSize) {
        fuelTankSize = physical.fuelTankSize;
      }
      var fuelSensorRange = 6.56;
      if (physical && physical.fuelSensorRange) {
        fuelSensorRange = physical.fuelSensorRange;
      }
      returnValue = round(fuelLevel(
        readingCurrent[valueKey] / multiplierValue,
        fuelTankSize,
        fuelSensorRange
      ));
      break;
    case 'millisecondsPastExpectedConnection':
      returnValue = millisecondsPastExpectedConnection(
        readingCurrent.date,
        readingCurrent['135']
      );
      break;
    case 'rolling' :
      returnValue = valueCalculator(
        formulaValueSecondary,
        readingCurrent[valueKey] / multiplierValue,
        context,
        precisionValue
      );
      returnValue += valueCalculator(
        formulaValueSecondary,
        readingLast[valueKey] / multiplierValue,
        context,
        precisionValue
      );
      returnValue = (returnValue / 2);
      break;
    default:
      returnValue = valueCalculator(
        formula,
        readingCurrent[valueKey] / multiplierValue,
        context,
        precisionValue
      );
  }
  return returnValue;
};

module.exports = {
  round,
  voltToVWC,
  percentToVWC,
  analogToVWC,
  percentToDigital,
  analogToDigital,
  percentToDigitalInverse,
  analogToDigitalInverse,
  voltToCentibar,
  percentToCentibar,
  analogToCentibar,
  numberMap,
  valveStatus,
  valveStatusString,
  cToF,
  fToC,
  fromC,
  fromCMultiplier,
  toC,
  valveTimeToEpoch,
  valveTimeToEpochMillis,
  valveTimeToPretty,
  valveTimeToDate,
  nextValveTime,
  nextValveTimeToPretty,
  nextValveTimeToEpochMillis,
  toValveTime,
  secondsToHHMMSS,
  percentTo20V,
  fourToTwenty,
  fuelLevel,
  ftToM,
  mToFt,
  spaceCamel,
  pumpState,
  flowMeterState,
  pumpOutput,
  binLevel,
  chartDimensions,
  displayFormula,
  cellSignalToRssi,
  cellSignalToQuality
};