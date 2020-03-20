/* global chrome */

// Inject API to web page
const injectalgoBox = (name, css = false) => {
  const s = document.createElement(css ? "style" : "script");
  if (css) {
    s.innerHTML = name;
  } else {
    s.src = chrome.extension.getURL(name);
    s.onload = function() {
      this.parentNode.removeChild(this);
    };
  }
  (document.head || document.documentElement).appendChild(s);
};

injectalgoBox("algobox.js");
injectalgoBox(
  `
  .algoBox-r-c-btn-no-click {
    pointer-events: none;
    opacity: .65;
  }

  label {
    display: inline-block;
    margin-bottom: .5rem;
    cursor: default;
  }

  .form-control:disabled, .form-control[readonly] {
    background-color: #e9ecef;
    opacity: 1;
  }

  button, input {
    overflow: visible;
  }

  input, textarea, select, button {
    text-rendering: auto;
    color: initial;
    letter-spacing: normal;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    display: inline-block;
    text-align: start;
    margin: 0em;
    font: 400 13.3333px Arial;
  }

  .form-control {
    display: block;
    width: 100%;
    height: calc(2.25rem + 2px);
    padding: .375rem .75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    box-sizing: border-box;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .algoBox-r-c-btn-r {
    background:#dc3545 !important
  }

  .algoBox-r-c-btn-loader {
    border-radius: 50%;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    width: 16px;
    height: 16px;
    animation: algoBox-spin 1s linear infinite;
  }

  @keyframes algoBox-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`,
  true
);

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
