import * as $ from "jquery";
import * as ko from "knockout";

$.fn.injectSelect2Button = function() {
  let select = $(this);
  let select2 = select.next(".select2");
  let button = select2.next("button");
  let arrow = $(".select2-selection__arrow", select2);

  ko.tasks.schedule(() => {
    button.appendTo(select2);
    button.show();
  });

  setImmediate(() => {
    arrow.css("right", button.outerWidth() + "px");
  });

  return select;
};

$.fn.injectSelect2CircleIcon = function() {
  let select = $(this);
  let select2 = select.next(".select2");

  observe(select2[0], node => {
    if (node.nodeType === 1) {
      let element = node as HTMLElement;
      if (element.className === "select2-selection__clear") {
        $(element).empty();
        $("<i class='icon-circle-close'>").appendTo(element);
      }
    }
  });
};

function observe(parent: HTMLElement, callback: (node: Node) => void) {
  const observer = new MutationObserver(mutations => {
    for (let i = 0; i < mutations.length; i++) {
      for (let j = 0; j < mutations[i].addedNodes.length; j++) {
        callback(mutations[i].addedNodes[j]);
      }
    }
  });

  observer.observe(parent, {
    childList: true,
    subtree: true
  });
}
