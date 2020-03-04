import cheerio from "cheerio";

const Extension = {
  getActiveUrl: () => {
    return new Promise((resolve, reject) => {
      if (window.chrome && window.chrome.tabs) {
        window.chrome.tabs.query(
          {
            currentWindow: true,
            active: true
          },
          tabs => {
            try {
              new URL(tabs[0].url);
              resolve(tabs[0].url);
            } catch (err) {
              reject(null);
            }
          }
        );
      } else {
        reject(null);
      }
    });
  },

  getDocumentHead: () => {
    return new Promise((resolve, reject) => {
      if (window.chrome && window.chrome.tabs) {
        const modifyDOM = () => {
          return document.getElementsByTagName("head")[0].innerHTML;
        };

        window.chrome.tabs.executeScript(
          {
            code: `(${modifyDOM})();`
          },
          results => resolve(results[0])
        );
      } else {
        reject(null);
      }
    });
  },

  getFavicon: async () => {
    let imgUrl;

    try {
      const head = await Extension.getDocumentHead();

      const $ = cheerio.load(head);
      imgUrl = $("link[rel=icon]").attr("href");
      new URL(imgUrl);

      return imgUrl;
    } catch (err) {
      try {
        // Validate the url.
        if (
          imgUrl === null ||
          imgUrl === undefined ||
          imgUrl.trim().length === 0
        ) {
          throw new Error(`Invalid favicon url: ${imgUrl}`);
        }

        const url = await Extension.getActiveUrl();
        const _url = new URL(url);

        return `${_url.origin}${imgUrl.startsWith("/") ? "" : "/"}${imgUrl}`;
      } catch (err) {
        throw err;
      }
    }
  }
};

export default Extension;
