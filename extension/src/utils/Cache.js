const Cache = {
  key: "algoBox.app",

  get: (key = Cache.key) => {
    return new Promise(resolve => {
      if (window.chrome.storage) {
        window.chrome.storage.local.get(key, results => {
          // Not stored in Chrome. Send empty array.
          if (window.chrome.runtime.lastError || results[key] === undefined) {
            resolve({});
          } else {
            resolve(results[key]);
          }
        });
      }
    });
  },

  set: async (value, key = Cache.key) => {
    return new Promise(async resolve => {
      if (window.chrome.storage) {
        try {
          const result = await Cache.get(key);
          await Cache.delete(key);

          if (result[key].length === 0) {
            result[key] = [value];
          } else {
            result[key].push(value);
          }

          window.chrome.storage.local.set(
            {
              "algoBox.api": result
            },
            () => resolve(null)
          );
        } catch (err) {
          resolve(null);
        }
      }
    });
  },

  delete: (key = Cache.key) => {
    return new Promise(resolve => {
      if (window.chrome.storage) {
        window.chrome.storage.local.remove(key, resolve);
      }
    });
  }
};

export default Cache;
