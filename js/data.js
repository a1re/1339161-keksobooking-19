'use strict';

window.data = (function () {
  var PINS_LIST_URL = '//js.dump.academy/keksobooking/data';
  var PINS_LOAD_ERROR_MESSAGE = 'Не удалось получить объявления с сервера. Попробуйте перезагрузить страницу';
  var XHR_TIMEOUT_IN_SEC = 10;
  var StatusCode = {
    SUCCESS: 200
  };
  var accomodationTypeMap = {
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

  var getPins = function (pinsHandler) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = XHR_TIMEOUT_IN_SEC * 1000;
    xhr.responseType = 'json';
    xhr.open('GET', PINS_LIST_URL);
    xhr.send();

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case StatusCode.SUCCESS:
          pinsHandler(xhr.response);
          break;

        default:
          window.popup.error(PINS_LOAD_ERROR_MESSAGE + ' (cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText + ').');
      }
    });

    xhr.addEventListener('error', function () {
      window.popup.error(PINS_LOAD_ERROR_MESSAGE + '.');
    });

    xhr.addEventListener('timeout', function () {
      window.popup.error(PINS_LOAD_ERROR_MESSAGE + ' (таймаут ' + xhr.timeout + ' сек.)');
    });
  };

  return {
    getPins: getPins,
    accomodationTypeMap: accomodationTypeMap,
    XHR_TIMEOUT_IN_SEC: XHR_TIMEOUT_IN_SEC
  };
})();
