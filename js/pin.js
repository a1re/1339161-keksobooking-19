'use strict';

window.pin = (function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var MASTER_PIN_SIZE = 65;
  var MASTER_PIN_PILLAR_SIZE = 20;

  var master = document.querySelector('.map__pin--main');
  var addressUpdateCallback = null;
  var masterDefaultLeft = parseInt(master.style.left, 10);
  var masterDefaultTop = parseInt(master.style.top, 10);

  var make = function (pinElement, pinData) {
    var pinImage = pinElement.querySelector('img');
    pinElement.style.left = pinData.location.x - PIN_WIDTH / 2 + 'px';
    pinElement.style.top = pinData.location.y - PIN_HEIGHT + 'px';
    pinImage.src = pinData.author.avatar;
    pinImage.alt = pinData.offer.title;
    return pinElement;
  };

  var setAddressUpdateCallback = function (callback) {
    addressUpdateCallback = callback;
  };

  var resetMasterPosition = function () {
    master.style.left = masterDefaultLeft + 'px';
    master.style.top = masterDefaultTop + 'px';

    if (typeof addressUpdateCallback === 'function') {
      addressUpdateCallback();
    }
  };

  var updateMasterPosition = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var delta = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY,
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      if (master.offsetLeft - delta.x <= window.data.BOUNDARIES.LEFT) {
        master.style.left = window.data.BOUNDARIES.LEFT + 'px';
      } else if (master.offsetLeft - delta.x >= (window.data.BOUNDARIES.RIGHT - MASTER_PIN_SIZE)) {
        master.style.left = (window.data.BOUNDARIES.RIGHT - MASTER_PIN_SIZE) + 'px';
      } else {
        master.style.left = (master.offsetLeft - delta.x) + 'px';
      }

      if (master.offsetTop - delta.y <= window.data.BOUNDARIES.TOP - MASTER_PIN_SIZE - MASTER_PIN_PILLAR_SIZE) {
        master.style.top = (window.data.BOUNDARIES.TOP - MASTER_PIN_SIZE - MASTER_PIN_PILLAR_SIZE) + 'px';
      } else if (master.offsetTop - delta.y >= window.data.BOUNDARIES.BOTTOM - MASTER_PIN_SIZE - MASTER_PIN_PILLAR_SIZE) {
        master.style.top = (window.data.BOUNDARIES.BOTTOM - MASTER_PIN_SIZE - MASTER_PIN_PILLAR_SIZE) + 'px';
      } else {
        master.style.top = (master.offsetTop - delta.y) + 'px';
      }

      if (typeof addressUpdateCallback === 'function') {
        addressUpdateCallback();
      }
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  master.addEventListener('mousedown', updateMasterPosition);

  return {
    MASTER_PIN_SIZE: MASTER_PIN_SIZE,
    MASTER_PIN_PILLAR_SIZE: MASTER_PIN_PILLAR_SIZE,
    make: make,
    master: master,
    setAddressUpdateCallback: setAddressUpdateCallback,
    resetMasterPosition: resetMasterPosition
  };
})();
