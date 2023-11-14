# Reproduction

## Start the app

```shell
npm install
```

To start the development server run `nx run test:serve`. Open your browser and navigate to http://localhost:4200/.

## Reproduce build issue

```shell
nx run test:build
```

## Relevant code

Code related to reproducer is located in [apps/test/app/page.tsx](apps/test/app/page.tsx)

This issue is replicated on the following versions
```json
{
  "nx": "17.1.2",
  "highcharts": "11.2.0",
  "next": "14.0.2"
}
```
