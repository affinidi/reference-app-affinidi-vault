import fs from 'fs/promises'
import { dirname, join } from 'path'
import url from 'url'

const __dirname = dirname(url.fileURLToPath(import.meta.url))

export async function generateAppInformation() {
    const rootPath = join(__dirname, '..')
    const samplesPath = join(rootPath, 'samples')
    const appsPath = join(samplesPath, 'apps.json')
    const generatePath = join(rootPath, 'generator')

    const folders = (await fs.readdir(generatePath, { withFileTypes: true }))
                    .filter(dir => dir.isDirectory())
                    .map(dir => dir.name)

    let appInformation = {}
    for (const folder of folders) {
        const appPath = join(generatePath, `${folder}/template`)
        const redirectUrisInformationPath = join(appPath, 'appInformation.json')

        try {
            const contents = await (fs.readFile(redirectUrisInformationPath, 'utf-8'))
            if (!contents) {
                throw Error('App information missing in template!')
            }
            const data = JSON.parse(contents)
            appInformation = {
                ...appInformation,
                ...data
            }
        } catch(err) {
            throw new Error(err)
        }
    }

    await updateAppsInformation(appInformation, appsPath)
}

export async function updateAppsInformation(appInformation, filePath) {
    fs.writeFile(filePath, JSON.stringify(appInformation,null,4))
}