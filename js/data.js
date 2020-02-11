'use strict';

window.data = (function () {
  var CHECKIN_CHECKOUT_SLOTS = ['12:00', '13:00', '14:00'];
  var FEATURES_LIST = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS_LIST = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];
  var TITLE_FIRST_WORD = ['Очаровательное', 'Добротное', 'Милое', 'Удобное', 'Надежное'];
  var TITLE_SECOND_WORD = ['гнездышко', 'убежище', 'местечко', 'жилище'];
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

  var getPins = function (number) {
    var pins = [];
    for (var j = 0; j < number; j++) {
      var avatarNumber = (j < 9) ? ('0' + (j + 1)) : j + 1;
      var coords = {
        x: window.util.getNaturalRandom(BOUNDARIES.LEFT, BOUNDARIES.RIGHT),
        y: window.util.getNaturalRandom(BOUNDARIES.TOP, BOUNDARIES.BOTTOM)
      };

      var randomHeader = window.util.getRandomValueFromArray(TITLE_FIRST_WORD)
                         + ' ' + window.util.getRandomValueFromArray(TITLE_SECOND_WORD);

      var randomAccomodationType = window.util.getRandomValueFromArray(ACCOMODATION_TYPES);

      pins[j] = {
        author: {avatar: 'img/avatars/user' + avatarNumber + '.png'},
        offer: {
          title: randomHeader,
          address: coords.x + ', ' + coords.y,
          price: window.util.getNaturalRandom(100, 1000) * 100,
          type: randomAccomodationType.key,
          rooms: window.util.getNaturalRandom(1, 3),
          guests: window.util.getNaturalRandom(1, 5),
          checkin: window.util.getRandomValueFromArray(CHECKIN_CHECKOUT_SLOTS),
          checkout: window.util.getRandomValueFromArray(CHECKIN_CHECKOUT_SLOTS),
          features: window.util.tossArray(window.util.getNaturalRandom(1, FEATURES_LIST.length), FEATURES_LIST),
          description: randomHeader + ' в Токио, лучше не найдете.',
          photos: window.util.tossArray(window.util.getNaturalRandom(1, PHOTOS_LIST.length), PHOTOS_LIST)
        },
        location: coords
      };
    }
    return pins;
  };

  return {
    getPins: getPins,
    getAccomodationTypeByKey: getAccomodationTypeByKey,
    BOUNDARIES: BOUNDARIES
  };
})();
