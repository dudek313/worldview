const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const yargs = require('yargs')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const copyFile = promisify(fs.copyFile)

const prog = path.basename(__filename)

const options = yargs
  .usage('Usage: $0 [options]')
  .option('inputDir', {
    demandOption: true,
    alias: 'i',
    type: 'string',
    description: 'getcapabilities input directory'
  })
  .option('outputDir', {
    demandOption: true,
    alias: 'o',
    type: 'string',
    description: 'wmts output directory'
  })
  .option('mode', {
    demandOption: true,
    alias: 'm',
    type: 'string',
    description: 'mode'
  })
  .epilog('Extracts vector data information from GetCapabilities')

const { argv } = options
if (!argv.config && !argv.inputDir && !argv.outputDir) {
  throw new Error('Invalid number of arguments')
}

const inputDir = argv.inputDir
const outputDir = argv.outputDir

async function main () {
  if (argv.mode === 'profile') console.time('processVectorData')
  let fileCount = 0
  let errorCount = 0

  for (const file of fs.readdirSync(inputDir)) {
    try {
      fileCount += 1
      await copyFileAsync(file)
    } catch (error) {
      errorCount += 1
      console.error(`${prog}: ERROR: [${file}] ${error}\n.`)
    }
  }

  console.error(`${prog}: ${errorCount} error(s), ${fileCount} file(s)`)

  if (errorCount > 0) {
    throw new Error(`${prog}: Error: ${errorCount} errors occured`)
  }
  if (argv.mode === 'profile') console.timeEnd('processVectorData')
}

async function copyFileAsync (file) {
  if (file.endsWith('.json')) {
    const responseData = {}
    const vectorLayerFilename = file
    const vectorLayerId = vectorLayerFilename.split('.json', 1)[0]
    responseData.vectorData = {}
    responseData.vectorData[vectorLayerId] = {}
    const initialData = JSON.parse(await readFile(`${inputDir}/${file}`, 'utf-8'))
    for (const i in initialData) {
      responseData.vectorData[vectorLayerId][i] = initialData[i]
    }
    await writeFile(`${inputDir}/${file}`, JSON.stringify(responseData, null, 2), 'utf-8')
    await copyFile(`${inputDir}/${file}`, `${outputDir}/${file}`)
  }
}

main().catch((err) => {
  console.error(err.stack)
})
