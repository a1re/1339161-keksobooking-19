'use strict';

window.filter = (function () {
  var updatePins = null;
  var housingTypeElement = document.querySelector('#housing-type');
  var ANY_HOUSUNG_TYPE = 'any';

  var deactivate = function () {
    var fieldsList = document.querySelectorAll('.map__filters select, .map__filters fieldset');
    fieldsList.forEach(function (field) {
      field.disabled = true;
    });
  };

  var activate = function () {
    var fieldsList = document.querySelectorAll('.map__filters select, .map__filters fieldset');
    fieldsList.forEach(function (field) {
      field.disabled = false;
    });
  };

  var addPinHandler = function (pinHandler) {
    updatePins = pinHandler;
  };

  var housingTypeChangeHandler = function (housingTypeEvt) {
    var selectedType = housingTypeEvt.currentTarget.value;
    var filteredPins = window.data.pins.filter(function (pinData) {
      return selectedType === pinData.offer.type || selectedType === ANY_HOUSUNG_TYPE;
    });

    if (typeof updatePins === 'function') {
      updatePins(filteredPins);
    }
  };

  housingTypeElement.addEventListener('change', housingTypeChangeHandler);

  return {
    deactivate: deactivate,
    activate: activate,
    addPinHandler: addPinHandler
  };
})();
