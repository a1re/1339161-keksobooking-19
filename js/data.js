'use strict';

window.data = (function () {
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var SAVE_URL = 'https://js.dump.academy/keksobooking';
  var XHR_TIMEOUT_IN_SEC = 10;
  var Message = {
    ADVICE: 'Проверьте соединение и попробуйте еще раз.',
    PIN_LOAD_ERROR: 'Не удалось получить объявления с сервера. ',
    TIMEOUT: 'Не удалось загрузить данные за ' + XHR_TIMEOUT_IN_SEC + ' сек. '
  };
  var StatusCode = {
    SUCCESS: 200
  };

  var pins = [];

  var load = function (loadHander, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = XHR_TIMEOUT_IN_SEC * 1000;
    xhr.responseType = 'json';
    xhr.open('GET', LOAD_URL);
    xhr.send();

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case StatusCode.SUCCESS:
          window.data.pins = xhr.response;
          loadHander(window.data.pins);
          break;

        default:
          errorHandler(Message.PIN_LOAD_ERROR + ' (cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText + ').');
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler(Message.PIN_LOAD_ERROR + Message.ADVICE);
    });

    xhr.addEventListener('timeout', function () {
      errorHandler(Message.TIMEOUT);
    });
  };

  var save = function (data, loadHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = XHR_TIMEOUT_IN_SEC * 1000;
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case StatusCode.SUCCESS:
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
      errorHandler(Message.TIMEOUT);
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
