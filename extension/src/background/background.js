/*global chrome,localStorage*/

import Algorand from "../utils/Algorand";

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

  sendResponse: (msgId, type, result) => {
    if (Callbacks.callbacks[msgId]) {
      Callbacks.callbacks[msgId]({ type, result });

      delete Callbacks.callbacks[msgId];
    }
  }
};

const Process = {
  main: (message, sender, sendResponse) => {
    console.log(message);

    // Register the callback for the response from the host.
    Callbacks.registerCallback(message.msgId, sendResponse);

    if (message.cmd !== "approve") {
      // Not approved.
      if (!Approval.isApproved(message.args.host)) {
        return Callbacks.sendResponse(
          message.msgId,
          "failure",
          "Host not approved"
        );
      }
    }

    // Operations based on cmd.
    switch (message.cmd) {
      default:
      case "sendTransaction":
        return Process.sendTransaction(message.msgId, message.args);

      case "pendingTransactions":
        return Process.pendingTransactions(message.args);
    }
  },

  sendTransaction: (msgId, params) => {
    // de-serialize.
    params.txParams.date = new Date(params.txParams.date);
    params.secretKey = new Uint8Array(params.secretKey.split(","));

    Algorand.createTransaction(params.network, params.txParams)
      .then(tx => Algorand.sendTransaction({ ...params, tx }))
      .then(() => Callbacks.sendResponse(msgId, "success", params))
      .catch(err => {
        console.log(err);
        Callbacks.sendResponse(msgId, "failure", params);
      });

    return true;
  },

  pendingTransactions: params => {
    return true;
  }
};

// From the algoBox popup script.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  return Process.main(message, sender, sendResponse);
});
