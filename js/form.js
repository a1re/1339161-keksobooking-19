'use strict';

(function () {
  var form = document.querySelector('.ad-form');  
  var formSubmitButton = form.querySelector('.ad-form__submit');
  
  var fields = {
    'title': new window.FormField('#title'),
    'type': new window.FormField('#type'),
    'price': new window.FormField('#price'),
    'roomNumber': new window.FormField('#room_number'),
    'capacity': new window.FormField('#capacity'),
    'timein': new window.FormField('#timein'),
    'timeout': new window.FormField('#timeout'),
    'timeout': new window.FormField('#timeout'),
    'avatar': new window.FormField('#avatar'),
    'images': new window.FormField('#images')
  };
  
  var checkRoomsAndCapacity = function () {
    var roomNumber = parseInt(fields['roomNumber'].element.value, 10);
    var capacity = parseInt(fields['capacity'].element.value, 10);
    if (roomNumber === window.page.Limit.MAX_ROOMS && capacity === window.page.Limit.MIN_CAPACITY) {
      return true;
    }
    if (roomNumber >= capacity && roomNumber !== window.page.Limit.MAX_ROOMS && capacity !== window.page.Limit.MIN_CAPACITY) {
      return true;
    }
    return false;
  };

  fields['type'].setValidation(function () {
    var housingType = window.page.housingTypeMap[this.element.value];
    fields['price'].element.min = housingType.minPrice;
    fields['price'].element.placeholder = housingType.minPrice;
    fields['price'].validate();
    return true;
  });

  fields['roomNumber'].setValidation(function () {
    if (checkRoomsAndCapacity()) {
      return fields['capacity'].setValid();
    }
    return this.setInvalid(window.page.Message.CAPACITY_ERROR)
  });

  fields['capacity'].setValidation(function () {
    if (checkRoomsAndCapacity()) {
      return fields['roomNumber'].setValid();
    }
    return this.setInvalid(window.page.Message.CAPACITY_ERROR)
  });

  fields['timein'].setValidation(function () {
    fields['timeout'].element.value = fields['timein'].element.value;
    return true;
  });

  fields['timeout'].setValidation(function () {
    fields['timein'].element.value = fields['timeout'].element.value;
    return true;
  });
  
  fields['avatar'].setUploadImagePreview('.ad-form-header__preview');
  fields['images'].setUploadImagePreview('.ad-form__photo');

  fields['price'].setReset(function () {
    setTimeout(function () {
      var housingType = window.page.housingTypeMap[fields['type'].element.value];
      fields['price'].element.min = housingType.minPrice;
      fields['price'].element.placeholder = housingType.minPrice;
    }, 1);
  });

  var submitLoadHandler = function () {
    formSubmitButton.textContent = window.page.Message.SAVE_FORM_DEFAULT;
    window.page.showSuccess();
    window.page.deactivate();
    form.reset();
  };

  var submitErrorHandler = function (message) {
    formSubmitButton.textContent = window.page.Message.SAVE_FORM_DEFAULT;
    window.page.showError(message);
  };
  
  formSubmitButton.addEventListener('click', function (evt) {
    Object.keys(fields).forEach(function (name) {
      fields[name].validate();
    });
  });
  
  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    formSubmitButton.textContent = window.page.Message.SAVE_FORM_LOADING;
    window.data.save(new FormData(form), submitLoadHandler, submitErrorHandler);
  });
  
  form.addEventListener('reset', function (evt) {
    Object.keys(fields).forEach(function (name) {
      fields[name].reset();
    });
    window.page.deactivate();
  });

  window.page.addActivationProcedure(function () {
    form.classList.remove('ad-form--disabled');
    Object.keys(fields).forEach(function (name) {
      fields[name].enable();
    });
    document.querySelector('#description').disabled = false;
    document.querySelector('.ad-form .features').disabled = false;
    document.querySelector('#address').disabled = false;
    document.querySelector('.ad-form__submit').disabled = false;
    document.querySelector('.ad-form__reset').disabled = false;
  });

  window.page.addDeactivationProcedure(function () {
    form.classList.add('ad-form--disabled');
    Object.keys(fields).forEach(function (name) {
      fields[name].disable();
    });
    document.querySelector('#description').disabled = true;
    document.querySelector('.ad-form .features').disabled = true;
    document.querySelector('#address').disabled = true;
    document.querySelector('.ad-form__submit').disabled = true;
    document.querySelector('.ad-form__reset').disabled = true;
  });
})();