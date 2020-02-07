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

  var makeDraggable = function (draggableElement) {

    draggableElement.addEventListener('mousedown', function (evt) {
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

        draggableElement.style.left = (draggableElement.offsetLeft - delta.x) + 'px';
        draggableElement.style.top = (draggableElement.offsetTop - delta.y) + 'px';
      };

      var mouseUpHandler = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    });
  };

  return {
    make: make,
    master: master,
    getMasterPosition: getMasterPosition,
    getMasterAddress: getMasterAddress,
    makeDraggable: makeDraggable
  };
})();
