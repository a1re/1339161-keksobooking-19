'use strict';

window.map = (function () {
  var mapElement = document.querySelector('.map');

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

  var activatePage = function () {
    mapElement.classList.remove('map--faded');
    window.form.activate();
    filters.activate();
    window.form.updateAddress(window.pin.getMasterAddress(true));
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
  window.form.updateAddress(window.pin.getMasterAddress(false));
  filters.deactivate();
})();
