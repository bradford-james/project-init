const fs = require('fs')
const path = require('path')

const deleteFolderRecursive = givenPath => {
  if (fs.existsSync(givenPath)) {
    fs.readdirSync(givenPath).forEach(file => {
      const curPath = path.resolve(givenPath, file)

      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse

        deleteFolderRecursive(curPath)
      } else {
        // delete file

        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(givenPath)
  } else {
    console.log(`ERRROR: Directory not found - ${givenPath}`)
  }
}

if (process.argv.slice(2)[0] === 'local') {
  let deletePath = path.join(__dirname, '../staging')
  deleteFolderRecursive(deletePath)
  deletePath = path.join(__dirname, '../../../zMock')
  deleteFolderRecursive(deletePath)
}

exports.deleteFolderRecursive = deleteFolderRecursive
