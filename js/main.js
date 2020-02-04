'use strict';

var ACCOMODATION_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var ACCOMODATION_TYPES_RU = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];
var ACCOMODATION_TYPES_MIN_PRICES = [10000, 1000, 5000, 0];
var CHECKIN_CHECKOUT_SLOTS = ['12:00', '13:00', '14:00'];
var FEATURES_LIST = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS_LIST = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAIN_PIN_SIZE = 65;
var MAIN_PIN_PILLAR_SIZE = 20;
var TITLE_FIRST_WORD = ['Очаровательное', 'Добротное', 'Милое', 'Удобное', 'Надежное'];
var TITLE_SECOND_WORD = ['гнездышко', 'убежище', 'местечко', 'жилище'];
var MOUSE_MAIN_BUTTON = 0;
var MAX_ROOMS = 100;
var MIN_CAPACITY = 0;
var ESC_KEY = 'Escape';
var CAPACITY_ERROR_MESSAGE = 'Гостям будет некомфортно';

var mapElement = document.querySelector('.map');
var mainPin = mapElement.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var capacitySelector = adForm.querySelector('#capacity');
var roomNumberSelector = adForm.querySelector('#room_number');
var typeSelector = adForm.querySelector('#type');
var priceInput = adForm.querySelector('#price');
var timeinSelector = adForm.querySelector('#timein');
var timeoutSelector = adForm.querySelector('#timeout');

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

var closeCardByEscHandler = function (evt) {
  if (evt.key === ESC_KEY) {
    closeCard();
  }
};

var closeCard = function () {
  var card = document.querySelector('.map__card');
  if (card) {
    card.remove();
    document.removeEventListener('keydown', closeCardByEscHandler);
  }
};

var openCard = function (pinDetails) {
  closeCard();

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

  card.querySelector('.popup__close').addEventListener('click', function () {
    closeCard(card);
  });
  document.addEventListener('keydown', closeCardByEscHandler);

  mapFilters.parentNode.insertBefore(card, mapFilters);
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
    var pin = allPins.appendChild(makePin(pinTemplate.cloneNode(true), pinList[i]));
    pin.dataset.id = i;
    pin.addEventListener('click', function (evt) {
      openCard(pinList[evt.currentTarget.dataset.id]);
    });
  }
  document.querySelector('.map__pins').appendChild(allPins);
};

var deactivateForm = function () {
  adForm.classList.add('ad-form--disabled');
  var fieldsets = adForm.querySelectorAll('.ad-form fieldset');
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].disabled = true;
  }
};

var activateForm = function () {
  adForm.classList.remove('ad-form--disabled');
  var fieldsets = adForm.querySelectorAll('.ad-form fieldset');
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].disabled = false;
  }
};

var deactivateFilters = function () {
  var filters = document.querySelectorAll('.map__filters select, .map__filters fieldset');
  for (var i = 0; i < filters.length; i++) {
    filters[i].disabled = true;
  }
};

var activateFilters = function () {
  var filters = document.querySelectorAll('.map__filters select, .map__filters fieldset');
  for (var i = 0; i < filters.length; i++) {
    filters[i].disabled = false;
  }
};

var activatePage = function () {
  mapElement.classList.remove('map--faded');
  activateForm();
  activateFilters();
};

var getMainPinPosition = function () {
  var coords = {
    x: parseInt(mainPin.style.left, 10),
    y: parseInt(mainPin.style.top, 10)
  };
  coords.x += Math.round(MAIN_PIN_SIZE / 2);

  if (mapElement.classList.contains('map--faded')) {
    coords.y += Math.round(MAIN_PIN_SIZE / 2);
  } else {
    coords.y += MAIN_PIN_SIZE;
    coords.y += MAIN_PIN_PILLAR_SIZE;
  }

  return coords;
};

var updateAddress = function () {
  var coords = getMainPinPosition();
  adForm.querySelector('#address').value = coords.x + ', ' + coords.y;
};

var checkRoomsAndCapacity = function () {
  var roomNumber = parseInt(roomNumberSelector.value, 10);
  var capacity = parseInt(capacitySelector.value, 10);
  if (roomNumber === MAX_ROOMS && capacity === MIN_CAPACITY) {
    return true;
  }
  if (roomNumber >= capacity && roomNumber !== MAX_ROOMS && capacity !== MIN_CAPACITY) {
    return true;
  }
  return false;
};

var updateFieldValidity = function (field, isValid, invalidMessage) {
  if (isValid) {
    field.classList.remove('invalid');
    field.setCustomValidity('');
  } else {
    field.classList.add('invalid');
    field.setCustomValidity(invalidMessage);
  }
};

var checkPriceValue = function () {
  var price = parseInt(priceInput.value, 10);
  var maxPrice = parseInt(priceInput.max, 10);
  var minPrice = getMinPrice();
  if (isNaN(price) || price > maxPrice || price < minPrice) {
    priceInput.classList.add('invalid');
    return;
  }
  priceInput.classList.remove('invalid');
};

var getMinPrice = function () {
  var typeValue = typeSelector.value;
  var typeIndex = ACCOMODATION_TYPES.indexOf(typeValue);
  if (typeIndex === -1) {
    return 0;
  }
  return ACCOMODATION_TYPES_MIN_PRICES[typeIndex];
};

mainPin.addEventListener('mousedown', function (evt) {
  if (evt.button === MOUSE_MAIN_BUTTON) {
    activatePage();
    updateAddress();
  }
});

capacitySelector.addEventListener('change', function () {
  if (checkRoomsAndCapacity()) {
    updateFieldValidity(capacitySelector, true);
    updateFieldValidity(roomNumberSelector, true);
  } else {
    updateFieldValidity(capacitySelector, false, CAPACITY_ERROR_MESSAGE);
  }
});

roomNumberSelector.addEventListener('change', function () {
  if (checkRoomsAndCapacity()) {
    updateFieldValidity(roomNumberSelector, true);
    updateFieldValidity(capacitySelector, true);
  } else {
    updateFieldValidity(roomNumberSelector, false, CAPACITY_ERROR_MESSAGE);
  }
});

typeSelector.addEventListener('change', function () {
  var minPrice = getMinPrice();
  priceInput.min = minPrice;
  priceInput.placeholder = minPrice;
  checkPriceValue();
});

priceInput.addEventListener('change', function () {
  checkPriceValue();
});

mainPin.addEventListener('click', function () {
  activatePage();
  updateAddress();
});

timeinSelector.addEventListener('change', function () {
  timeoutSelector.value = timeinSelector.value;
});

timeoutSelector.addEventListener('change', function () {
  timeinSelector.value = timeoutSelector.value;
});

placePins(makeData(8));

deactivateForm();
deactivateFilters();
updateAddress();
