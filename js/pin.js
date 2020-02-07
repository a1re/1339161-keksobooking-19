'use strict';

window.pin = (function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var MASTER_PIN_SIZE = 65;
  var MASTER_PIN_PILLAR_SIZE = 20;

  var master = document.querySelector('.map__pin--main');

  var make = function (pinElement, pinData) {
    var pinImage = pinElement.querySelector('img');
    pinElement.style.left = pinData.location.x - PIN_WIDTH / 2 + 'px';
    pinElement.style.top = pinData.location.y - PIN_HEIGHT + 'px';
    pinImage.src = pinData.author.avatar;
    pinImage.alt = pinData.offer.title;
    return pinElement;
  };

  var getMasterPosition = function (usePillar) {
    var coords = {
      x: parseInt(master.style.left, 10),
      y: parseInt(master.style.top, 10)
    };
    coords.x += Math.round(MASTER_PIN_SIZE / 2);

    if (usePillar) {
      coords.y += MASTER_PIN_SIZE;
      coords.y += MASTER_PIN_PILLAR_SIZE;
    } else {
      coords.y += Math.round(MASTER_PIN_SIZE / 2);
    }

    return coords;
  };

  var getMasterAddress = function (usePillar) {
    var coords = getMasterPosition(usePillar);
    return coords.x + ', ' + coords.y;
  };

  return {
    make: make,
    master: master,
    getMasterPosition: getMasterPosition,
    getMasterAddress: getMasterAddress
  };
})();
