const link = document.createElement("a");
link.style.display = "none";

document.body.appendChild(link);

/**
 * Download file without explicitely clicking on link.
 */
export function downloadFile(url: string, onError: Function) {
  window.location.assign(url);
  window.onerror = function() {
    window.location.assign(null);
  };
}
