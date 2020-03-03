'use strict';

window.page = (function () {
  var Boundary = {
    TOP: 130,
    RIGHT: document.querySelector('.map').offsetWidth,
    BOTTOM: 630,
    LEFT: 0
  };
  var PriceDelimiter = {
    LOW: 10000,
    HIGH: 50000
  };
  var Message = {
    SAVE_FORM_LOADING: 'Публикация...',
    SAVE_FORM_DEFAULT: 'Опубликовать',
    CAPACITY_ERROR: 'Гостям будет некомфортно',
    PIN_LOAD_ERROR: 'Не удалось получить объявления с сервера.',
    ADVICE: 'Проверьте соединение и попробуйте еще раз.',
    TIMEOUT: 'Истекло время для загрузки данных.'
  };
  var Wordform = {
    ROOMS: ['комната', 'комнаты', 'комнат'],
    GUESTS: ['гостя', 'гостей', 'гостей']
  };
  var housingTypeMap = {
    'palace': {
      name: 'Дворец',
      minPrice: 10000
    },
    'flat': {
      name: 'Квартира',
      minPrice: 1000
    },
    'house': {
      name: 'Дом',
      minPrice: 5000
    },
    'bungalo': {
      name: 'Бунгало',
      minPrice: 0
    }
  };
  var PinSize = {
    WIDTH: 50,
    HEIGHT: 70
  };
  var PointerSize = {
    DIAMETER: 65,
    PILLAR: 20
  };
  var Limit = {
    MAX_PINS: 5,
    MAX_ROOMS: 100,
    MIN_CAPACITY: 0
  };

  var mapElement = document.querySelector('.map');
  var activityStatus = true;
  var activationProcedures = [];
  var deactivationProcedures = [];

  var activate = function () {
    mapElement.classList.remove('map--faded');
    activationProcedures.forEach(function (procedure) {
      procedure();
    });
    activityStatus = true;
  };

  var deactivate = function () {
    mapElement.classList.add('map--faded');
    deactivationProcedures.forEach(function (procedure) {
      procedure();
    });
    activityStatus = false;
  };

  var isActive = function () {
    return activityStatus;
  };

  var addActivationProcedure = function (procedure) {
    activationProcedures.push(procedure);
  };

  var addDeactivationProcedure = function (procedure) {
    deactivationProcedures.push(procedure);
  };

  var showError = function (message) {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorElement = errorTemplate.cloneNode(true);

    if (message) {
      errorElement.querySelector('.error__message').textContent = message;
    }

    document.querySelector('main').appendChild(errorElement);
    errorElement.querySelector('.error__button').addEventListener('click', function () {
      errorElement.remove();
    });

    window.util.setCloseByEsc(function () {
      errorElement.remove();
    });
  };

  var showSuccess = function (message) {
    var successTemplate = document.querySelector('#success').content.querySelector('.success');
    var successElement = successTemplate.cloneNode(true);

    if (message) {
      successElement.querySelector('.success__message').textContent = message;
    }

    document.querySelector('main').appendChild(successElement);
    successElement.addEventListener('click', function () {
      successElement.remove();
    });

    window.util.setCloseByEsc(function () {
      successElement.remove();
    });
  };

  return {
    activate: activate,
    deactivate: deactivate,
    isActive: isActive,
    addActivationProcedure: addActivationProcedure,
    addDeactivationProcedure: addDeactivationProcedure,
    showError: showError,
    showSuccess: showSuccess,

    Boundary: Boundary,
    PriceDelimiter: PriceDelimiter,
    Message: Message,
    Wordform: Wordform,
    PinSize: PinSize,
    PointerSize: PointerSize,
    Limit: Limit,
    housingTypeMap: housingTypeMap
  };
})();
