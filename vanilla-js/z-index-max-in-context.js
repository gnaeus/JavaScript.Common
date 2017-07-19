/**
 * Максимальное значение z-index внутри контекста наложения, к которому принадлежит node
 * Значения z-index в других контекстах наложения игнорируются
 * @param node {Element}
 * @returns {number}
 */
function zIndexMaxInContext(node) {
  var zIndexMax = 0;
  // обходим цепочку предков элемента
  while (node.parentElement) {
    // document.body — корневой контекст наложения
    if (node === document.body) {
      break;
    }
    // обходим цепочку предков элемента
    node = node.parentElement;

    var style = getComputedStyle(node);
    // если элемент позиционирован не статически и его значение z-index не равно auto
    // или элемент имеет прозрачность менее 1, тогда он является корнем контекста наложения
    if ((style.zIndex !== "auto" && style.position !== "static") || style.opacity !== "1") {
      break;
    }
  }
  // теперь node — корень контекста наложения
  if (node) {
    var stack = [];
    // помещаем в стек детей контекста наложения
    stack.push.apply(stack, node.children);

    // обходим поддерево элементов контекста наложения
    while (stack.length > 0) {
      node = stack.pop();

      var style = getComputedStyle(node);
      if ((style.zIndex !== "auto" && style.position !== "static") || style.opacity !== "1") {
        // если встретили вложенный контекст наложения, то вычисляем его z-index
        // внутрь контекста при этом не заходим
        var zIndex = parseInt(style.zIndex);
        if (zIndexMax < zIndex) {
          zIndexMax = zIndex;
        }
      } else {
        // иначе продолжаем обход в глубину
        stack.push.apply(stack, node.children);
      }
    }
  }
  return zIndexMax;
}
