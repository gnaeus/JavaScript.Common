const urlFromHead = document.head.getAttribute("root-url") || "";

const rootUrl =
  urlFromHead.slice(-1) === "/" ? urlFromHead.slice(0, -1) : urlFromHead;

__webpack_public_path__ = `${rootUrl}/${process.env.OUT_DIR}/`;
