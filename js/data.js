'use strict';

/**
 * Модель для обмена данными с внешними источниками с помощью XMLHttpRequest
 */

window.data = (function () {
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var SAVE_URL = 'https://js.dump.academy/keksobooking';
  var XHR_TIMEOUT_IN_SEC = 10;
  var StatusCode = {
    SUCCESS: 200
  };

  // Массив, в котором хранятся данные об объявоениях, полученных с сервера
  var pins = [];

  /**
   * Подгружает список объявлений с удаленного сервера по LOAD_URL
   *
   * @param {function} successHandler - хэндлер обработки успешного запроса
   * @param {function} errorHandler - хэндлер обработки ошибки
   * @return {undefined}
   */
  var load = function (successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = XHR_TIMEOUT_IN_SEC * 1000;
    xhr.responseType = 'json';
    xhr.open('GET', LOAD_URL);
    xhr.send();

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case StatusCode.SUCCESS:
          window.data.pins = xhr.response;
          successHandler(window.data.pins);
          break;

        default:
          errorHandler(window.page.Message.PIN_LOAD_ERROR + ' (cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText + ').');
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler(window.page.Message.PIN_LOAD_ERROR + ' ' + window.page.Message.ADVICE);
    });

    xhr.addEventListener('timeout', function () {
      errorHandler(window.page.Message.TIMEOUT);
    });
  };

  /**
   * Отправлеяет данные объявления на удаленный сервер по SAVE_URL
   *
   * @param {FormData} data - объект FormData с данными из формы
   * @param {function} successHandler - хэндлер обработки успешного запроса
   * @param {function} errorHandler - хэндлер обработки ошибки
   * @return {undefined}
   */
  var save = function (data, successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = XHR_TIMEOUT_IN_SEC * 1000;
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case StatusCode.SUCCESS:
          successHandler();
          break;

        default:
          errorHandler();
      }
    });
    xhr.addEventListener('error', function () {
      errorHandler();
    });
    xhr.addEventListener('timeout', function () {
      errorHandler(window.page.Message.TIMEOUT);
    });
    xhr.open('POST', SAVE_URL);
    xhr.send(data);
  };

  return {
    load: load,
    save: save,
    pins: pins
  };
})();
