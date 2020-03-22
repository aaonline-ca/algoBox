import Crypto from "crypto-js";

import Cache from "./Cache";

import * as config from "../config.json";

const Session = {
  key: "algoBox.app.session",
  wallet: null,
  wallets: [],

  setWallets: (wallets, user = null) => {
    Session.wallets = [...wallets];

    for (let i = 0; i < wallets.length; ++i) {
      if (typeof wallets[i].sk === "string") {
        Session.wallets[i].sk = new Uint8Array(wallets[i].sk.split(","));
      } else {
        Session.wallets[i].sk = new Uint8Array(Object.values(wallets[i].sk));
      }
    }

    if (user) {
      Session.wallet = { ...user.unlocked.wallet };

      if (typeof Session.wallet.sk === "string") {
        Session.wallet.sk = new Uint8Array(Session.wallet.sk.split(","));
      } else {
        Session.wallet.sk = new Uint8Array(Object.values(Session.wallet.sk));
      }
    }
  },

  isLoggedIn: async () => {
    const user = await Cache.get(Session.key);
    if (!user) {
      return null;
    }

    // See if there is an unlocked session. If yes, use that.
    if (
      !user.unlocked ||
      !user.unlocked.wallets ||
      user.unlocked.wallets.length === 0
    ) {
      return null;
    }

    Session.setWallets(user.unlocked.wallets, user);
    return user.unlocked.network;
  },

  setAccount: address => {
    const wallet = Session.wallets.filter(e => e.address === address)[0];
    Session.updateDetails("wallet", wallet);
    Session.wallet = { ...wallet };
    return wallet;
  },

  updateDetails: async (key, value) => {
    const user = await Cache.get(Session.key);
    if (!user) {
      throw new Error("No accounts found!");
    }

    // See if there is an unlocked session.
    if (!user.unlocked) {
      throw new Error("No session found!");
    }

    if (key === "wallet" && typeof value.sk !== "string") {
      value.sk = Object.values(JSON.parse(JSON.stringify(value.sk)));
      value.sk = value.sk.toString();
    }
    user.unlocked[key] = value;

    await Cache.set(user, Session.key);
  },

  login: async password => {
    try {
      const user = await Cache.get(Session.key);
      if (!user) {
        throw new Error("No accounts found!");
      }

      try {
        const decrypted = Crypto.AES.decrypt(user.wallets, password);
        const wallets = JSON.parse(decrypted.toString(Crypto.enc.Utf8));

        if (wallets && wallets.length > 0) {
          await Session.createSession(
            user,
            wallets,
            config.algorand.networks[0],
            wallets[0],
            password
          );

          Session.setWallets(wallets, user);

          return user.unlocked.network;
        }
      } catch (err) {
        console.log(err);
        throw new Error("Incorrect password!");
      }
    } catch (err) {
      throw err;
    }
  },

  register: async (wallet, network, password = null) => {
    try {
      if (password) {
        const wallets = [wallet];
        const json = JSON.stringify(wallets);
        const encrypted = Crypto.AES.encrypt(json, password).toString();

        await Session.createSession(
          { wallets: encrypted },
          wallets,
          network,
          wallet,
          password
        );
      } else {
        const user = await Cache.get(Session.key);

        const wallets = [...user.unlocked.wallets, wallet];

        await Session.createSession(user, wallets);
        Session.setWallets(wallets);
      }
    } catch (err) {
      throw err;
    }
  },

  logout: async () => {
    const user = await Cache.get(Session.key);
    if (!user) {
      throw new Error("No accounts found!");
    }

    if (
      !user.unlocked ||
      !user.unlocked.wallets ||
      user.unlocked.wallets.length === 0
    ) {
      throw new Error("No session found!");
    }

    const wallets = JSON.stringify(user.unlocked.wallets);
    user.wallets = Crypto.AES.encrypt(
      wallets,
      user.unlocked.password
    ).toString();
    user.unlocked = undefined;

    await Cache.set(user, Session.key);
  },

  createSession: async (
    user,
    wallets,
    network = null,
    wallet = null,
    password = null
  ) => {
    for (let i = 0; i < wallets.length; ++i) {
      if (typeof wallets[i].sk !== "string") {
        wallets[i].sk = Object.values(
          JSON.parse(JSON.stringify(wallets[i].sk))
        );
        wallets[i].sk = wallets[i].sk.toString();
      }
    }

    user.unlocked = user.unlocked || {};
    user.unlocked.wallets = wallets;
    if (network) {
      user.unlocked.network = network;
    }
    if (wallet) {
      if (typeof wallet.sk !== "string") {
        wallet.sk = Object.values(JSON.parse(JSON.stringify(wallet.sk)));
        wallet.sk = wallet.sk.toString();
      }

      user.unlocked.wallet = wallet;
    }
    if (password) {
      user.unlocked.password = password;
    }

    await Cache.set(user, Session.key);
  }
};

export default Session;
