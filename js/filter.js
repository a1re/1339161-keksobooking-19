'use strict';

window.filter = (function () {
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

  return {
    deactivate: deactivate,
    activate: activate
  };
})();
