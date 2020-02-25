const { parseArgs } = require('../main')
// const { validateInput, askCnfgDefaults } = require('../main')

test('initial', () => {
  expect(parseArgs(['', '', 'base', 'test'])).toMatchInlineSnapshot(`
    Object {
      "options": Object {
        "cnfg": "",
        "dirName": "test",
        "dirPath": "cwd",
        "exclude": Array [],
        "include": Array [],
      },
      "template": "base",
    }
  `)
})

// test('no cmd specified', () => {
//   expect(parseArgs(['', '', '--help'])).toMatchInlineSnapshot()
//   expect(parseArgs(['', ''])).toMatchInlineSnapshot()
// })
