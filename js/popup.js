'use strict';

window.popup = (function () {
  function error(message) {
    var errorElement = document.querySelector('#error').content.querySelector('.error');
    errorElement.querySelector('.error__message').textContent = message;
    document.querySelector('main').appendChild(errorElement);
    errorElement.querySelector('.error__button').addEventListener('click', function () {
      errorElement.remove();
    });
  }

  return {
    error: error
  };
})();
