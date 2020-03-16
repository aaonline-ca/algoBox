/*global chrome*/

const Approval = {
  key: "algoBox.approval",

  getAll: () => {
    const items = localStorage.getItem(Approval.key);
    return items === null || items === undefined ? [] : JSON.parse(items);
  },

  isApproved: (value, items = null) => {
    if (value === null || value === undefined) {
      return false;
    }

    items = items !== null ? items : Approval.getAll();
    return items.indexOf(value) > -1;
  },

  approve: value => {
    let items = Approval.getAll();

    if (!Approval.isApproved(value, items)) {
      items.push(value);

      localStorage.removeItem(Approval.key);
      localStorage.setItem(Approval.key, JSON.stringify(items));
      console.log(`approving ${chrome.runtime.id}`);
    }
  },

  reset: () => {
    localStorage.removeItem(Approval.key);
    localStorage.setItem(Approval.key, JSON.stringify([]));
  }
};
Approval.reset();
Approval.approve(chrome.runtime.id);

const Callbacks = {
  callbacks: {},

  registerCallback: (id, callback) => {
    Callbacks.callbacks[id] = callback;
  },

  sendResponse: (msgId, type, msg, cmd, args) => {
    if (Callbacks.callbacks[msgId] !== undefined) {
      Callbacks.callbacks[msgId]({
        type: type,
        result: msg
      });

      delete Callbacks.callbacks[msgId];
    }
  },

  onMessage: response => {
    console.log(response);

    if (
      response.id !== undefined &&
      Callbacks.callbacks[response.id] !== undefined
    ) {
      if (Callbacks.callbacks[response.id].resolve !== undefined) {
        if (response.type === "success") {
          Callbacks.callbacks[response.id].resolve(response.result);
        } else {
          Callbacks.callbacks[response.id].reject(response.result);
        }

        delete Callbacks.callbacks[response.id];
        return;
      }

      Callbacks.sendResponse(
        response.id,
        response.type,
        response.result,
        response.cmd,
        response.args
      );
    }
  }
};

const Process = {
  main: (message, sender, sendResponse) => {
    console.log(message);

    // Operations based on cmd.
    switch (message.cmd) {
      default:
      case "triggerLogin":
        Process.triggerLogin();
        break;
    }
  }
};

// From the algoBox content/popup script.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  Process.main(message, sender, sendResponse);
  return true;
});
