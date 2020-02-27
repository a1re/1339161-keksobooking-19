'use strict';

(function () {
  var FILE_EXTENSIONS = ['jpg', 'jpeg', 'png'];

  var cleanPreviews = function (holderElement) {
    while (holderElement.firstChild) {
      holderElement.removeChild(holderElement.lastChild);
    }
  };

  var setImageForm = function (fileFieldSelector, imageHolderSelector) {
    var fileChooser = document.querySelector(fileFieldSelector);
    var previewHolder = document.querySelector(imageHolderSelector);

    fileChooser.addEventListener('change', function () {
      var file = fileChooser.files[0];
      var fileName = file.name.toLowerCase();

      var isExtensionValid = FILE_EXTENSIONS.some(function (ext) {
        return fileName.endsWith(ext);
      });

      if (isExtensionValid) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          cleanPreviews(previewHolder);

          var newPreview = document.createElement('img');
          newPreview.src = reader.result;
          previewHolder.appendChild(newPreview);
        });

        reader.readAsDataURL(file);
      }
    });
  };

  setImageForm('#avatar', '.ad-form-header__preview');
  setImageForm('#images', '.ad-form__photo');
})();
