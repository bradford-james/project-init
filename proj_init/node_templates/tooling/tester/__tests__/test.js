// below is a sample test using the JS framework 'Jest".
// Visit: https://www.valentinog.com/blog/jest/ and jump down to 'Jest Tutorial: test structure and a first failing test' for more background on writing tests

// use 'npm t' from the command line/bash to run tests

const testFunction = () => 5 + 3
const expectedResult = 8

test('Initial Test', () => {
  expect(testFunction()).toBe(expectedResult)
})
