### Tester

Tests are critical for preventing regressions and give developers confidence to undertake refactors.  Jest specifically is great for running unit and integration tests.  Mostly you'll set up assertions (x is equal to y, x returns an object, etc).  There are a few optional modes that have been set up in the package.json scripts:

* **Watch:** will watch for changes and runs tests after every save.  You can also specify small subsets of tests to run, specific files to watch, etc
* **Coverage:** will generate a code report and create a /coverage/ directory where you can view the coverage report
* **Debug:** will launch chrome's devtools to step through the code

Jest will execute any file named as *.test.js or in a /\_\_tests\_\_/ directory.  There is an example test in the /\_\_tests\_\_/test.js file 

* **Uses:** Jest
* **Config File:** /jest.config.js

Jest has a prompter for generating a config file that can be run w/
```
=> jest --init
```
but this project has been initialized with a general config file already.  You can delete that one and run the prompter if you'd prefer (has options for if testing code that will run in the browser, older node version, etc)

**Note:** a growing practice is TDD (Test Driven Development).  This involves writing tests *before* writing code, completing the feature enough to make the test run and then writing a test for more expansive functionality then writing the code that will make it pass.  Its a fairly iterative technique that requires some experience w/ writing tests to work fluidly, but is becoming a growing practice as it ensures that all written code is testable and serves as its own kind of documentation and scope control.