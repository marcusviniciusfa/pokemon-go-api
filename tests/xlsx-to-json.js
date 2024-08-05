const xlsx = require('xlsx')
const fsPromises = require('node:fs/promises')
const path = require('node:path')

console.log('inform the absolute path of the file ".xlsx"')
console.log('example: /path/to file.xlsx\n')

process.stdin.on('data', async (input) => {
  const [inputDirectory, inputFileName] = input.toString().replace(/\n/, '').split(' ')
  const [outputDirectory, outputFileName] = [__dirname, 'pokemons.json']
  const outputPath = path.resolve(outputDirectory, outputFileName)
  const files = await fsPromises.readdir(inputDirectory)
  for (const file of files) {
    if (file === inputFileName) {
      const workbook = xlsx.readFile(path.resolve(inputDirectory, inputFileName))
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const data = xlsx.utils.sheet_to_json(worksheet)
      await fsPromises.writeFile(outputPath, JSON.stringify(data), {
        encoding: 'utf-8',
      })
    }
  }
  try {
    await fsPromises.stat(outputPath)
    console.log(`\nfile "${outputFileName}" created in directory "${outputDirectory}" successfully! 🎉`)
    process.exit(0)
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
})
