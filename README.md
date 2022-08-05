# Accounting - Integrate accounting data with Apideck

<img alt="Logo" align="right" src="./public/img/logo.png" width="10%" />

#### A sample project for viewing and managing accounting data with the [Apideck Accounting API](https://developers.apideck.com/apis/accounting/reference).

The Accounting API is a single API to push and query accounting data from +5 connectors. In this sample project, we use the [Apideck Node SDK](https://www.npmjs.com/package/@apideck/node) to create a accounting tool that allows you to manage invoices and customers from multiple services (e.g., QuickBooks, MYOB, Xero, etc.)
<br>
<br>

## Getting started

### Requirements

- **An Apideck account**: You can sign up for an Apideck account here: https://app.apideck.com/signup
- **Apideck Application ID**: Available in your Apideck dashboard.
- **Apideck API Key**: Available in your Apideck dashboard.

### Installing the sample

This project uses the Accounting API with the Node SDK. Visit https://developers.apideck.com/apis/accounting/reference for documentation of the API and https://github.com/apideck-libraries/apideck-node for documentation about the SDK.

#### Step 1: Enable the accounting connectors

Login to Apideck and enable the accounting connectors you would like to make available to your customers.

You can find the overview of accounting connectors here: https://platform.apideck.com/configuration/accounting.

#### Step 2: Update your environment variables

- Copy `.env.example` and create a `.env.local` file
- Add your API key: `NEXT_PUBLIC_API_KEY=<your-api-key>`
- Add your Application ID: `NEXT_PUBLIC_APP_ID=<your-app-id>`
- Your env should also include `NEXT_PUBLIC_API_URL=https://unify.apideck.com`

Note: You can find your credentials in the admin: https://platform.apideck.com/configuration/api-keys

#### Step 3: Install dependencies

- Install dependencies with `yarn` or `npm install`
- Run the development server with `yarn dev` or `npm run dev`
- Visit `http://localhost:3000/` to see if it's running. If you haven't configured any integrations you will see a message.

#### Step 4: Create a session and add connections

You need to create a Vault session and add/configure at least one accounting connection. Use the button on the `/invalid-session` route to create a test session for a specific consumer (by passing the consumer ID). After creating a session you can click the integrations dropdown in the sidebar to select a connector. Make sure you have the Accounting connectors enabled in the admin: https://platform.apideck.com/configuration/accounting.

You should now be able to load and manage the invoices, customers, and more of the connections you have configured.

## Commands

#### `yarn dev`

Runs `next dev` which starts the app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

<img alt="Screenshot" src="./public/img/screenshot.jpg" />

#### `yarn build`

Runs `next build` which builds the application for production usage

#### `yarn start`

Runs `next start` which starts a Next.js production server

#### `yarn lint`

Runs the `eslint` command for all files with the `js`, `ts`, `jsx`, and `tsx` extensions. See the `.eslint.json` file for all configuration settings.

#### `yarn lint:fix`

Runs the `eslint` command with the `--fix` flag which tries to automatically fix linting problems.

#### `yarn lint:cache`

Runs the `eslint` command with the `--cache` flag which only checks the changed files.

#### `yarn lint:format`

Runs Prettier which formats all files inside the `src` directory based on the configuration set inside the `.prettierrc` file.

#### `yarn type-check`

Runs the `tsc` command to compile the project and check if it has type errors.

#### `yarn test`

Runs the `jest` command which runs all tests

#### `yarn test:watch`

Runs the `jest` command with `--watch` flag which runs all tests in watch mode

#### `yarn test:coverage`

Runs the `jest` command with `--coverage` flag which indicates that test coverage information should be collected and reported in the output.

## Commit hooks

This project uses [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged) to run linters against staged git files on commit.

#### Pre-commit

Before each commit we run `eslint` and `prettier` on all staged files.

#### Pre-push

Before each push to the repository we run `jest` to check if all tests are passing.

## Resources

To learn more, take a look at the following resources:

- [Accounting API](https://www.apideck.com/accounting-api) - info about the Accounting API of Apideck
- [Accounting API Documentation](https://developers.apideck.com/apis/accounting/reference) - documentation of the Accounting API
- [Accounting API Explorer](https://developers.apideck.com/apis/accounting/api-explorer) - API explorer to test endpoints of the Accounting API
- [Vault API Documentation](https://developers.apideck.com/apis/vault/reference) - documentation of the Vault API
- [Vault API Explorer](https://developers.apideck.com/apis/vault/api-explorer) - API explorer to test endpoints of the Vault API
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Vercel Serverless Functions](https://vercel.com/docs/serverless-functions/introduction) - learn more about serverless functions by using the `/pages/api` directory in Next.js projects
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [TypeScript](https://www.typescriptlang.org/) - learn about TypeScript
- [Tailwind CSS](https://tailwindcss.com/) - learn about the utility-first CSS framework Tailwind
- [Jest](https://jestjs.io/) - learn about Jest, the JavaScript Testing Framework
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - learn about testing React components with React Testing Library
- [ESLint](https://eslint.org/) - learn about analyzing code with ESLint
- [Prettier](https://eslint.org/) - learn about formatting code with Prettier
- [Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - a Prettier extension for Visual Studio Code
