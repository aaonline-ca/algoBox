import Crypto from "crypto-js";

import Cache from "./Cache";

const Session = {
  key: "algoBox.app.session",
  wallets: [],

  login: async password => {
    try {
      const user = await Cache.get(Session.key);
      if (!user) {
        throw new Error("No accounts found!");
      }

      try {
        const wallets = JSON.parse(
          Crypto.AES.decrypt(user.wallets, password).toString(Crypto.enc.Utf8)
        );

        if (wallets && wallets.length > 0) {
          Session.wallets = wallets;
        }
      } catch (err) {
        throw new Error("Incorrect password!");
      }
    } catch (err) {
      throw err;
    }
  },

  register: async (password, wallet) => {
    try {
      const wallets = Crypto.AES.encrypt(
        JSON.stringify([wallet]),
        password
      ).toString();

      await Cache.set({ wallets }, Session.key);
    } catch (err) {
      throw err;
    }
  }
};

export default Session;
