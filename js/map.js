'use strict';

window.map = (function () {
  var MAX_PINS = 5;

  var mapElement = document.querySelector('.map');
  var pinHolder = document.querySelector('.map__pins');
  var isPageActive = false;

  var updatePins = function (pinList) {
    var oldPins = pinHolder.querySelectorAll('.map__pin:not(.map__pin--main)');
    oldPins.forEach(function (oldPin) {
      oldPin.remove();
    });

    var newPins = document.createDocumentFragment();
    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    pinList.forEach(function (pinData, i) {
      if (i >= MAX_PINS) {
        return;
      }

      var pin = newPins.appendChild(window.pin.make(pinTemplate.cloneNode(true), pinData));
      pin.addEventListener('click', function () {
        window.card.open(pinData);
      });
    });
    pinHolder.appendChild(newPins);
    window.card.close();
  };

  var updateAddress = function () {
    var coords = {
      x: parseInt(window.pin.master.style.left, 10),
      y: parseInt(window.pin.master.style.top, 10)
    };

    coords.x += Math.round(window.pin.MasterPin.SIZE / 2);

    if (isPageActive) {
      coords.y += window.pin.MasterPin.SIZE;
      coords.y += window.pin.MasterPin.PILLAR_HEIGHT;
    } else {
      coords.y += Math.round(window.pin.MasterPin.SIZE / 2);
    }

    window.form.setAddress(coords.x + ', ' + coords.y);
  };

  var activatePage = function () {
    mapElement.classList.remove('map--faded');
    window.form.activate();
    window.filter.activate();
    window.pin.setAddressUpdateCallback(updateAddress);
    isPageActive = true;
  };

  var deactivatePage = function () {
    mapElement.classList.add('map--faded');
    window.filter.deactivate();
    isPageActive = false;
  };

  window.pin.master.addEventListener('click', function () {
    if (!isPageActive) {
      activatePage();
    }
    updateAddress();
  });

  window.pin.master.addEventListener('mousedown', function (evt) {
    if (window.util.isMouseLeftPressed(evt)) {
      activatePage();
    }
  });

  window.data.load(updatePins, window.popup.error);
  window.form.setDeactivationCallback(deactivatePage);
  window.form.deactivate();
  window.filter.deactivate();
  window.filter.addPinHandler(window.util.debounce(updatePins));
  updateAddress();
})();
