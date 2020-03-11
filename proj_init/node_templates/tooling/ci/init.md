### CI

CI stands for Continuous Integration.  This is roughly the idea that changes can be pushed to the remote repo's main branch at any time, by any permissioned contributor.  This is safeguarded by the use of automated validation like linters and automated tests.  There are a number of other things that can be checked, like ensuring the build is successful or code testing coverage hasn't regressed, but ultimately if the CI tool passes you can then run additional steps to release your code.

* **Uses:** GitHub Actions
* **Config File:** /.github/workflows/npmpublish.yml

* **Uses:** Semantic-Versioning
* **Config File:** /.releaserc
* /CHANGELOG.md

In this case, we're checking in the code to GitHub, running tests, and if successful, calling the release tool.  The release tool (Semantic-Versioning) will then read the recent commits (since the last publish to the GitHub) and determine if the code should be versioned.  This follows typical SemVer protocal, if there are any 'fix' commits it'll bump the patch number, if there are any features, the minor version number (major versions are denoted in a special way that commitzen helps with).

Semantic-Versioning also updates the version number in your package.json, as well as updating the Changelog with all recent commits and versions.  The config file will allow plugins to be used (to tell Semantic Versioning what to do if the code is versioned).