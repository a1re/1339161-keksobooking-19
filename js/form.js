'use strict';

/**
 * Модуль управления полями формы добавления объявления. Поля управляются
 * с помощью объекта window.FormField и его методов.
 *
 * Важный комментарий по ESLint — чтобы не передавать в функции фильтрации
 * объект, для получения доступа к его свойствами и атрибутам используется
 * this. ESLint это не нравится, но лишние данные гонять через параметры
 * функции интутивно кажется еще хуже. Поэтому для строчек с this использутеся
 * комментарий "// eslint-disable-line no-invalid-this" который глушит ESLint.
 */

(function () {
  var form = document.querySelector('.ad-form');
  var formSubmitButton = form.querySelector('.ad-form__submit');

  // Создаем словарь со списком объектов, где ключ — название поля. Поля
  // создаютс по DOM-селектору.
  var fields = {
    'title': new window.FormField('#title'),
    'type': new window.FormField('#type'),
    'price': new window.FormField('#price'),
    'roomNumber': new window.FormField('#room_number'),
    'capacity': new window.FormField('#capacity'),
    'timein': new window.FormField('#timein'),
    'timeout': new window.FormField('#timeout'),
    'avatar': new window.FormField('#avatar'),
    'images': new window.FormField('#images')
  };

  /**
   * Функция проверки соответствия значений полей roomNumber и capacity
   *
   * @return {bool} True, если значения корректны, False если нет
   */
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

  // Добавление валидации к полю "Тип жилья". Функция всегда возвращает true,
  // но при смене значения обновляет минимальное значение и плейсхолдер для
  // поля цены
  fields['type'].setValidation(function () {
    var housingType = window.page.housingTypeMap[this.element.value]; // eslint-disable-line no-invalid-this
    fields['price'].element.min = housingType.minPrice;
    fields['price'].element.placeholder = housingType.minPrice;
    fields['price'].validate();
    return true;
  });

  // Добавление валидации к полю "Количество комнат". При изменениии значения
  // проверяет соответствие полю "Количество мест" и сразу отмечает поле
  // невалидным, если оно не соответствует
  fields['roomNumber'].setValidation(function () {
    if (checkRoomsAndCapacity()) {
      return fields['capacity'].setValid();
    }
    return this.setInvalid(window.page.Message.CAPACITY_ERROR); // eslint-disable-line no-invalid-this
  });

  // Добавление валидации к полю "Количество мест". При изменениии значения
  // проверяет соответствие полю "Количество комнат" и сразу отмечает поле
  // невалидным, если оно не соответствует
  fields['capacity'].setValidation(function () {
    if (checkRoomsAndCapacity()) {
      return fields['roomNumber'].setValid();
    }
    return this.setInvalid(window.page.Message.CAPACITY_ERROR); // eslint-disable-line no-invalid-this
  });

  // Добавление валидации к полю "Время заезда". Функция всегда возвращает true,
  // но при изменении обновляет значение связанного с ним поля "Время выезда"
  fields['timein'].setValidation(function () {
    fields['timeout'].element.value = fields['timein'].element.value;
    return true;
  });

  // Добавление валидации к полю "Время выезда". Функция всегда возвращает true,
  // но при изменении обновляет значение связанного с ним поля "Время заезда"
  fields['timeout'].setValidation(function () {
    fields['timein'].element.value = fields['timeout'].element.value;
    return true;
  });

  // Добавления элементов для превью для полей "Ваша фотография" и "Фотография
  // жилья"
  fields['avatar'].setUploadImagePreview('.ad-form-header__preview');
  fields['images'].setUploadImagePreview('.ad-form__photo');

  // Добавления процедуры сброса значений для поля "Цена за ночь", т.к. при
  // смене значения поля "Тип жилья" в "Цене за ночь" обновляются и атрибуты
  // тоже и при обычном сбросе значения возвращаются именно к ним. Сброс
  // срабатывает по минимальному таймауту, чтобы получить значения уже после
  // сброса поля "Тип жилья"
  fields['price'].setReset(function () {
    setTimeout(function () {
      var housingType = window.page.housingTypeMap[fields['type'].element.value];
      fields['price'].element.min = housingType.minPrice;
      fields['price'].element.placeholder = housingType.minPrice;
    }, 1);
  });

  /**
   * Функция которая вызывается при успешном сохранении данных через
   * XMLHttpRequest
   *
   * @return {undefined}
   */
  var submitLoadHandler = function () {
    formSubmitButton.textContent = window.page.Message.SAVE_FORM_DEFAULT;
    window.page.showSuccess();
    window.page.deactivate();
    form.reset();
  };

  /**
   * Функция которая вызывается при ошибке при сохранении данных через
   * XMLHttpRequest
   *
   * @param {string} message - Сообщенеи об ошибке
   * @return {undefined}
   */
  var submitErrorHandler = function (message) {
    formSubmitButton.textContent = window.page.Message.SAVE_FORM_DEFAULT;
    window.page.showError(message);
  };

  // Проверка полей через метод объекта Field при сабмите формы. Привязан
  // по клику т.к. на сабмите всегда сначала срабатывает браузерная валидация,
  // а она не дает дружелюбно подсветить поля
  formSubmitButton.addEventListener('click', function () {
    Object.keys(fields).forEach(function (name) {
      fields[name].validate();
    });
  });

  // Сабмит формы через XMLHttpRequest
  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    formSubmitButton.textContent = window.page.Message.SAVE_FORM_LOADING;
    window.data.save(new FormData(form), submitLoadHandler, submitErrorHandler);
  });

  // Сброс значений поля — для всех полей помимо браузерного резета, срабатывает
  // еще резет из объекта Field
  form.addEventListener('reset', function () {
    Object.keys(fields).forEach(function (name) {
      fields[name].reset();
    });
    window.page.deactivate();
  });

  // Добавление активации полей при активации страницы
  window.page.addActivationProcedure(function () {
    form.classList.remove('ad-form--disabled');
    Object.keys(fields).forEach(function (name) {
      fields[name].enable();
    });
    // Некоторые поля деактивируются вручную по селектору т.к. для них
    // не создается объект Field
    document.querySelector('#description').disabled = false;
    document.querySelector('.ad-form .features').disabled = false;
    document.querySelector('#address').disabled = false;
    document.querySelector('.ad-form__submit').disabled = false;
    document.querySelector('.ad-form__reset').disabled = false;
  });

  // Добавление деактивации полей при деактивации страницы
  window.page.addDeactivationProcedure(function () {
    form.classList.add('ad-form--disabled');
    Object.keys(fields).forEach(function (name) {
      fields[name].disable();
    });
    // Некоторые поля деактивируются вручную по селектору т.к. для них
    // не создается объект Field
    document.querySelector('#description').disabled = true;
    document.querySelector('.ad-form .features').disabled = true;
    document.querySelector('#address').disabled = true;
    document.querySelector('.ad-form__submit').disabled = true;
    document.querySelector('.ad-form__reset').disabled = true;
  });
})();
