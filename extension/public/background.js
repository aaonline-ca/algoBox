/*global chrome*/

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
      console.log(items);
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

const Process = {
  main: (message, sender, sendResponse) => {
    console.log(message);

    // Operations based on cmd.
    switch (message.cmd) {
      default:
      case "triggerLogin":
        Process.triggerLogin();
        break;
    }
  },

  triggerLogin: () => {
    const file = document.createElement("input");
    file.style.display = "none";
    file.type = "file";
    file.name = "file";
    file.accept = ".txt";
    document.getElementById("root").appendChild(file);

    file.onchange = e => {
      const f = e.target.files[0];

      const fr = new FileReader();
      // fr.onload = async evt => {
      //   try {
      //     const wallet = Algorand.getWallet(evt.target.result);
      //     ctx.setWallet(wallet);
      //     Algorand.getAccount(ctx.network, wallet.address).then(ctx.setAccount);
      //
      //     document.getElementById("root").removeChild(file);
      //   } catch (err) {
      //     alert("Invalid ALGO wallet file!");
      //   }
      // };
      fr.readAsText(f);
    };
    file.click();
  }
};

// From the algoBox content/popup script.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  Process.main(message, sender, sendResponse);
  return true;
});
