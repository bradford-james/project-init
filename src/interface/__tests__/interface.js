const { parseArgs } = require('../main')
// const { validateInput, askCnfgDefaults } = require('../main')

test('initial', () => {
  expect(parseArgs(['', '', 'base', 'test'])).toMatchInlineSnapshot(`
    Object {
      "options": Object {
        "dirName": "test",
        "dirPath": "cwd",
        "displayCnfgFlag": false,
        "exclude": Array [],
        "include": Array [],
        "manualFlag": false,
        "setCnfgFlag": false,
      },
      "template": "base",
    }
  `)
})

// test('no cmd specified', () => {
//   expect(parseArgs(['', '', '--help'])).toMatchInlineSnapshot()
//   expect(parseArgs(['', ''])).toMatchInlineSnapshot()
// })
