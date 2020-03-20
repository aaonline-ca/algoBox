const algoBoxCallback = {
  callbacks: {},

  registerCallback: (msgId, callback) => {
    algoBoxCallback.callbacks[msgId] = {
      resolve: callback.resolve,
      reject: callback.reject
    };
  },

  sendCallback: (msgId, response) => {
    const callback = algoBoxCallback.callbacks[msgId];

    if (!response) {
      callback.reject(null);
    } else if (response.type === "failure") {
      callback.reject(response.result);
    } else if (response.type === "success") {
      callback.resolve(response.result);
    }

    delete algoBoxCallback.callbacks[msgId];
  },

  callExtension: (cmd, args) => {
    return new Promise((resolve, reject) => {
      const msgId = Math.random()
        .toString(36)
        .substring(7);

      algoBoxCallback.registerCallback(msgId, { resolve, reject });

      args = args || {};
      args.host = window.location.hostname;

      const event = new CustomEvent("algoBox.api.request", {
        detail: { msgId, cmd, args },
        bubbles: true
      });

      document.dispatchEvent(event);
    });
  }
};

// Add listener to wait for events from the injected script.
document.addEventListener(
  "algoBox.api.response",
  data => {
    const response = data.detail;
    algoBoxCallback.sendCallback(response.msgId, response.response);
  },
  false
);

const algoBox = {
  approve: async () => {
    try {
      return await algoBoxCallback.callExtension("approve", {
        title: document.title
      });
    } catch (err) {
      throw err;
    }
  }
};
