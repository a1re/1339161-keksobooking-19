'use strict';

window.FormField = (function () {
  var FILE_EXTENSIONS = ['jpg', 'jpeg', 'png'];
  var INSTANT_CHECK_TIMEOUT = 5000;
  
  var Field = function (selector) {
    var self = this;
    self.element = document.querySelector(selector);
    self.isValid = true;
    
    if (self.element.type === "text" || self.element.type === "number") {
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

  Field.prototype.setValidation = function (procedure) {
    this.validationProcedure = procedure.bind(this);
  };

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

  Field.prototype.setValid = function () {
    this.element.classList.remove('invalid');
    this.element.setCustomValidity('');
    return true;
  };

  Field.prototype.setInvalid = function (message) {
    this.element.classList.add('invalid');
    if (message) {
      this.element.setCustomValidity(message);
    }
    return false;
  };

  Field.prototype.disable = function () {
    this.element.disabled = true;
  };

  Field.prototype.enable = function () {
    this.element.disabled = false;
  };

  Field.prototype.setReset = function (procedure) {
    this.resetProcedure = procedure.bind(this);
  };

  Field.prototype.reset = function () {
    if (typeof this.resetProcedure === 'function') {
      this.resetProcedure();
    }
    this.setValid();
  };
  
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
  }
  
  return Field;
})();