/* global chrome */

// Inject API to web page
const injectalgoBox = name => {
  const s = document.createElement("script");
  s.src = chrome.extension.getURL(name);
  s.onload = function() {
    this.parentNode.removeChild(this);
  };
  (document.head || document.documentElement).appendChild(s);
};

injectalgoBox("algobox.js");

// Add listener to wait for events from the injected script.
document.addEventListener(
  "algoBox.api.request",
  data => {
    const msg = data.detail;

    chrome.runtime.sendMessage(msg, response => {
      const event = new CustomEvent("algoBox.api.response", {
        detail: { msgId: msg.msgId, response },
        bubbles: true
      });

      document.dispatchEvent(event);
    });
  },
  false
);
