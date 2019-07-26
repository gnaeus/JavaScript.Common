// @ts-ignore
ko.bindingProvider.instance.preprocessNode = function(node) {
  if (node.nodeType === 1) {
    var attributes = node.attributes;
    var length = attributes.length;
    var bindings = [];

    for (var i = 0, attr; i < length; ++i) {
      attr = attributes[i];
      if (attr.name.lastIndexOf("ko-", 0) === 0) {
        bindings.push(attr.name.slice(3) + ": " + attr.value);
      }
    }

    if (bindings.length > 0) {
      var dataBind = node.getAttribute("data-bind");
      if (dataBind) {
        dataBind += ", " + bindings.join(", ");
      } else {
        dataBind = bindings.join(", ");
      }
      node.setAttribute("data-bind", dataBind);
    }
  }
};
