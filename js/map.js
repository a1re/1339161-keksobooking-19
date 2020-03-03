'use strict';

window.map = (function () {
  var pointer = document.querySelector('.map__pin--main');
  var pinsHolder = document.querySelector('.map__pins');
  var pointerDefaultLeft = parseInt(pointer.style.left, 10);
  var pointerDefaultTop = parseInt(pointer.style.top, 10);

  var updateAddress = function () {
    var coords = {
      x: parseInt(pointer.style.left, 10),
      y: parseInt(pointer.style.top, 10)
    };

    coords.x += Math.round(window.page.PointerSize.DIAMETER / 2);

    if (!window.page.isActive()) {
      coords.y += window.page.PointerSize.DIAMETER;
      coords.y += window.page.PointerSize.PILLAR;
    } else {
      coords.y += Math.round(window.page.PointerSize.DIAMETER / 2);
    }

    window.form.setAddress(coords.x + ', ' + coords.y);
  };

  var updatePointerPosition = function (evt) {
    evt.preventDefault();

    if (!window.util.isMouseLeftPressed(evt)) {
      return;
    }

    if (!window.page.isActive()) {
      window.page.activate();
    }

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var delta = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY,
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var adjustedTopBoundary = window.page.Boundary.TOP -
                                window.page.PointerSize.DIAMETER -
                                window.page.PointerSize.PILLAR;
      var adjustedBottomBoundary = window.page.Boundary.BOTTOM -
                                   window.page.PointerSize.DIAMETER -
                                   window.page.PointerSize.PILLAR;
      var adjustedRightBoundary = window.page.Boundary.RIGHT -
                                  window.page.PointerSize.DIAMETER;

      if (pointer.offsetLeft - delta.x <= window.page.Boundary.LEFT) {
        pointer.style.left = window.page.Boundary.LEFT + 'px';
      } else if (pointer.offsetLeft - delta.x >= adjustedRightBoundary) {
        pointer.style.left = adjustedRightBoundary + 'px';
      } else {
        pointer.style.left = (pointer.offsetLeft - delta.x) + 'px';
      }

      if (pointer.offsetTop - delta.y <= adjustedTopBoundary) {
        pointer.style.top = adjustedTopBoundary + 'px';
      } else if (pointer.offsetTop - delta.y >= adjustedBottomBoundary) {
        pointer.style.top = adjustedBottomBoundary + 'px';
      } else {
        pointer.style.top = (pointer.offsetTop - delta.y) + 'px';
      }

      updateAddress();
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  var resetPointerPosition = function () {
    pointer.style.left = pointerDefaultLeft + 'px';
    pointer.style.top = pointerDefaultTop + 'px';

    updateAddress();
  };

  var updatePins = function (pinList) {
    window.util.removeElements('.map__pin:not(.map__pin--main)', pinsHolder);

    var newPins = document.createDocumentFragment();
    pinList.forEach(function (pinData, i) {
      if (i >= window.page.Limit.MAX_PINS) {
        return;
      }
      var pin = new Pin(pinData);
      newPins.appendChild(pin.element);
    });
    pinsHolder.appendChild(newPins);
    window.card.close();
  };

  var Pin = function (data) {
    var template = document.querySelector('#pin').content.querySelector('.map__pin');

    this.element = template.cloneNode(true);
    this.element.style.left = data.location.x - window.page.PinSize.WIDTH / 2 + 'px';
    this.element.style.top = data.location.y - window.page.PinSize.HEIGHT + 'px';
    this.element.addEventListener('click', function () {
      window.card.open(data);
    });

    var image = this.element.querySelector('img');
    image.src = data.author.avatar;
    image.alt = data.offer.title;
  };

  pointer.addEventListener('mousedown', updatePointerPosition);

  pointer.addEventListener('click', function (evt) {
    if (!window.util.isMouseLeftPressed(evt)) {
      return;
    }

    if (!window.page.isActive()) {
      window.page.activate();
    }
    updateAddress();
  });

  window.page.addDeactivationProcedure(function () {
    setTimeout(resetPointerPosition, 1);
  });
  window.data.load(updatePins, window.page.showError);
  window.filter.addPinHandler(window.util.debounce(updatePins));
  window.page.deactivate();
})();
