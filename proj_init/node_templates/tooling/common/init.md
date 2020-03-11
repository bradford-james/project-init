### Common

These are items that should be included in all projects:

* /README.md

This document shows on the front page of your GitHub repo and generally is treated as a TLDR for your package (the thing people will read to get a general idea if they're interested in using your tool).  Further documentation is then generally stored in a docuemntation directory that your README will point to.

* /LICENSE

Your legal mumbo-jumbo. Typical open source projects use the MIT license, this sets the baseline for how your package can be used and needs to be credited.  The license that has been generated was read from whatever is set as your default within your local npm CLI

check by: 
```
=> npm get init.license
```