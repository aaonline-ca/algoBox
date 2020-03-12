const Cache = {
  key: "algoBox.app",

  get: (key = Cache.key) => {
    return new Promise((resolve, reject) => {
      if (window.chrome.storage) {
        window.chrome.storage.local.get(key, results => {
          // Not stored in Chrome. Send empty array.
          if (window.chrome.runtime.lastError || results[key] === undefined) {
            reject(null);
          } else {
            resolve(results[key]);
          }
        });
      } else {
        reject("Not a chrome browser!");
      }
    });
  },

  set: async (value, key = Cache.key) => {
    return new Promise((resolve, reject) => {
      if (window.chrome.storage) {
        const map = {};
        map[key] = value;

        window.chrome.storage.local.set(map, resolve);
      } else {
        reject("Not a chrome browser!");
      }
    });
  },

  delete: (key = Cache.key) => {
    return new Promise((resolve, reject) => {
      if (window.chrome.storage) {
        window.chrome.storage.local.remove(key, resolve);
      } else {
        reject("Not a chrome browser!");
      }
    });
  }
};

export default Cache;
