'use strict';

/**
 * Модуль с константами, перечислениями, словарями и функциями, которые
 * относятся к общему управлению страницей Кексобукинга (ключевое отличие от
 * window.util в уровне абстракции.
 *
 * ВАЖНО! Стоит обратить внимание, как реализована активация/деактивация
 * страницы. У модуля page есть две экспортируемые функции activate и
 * deactivate, каждая из которых делает две вещи — добавляет/убирает класс
 * map--faded для карты и вполняет по очереди функции в массивах
 * activationProcedures/deactivationProcedures. В массивах эти функции
 * появляются через экспортируемые функции addActivationProcedure/
 * addDectivationProcedure, которые используются другими модулями для
 * деактивации страницы по их усмотрению. Например, форме нужно убиирать/
 * добавлять атрибут disabled для полей — поэтому они делают для этого
 * собственные функции и добавлеют в соответствующие очереди модуля window.page.
 */

window.page = (function () {
  // Ограниченние карты для размещения пина
  var Boundary = {
    TOP: 130,
    RIGHT: document.querySelector('.map').offsetWidth,
    BOTTOM: 630,
    LEFT: 0
  };
  // Границы, по которым разделяются значения в фильтре стоимости
  var PriceDelimiter = {
    LOW: 10000,
    HIGH: 50000
  };
  // Сервисные сообщения
  var Message = {
    SAVE_FORM_LOADING: 'Публикация...',
    SAVE_FORM_DEFAULT: 'Опубликовать',
    CAPACITY_ERROR: 'Гостям будет некомфортно',
    PIN_LOAD_ERROR: 'Не удалось получить объявления с сервера.',
    ADVICE: 'Проверьте соединение и попробуйте еще раз.',
    TIMEOUT: 'Истекло время для загрузки данных.'
  };
  // Формы слов для использования в функции window.util.pickWordByInt в карточке
  var Wordform = {
    ROOMS: ['комната', 'комнаты', 'комнат'],
    GUESTS: ['гостя', 'гостей', 'гостей']
  };
  // Словарь с названием и минимальными значениями для поля "Тип жилья"
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
  // Размеры пинов объявлений
  var PinSize = {
    WIDTH: 50,
    HEIGHT: 70
  };
  // Размеры главного пина
  var PointerSize = {
    DIAMETER: 65,
    PILLAR: 20
  };
  // Перечисление ограничений для количества пинов, объявлений и вместимпости
  var Limit = {
    MAX_PINS: 5,
    MAX_ROOMS: 100,
    MIN_CAPACITY: 0
  };

  var mapElement = document.querySelector('.map');
  var activityStatus = true;
  var activationProcedures = [];
  var deactivationProcedures = [];

  /**
   * Переведение страницы в активное состояние
   *
   * @return {undefined}
   */
  var activate = function () {
    mapElement.classList.remove('map--faded');
    activationProcedures.forEach(function (procedure) {
      procedure();
    });
    activityStatus = true;
  };

  /**
   * Переведение страницы в неактивное состояние
   *
   * @return {undefined}
   */
  var deactivate = function () {
    mapElement.classList.add('map--faded');
    deactivationProcedures.forEach(function (procedure) {
      procedure();
    });
    activityStatus = false;
  };

  /**
   * Проверка статуса активности (сделано функцией, чтобы было можно
   * экспортировать, т.к. примитивное значение сохранеяется в момент экспорта).
   *
   * @return {bool} True — если страница активна, False — если нет
   */
  var isActive = function () {
    return activityStatus;
  };

  /**
   * Добавление процедуры активации страницы
   *
   * @param {function} procedure
   * @return {undefined}
   */
  var addActivationProcedure = function (procedure) {
    activationProcedures.push(procedure);
  };

  /**
   * Добавление процедуры деактивации страницы
   *
   * @param {function} procedure
   * @return {undefined}
   */
  var addDeactivationProcedure = function (procedure) {
    deactivationProcedures.push(procedure);
  };

  /**
   * Отображение окна ошибки
   *
   * @param {string} message
   * @return {undefined}
   */
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

  /**
   * Отображение окна с сообщением об успешной операции
   *
   * @param {string} message
   * @return {undefined}
   */
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
