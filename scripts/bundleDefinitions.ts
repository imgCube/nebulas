import * as fs from 'fs'
import * as path from 'path'
import dts = require('dts-bundle')
import denodify = require('denodeify')

const readFile = denodify(fs.readFile)

dts.bundle({
  name: 'index',
  main: 'build/index.d.ts',
  indent: '  ',
  outputAsModuleFolder: true,
  removeSource: true
})

const indexDefinitionPath = path.join(__dirname, '../build/index.d.ts')
const globalDefinitionPath = path.join(__dirname, '../global.d.ts')

readFile(indexDefinitionPath, 'utf8').then((contents: string) => {
  fs.truncate(indexDefinitionPath, 0, () => {
    contents = contents.replace(/export default /g, '')
    contents = contents.replace(/interface Transaction {((.|\n)*?)}((.|\n)*?)}/g, '')

    fs.appendFile(indexDefinitionPath, contents, () => {
      readFile(globalDefinitionPath).then((contents: string) => {
        fs.appendFile(indexDefinitionPath, contents, console.error)
      }).catch(console.error)
    })
  })
}).catch(console.error)


