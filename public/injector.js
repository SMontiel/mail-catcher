const { ipcRenderer } = require('electron');

let isScrollEnabled = true;

window.onscroll = function () {
  if (isScrollEnabled) {
    ipcRenderer.sendToHost(JSON.stringify({
      x: window.scrollX,
      y: window.scrollY
    }));
  }
};

ipcRenderer.on("scroll-to", function (event, data) {
  if (isScrollEnabled) {
    window.scrollTo(data.x, data.y);
  }
});

ipcRenderer.on("enable-scroll", function (event, data) {
  isScrollEnabled = data.enable;
});

ipcRenderer.on("set-hash", function (event, data) {
  window.location.hash = data.hash;
});
