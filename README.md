# Sui Counter DApp

This project was built as part of the **Sui Bootcamp Homework**.

## Overview

The app allows users to:
- Connect their Sui wallet (via `@mysten/wallet-kit`)
- Create a `Counter` object on the blockchain
- Increment the counter through on-chain transactions
- Display the current counter value in real time

Each user owns their own counter object, stored securely on the Sui testnet.

---

## Tech Stack

- **React + TypeScript**
- **Vite** for fast development and builds
- **@mysten/sui.js** for blockchain interaction
- **@mysten/wallet-kit** for wallet connection
- **CSS3** for styling and responsive layout

---

## Smart Contract

The Move module is deployed on **Sui Testnet** under the following package ID:
0x8943ac4651cd4818dfa9ec976a1fa496e6ebe4a80bab3c0bcd5b383eac71a4cd

### Module: `counter`

Functions:
- `create`: creates a new `Counter` object.
- `increment`: increases the counter value by 1.

---

## Run Locally

```bash
git clone https://github.com/<username>/sui-counter-dapp.git
cd sui-counter-dapp
npm install
npm run dev
```

## Deployment

This project is live on GitHub Pages:
[View the DApp]()

## Responsive Design

The interface automatically adapts for both desktop and mobile.
Once connected, users can:
- See whether they have an existing counter object
- Create one if not
- Increment it directly from the UI

