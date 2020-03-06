'use strict';

/**
 * Абстрактный объект для работы с полями формы объявления. Создается через
 * конструктор Field (снаружи модуля — window.FormField) и настраивается
 * при помощи методов, определенных через прототип.
 */

window.FormField = (function () {
  var FILE_EXTENSIONS = ['jpg', 'jpeg', 'png'];
  var INSTANT_CHECK_TIMEOUT = 5000;

  /**
   * Конструктор класса Field
   *
   * @constructor
   * @param {string} selector - DOM-селектор поля, для которого создается объект
   */
  var Field = function (selector) {
    var self = this;
    self.element = document.querySelector(selector);
    self.isValid = true;

    // Если поле текстовое или цифровое, то валидация запускаются при нажатии
    // клавиш с небольшим таймаутом, чтобы не подсвечивать поле красным цветом
    // раньше времени (пока пользователь еще заполняет), а также при снятии
    // фокуса. Если поле другого типа, то валидация происходит при событии
    // change
    if (self.element.type === 'text' || self.element.type === 'number') {
      self.element.addEventListener('keyup', function () {
        if (self.validate(true)) {
          self.setValid();
        } else {
          window.util.debounce(self.validate.bind(self), INSTANT_CHECK_TIMEOUT)();
        }
      });
      self.element.addEventListener('blur', function () {
        self.validate();
      });
    } else {
      self.element.addEventListener('change', function () {
        self.validate();
      });
    }
  };

  /**
   * Добавляет функцию валидации к полю
   *
   * @param {function} procedure - функция, валидирующая значение поля. Доступ
   *                               к свойствам поля осуществляется через this.
   *                               Функция должна возвращать логическое (bool)
   *                               значение: если True, то значение прошло
   *                               проверку, если False — то нет
   * @return {undefined}
   */
  Field.prototype.setValidation = function (procedure) {
    this.validationProcedure = procedure.bind(this);
  };

  /**
   * Проверяет значение поля. Если задана функция валидацции через
   * setValidation, то запускается она, если нет, то статус берется
   * из браузерной проверки.
   *
   * @param {bool} [getStatusOnly] - если True, то полю не устанавливается сам
   *                                 статус, а только возвращается из метода
   * @return {bool} True если значение прошло проверку, False если нет
   */
  Field.prototype.validate = function (getStatusOnly) {
    if (typeof this.validationProcedure === 'function') {
      this.isValid = this.validationProcedure();
    } else {
      this.isValid = this.element.validity.valid;
    }
    if (getStatusOnly) {
      return this.isValid;
    }
    return this.isValid ? this.setValid() : this.setInvalid();
  };

  /**
   * Отмечает поле, как валидное
   *
   * @return {bool} True
   */
  Field.prototype.setValid = function () {
    this.isValid = true;
    this.element.classList.remove('invalid');
    this.element.setCustomValidity('');
    return true;
  };

  /**
   * Отмечает поле, как невалидное
   *
   * @param {string} message — сообщение о статусе для пользователя (выводится
   *                           срдствами валидации браузера.
   * @return {bool} False
   */
  Field.prototype.setInvalid = function (message) {
    this.isValid = false;
    this.element.classList.add('invalid');
    if (message) {
      this.element.setCustomValidity(message);
    }
    return false;
  };

  /**
   * Отключает поле, устанавливая ему атрибут disabled
   *
   * @return {undefined}
   */
  Field.prototype.disable = function () {
    this.element.disabled = true;
  };

  /**
   * Включает поле, отключая ему атрибут disabled
   *
   * @return {undefined}
   */
  Field.prototype.enable = function () {
    this.element.disabled = false;
  };

  /**
   * Добавляет для пользователя функцию, которая срабатывает при сбросе значений
   * всей формы
   *
   * @param {function} procedure — функция, срабатывающая при сбросе значений
   *                               формы (reset). Доступ к свойствам поля
   *                               осуществляется через this.
   * @return {undefined}
   */
  Field.prototype.setReset = function (procedure) {
    this.resetProcedure = procedure.bind(this);
  };

  /**
   * Сбрасывает значение поля и помечает его как валидное. Если для него
   * установлена функция через setReset, то она срабатывает.
   *
   * @return {undefined}
   */
  Field.prototype.reset = function () {
    if (typeof this.resetProcedure === 'function') {
      this.resetProcedure();
    }
    this.setValid();
  };

  /**
   * Добавляет элемент для превью для поля с загрузкой изображения и
   * отрабатывает процедуру выбора файла. При сбросе значений, восставливает
   * содержание элемента, которое было на момент установки.
   *
   * @param {string} selector — DOM-селектор поля, в которое будет помещаться
   *                            изображение-превью.
   * @return {undefined}
   */
  Field.prototype.setUploadImagePreview = function (selector) {
    var previewHolder = document.querySelector(selector);
    var children = previewHolder.querySelectorAll('*');
    var defaultPreview = document.createDocumentFragment();
    children.forEach(function (childElement) {
      var child = childElement.cloneNode(true);
      defaultPreview.appendChild(child);
    });

    var uploadPreviewImageHandler = function () {
      var file = this.element.files[0];
      var fileName = file.name.toLowerCase();

      var isExtensionValid = FILE_EXTENSIONS.some(function (ext) {
        return fileName.endsWith(ext);
      });

      if (isExtensionValid) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          window.util.removeElements('*', previewHolder);

          var newPreview = document.createElement('img');
          newPreview.src = reader.result;
          previewHolder.appendChild(newPreview);
        });

        reader.readAsDataURL(file);
      }
    };

    this.element.addEventListener('change', uploadPreviewImageHandler.bind(this));

    this.setReset(function () {
      window.util.removeElements('*', previewHolder);
      previewHolder.appendChild(defaultPreview.cloneNode(true));
    });
  };

  return Field;
})();
