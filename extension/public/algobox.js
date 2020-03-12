const nuBoxCallback = {
  callbacks: {},

  registerCallback: (msgId, callback) => {
    nuBoxCallback.callbacks[msgId] = {
      resolve: callback.resolve,
      reject: callback.reject
    };
  },

  sendCallback: (msgId, response) => {
    const callback = nuBoxCallback.callbacks[msgId];

    if (!response) {
      callback.reject(null);
    } else if (response.type === "failure") {
      callback.reject(response.result);
    } else if (response.type === "success") {
      callback.resolve(response.result);
    }

    delete nuBoxCallback.callbacks[msgId];
  },

  callExtension: (cmd, args) => {
    return new Promise((resolve, reject) => {
      const msgId = Math.random()
        .toString(36)
        .substring(7);

      nuBoxCallback.registerCallback(msgId, {
        resolve: resolve,
        reject: reject
      });

      args = args === undefined || args === null ? {} : args;
      args.host = window.location.hostname;

      const event = new CustomEvent("nuBox.api.request", {
        detail: {
          msgId: msgId,
          cmd: cmd,
          args: args
        },
        bubbles: true
      });

      document.dispatchEvent(event);
    });
  }
};

// Add listener to wait for events from the injected script.
document.addEventListener(
  "nuBox.api.response",
  data => {
    const response = data.detail;
    nuBoxCallback.sendCallback(response.msgId, response.response);
  },
  false
);

const nuBox = {
  checkForExtension: async () => {
    try {
      await nuBoxCallback.callExtension("isHostRunning");
    } catch (err) {
      if (err === null) {
        throw new Error(
          "You do not have the nuBox chromium extension installed!"
        );
      } else {
        throw new Error("Unable to start the Chromium nuBox host!");
      }
    }
  },

  // noPopup option is honored only if both Alice and Bob are running in same machine.
  grant: async (
    label,
    bob_encrypting_key,
    bob_verifying_key,
    expiration,
    noPopup = false
  ) => {
    try {
      if (label === undefined || label === null) {
        throw new Error("missing label in grant request");
      }
      if (bob_encrypting_key === undefined || bob_encrypting_key === null) {
        throw new Error("missing bob's encrypting key in grant request");
      }
      if (bob_verifying_key === undefined || bob_verifying_key === null) {
        throw new Error("missing bob's verifying key in grant request");
      }
      if (expiration === undefined || expiration === null) {
        throw new Error("missing expiration in grant request");
      }

      return await nuBoxCallback.callExtension("grant", {
        label: label,
        bek: bob_encrypting_key,
        bvk: bob_verifying_key,
        expiration: expiration,
        noPopup: noPopup
      });
    } catch (err) {
      throw err;
    }
  },

  revoke: async (label, bvk, noPopup = false) => {
    try {
      if (label === undefined || label === null) {
        throw new Error("missing label in revoke request");
      }
      if (bvk === undefined || bvk === null) {
        throw new Error("missing bob verifying key in revoke request");
      }

      await nuBoxCallback.callExtension("revoke", {
        label: label,
        bvk: bvk,
        noPopup: noPopup
      });
    } catch (err) {
      throw err;
    }
  },

  encrypt: async (plaintext, label, ipfs = false) => {
    try {
      if (plaintext === undefined || plaintext === null) {
        throw new Error("missing plaintext in encrypt request");
      }
      if (label === undefined || label === null) {
        throw new Error("missing label in encrypt request");
      }

      return await nuBoxCallback.callExtension("encrypt", {
        plaintext: plaintext,
        label: label,
        ipfs: ipfs
      });
    } catch (err) {
      throw err;
    }
  },

  decrypt: async (encrypted, label, ipfs = false) => {
    try {
      if (encrypted === undefined || encrypted === null) {
        throw new Error("missing encrypted in decrypt request");
      }
      if (label === undefined || label === null) {
        throw new Error("missing label in decrypt request");
      }

      return await nuBoxCallback.callExtension("decrypt", {
        encrypted: encrypted,
        label: label,
        ipfs: ipfs
      });
    } catch (err) {
      throw err;
    }
  },

  getBobKeys: async () => {
    try {
      return await nuBoxCallback.callExtension("bob_keys");
    } catch (err) {
      throw err;
    }
  },

  approve: async () => {
    try {
      return await nuBoxCallback.callExtension("approve", {
        title: document.title
      });
    } catch (err) {
      throw err;
    }
  }
};
