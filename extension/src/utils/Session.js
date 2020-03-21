import Crypto from "crypto-js";

import Cache from "./Cache";

const Session = {
  key: "algoBox.app.session",
  wallets: [],

  setWallets: wallets => {
    Session.wallets = [...wallets];

    for (let i = 0; i < wallets.length; ++i) {
      if (typeof wallets[i].sk === "string") {
        Session.wallets[i].sk = new Uint8Array(wallets[i].sk.split(","));
      } else {
        Session.wallets[i].sk = new Uint8Array(Object.values(wallets[i].sk));
      }
    }
  },

  isLoggedIn: async () => {
    const user = await Cache.get(Session.key);
    if (!user) {
      return false;
    }

    // See if there is an unlocked session. If yes, use that.
    if (
      !user.unlocked ||
      !user.unlocked.wallets ||
      user.unlocked.wallets.length === 0
    ) {
      return false;
    }

    Session.setWallets(user.unlocked.wallets);
    return true;
  },

  setAccount: address => {
    const wallet = Session.wallets.filter(e => e.address === address)[0];

    Session.updateDetails("wallet", address);

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

    if (key === "wallet") {
      // Find the wallet, and then bring it to front.
      user.unlocked.wallets.sort((x, y) =>
        x.address === value ? -1 : y.address === value ? 1 : 0
      );
    } else {
      user.unlocked[key] = value;
    }

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
          Session.setWallets(wallets);

          // Create an unlocked-session.
          await Session.createSession(user, wallets);
        }
      } catch (err) {
        throw new Error("Incorrect password!");
      }
    } catch (err) {
      throw err;
    }
  },

  register: async (wallet, password = null) => {
    try {
      if (password) {
        const wallets = [wallet];
        const json = JSON.stringify(wallets);
        const encrypted = Crypto.AES.encrypt(json, password).toString();

        await Session.createSession({ wallets: encrypted }, wallets);
      } else {
        const user = await Cache.get(Session.key);

        const wallets = user.unlocked.wallets;
        wallets.push(wallet);

        await Session.createSession(user, wallets);
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

    user.unlocked = undefined;
    await Cache.set(user, Session.key);
  },

  createSession: async (user, wallets) => {
    for (let i = 0; i < wallets.length; ++i) {
      if (typeof wallets[i].sk !== "string") {
        wallets[i].sk = Object.values(
          JSON.parse(JSON.stringify(wallets[i].sk))
        );
        wallets[i].sk = wallets[i].sk.toString();
      }
    }

    user.unlocked = { wallets };
    await Cache.set(user, Session.key);
  }
};

export default Session;
