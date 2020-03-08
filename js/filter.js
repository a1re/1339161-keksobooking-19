'use strict';

/**
 * Модуль для работы с фильтрацией объявлений. Состоит из абстрактного объекта
 * filter для работы с полями фильтрации (для каждого поля нужно создать свой
 * объект Filter, которому передается селектор объекта и функция обновления
 * всего массива пинов), а также активации этого объекта для концретных полей
 * формы.
 *
 * Сама логика фильтров работает так — для каждого поля создается своя функция,
 * которая дложна возвращать True или False, а изменение значение формы
 * активируeт или деактивирует фильтр. При каждом изменении значений полей, для
 * которых создан объект Field, вызывается функция обновления пинов, которая
 * итерирует через весь массив и для каждого элемента вызывает все
 * активированные функции фильтров. Пока функции возвращают True, объявление
 * остается в массиве, как только выходит False — перечисление фильтров
 * останавливается, объявление исключается и цикл переходит к след. объявлению.
 *
 * Важный комментарий по ESLint — чтобы не передавать в функции фильтрации
 * объект, для получения доступа к его свойствами и атрибутам используется
 * this. ESLint это не нравится, но лишние данные гонять через параметры
 * функции интутивно кажется еще хуже. Поэтому для строчек с this использутеся
 * комментарий "// eslint-disable-line no-invalid-this" который глушит ESLint.
 */

(function () {
  var CANCEL_FILTER_SELECTOR_VALUE = 'any';

  /**
   * Конструктор класса Filter
   *
   * @constructor
   * @param {string} selector - DOM-селектор поля, для которого создается объект
   * @param {function} updateData — функция обновления списка пинов
   */
  var Filter = function (selector, updateData) {
    var self = this;
    self.element = document.querySelector(selector);
    self.isActive = false;
    self.element.addEventListener('change', function () {
      var unchecked = (self.element.type === 'checkbox' && self.element.checked === false);
      var selectedAny = (self.element.value === CANCEL_FILTER_SELECTOR_VALUE);
      if (unchecked || selectedAny) {
        self.deactivate();
      } else {
        self.activate();
      }
      updateData();
    });
  };

  /**
   * Добавляет функцию фильтрации к полю
   *
   * @param {function} procedure - функция, котрая вызывается при переборе
   *                               объявлений и должна возвращать True, если
   *                               объявление нужно оставить и False — если
   *                               нет. Доступ к атрибутам поля осуществляется
   *                               через this
   * @return {undefined}
   */
  Filter.prototype.set = function (procedure) {
    this.execute = procedure.bind(this);
  };

  /**
   * Активирует фильтр. Когда фильтр активный — его функция вызывается при
   * переборе объявлений.
   *
   * @return {undefined}
   */
  Filter.prototype.activate = function () {
    this.isActive = true;
  };

  /**
   * Деактивирует фильтр. Когда фильтр неактивный — его функция не вызывается
   * при переборе объявлений.
   *
   * @return {undefined}
   */
  Filter.prototype.deactivate = function () {
    this.isActive = false;
  };

  /**
   * Перебирает объявления и оставляет только те, которые удовлетворяют
   * критериям
   *
   * @return {undefined}
   */
  var applyFilters = function () {
    var filteredPins = window.data.pins.filter(function (pinData) {
      for (var key in filters) {
        if (filters.hasOwnProperty(key)) {
          if (filters[key].isActive && !filters[key].execute(pinData)) {
            return false;
          }
        }
      }
      return true;
    });
    window.map.updatePins(filteredPins);
  };

  // Создаем словарь со списком объектов, где ключ — название поля. Поля
  // создаются по DOM-селектору. Т.к. создание объектов однотипное, очень
  // просится селекторы загнать в массив, а объекты создавать в цикле, но
  // на практике это только создает лишние переменные и циклы, но никак
  // не экономит объем кода и заметно ухудшает читаемость. Хоть это и
  // немного противоречит DRY, это осознанное решение.
  var filters = {
    'housingType': new Filter('#housing-type', applyFilters),
    'housingPrice': new Filter('#housing-price', applyFilters),
    'housingRooms': new Filter('#housing-rooms', applyFilters),
    'housingGuests': new Filter('#housing-guests', applyFilters),
    'filterWifi': new Filter('#filter-wifi', applyFilters),
    'filterDishwasher': new Filter('#filter-dishwasher', applyFilters),
    'filterParking': new Filter('#filter-parking', applyFilters),
    'filterWasher': new Filter('#filter-washer', applyFilters),
    'filterElevator': new Filter('#filter-elevator', applyFilters),
    'filterConditioner': new Filter('#filter-conditioner', applyFilters)
  };

  /**
   * Универсальная функция-фильтрациии для всех чекбоксов. Если в списке удобств
   * есть имя поля чекбокса, то возвращает True, оставляя объявление в массиве
   * пинов.
   *
   * @param {object} pinData — объект со всей информафией об объявлении,
   *                           полученный со внешнего источника через
   *                           window.data.load
   * @return {bool} True если в массиве offer.features есть элемент с именем
   *                поля, False — если нет
   */
  var checkboxFilter = function (pinData) {
    return pinData.offer.features.indexOf(this.element.value) >= 0; // eslint-disable-line no-invalid-this
  };

  // Добавление функции фильтрации для поля типа жилья. Сравнивает значение
  // селектора со значением offer.type в объекте информации об объявлении.
  filters['housingType'].set(function (pinData) {
    return this.element.value === pinData.offer.type; // eslint-disable-line no-invalid-this
  });

  // Добавление функции фильтрации для поля стоимости жилья. Сравнивает значение
  // селектора со значением offer.price через перечислений границ стоиомости.
  filters['housingPrice'].set(function (pinData) {
    switch (this.element.value) { // eslint-disable-line no-invalid-this
      case 'middle':
        return (
          pinData.offer.price >= window.page.PriceDelimiter.LOW
          &&
          pinData.offer.price <= window.page.PriceDelimiter.HIGH
        );
      case 'low':
        return (pinData.offer.price < window.page.PriceDelimiter.LOW);
      case 'high':
        return (pinData.offer.price > window.page.PriceDelimiter.HIGH);
      default:
        return true;
    }
  });

  // Добавление функции фильтрации для поля количества комнат. Сравнивает
  // значение селектора со значением offer.rooms в объекте информации
  // об объявлении.
  filters['housingRooms'].set(function (pinData) {
    return parseInt(this.element.value, 10) === parseInt(pinData.offer.rooms, 10); // eslint-disable-line no-invalid-this
  });

  // Добавление функции фильтрации для поля вместимсти. Сравнивает значение
  // селектора со значением offer.rooms в объекте информации об объявлении.
  filters['housingGuests'].set(function (pinData) {
    return parseInt(this.element.value, 10) === parseInt(pinData.offer.guests, 10); // eslint-disable-line no-invalid-this
  });

  // Добавление функции фильтрации для чекбоксов.
  filters['filterWifi'].set(checkboxFilter);
  filters['filterDishwasher'].set(checkboxFilter);
  filters['filterParking'].set(checkboxFilter);
  filters['filterWasher'].set(checkboxFilter);
  filters['filterElevator'].set(checkboxFilter);
  filters['filterConditioner'].set(checkboxFilter);

  // Снятие атрибутов disabled для всех полей при активации страницы
  window.page.addActivationProcedure(function () {
    for (var key in filters) {
      if (filters.hasOwnProperty(key)) {
        filters[key].element.disabled = false;
      }
    }
  });

  // Добавлеие атрибутов disabled для всех полей при деактивации страницы,
  // а также сброс значений формы
  window.page.addDeactivationProcedure(function () {
    var form = document.querySelector('.map__filters');
    for (var key in filters) {
      if (filters.hasOwnProperty(key)) {
        filters[key].element.disabled = true;
        filters[key].deactivate();
      }
    }
    form.reset();
  });
})();
