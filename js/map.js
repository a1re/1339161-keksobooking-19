'use strict';

window.map = (function () {
  var MAIN_PIN_SIZE = 65;
  var MAIN_PIN_PILLAR_SIZE = 20;

  var mapElement = document.querySelector('.map');
  var mainPin = mapElement.querySelector('.map__pin--main');

  var placePins = function (pinList) {
    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var allPins = document.createDocumentFragment();
    for (var i = 0; i < pinList.length; i++) {
      var pin = allPins.appendChild(window.pin.make(pinTemplate.cloneNode(true), pinList[i]));
      pin.dataset.id = i;
      pin.addEventListener('click', function (evt) {
        window.card.open(pinList[evt.currentTarget.dataset.id]);
      });
    }
    document.querySelector('.map__pins').appendChild(allPins);
  };

  var filters = {
    deactivate: function () {
      var filtersList = document.querySelectorAll('.map__filters select, .map__filters fieldset');
      for (var i = 0; i < filtersList.length; i++) {
        filtersList[i].disabled = true;
      }
    },
    activate: function () {
      var filtersList = document.querySelectorAll('.map__filters select, .map__filters fieldset');
      for (var i = 0; i < filtersList.length; i++) {
        filtersList[i].disabled = false;
      }
    }
  };

  var getMainPinPosition = function () {
    var coords = {
      x: parseInt(mainPin.style.left, 10),
      y: parseInt(mainPin.style.top, 10)
    };
    coords.x += Math.round(MAIN_PIN_SIZE / 2);

    if (mapElement.classList.contains('map--faded')) {
      coords.y += Math.round(MAIN_PIN_SIZE / 2);
    } else {
      coords.y += MAIN_PIN_SIZE;
      coords.y += MAIN_PIN_PILLAR_SIZE;
    }

    return coords;
  };

  var getMainPinAddress = function () {
    var coords = getMainPinPosition();
    return coords.x + ', ' + coords.y;
  };

  var activatePage = function () {
    mapElement.classList.remove('map--faded');
    window.form.activate();
    filters.activate();
    window.form.updateAddress(getMainPinAddress());
  };

  mainPin.addEventListener('click', function () {
    activatePage();
  });

  mainPin.addEventListener('mousedown', function (evt) {
    if (window.util.isMouseLeftPressed(evt)) {
      activatePage();
    }
  });

  placePins(window.data.getPins(8));

  window.form.deactivate();
  window.form.updateAddress(getMainPinAddress());
  filters.deactivate();
})();
