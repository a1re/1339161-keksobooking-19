'use strict';

/**
 * Набор функций и констант для использования в других модулях
 */

window.util = (function () {
  var ESC_KEYCODE = 27;
  var MOUSE_MAIN_BUTTON = 0;
  var DEBOUNCE_INTERVAL_IN_MS = 500;

  /**
   * Генерирует натурального числа от min до max включительно
   *
   * @param {int} min - минимальное число для рандомизации
   * @param {int} max - максимальное число для рандомизации
   * @return {int} Рандомное натуральное число
   */
  var getNaturalRandom = function (min, max) {
    var randomInt = min + Math.random() * (max + 1 - min);
    return Math.floor(randomInt);
  };

  /**
   * Возвращает случайное значение из переданного массива
   *
   * @param {array} array - непустой массив
   * @return {*} случайное значение из массива
   */
  var getRandomValueFromArray = function (array) {
    var i = getNaturalRandom(0, array.length - 1);
    return array[i];
  };

  /**
   * Выбирает слово правильной формы по числительному
   *
   * @param {int} n - числотельное, по которому нужно подбират форму слова
   * @param {array} wordforms - массив форм слов, где первым идет слово в
   *                            именительном падеже в ед. числе, вторым —
   *                            родительном падеже в ед. числе, третьим —
   *                            родительном падеже в мн. числе, например:
   *                            ['житель', 'жителя', 'жителей'].
   * @return {string} форма слова.
   */
  var pickWordByInt = function (n, wordforms) {
    var lastDigit = parseInt(n.toString().slice(-2), 10);
    if (lastDigit > 10 && lastDigit < 15) {
      return wordforms[2];
    }
    lastDigit = parseInt(n.toString().slice(-1), 10);
    if (lastDigit === 1) {
      return wordforms[0];
    } else if (lastDigit > 1 && lastDigit < 5) {
      return wordforms[1];
    }
    return wordforms[2];
  };

  /**
   * Дебаунсер, предотвращающий множественный вызорв коллбека за короткий
   * промежуток времени.
   *
   * @param {function} callback - коллбек, который нужно вызвать не чаще,
   *                              чем заданный интервал.
   * @param {int} [timeout] - интервал для вызова в миллисекундах. Опциональный
   *                          параметр, если его не указывать, будет
   *                          использоваться константа DEBOUNCE_INTERVAL_IN_MS.
   * @return {undefined}
   */
  var debounce = function (callback, timeout) {
    var lastTimout = null;

    var interval = timeout ? timeout : DEBOUNCE_INTERVAL_IN_MS;

    return function () {
      var params = arguments;

      if (lastTimout) {
        window.clearTimeout(lastTimout);
      }

      lastTimout = window.setTimeout(function () {
        callback.apply(null, params);
      }, interval);
    };
  };

  /**
   * Вызывает коллбек при нажатии на ESC. Используется для закрытия поп-апов
   *
   * @param {function} callback - коллбек, который нужно вызвать по нажатию на Esc
   * @return {undefined}
   */
  var setCloseByEsc = function (callback) {
    var closeByEscHandler = function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        callback();
        document.removeEventListener('keydown', closeByEscHandler);
      }
    };

    document.addEventListener('keydown', closeByEscHandler);
  };

  /**
   * Удаляет все элементы по фильтру для родителя. В большинстве случаев,
   * используется для удаление потомков элемента
   *
   * @param {string} [filter] - DOM-селектор элементов для удаление. Если не
   *                            указан, используется '*'
   * @param {HTMLElement} [parentElement] - Элемент, потомков которого нужно
   *                                        удалять. Если не указан,
   *                                        используется document
   * @return {undefined}
   */
  var removeElements = function (filter, parentElement) {
    if (!filter) {
      filter = '*';
    }
    if (!parentElement) {
      parentElement = document;
    }
    var elementsList = parentElement.querySelectorAll(filter);
    elementsList.forEach(function (childElement) {
      childElement.remove();
    });
  };

  /**
   * Поднимает регистр первого символа строки
   *
   * @param {string} string - Строка
   * @return {string} Строка с капитализированным первым символом
   */
  var capitlizeFirstLetter = function (string) {
    return (string.length > 0) ? (string[0].toUpperCase() + string.slice(1)) : '';
  };

  /**
   * Проверка, что нажата именно левая кнопка мыши (трекпада)
   *
   * @param {Event} evt - событие, переданное из обработчика
   * @return {bool} True если да, False если нет
   */
  var isMouseLeftPressed = function (evt) {
    return (evt.button === MOUSE_MAIN_BUTTON) ? true : false;
  };

  return {
    isMouseLeftPressed: isMouseLeftPressed,
    capitlizeFirstLetter: capitlizeFirstLetter,
    setCloseByEsc: setCloseByEsc,
    debounce: debounce,
    getNaturalRandom: getNaturalRandom,
    getRandomValueFromArray: getRandomValueFromArray,
    pickWordByInt: pickWordByInt,
    removeElements: removeElements
  };
})();
