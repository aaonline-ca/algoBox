/* global chrome */

const callExtension = (cmd, args) => {
  return new Promise((resolve, reject) => {
    const msgId = Math.random()
      .toString(36)
      .substring(7);

    args = args === undefined || args === null ? {} : args;
    args.host = window.location.hostname;

    chrome.runtime.sendMessage({ msgId, cmd, args }, response => {
      console.log(response);

      if (!response) {
        reject(null);
      } else if (response.type === "failure") {
        reject(response.result);
      } else {
        resolve(response.result);
      }
    });
  });
};

const Worker = {
  sendTransaction: async message => {
    return await callExtension("sendTransaction", message);
  }
};

export default Worker;
