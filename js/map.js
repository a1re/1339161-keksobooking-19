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

  window.data.load(placePins, window.popup.error);
  window.form.setDeactivationCallback(deactivatePage);
  window.form.deactivate();
  window.filter.deactivate();
  updateAddress();
})();
