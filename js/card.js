'use strict';

/**
 * Набор функций для управление карточкой, открываемой при клике на пин
 * с объявлением
 */

window.card = (function () {

  /**
   * Генерирует натурального числа от min до max включительно
   *
   * @param {object} pinData - объект с информациией об объявлении, полученный
   *                           из window.data.load
   * @return {undefined}
   */
  var open = function (pinData) {
    close(); // Закрывает текущую карточку, если она открыта

    var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
    var card = cardTemplate.cloneNode(true);
    var mapFilters = document.querySelector('.map__filters-container');

    if (pinData.author.avatar) {
      card.querySelector('.popup__avatar').src = pinData.author.avatar;
    } else {
      card.querySelector('.popup__avatar').style.display = 'none';
    }

    var checkinCheckout = [];
    if (pinData.offer.checkin) {
      checkinCheckout.push('заезд после ' + pinData.offer.checkin);
    }
    if (pinData.offer.checkout) {
      checkinCheckout.push('выезд до ' + pinData.offer.checkout);
    }

    var roomsGuests = [];
    if (pinData.offer.rooms) {
      roomsGuests.push(
          pinData.offer.rooms +
          ' ' +
          window.util.pickWordByInt(pinData.offer.rooms, window.page.Wordform.ROOMS)
      );
    }
    if (pinData.offer.guests) {
      roomsGuests.push(
          'для ' +
          pinData.offer.guests +
          ' ' +
          window.util.pickWordByInt(pinData.offer.guests, window.page.Wordform.GUESTS)
      );
    }

    if (pinData.offer.features.length) {
      var featureCards = card.querySelectorAll('.popup__features .popup__feature');
      for (var i = 0; i < featureCards.length; i++) {
        featureCards[i].style.display = 'none';
      }
      for (i = 0; i < pinData.offer.features.length; i++) {
        card.querySelector('.popup__feature--' + pinData.offer.features[i]).style.display = 'inline-block';
      }
    } else {
      card.querySelector('.popup__features').style.display = 'none';
    }

    if (pinData.offer.photos.length) {
      var photosFragment = document.createDocumentFragment();
      for (i = 0; i < pinData.offer.photos.length; i++) {
        var photoElement = document.createElement('img');
        photoElement.src = pinData.offer.photos[i];
        photoElement.width = 45;
        photoElement.height = 40;
        photoElement.alt = pinData.offer.title;
        photoElement.classList.add('popup__photo');
        photosFragment.appendChild(photoElement);
      }
      var currentPhotos = card.querySelector('.popup__photos');
      while (currentPhotos.firstChild) {
        currentPhotos.removeChild(currentPhotos.firstChild);
      }
      card.querySelector('.popup__photos').appendChild(photosFragment);
    } else {
      card.querySelector('.popup__photos').style.display = 'none';
    }

    var housingType = window.page.housingTypeMap[pinData.offer.type];

    fillOrHideElement(
        card.querySelector('.popup__title'),
        pinData.offer.title,
        pinData.offer.title
    );
    fillOrHideElement(
        card.querySelector('.popup__text--address'),
        pinData.offer.address,
        pinData.offer.address
    );
    fillOrHideElement(
        card.querySelector('.popup__text--price'),
        pinData.offer.price,
        pinData.offer.price + '₽/ночь'
    );
    fillOrHideElement(
        card.querySelector('.popup__description'),
        pinData.offer.description,
        pinData.offer.description
    );
    fillOrHideElement(
        card.querySelector('.popup__text--time'),
        checkinCheckout.length,
        window.util.capitlizeFirstLetter(checkinCheckout.join(', '))
    );
    fillOrHideElement(
        card.querySelector('.popup__type'),
        pinData.offer.type,
        housingType.name
    );
    fillOrHideElement(
        card.querySelector('.popup__text--capacity'),
        roomsGuests.length,
        window.util.capitlizeFirstLetter(roomsGuests.join(' '))
    );

    card.querySelector('.popup__close').addEventListener('click', function () {
      close();
    });
    window.util.setCloseByEsc(function () {
      close();
    });

    mapFilters.parentNode.insertBefore(card, mapFilters);
  };

  /**
   * Закрывает текущую открытую карточку, если она открыта. Если закрыта,
   * то ошибка не генерируется.
   *
   * @return {undefined}
   */
  var close = function () {
    var card = document.querySelector('.map__card');
    if (card) {
      card.remove();
    }
    var pin = document.querySelector('.map__pin--active');
    if (pin) {
      pin.classList.remove('map__pin--active');
    }
  };

  /**
   * Заполняет элемент контентом или скрывает его
   *
   * @param {HTMLElement} element — элемент, который нужно заполнить или скрыть
   * @param {bool} condition - условие, если True — то элемент заполняется
   *                           контентом , если False — то скрывается
   * @param {string} content - содержание блока
   * @return {undefined}
   */
  var fillOrHideElement = function (element, condition, content) {
    if (condition) {
      element.textContent = content;
    } else {
      element.style.display = 'none';
    }
  };

  // Добавление закрытие открытой карточки при деактивации страницы
  window.page.addDeactivationProcedure(function () {
    close();
  });

  return {
    open: open,
    close: close
  };
})();
