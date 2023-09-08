# Reference app generator

## Getting started

1. Clone this monorepo
2. Run `npm install` in the root directory (it will automatically install dependencies in the template and generated use cases)
3. Run `npm run dev` to automatically re-generate use cases and run them

Now make some changes to `generator/template` or `generator/overrides/{use-case}` and apps will be re-generated & restarted automatically.

> Note: `npm run dev` does not reload the page automatically when source code changes.

## Additional commands

- To just generate the use cases, use `npm run generate`
- To just run use cases without re-generating them, use `npm run start` or `npm run start:default`
- To build use cases, use `npm run build` or `npm run build:default`
- To manually re-install dependencies in the template and all generated use cases, use `npm run install-all`

## Structure

```
/docs
/use-cases      – fully functional use case-specific apps
  /use-case-1
  /use-case-2
  ...
/generator
  /template     – fully functional generic app that's used as a base for all use cases
  /overrides
    /use-case-1 – use case-specific overrides (themes, components, assets, etc.)
    /use-case-2
    ...
  generate.mjs  – script that's responsible for generating use case-specific apps
```

How it works:
- It copies `/generator/template/` to the `/use-cases/{use-case}` folder
- It then merges files from `/generator/overrides/{use-case}` with `/use-cases/{use-case}`
  > Some paths are completely overridden instead of being merged – this can be customized in the `generate.mjs` script.
- `package.json` and `package-lock.json` are slightly updated to use proper `name` value
- `README.md` file is copied from the root directory to the `use-cases/{use-case}` folder
  > `{use-case}` variable is replaced in the `README.md` file

## Persistent storage

The app uses file database by default ([lowdb](https://www.npmjs.com/package/lowdb)). It works with local setup but won't work with serverless deployment.
You might want to use your DB of choice depending on the platform and/or hosting provider (e.g. [Vercel KV](https://vercel.com/docs/storage/vercel-kv/quickstart) for Vercel).
If you want to customize and use other storage options please edit `pages/api/helpers/storage.ts`.

## Best practices

- Keep overrides as minimal as possible
- Instead of overriding the whole component, try to only override theme or styles
- Make the code as generic as possible
- Keep most of the logic and components in the base template
- Carefully check changes after each `npm run generate` execution
