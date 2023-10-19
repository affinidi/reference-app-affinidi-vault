# Reference app generator

## Getting started

1. Clone this monorepo
2. Run `npm install` in the root directory (it will automatically install dependencies in the template and generated samples)
3. Run `npm run dev` to automatically re-generate samples and run them

Now make some changes to `generator/{framework}/template` or `generator/{framework}/overrides/{sample}` and apps will be re-generated & restarted automatically.

> Note: `npm run dev` does not reload the page automatically when source code changes.

## Additional commands

- To just generate the samples, use `npm run generate`
- To just run samples without re-generating them, use `npm run start` or `npm run start:default`
- To build samples, use `npm run build` or `npm run build:default`
- To manually re-install dependencies in the template and all generated samples, use `npm run install-all`

## Structure

```
/docs
/samples      – fully functional sample apps
  /sample-1
  /sample-2
  ...
/generator
  /framework
    /template     – fully functional generic app that's used as a base for all samples
    /overrides
      /sample-1 – sample-specific overrides (themes, components, assets, etc.)
      /sample-2
      ...
    generate.mjs  – script that's responsible for generating sample-specific apps
```

How it works:

- It copies `/generator/{framework}/template/` to the `/samples/{sample}` folder
- It then merges files from `/generator/{framework}/overrides/{sample}` with `/samples/{sample}`
  > Some paths are completely overridden instead of being merged – this can be customized in the `generate.mjs` script.
- `package.json` and `package-lock.json` are slightly updated to use proper `name` value
- `README.md` file is copied from the root directory to the `samples/{sample}` folder
  > `{sample}` variable is replaced in the `README.md` file

## Best practices

- Keep overrides as minimal as possible
- Instead of overriding the whole component, try to only override theme or styles
- Make the code as generic as possible
- Keep most of the logic and components in the base template
- Carefully check changes after each `npm run generate` execution
