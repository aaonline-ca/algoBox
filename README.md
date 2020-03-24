# algoBox
![](https://img.shields.io/badge/React-v16.13-red)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)

# Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [API](#api)

# Introduction
**algoBox** is an easy-to-use chrome (can use it on any chromium based browsers!) extension for Algorand.

# Features
- Register an account (requires only a password)
- Login with the same password
- A user session persists until the browser is closed (or user logs out of the account)
- Choose which algorand network to use (and switch between them easily)
- Wallet management:
    - *Create a new wallet* (mnemonic will be downloaded; wallet is automatically added to the extension)
    - *Import a wallet* (if you have a wallet mnemonic, you can import it into the extension)
    - *Remove a wallet* (you can remove a wallet from the extension. If you lose its mnemonic, you lose the wallet permanently)
    - *Share a wallet* (download the QR code of your wallet address)
    - Choose which wallet to be used as active wallet
- Transfer:
    - See account balance
    - Copy wallet address with a click
    - Sends a transaction even if the extension window is closed
    - Schedule a transaction to be sent in the future (as long as the browswer isnt closed)
- See transaction history of a wallet
- All information is sandboxed with the extension and no sensitive details ever leaves the extension

# API
algoBox also injects few APIs for algorand developers to use (with zero effort on their part to be able to use the APIs). There is nothing to install or build (as long as the users have the extension running).

- **approve**:
    - need to get approval from the user before calling any other APIs
    - opens up a popup where user can see who is requesting the approval access
    - if the user is not logged into the extension, it'll show a login popup first
    - once a website is approved, the approval will persists across that browser session (until the browser is closed)
    - Within a session, if the website calls approve again (and its approved before), the new request is automatically approved.

```js
await algoBox.approve();
```

<img src="https://i.imgur.com/GRrqNGX.png" width="250" /> <img src="https://i.imgur.com/AkL4JIw.png" width="250" />

- **transfer**:
    - opens up a transfer popup with necessary details - *amount* and *receiver address*
    - *network* and *wallet* used is the one currently set in the chrome extension (when the transfer api is processed)
    - once the user approves the transfer, its sent immediately

```js
await algoBox.transfer(to, amount);
```

<img src="https://i.imgur.com/ekpy7be.png" width="250" />
