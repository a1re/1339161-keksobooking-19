'use strict';

window.pin = (function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var make = function (pinElement, pinData) {
    var pinImage = pinElement.querySelector('img');
    pinElement.style.left = pinData.location.x - PIN_WIDTH / 2 + 'px';
    pinElement.style.top = pinData.location.y - PIN_HEIGHT + 'px';
    pinImage.src = pinData.author.avatar;
    pinImage.alt = pinData.offer.title;
    return pinElement;
  };

  return {
    make: make
  };
})();
