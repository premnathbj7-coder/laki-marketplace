# Laki Marketplace starter

A beginner-friendly marketplace demo with a React + Vite storefront and an Express API. It uses sample catalog data in memory, stores the cart in the browser, and supports a demo order endpoint. It does not include real accounts, persistent database storage, or payment processing.

## Run it in VS Code

1. Install Node.js LTS.
2. Open this folder in VS Code.
3. In Terminal → New Terminal, run `npm install`.
4. Run `npm run install:all` to install the client and server packages.
5. Run `npm run dev` to start both sides.
6. Open the Vite URL printed in the terminal, usually `http://localhost:5173`.

The API is available at `http://localhost:5000/api/health`.

## Project structure

- `client/src/App.jsx` – storefront, search, category filters, cart, and demo checkout
- `client/src/styles.css` – responsive visual design
- `server/index.js` – product/category endpoints and demo order endpoint

## Next steps

For a production project, add a database, real authentication, server-side validation, inventory management, and a trusted payment provider. Keep credentials in environment variables and do not store card details yourself. Product images currently use remote Unsplash URLs.
