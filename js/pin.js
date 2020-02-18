'use strict';

window.pin = (function () {
  var Pin = {
    WIDTH: 50,
    HEIGHT: 70
  };
  var MasterPin = {
    SIZE: 65,
    PILLAR_HEIGHT: 20
  };
  var Boundary = {
    TOP: 130,
    RIGHT: document.querySelector('.map').offsetWidth,
    BOTTOM: 630,
    LEFT: 0
  };

  var master = document.querySelector('.map__pin--main');
  var addressUpdateCallback = null;
  var masterDefaultLeft = parseInt(master.style.left, 10);
  var masterDefaultTop = parseInt(master.style.top, 10);

  var make = function (pinElement, pinData) {
    var pinImage = pinElement.querySelector('img');
    pinElement.style.left = pinData.location.x - Pin.WIDTH / 2 + 'px';
    pinElement.style.top = pinData.location.y - Pin.HEIGHT + 'px';
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

      if (master.offsetLeft - delta.x <= Boundary.LEFT) {
        master.style.left = Boundary.LEFT + 'px';
      } else if (master.offsetLeft - delta.x >= (Boundary.RIGHT - MasterPin.SIZE)) {
        master.style.left = (Boundary.RIGHT - MasterPin.SIZE) + 'px';
      } else {
        master.style.left = (master.offsetLeft - delta.x) + 'px';
      }

      if (master.offsetTop - delta.y <= Boundary.TOP - MasterPin.SIZE - MasterPin.PILLAR_HEIGHT) {
        master.style.top = (Boundary.TOP - MasterPin.SIZE - MasterPin.PILLAR_HEIGHT) + 'px';
      } else if (master.offsetTop - delta.y >= Boundary.BOTTOM - MasterPin.SIZE - MasterPin.PILLAR_HEIGHT) {
        master.style.top = (Boundary.BOTTOM - MasterPin.SIZE - MasterPin.PILLAR_HEIGHT) + 'px';
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
    MasterPin: MasterPin,
    make: make,
    master: master,
    setAddressUpdateCallback: setAddressUpdateCallback,
    resetMasterPosition: resetMasterPosition
  };
})();
