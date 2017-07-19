var hasOwnProperty = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor.bind(Object);
var getPrototypeOf = Object.getPrototypeOf.bind(Object);

ko.mergeJS = function(target, source, options) {
  var exclude = Object.create(null);
  if (options && options.exclude) {
    for (var i = 0; i < options.exclude.length; ++i) {
      exclude[options.exclude[i]] = true;
    }
  }
  if (source) {
    for (var prop in source) {
      if (hasOwnProperty(source, prop) && !hasOwnProperty(exclude, prop)) {
        var value = ko.unwrap(source[prop]);
        // если в target уже есть такое поле
        if (hasOwnProperty(target, prop)) {
          var descriptor = getOwnPropertyDescriptor(target, prop);
          // если поле — это простое поле или имеет сеттер
          if (descriptor.writable || descriptor.set) {
            var observable = target[prop];
            // если поле содержит ko.observable()
            if (ko.isWriteableObservable(observable)) {
              observable(value);
            } else {
              target[prop] = value;
            }
          }
        } else {
          var hasSetter = false;
          var prototype = target;
          // обходим всю цепочку прототипов
          while ((prototype = getPrototypeOf(prototype))) {
            // если в prototype уже есть такое поле
            if (hasOwnProperty(prototype, prop)) {
              var descriptor = getOwnPropertyDescriptor(prototype, prop);
              // если поле — это простое поле или имеет сеттер
              if (descriptor.writable || descriptor.set) {
                hasSetter = true;
              }
              break;
            }
          }
          // если в цепочке прототипов содержится setter или такого поля не найдено вообще
          if (hasSetter || prototype === null) {
            target[prop] = value;
          }
        }
      }
    }
  }
  return target;
};
