/* global chrome */

const triggerLogin = () => {
  const file = document.createElement("input");
  file.style.display = "none";
  file.type = "file";
  file.name = "file";
  file.accept = ".txt";

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
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.message) {
    default:
    case "triggerLogin":
      return triggerLogin();
  }
});
