/*global chrome*/

import Cache from "../utils/Cache";
import Algorand from "../utils/Algorand";
import Session from "../utils/Session";

import * as config from "../config.json";

const Approval = {
  key: "algoBox.approval",

  getApprovals: async () => {
    const items = await Cache.get(Approval.key);
    return items || {};
  },

  isApproved: async host => {
    if (!host) {
      return false;
    }

    const items = await Approval.getApprovals();
    return host in items ? true : false;
  },

  approve: async host => {
    const items = await Approval.getApprovals();
    items[host] = true;

    await Cache.set(items, Approval.key);
    console.log(`approving ${host}`);
  },

  reset: async () => {
    await Cache.set({}, Approval.key);
  }
};

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
    // Check if logged in. If not, ask use to login.
    Session.isLoggedIn().then(network => {
      if (network) {
        // Do validations.
        if (!Algorand.isValidAddress(args.txParams.to)) {
          return Callbacks.sendResponse(
            msgId,
            "failure",
            "Invalid To address!"
          );
        }
        if (!args.txParams.amount || args.txParams.amount.trim().length === 0) {
          return Callbacks.sendResponse(msgId, "failure", "Invalid amount!");
        }

        if (!isNaN(args.txParams.amount) && Number(args.txParams.amount) > 0) {
          // Validate the account has enough funds.
          Algorand.getAccount(network, Session.wallet.address)
            .then(account => {
              if (account && !isNaN(account.amount)) {
                const balance = Number(account.amount) / Math.pow(10, 6);

                if (balance > Number(args.txParams.amount)) {
                  return popup(
                    "approve.html",
                    msgId,
                    _popup => {
                      _popup.$("#algobox-transfer-to").val(args.txParams.to);
                      _popup
                        .$("#algobox-transfer-amount")
                        .val(args.txParams.amount);
                      _popup.$("#card-algobox-url").html(args.host);
                    },
                    async _popup => {
                      // Disable the buttons.
                      _popup.$("#algobox-cancel").attr("disabled", true);
                      _popup
                        .$("#algobox-confirm")
                        .attr("disabled", true)
                        .html(
                          '<div class="spinner-border spinner-border-sm" role="status"></div>'
                        );

                      args.secretKey = Session.wallet.sk;
                      args.network = network;
                      args.txParams.url = config.algorand.explorer[network];

                      await Process.sendTransaction(msgId, args);
                    }
                  );
                } else {
                  return Callbacks.sendResponse(
                    msgId,
                    "failure",
                    "Account doesnt have enough balance!"
                  );
                }
              }

              Callbacks.sendResponse(msgId, "failure", "Invalid amount!");
            })
            .catch(err => {
              Callbacks.sendResponse(
                msgId,
                "failure",
                "Failed to get account balance!"
              );
            });
        } else {
          Callbacks.sendResponse(msgId, "failure", "Invalid amount!");
        }
      } else {
        Callbacks.sendResponse(msgId, "failure", "Call approve() first!");
      }
    });
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
        await Approval.approve(args.host);
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
        Approval.isApproved(args.host).then(isApproved => {
          // Check if already approved.
          if (isApproved) {
            Callbacks.sendResponse(msgId, "success", "Host is approved");
          } else {
            popup("connect.html", msgId, initFn, approval);
          }
        });
      } else {
        popup("login.html", msgId, () => {}, login);
      }
    });
  },

  sendTransaction: async (msgId, params) => {
    // de-serialize.
    params.txParams.date = new Date(params.txParams.date);
    if (params.secretKey.constructor !== Uint8Array) {
      params.secretKey = new Uint8Array(params.secretKey.split(","));
    }

    try {
      const tx = await Algorand.createTransaction(
        params.network,
        params.txParams
      );
      await Algorand.sendTransaction({ ...params, tx });

      Callbacks.sendResponse(msgId, "success", "Sent");
    } catch (err) {
      Callbacks.sendResponse(msgId, "failure", "Failed to make transfer!");
    }
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
    const result = await callback(popup, popupCloseHandler);
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

// Load when broswer is loaded.
chrome.runtime.onStartup.addListener(() => {
  Approval.reset().then(() => Approval.approve(chrome.runtime.id));
  Session.logout().catch(console.log);
});
