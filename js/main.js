'use strict';

var ACCOMODATION_TYPES = ['palace', 'flat', 'house', 'bungalo'];
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
        description: randomHeader + ' в Токио, лучше не найдете',
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

placePins(makeData(8));

mapElement.classList.remove('map--faded');
