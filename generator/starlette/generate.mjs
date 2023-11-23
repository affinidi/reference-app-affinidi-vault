import fs from 'fs/promises'
import { dirname, join, basename } from 'path'
import url from 'url'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'
import { generateAppInformation } from '../generateAppInformation.mjs'

const filesToIgnore = ['.next', '.env', 'generator-config.json', '.gitkeep', 'keys', 'appInformation.json']
const pathsToOverwrite = []

const __dirname = dirname(url.fileURLToPath(import.meta.url))

async function generate() {
  await generateAppInformation()
  const rootPath = join(__dirname, '../..')
  const samplesPath = join(rootPath, 'samples')
  const generatorPath = join(rootPath, 'generator')
  const starlettePath = join(generatorPath, 'starlette')
  const overridesPath = join(starlettePath, 'overrides')
  const templatePath = join(starlettePath, 'template')

  const overrides = (await fs.readdir(overridesPath, { withFileTypes: true }))
    .filter((i) => i.isDirectory())
    .map((i) => i.name)
    .sort()

  console.log(`Detected samples: ${overrides.join(', ')}`)

  for (const [i, sample] of overrides.entries()) {
    console.log(`\nGenerating "${sample}" sample`)
 

    const overridePath = join(overridesPath, sample)
    const samplePath = join(samplesPath, sample)

    let generatorConfig = {}
    try {
      generatorConfig = JSON.parse(
        await fs.readFile(join(overridePath, 'generator-config.json'), {
          encoding: 'utf-8',
        }),
      )
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error
      }
    }

    const { readmeReplacements } = generatorConfig

    console.log('Copying the template')
    const pathsToDelete = (await fs.readdir(samplePath).catch(() => []))
      .filter((file) => !filesToIgnore.includes(file))
      .map((file) => join(samplePath, file))
    await deletePath(pathsToDelete)
    await merge(templatePath, samplePath, {
      filter: (path) => !filesToIgnore.includes(basename(path)),
    })

    for (const path of pathsToOverwrite) {
      if (await exists(join(overridePath, ...path))) {
        console.log(`Deleting "${path.join('/')}" path from the template`)
        await deletePath(join(samplePath, ...path))
      }
    }

    console.log(`Applying overrides`)
    await merge(overridePath, samplePath, {
      filter: (path) => !filesToIgnore.includes(basename(path)),
    })

    const envPath = join(samplePath, '.env')
    if (!(await exists(envPath))) {
      await fs.cp(join(samplePath, '.env.example'), envPath)
    }
  }
}

async function transformJson(path, transformFn) {
  const json = JSON.parse(await fs.readFile(path, { encoding: 'utf-8' }))
  transformFn(json)
  await fs.writeFile(path, JSON.stringify(json, null, 2), {
    encoding: 'utf-8',
  })
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
