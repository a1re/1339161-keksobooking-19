'use strict';

var ACCOMODATION_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var ACCOMODATION_TYPES_RU = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];
var CHECKIN_CHECKOUT_SLOTS = ['12:00', '13:00', '14:00'];
var FEATURES_LIST = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS_LIST = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var TITLE_FIRST_WORD = ['Очаровательное', 'Добротное', 'Милое', 'Удобное', 'Надежное'];
var TITLE_SECOND_WORD = ['гнездышко', 'убежище', 'местечко', 'жилище'];

var mapElement = document.querySelector('.map');

var getNaturalRandom = function (min, max) {
  var randomInt = min + Math.random() * (max + 1 - min);
  return Math.floor(randomInt);
};

var getRandomValueFromArray = function (array) {
  var i = getNaturalRandom(0, array.length - 1);
  return array[i];
};

var tossArray = function (arraySize, values) {
  if (arraySize >= values.length) {
    return values;
  }
  var tossedArray = [];
  for (var i = 0; i < arraySize; i++) {
    var pick = getRandomValueFromArray(values);
    if (tossedArray.indexOf(pick) >= 0) {
      i--;
    } else {
      tossedArray.push(pick);
    }
  }
  return tossedArray;
};

var makeData = function (number) {
  var dataCards = [];
  for (var i = 0; i < number; i++) {
    var avatarNumber = (i < 9) ? ('0' + (i + 1)) : i + 1;
    var coords = {
      x: getNaturalRandom(0, mapElement.offsetWidth - PIN_WIDTH),
      y: getNaturalRandom(130, 630)
    };
    var randomHeader = getRandomValueFromArray(TITLE_FIRST_WORD) + ' ' + getRandomValueFromArray(TITLE_SECOND_WORD);
    dataCards[i] = {
      author: {avatar: 'img/avatars/user' + avatarNumber + '.png'},
      offer: {
        title: randomHeader,
        address: coords.x + ', ' + coords.y,
        price: getNaturalRandom(100, 1000) * 100,
        type: getRandomValueFromArray(ACCOMODATION_TYPES),
        rooms: getNaturalRandom(1, 3),
        guests: getNaturalRandom(1, 5),
        checkin: getRandomValueFromArray(CHECKIN_CHECKOUT_SLOTS),
        checkout: getRandomValueFromArray(CHECKIN_CHECKOUT_SLOTS),
        features: tossArray(getNaturalRandom(1, FEATURES_LIST.length), FEATURES_LIST),
        description: randomHeader + ' в Токио, лучше не найдете.',
        photos: tossArray(getNaturalRandom(1, PHOTOS_LIST.length), PHOTOS_LIST)
      },
      location: coords
    };
  }
  return dataCards;
};

var makePin = function (pinElement, pinData) {
  var pinImage = pinElement.querySelector('img');
  pinElement.style.left = pinData.location.x - PIN_WIDTH / 2 + 'px';
  pinElement.style.top = pinData.location.y - PIN_HEIGHT + 'px';
  pinImage.src = pinData.author.avatar;
  pinImage.alt = pinData.offer.title;
  return pinElement;
};

var placePins = function (pinList) {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var allPins = document.createDocumentFragment();
  for (var i = 0; i < pinList.length; i++) {
    var pin = makePin(pinTemplate.cloneNode(true), pinList[i]);
    allPins.appendChild(pin);
  }
  document.querySelector('.map__pins').appendChild(allPins);
};

var fillOrHideElement = function (node, condition, content) {
  if (condition) {
    node.textContent = content;
  } else {
    node.style.display = 'node';
  }
};

var capitlizeFirstLetter = function (string) {
  return string[0].toUpperCase() + string.slice(1);
};

var pickWordByInt = function (n, wordforms) {
  var lastDigit = parseInt(n.toString().slice(-2), 10);
  if (lastDigit > 10 && lastDigit < 15) {
    return wordforms[2];
  }
  lastDigit = parseInt(n.toString().slice(-1), 10);
  if (lastDigit === 1) {
    return wordforms[0];
  } else if (lastDigit > 1 && lastDigit < 5) {
    return wordforms[1];
  }
  return wordforms[2];
};

var openCard = function (pinDetails) {
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
    roomsGuests.push(pinDetails.offer.rooms + ' ' + pickWordByInt(pinDetails.offer.rooms, ['комната', 'комнаты', 'комнат']));
  }
  if (pinDetails.offer.guests) {
    roomsGuests.push('для ' + pinDetails.offer.guests + ' ' + pickWordByInt(pinDetails.offer.guests, ['гостя', 'гостей', 'гостей']));
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
  }

  fillOrHideElement(card.querySelector('.popup__title'), pinDetails.offer.title, pinDetails.offer.title);
  fillOrHideElement(card.querySelector('.popup__text--address'), pinDetails.offer.address, pinDetails.offer.address);
  fillOrHideElement(card.querySelector('.popup__text--price'), pinDetails.offer.price, pinDetails.offer.price + '₽/ночь');
  fillOrHideElement(card.querySelector('.popup__description'), pinDetails.offer.description, pinDetails.offer.description);
  fillOrHideElement(card.querySelector('.popup__text--time'), checkinCheckout.length, capitlizeFirstLetter(checkinCheckout.join(', ')));
  fillOrHideElement(card.querySelector('.popup__type'), pinDetails.offer.type, ACCOMODATION_TYPES_RU[ACCOMODATION_TYPES.indexOf(pinDetails.offer.type)]);
  fillOrHideElement(card.querySelector('.popup__text--capacity'), roomsGuests.length, capitlizeFirstLetter(roomsGuests.join(' ')));

  mapFilters.parentNode.insertBefore(card, mapFilters);
};

var pinsData = makeData(8);
placePins(pinsData);
openCard(pinsData[0]);

mapElement.classList.remove('map--faded');
