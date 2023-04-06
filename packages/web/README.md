# Web application

This is Eonian Farm UI dApp.

## Requirements

* NodeJS v16 or higher

## Development

### First Start Guide

Run development server

```bash
yarn dev
```

It will start

* NextJS application at [http://localhost:3000](http://localhost:3000) and the open page automatically
* Storybook at [http://localhost:6006](http://localhost:6006) or another port of it is busy

### Storybook

For the development of components and independent screens, there used Storybook.
To start it locally, use the following command:

```bash
yarn storybook
```

### Mocking server

For querying data from the blockchain and other services, there used GraphQL. The mocking server allows mocking this API for development purposes.

To start it locally, use the following command:

```bash
yarn mock
```

### CDN

* <https://vercel.com/eonian/farm-app> - Web app project in Vercel
* <https://vercel.com/eonian/storybook> - Storybook project in Vercel
