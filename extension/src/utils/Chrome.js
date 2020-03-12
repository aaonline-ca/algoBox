/* global chrome */

const getTab = () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs && tabs.length > 0) {
        resolve(tabs[0].id);
      } else {
        reject(null);
      }
    });
  });
};

const sendTabMessage = (tabId, message) => {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, { message }, response => {
      resolve(response);
    });
  });
};

const Chrome = {
  login: async () => {
    try {
      const tabId = await getTab();
      return await sendTabMessage(tabId, "triggerLogin");
    } catch (err) {
      throw err;
    }
  }
};

export default Chrome;
