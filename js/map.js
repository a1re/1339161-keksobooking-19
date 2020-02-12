'use strict';

window.map = (function () {
  var mapElement = document.querySelector('.map');
  var isPageActive = false;

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

  var updateAddress = function () {
    var coords = {
      x: parseInt(window.pin.master.style.left, 10),
      y: parseInt(window.pin.master.style.top, 10)
    };

    coords.x += Math.round(window.pin.MASTER_PIN_SIZE / 2);

    if (isPageActive) {
      coords.y += window.pin.MASTER_PIN_SIZE;
      coords.y += window.pin.MASTER_PIN_PILLAR_SIZE;
    } else {
      coords.y += Math.round(window.pin.MASTER_PIN_SIZE / 2);
    }

    window.form.setAddress(coords.x + ', ' + coords.y);
  };

  var activatePage = function () {
    mapElement.classList.remove('map--faded');
    window.form.activate();
    filters.activate();
    window.pin.setAddressUpdateCallback(updateAddress);
    isPageActive = true;
  };

  window.pin.master.addEventListener('click', function () {
    activatePage();
  });

  window.pin.master.addEventListener('mousedown', function (evt) {
    if (window.util.isMouseLeftPressed(evt)) {
      activatePage();
    }
  });

  placePins(window.data.getPins(8));

  window.form.deactivate();
  filters.deactivate();
  updateAddress();
})();
