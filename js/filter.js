'use strict';

window.filter = (function () {
  var CANCEL_FILTER_SELECTOR_VALUE = 'any';

  var updatePins = null;
  var PriceBoundary = {
    LOW: 10000,
    HIGH: 50000
  };
  var checkboxFilters = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var selectorFilters = [
    {
      name: 'housing-type',
      filter: function (selectedValue, pinData) {
        return selectedValue === pinData.offer.type;
      }
    },
    {
      name: 'housing-price',
      filter: function (selectedValue, pinData) {
        switch (selectedValue) {
          case 'middle':
            return (pinData.offer.price >= PriceBoundary.LOW && pinData.offer.price <= PriceBoundary.HIGH);
          case 'low':
            return (pinData.offer.price < PriceBoundary.LOW);
          case 'high':
            return (pinData.offer.price > PriceBoundary.HIGH);
          default:
            return true;
        }
      }
    },
    {
      name: 'housing-rooms',
      filter: function (selectedValue, pinData) {
        return parseInt(selectedValue, 10) === parseInt(pinData.offer.rooms, 10);
      }
    },
    {
      name: 'housing-guests',
      filter: function (selectedValue, pinData) {
        return parseInt(selectedValue, 10) === parseInt(pinData.offer.guests, 10);
      }
    },
  ];
  var filtersForm = document.querySelector('.map__filters-container');

  var filters = [];

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

  var addFilter = function (name, selectedValue, filter) {
    removeFilter(name);
    filters.push({
      name: name,
      selectedValue: selectedValue,
      executeFilter: filter
    });
  };

  var removeFilter = function (name) {
    for (var i = 0; i < filters.length; i++) {
      if (filters[i].name === name) {
        filters.splice(i, 1);
        return;
      }
    }
  };

  var applyFilters = function () {
    var filteredPins = window.data.pins.filter(function (pinData) {
      for (var i = 0; i < filters.length; i++) {
        if (!filters[i].executeFilter(filters[i].selectedValue, pinData)) {
          return false;
        }
      }
      return true;
    });
    if (typeof updatePins === 'function') {
      updatePins(filteredPins);
    }
  };

  checkboxFilters.forEach(function (featureName) {
    var checkboxElement = filtersForm.querySelector('#filter-' + featureName);
    checkboxElement.addEventListener('change', function (evt) {
      if (evt.currentTarget.checked) {
        addFilter(featureName, featureName, function (selectedValue, pinData) {
          return (pinData.offer.features.indexOf(selectedValue) >= 0);
        });
      } else {
        removeFilter(featureName);
      }
      applyFilters();
    });
  });

  selectorFilters.forEach(function (feature) {
    var selectorElement = filtersForm.querySelector('#' + feature.name);
    selectorElement.addEventListener('change', function (evt) {
      if (evt.currentTarget.value !== CANCEL_FILTER_SELECTOR_VALUE) {
        addFilter(feature.name, evt.currentTarget.value, feature.filter);
      } else {
        removeFilter(feature.name);
      }
      applyFilters();
    });
  });

  return {
    deactivate: deactivate,
    activate: activate,
    addPinHandler: addPinHandler
  };
})();
