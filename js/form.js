'use strict';

window.form = (function () {
  var FILE_EXTENSIONS = ['jpg', 'jpeg', 'png'];

  var adForm = document.querySelector('.ad-form');
  var capacitySelector = adForm.querySelector('#capacity');
  var roomNumberSelector = adForm.querySelector('#room_number');
  var typeSelector = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var timeinSelector = adForm.querySelector('#timein');
  var timeoutSelector = adForm.querySelector('#timeout');
  var adFormSubmitbutton = adForm.querySelector('.ad-form__submit');

  var setAddress = function (address) {
    adForm.querySelector('#address').value = address;
  };

  var checkRoomsAndCapacity = function () {
    var roomNumber = parseInt(roomNumberSelector.value, 10);
    var capacity = parseInt(capacitySelector.value, 10);
    if (roomNumber === window.page.Limit.MAX_ROOMS && capacity === window.page.Limit.MIN_CAPACITY) {
      return true;
    }
    if (roomNumber >= capacity && roomNumber !== window.page.Limit.MAX_ROOMS && capacity !== window.page.Limit.MIN_CAPACITY) {
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
    var housingType = window.page.housingTypeMap[typeValue];
    return housingType.minPrice;
  };

  var submitLoadHandler = function () {
    adFormSubmitbutton.textContent = window.page.Message.SAVE_FORM_DEFAULT;
    window.page.showSuccess();
    adForm.reset();
  };

  var submitErrorHandler = function (message) {
    adFormSubmitbutton.textContent = window.page.Message.SAVE_FORM_DEFAULT;
    window.page.showError(message);
  };

  var setImageForm = function (fileFieldSelector, imageHolderSelector) {
    var fileChooser = document.querySelector(fileFieldSelector);
    var previewHolder = document.querySelector(imageHolderSelector);

    fileChooser.addEventListener('change', function () {
      var file = fileChooser.files[0];
      var fileName = file.name.toLowerCase();

      var isExtensionValid = FILE_EXTENSIONS.some(function (ext) {
        return fileName.endsWith(ext);
      });

      if (isExtensionValid) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          window.util.removeElements('*', previewHolder);

          var newPreview = document.createElement('img');
          newPreview.src = reader.result;
          previewHolder.appendChild(newPreview);
        });

        reader.readAsDataURL(file);
      }
    });
  };

  capacitySelector.addEventListener('change', function () {
    if (checkRoomsAndCapacity()) {
      updateFieldValidity(capacitySelector, true);
      updateFieldValidity(roomNumberSelector, true);
    } else {
      updateFieldValidity(capacitySelector, false, window.page.Message.CAPACITY_ERROR);
    }
  });

  roomNumberSelector.addEventListener('change', function () {
    if (checkRoomsAndCapacity()) {
      updateFieldValidity(roomNumberSelector, true);
      updateFieldValidity(capacitySelector, true);
    } else {
      updateFieldValidity(roomNumberSelector, false, window.page.Message.CAPACITY_ERROR);
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
    adFormSubmitbutton.textContent = window.page.Message.SAVE_FORM_LOADING;
    window.data.save(new FormData(adForm), submitLoadHandler, submitErrorHandler);
  });

  adForm.addEventListener('reset', function () {
    window.page.deactivate();
  });

  window.page.addActivationProcedure(function () {
    adForm.classList.remove('ad-form--disabled');
    var fieldsets = adForm.querySelectorAll('.ad-form fieldset');
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].disabled = false;
    }
  });

  window.page.addDeactivationProcedure(function () {
    adForm.classList.add('ad-form--disabled');
    var fieldsets = adForm.querySelectorAll('.ad-form fieldset');
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].disabled = true;
    }
  });

  setImageForm('#avatar', '.ad-form-header__preview');
  setImageForm('#images', '.ad-form__photo');

  return {
    setAddress: setAddress
  };
})();
