'use strict';

window.form = (function () {
  var SAVE_FORM_URL = '//js.dump.academy/keksobooking';
  var SAVE_FORM_LOADING_MESSAGE = 'Публикация...';
  var SAVE_FORM_DEFAULT_MESSAGE = 'Опубликовать';
  var MAX_ROOMS = 100;
  var MIN_CAPACITY = 0;
  var CAPACITY_ERROR_MESSAGE = 'Гостям будет некомфортно';

  var adForm = document.querySelector('.ad-form');
  var capacitySelector = adForm.querySelector('#capacity');
  var roomNumberSelector = adForm.querySelector('#room_number');
  var typeSelector = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var timeinSelector = adForm.querySelector('#timein');
  var timeoutSelector = adForm.querySelector('#timeout');
  var adFormSubmitbutton = adForm.querySelector('.ad-form__submit');

  var deactivationCallback = null;

  var deactivate = function () {
    adForm.classList.add('ad-form--disabled');
    var fieldsets = adForm.querySelectorAll('.ad-form fieldset');
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].disabled = true;
    }
  };

  var activate = function () {
    adForm.classList.remove('ad-form--disabled');
    var fieldsets = adForm.querySelectorAll('.ad-form fieldset');
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].disabled = false;
    }
  };

  var reset = function () {
    deactivate();
    if (typeof deactivationCallback === 'function') {
      deactivationCallback();
    }
    setTimeout(window.pin.resetMasterPosition, 1);
  };

  var setDeactivationCallback = function (callback) {
    if (typeof callback === 'function') {
      deactivationCallback = callback;
    }
  };

  var setAddress = function (address) {
    adForm.querySelector('#address').value = address;
  };

  var checkRoomsAndCapacity = function () {
    var roomNumber = parseInt(roomNumberSelector.value, 10);
    var capacity = parseInt(capacitySelector.value, 10);
    if (roomNumber === MAX_ROOMS && capacity === MIN_CAPACITY) {
      return true;
    }
    if (roomNumber >= capacity && roomNumber !== MAX_ROOMS && capacity !== MIN_CAPACITY) {
      return true;
    }
    return false;
  };

  var updateFieldValidity = function (field, isValid, invalidMessage) {
    if (isValid) {
      field.classList.remove('invalid');
      field.setCustomValidity('');
    } else {
      field.classList.add('invalid');
      field.setCustomValidity(invalidMessage);
    }
  };

  var checkPriceValue = function () {
    var price = parseInt(priceInput.value, 10);
    var maxPrice = parseInt(priceInput.max, 10);
    var minPrice = getMinPrice();
    if (isNaN(price) || price > maxPrice || price < minPrice) {
      priceInput.classList.add('invalid');
      return;
    }
    priceInput.classList.remove('invalid');
  };

  var getMinPrice = function () {
    var typeValue = typeSelector.value;
    var accomodationType = window.card.accomodationTypeMap[typeValue];
    return accomodationType.minPrice;
  };

  var submitLoadHandler = function () {
    adFormSubmitbutton.textContent = SAVE_FORM_DEFAULT_MESSAGE;
    window.popup.success();
    adForm.reset();
  };

  var submitErrorHandler = function (message) {
    adFormSubmitbutton.textContent = SAVE_FORM_DEFAULT_MESSAGE;
    window.popup.error(message);
  };

  var save = function (data, loadHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = window.data.XHR_TIMEOUT_IN_SEC * 1000;
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          loadHandler();
          break;

        default:
          errorHandler();
      }
    });
    xhr.addEventListener('error', function () {
      errorHandler();
    });
    xhr.addEventListener('timeout', function () {
      errorHandler('Не удалось сохранить данные за '
                   + window.data.XHR_TIMEOUT_IN_SEC +
                   ' сек. Проверьте соединение и перезагрузите страницу.');
    });
    xhr.open('POST', SAVE_FORM_URL);
    xhr.send(data);
  };

  capacitySelector.addEventListener('change', function () {
    if (checkRoomsAndCapacity()) {
      updateFieldValidity(capacitySelector, true);
      updateFieldValidity(roomNumberSelector, true);
    } else {
      updateFieldValidity(capacitySelector, false, CAPACITY_ERROR_MESSAGE);
    }
  });

  roomNumberSelector.addEventListener('change', function () {
    if (checkRoomsAndCapacity()) {
      updateFieldValidity(roomNumberSelector, true);
      updateFieldValidity(capacitySelector, true);
    } else {
      updateFieldValidity(roomNumberSelector, false, CAPACITY_ERROR_MESSAGE);
    }
  });

  typeSelector.addEventListener('change', function () {
    var minPrice = getMinPrice();
    priceInput.min = minPrice;
    priceInput.placeholder = minPrice;
    checkPriceValue();
  });

  priceInput.addEventListener('change', function () {
    checkPriceValue();
  });

  timeinSelector.addEventListener('change', function () {
    timeoutSelector.value = timeinSelector.value;
  });

  timeoutSelector.addEventListener('change', function () {
    timeinSelector.value = timeoutSelector.value;
  });

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    adFormSubmitbutton.textContent = SAVE_FORM_LOADING_MESSAGE;
    save(new FormData(adForm), submitLoadHandler, submitErrorHandler);
  });

  adForm.addEventListener('reset', reset);

  return {
    activate: activate,
    deactivate: deactivate,
    setDeactivationCallback: setDeactivationCallback,
    setAddress: setAddress
  };
})();
