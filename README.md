# Shabaka storefront

The customer-facing Shabaka application uses React, TypeScript, Vite, and Tailwind CSS. Customers can browse products, register and sign in, manage addresses, use a cart, and place orders through Moyasar checkout. Account order history and password management are currently placeholders.

## Run locally

1. Install Node.js and npm, then install dependencies:

   ```sh
   npm ci
   ```

2. Start the Shabaka backend. By default, the storefront sends requests to `http://127.0.0.1:8000/api/v1`. To use another API, create a `.env.local` file in this repository:

   ```dotenv
   VITE_API_URL=http://127.0.0.1:8000/api/v1
   VITE_MOYASAR_PK=your_publishable_key
   ```

   `VITE_MOYASAR_PK` is required for the payment form. Use a Moyasar publishable key here, not a secret key. Configure the backend's Moyasar settings separately.

3. Start the development server:

   ```sh
   npm run dev
   ```

Open the URL printed by Vite. The application stores the customer bearer token in browser local storage.

## Commands

- `npm run build` type-checks the project and builds it into `dist/`.
- `npm run lint` runs ESLint.
- `npm run preview` serves the production build locally.

Routes are defined in `src/App.tsx`, API calls live in `src/api/`, and authentication and cart state live in `src/context/`. A deployment must route client-side URLs back to `index.html`.
