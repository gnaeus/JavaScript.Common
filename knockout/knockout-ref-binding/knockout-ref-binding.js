ko.bindingHandlers.ref = {
  init: function (element, valueAccessor, allBindings, viewModel) {
    var handler = valueAccessor();
    if (typeof handler === "function") {
      handler.call(viewModel, element);
    } else {
      allBindings.get("_ko_property_writers").ref(element);
    }
  }
};

ko.expressionRewriting["_twoWayBindings"].ref = true;