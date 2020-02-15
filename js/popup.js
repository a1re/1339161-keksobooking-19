'use strict';

window.popup = (function () {
  var setCloseByEsc = function (element) {
    var closeByEscHandler = function (evt) {
      if (window.util.isEscPressed(evt)) {
        element.remove();
        document.removeEventListener('keydown', closeByEscHandler);
      }
    };

    document.addEventListener('keydown', closeByEscHandler);
  };

  var error = function (message) {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorElement = errorTemplate.cloneNode(true);

    if (message) {
      errorElement.querySelector('.error__message').textContent = message;
    }

    document.querySelector('main').appendChild(errorElement);
    errorElement.querySelector('.error__button').addEventListener('click', function () {
      errorElement.remove();
    });

    setCloseByEsc(errorElement);
  };

  var success = function (message) {
    var successTemplate = document.querySelector('#success').content.querySelector('.success');
    var successElement = successTemplate.cloneNode(true);

    if (message) {
      successElement.querySelector('.success__message').textContent = message;
    }

    document.querySelector('main').appendChild(successElement);
    successElement.addEventListener('click', function () {
      successElement.remove();
    });

    setCloseByEsc(successElement);
  };

  return {
    error: error,
    success: success
  };
})();
