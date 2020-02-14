'use strict';

window.util = (function () {
  var ESC_KEYCODE = 27;
  var MOUSE_MAIN_BUTTON = 0;

  var getNaturalRandom = function (min, max) {
    var randomInt = min + Math.random() * (max + 1 - min);
    return Math.floor(randomInt);
  };

  var getRandomValueFromArray = function (array) {
    var i = getNaturalRandom(0, array.length - 1);
    return array[i];
  };

  var tossArray = function (arraySize, values) {
    if (arraySize >= values.length) {
      return values;
    }

    var tossedArray = [];
    for (var i = 0; i < arraySize; i++) {
      var pick = getRandomValueFromArray(values);
      if (tossedArray.indexOf(pick) >= 0) {
        i--;
      } else {
        tossedArray.push(pick);
      }
    }
    return tossedArray;
  };

  var pickWordByInt = function (n, wordforms) {
    var lastDigit = parseInt(n.toString().slice(-2), 10);
    if (lastDigit > 10 && lastDigit < 15) {
      return wordforms[2];
    }
    lastDigit = parseInt(n.toString().slice(-1), 10);
    if (lastDigit === 1) {
      return wordforms[0];
    } else if (lastDigit > 1 && lastDigit < 5) {
      return wordforms[1];
    }
    return wordforms[2];
  };

  return {
    isEscPressed: function (evt) {
      return (evt.keyCode === ESC_KEYCODE) ? true : false;
    },
    isMouseLeftPressed: function (evt) {
      return (evt.button === MOUSE_MAIN_BUTTON) ? true : false;
    },
    capitlizeFirstLetter: function (string) {
      return (string.length > 0) ? (string[0].toUpperCase() + string.slice(1)) : '';
    },
    getNaturalRandom: getNaturalRandom,
    getRandomValueFromArray: getRandomValueFromArray,
    tossArray: tossArray,
    pickWordByInt: pickWordByInt
  };
})();
