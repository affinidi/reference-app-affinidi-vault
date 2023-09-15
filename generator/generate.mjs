import fs from 'fs/promises'
import { dirname, join, basename } from 'path'
import url from 'url'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'

const markdownFiles = ['README.md']
const filesToIgnore = ['node_modules', '.next', '.env', 'generator-config.json', '.gitkeep', 'keys']
const pathsToOverwrite = []

const __dirname = dirname(url.fileURLToPath(import.meta.url))

async function generate() {
  const rootPath = join(__dirname, '..')
  const useCasesPath = join(rootPath, 'use-cases')
  const generatorPath = join(rootPath, 'generator')
  const overridesPath = join(generatorPath, 'overrides')
  const templatePath = join(generatorPath, 'template')

  const overrides = (await fs.readdir(overridesPath, { withFileTypes: true }))
    .filter(i => i.isDirectory()).map(i => i.name)
    .sort()
  
  console.log(`Detected use cases: ${overrides.join(', ')}`)

  for (const [i, useCase] of overrides.entries()) {
    console.log(`\nGenerating "${useCase}" use case`)
    const port = 3000 + i + 1

    const overridePath = join(overridesPath, useCase)
    const useCasePath = join(useCasesPath, useCase)

    let generatorConfig = {}
    try {
      generatorConfig = JSON.parse(await fs.readFile(join(overridePath, 'generator-config.json'), { encoding: 'utf-8' }))
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error
      }
    }

    const { readmeReplacements } = generatorConfig

    console.log('Copying the template')
    const pathsToDelete = (await fs.readdir(useCasePath).catch(() => []))
      .filter(file => !filesToIgnore.includes(file))
      .map(file => join(useCasePath, file))
    await deletePath(pathsToDelete)
    await merge(templatePath, useCasePath, { filter: (path) => !filesToIgnore.includes(basename(path)) })

    for (const path of pathsToOverwrite) {
      if (await exists(join(overridePath, ...path))) {
        console.log(`Deleting "${path.join('/')}" path from the template`)
        await deletePath(join(useCasePath, ...path))
      }
    }

    console.log(`Applying overrides`)
    await merge(overridePath, useCasePath, { filter: (path) => !filesToIgnore.includes(basename(path)) })

    console.log('Transforming package.json and package-lock.json files')
    const packageName = `reference-app-${useCase}`
    await transformJson(join(useCasePath, 'package.json'), (packageJson) => {
      packageJson.name = packageName
    })
    await transformJson(join(useCasePath, 'package-lock.json'), (packageLockJson) => {
      packageLockJson.name = packageName
      packageLockJson.packages[''].name = packageName
    })

    for (const file of markdownFiles) {
      console.log(`Generating the ${file} file`)
      const readmePath = join(useCasePath, file)
      await fs.cp(join(rootPath, file), readmePath)
      await replace(readmePath, { '{use-case}': useCase, ...readmeReplacements })
    }

    console.log('Copying docs/ folder')
    await merge(join(rootPath, 'docs'), join(useCasePath, 'docs'))

    console.log('Copying guides/ folder')
    await merge(join(rootPath, 'guides'), join(useCasePath, 'guides'))

    const envPath = join(useCasePath, '.env')
    if (!(await exists(envPath))) {
      await fs.cp(join(useCasePath, '.env.example'), envPath)
    }

    await replace(envPath, { 'localhost:3000': `localhost:${port}` })
  }
}

async function transformJson(path, transformFn) {
  const json = JSON.parse(await fs.readFile(path, { encoding: 'utf-8' }))
  transformFn(json)
  await fs.writeFile(path, JSON.stringify(json, null, 2), { encoding: 'utf-8' })
}

async function replace(path, replacements) {
  let text = await fs.readFile(path, { encoding: 'utf-8' })

  for (const [key, value] of Object.entries(replacements)) {
    text = text.replaceAll(key, Array.isArray(value) ? value.join('\n') : value)
  }

  await fs.writeFile(path, text, { encoding: 'utf-8' })
}

async function merge(from, to, options) {
  await mkdirp(join(to, '..'))
  
  try {
    await fs.cp(from, to, { recursive: true, ...options })
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`Warning: Source doesn't exist: ${from}`)
    } else {
      throw error
    }
  }
}

async function deletePath(path) {
  await rimraf(path)
}

async function exists(path) {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

generate()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .then(() => {
    console.log('\nDone!')
    process.exit(0)
  })
