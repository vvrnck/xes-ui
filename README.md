# xes-ui

<!-- ## About the project -->

This project belongs to my undergraduate thesis with [@galbino](https://github.com/galbino) about how XES process mining can help in archiving better management decisions. The goal is to convert tabular data to XES format.

The application was made to allow eXtensible (😉) features and new formats.

## Project setup

### Prerequisites

- nodejs (>=20.0.0)
- pnpm (>=9.1.0) - optional but recommended
- setup the .env file (use the .env.example file in this repo for clarification)
- [backend](https://github.com/galbino/xes-tcc-uff)

#### 1. Install dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

#### 2. Run the project

##### 2.1. WebApp

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

## Compile and build

#### 1. WebApp

```bash
pnpm build
# or
npm run build
# or
yarn build
```

## Running the build

#### 1. WebApp

```bash
pnpm start
# or
npm run start
# or
yarn start
```

> As a shortcut, change ```start``` for ```preview``` to build and run.

## Lint

```bash
pnpm lint
# or
npm run lint
# or
yarn lint
```





## Deploy to Google Cloud Run

[![Run on Google Cloud](https://deploy.cloud.run/button.svg)](https://deploy.cloud.run)


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Good Practices

* CSS custom classes should use 2 underscore to separate words (ex: read__me);
* The global.scss should contain only generic classes;
* Write generic functions/components that can be re-used (hooks for instance);
* API calls should be wrapped in promises under the services folder;
* TypeScript should be used as much as possible;
