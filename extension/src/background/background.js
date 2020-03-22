/*global chrome,localStorage*/

import Algorand from "../utils/Algorand";
import Session from "../utils/Session";

import * as config from "../config.json";

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
      case "approve":
        Process.approve(message.msgId, message.args);
        break;

      case "transfer":
        Process.transfer(message.msgId, message.args);
        break;

      case "sendTransaction":
        Process.sendTransaction(message.msgId, message.args);
        break;

      case "pendingTransactions":
        Process.pendingTransactions(message.args);
        break;
    }

    return true;
  },

  transfer: (msgId, args) => {
    popup(
      "approve.html",
      msgId,
      _popup => {
        _popup.$("#algobox-transfer-to").html(args.to);
        _popup.$("#algobox-transfer-amount").html(args.amount);
        _popup.$("#card-algobox-url").html(args.host);
      },
      async () => {
        const network = "";
        args.secretKey = "";
        args.network = network;
        args.txParams.url = config.algorand.explorer[network];

        Process.sendTransaction(msgId, args);
      }
    );
  },

  approve: (msgId, args) => {
    // Check if logged in. If not, ask use to login.
    Session.isLoggedIn().then(network => {
      const initFn = _popup => {
        _popup.$("#host-title").html(args.title);
        _popup.$(".title-letter").html(args.title[0].toUpperCase());
        _popup.$("#connect-host").html(args.host);
      };

      const approval = async () => {
        Approval.approve(args.host);
        Callbacks.sendResponse(msgId, "success", "Host is approved");
      };

      const login = async (_popup, _popupCloseHandler) => {
        const password = _popup.$("#password").val();

        try {
          await Session.login(password);

          // When new page is loaded in same popup, we need to recreate
          // the event handlers.
          _popup.removeEventListener("beforeunload", _popupCloseHandler);

          popup("connect.html", msgId, initFn, approval, true);
        } catch (err) {
          _popup.$("#password").addClass("is-invalid");
        }

        return true;
      };

      if (network) {
        popup("connect.html", msgId, initFn, approval);
      } else {
        popup("login.html", msgId, () => {}, login);
      }
    });
  },

  sendTransaction: (msgId, params) => {
    // de-serialize.
    params.txParams.date = new Date(params.txParams.date);
    params.secretKey = new Uint8Array(params.secretKey.split(","));

    Algorand.createTransaction(params.network, params.txParams)
      .then(tx => Algorand.sendTransaction({ ...params, tx }))
      .then(() => Callbacks.sendResponse(msgId, "success", params))
      .catch(err => Callbacks.sendResponse(msgId, "failure", err));
  },

  pendingTransactions: params => {
    return true;
  }
};

const popup = (page, msgId, initFn, callback, redirect = false) => {
  const popup = window.open(
    page,
    "extension_popup",
    "width=340,height=600,top=25,left=25,toolbar=no,location=no,scrollbars=no,resizable=no,status=no,menubar=no,directories=no"
  );

  const popupCloseHandler = () => {
    Callbacks.sendResponse(msgId, "failure", "User has rejected the request");

    if (popup && !popup.closed) {
      popup.close();
    }
  };

  const popupConfirmHandler = async () => {
    const result = await callback(popup, popupCloseHandler, popupLoadHandler);
    if (result) {
      return;
    }

    // Cancel the popup event handler.
    popup.removeEventListener("beforeunload", popupCloseHandler);
    popup.close();
  };

  const popupLoadHandler = () => {
    initFn(popup);
    popup.$("#algobox-cancel").on("click", popupCloseHandler);
    popup.$("#algobox-confirm").on("click", popupConfirmHandler);
  };

  if (redirect) {
    setTimeout(popupLoadHandler, 300);
  } else {
    popup.addEventListener("load", popupLoadHandler);
  }
  popup.addEventListener("beforeunload", popupCloseHandler);

  popup.focus();
};

// From the algoBox popup script.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  return Process.main(message, sender, sendResponse);
});
