'use strict';

window.data = (function () {
  var PINS_LIST_URL = '//js.dump.academy/keksobooking/data';
  var PINS_LOAD_ERROR_MESSAGE = 'Не удалось получить объявления с сервера. Попробуйте перезагрузить страницу';
  var XHR_TIMEOUT_IN_SEC = 10;
  var BOUNDARIES = {
    TOP: 130,
    RIGHT: document.querySelector('.map').offsetWidth,
    BOTTOM: 630,
    LEFT: 0
  };
  var ACCOMODATION_TYPES = [
    {
      key: 'palace',
      name: 'Дворец',
      minPrice: 10000
    },
    {
      key: 'flat',
      name: 'Квартира',
      minPrice: 1000
    },
    {
      key: 'house',
      name: 'Дом',
      minPrice: 5000
    },
    {
      key: 'bungalo',
      name: 'Бунгало',
      minPrice: 0
    }
  ];

  var getAccomodationTypeByKey = function (accomodationKey) {
    for (var i = 0; i < ACCOMODATION_TYPES.length; i++) {
      if (ACCOMODATION_TYPES[i].key === accomodationKey) {
        return ACCOMODATION_TYPES[i];
      }
    }
    return null;
  };

  var getPins = function (pinsHandler) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = XHR_TIMEOUT_IN_SEC * 1000;
    xhr.responseType = 'json';
    xhr.open('GET', PINS_LIST_URL);
    xhr.send();

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
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
    getAccomodationTypeByKey: getAccomodationTypeByKey,
    BOUNDARIES: BOUNDARIES,
    XHR_TIMEOUT_IN_SEC: XHR_TIMEOUT_IN_SEC
  };
})();
