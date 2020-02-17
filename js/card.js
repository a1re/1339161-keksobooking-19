'use strict';

window.card = (function () {
  var ROOMS_WORDFORMS = ['комната', 'комнаты', 'комнат'];
  var GUESTS_WORDFORMS = ['гостя', 'гостей', 'гостей'];

  var open = function (pinDetails) {
    close();

    var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
    var card = cardTemplate.cloneNode(true);
    var mapFilters = document.querySelector('.map__filters-container');

    if (pinDetails.author.avatar) {
      card.querySelector('.popup__avatar').src = pinDetails.author.avatar;
    } else {
      card.querySelector('.popup__avatar').style.display = 'none';
    }

    var checkinCheckout = [];
    if (pinDetails.offer.checkin) {
      checkinCheckout.push('заезд после ' + pinDetails.offer.checkin);
    }
    if (pinDetails.offer.checkout) {
      checkinCheckout.push('выезд до ' + pinDetails.offer.checkout);
    }

    var roomsGuests = [];
    if (pinDetails.offer.rooms) {
      roomsGuests.push(pinDetails.offer.rooms + ' ' + window.util.pickWordByInt(pinDetails.offer.rooms, ROOMS_WORDFORMS));
    }
    if (pinDetails.offer.guests) {
      roomsGuests.push('для ' + pinDetails.offer.guests + ' ' + window.util.pickWordByInt(pinDetails.offer.guests, GUESTS_WORDFORMS));
    }

    if (pinDetails.offer.features.length) {
      var featureCards = card.querySelectorAll('.popup__features .popup__feature');
      for (var i = 0; i < featureCards.length; i++) {
        featureCards[i].style.display = 'none';
      }
      for (i = 0; i < pinDetails.offer.features.length; i++) {
        card.querySelector('.popup__feature--' + pinDetails.offer.features[i]).style.display = 'inline-block';
      }
    } else {
      card.querySelector('.popup__features').style.display = 'none';
    }

    if (pinDetails.offer.photos.length) {
      var photosFragment = document.createDocumentFragment();
      for (i = 0; i < pinDetails.offer.photos.length; i++) {
        var photoElement = document.createElement('img');
        photoElement.src = pinDetails.offer.photos[i];
        photoElement.width = 45;
        photoElement.height = 40;
        photoElement.alt = pinDetails.offer.title;
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

    var accomodationType = window.data.accomodationTypeMap[pinDetails.offer.type];

    fillOrHideElement(card.querySelector('.popup__title'), pinDetails.offer.title, pinDetails.offer.title);
    fillOrHideElement(card.querySelector('.popup__text--address'), pinDetails.offer.address, pinDetails.offer.address);
    fillOrHideElement(card.querySelector('.popup__text--price'), pinDetails.offer.price, pinDetails.offer.price + '₽/ночь');
    fillOrHideElement(card.querySelector('.popup__description'), pinDetails.offer.description, pinDetails.offer.description);
    fillOrHideElement(card.querySelector('.popup__text--time'), checkinCheckout.length, window.util.capitlizeFirstLetter(checkinCheckout.join(', ')));
    fillOrHideElement(card.querySelector('.popup__type'), pinDetails.offer.type, accomodationType.name);
    fillOrHideElement(card.querySelector('.popup__text--capacity'), roomsGuests.length, window.util.capitlizeFirstLetter(roomsGuests.join(' ')));

    card.querySelector('.popup__close').addEventListener('click', function () {
      close();
    });
    document.addEventListener('keydown', closeByEscHandler);

    mapFilters.parentNode.insertBefore(card, mapFilters);
  };

  var close = function () {
    var card = document.querySelector('.map__card');
    if (card) {
      card.remove();
      document.removeEventListener('keydown', closeByEscHandler);
    }
  };

  var fillOrHideElement = function (node, condition, content) {
    if (condition) {
      node.textContent = content;
    } else {
      node.style.display = 'node';
    }
  };

  var closeByEscHandler = function (evt) {
    if (window.util.isEscPressed(evt)) {
      close();
    }
  };

  return {
    open: open,
    close: close
  };

})();
