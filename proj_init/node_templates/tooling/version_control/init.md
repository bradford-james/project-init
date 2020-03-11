### Version Control

Version control is essential for tracking changes in code.  The goal should be to try work exclusive on a cohesive change, commit the code when complete, then move to the next feature/issue.  This makes versioning clear (i.e. don't refactor something that has to do with the interface if you are updating documentation or fixing a bug elsewhere).  The golden rule is to make commits small, so its more obvious what change was made and for what reason.

* **Uses:** Git
* **Config File:** /.gitignore

This project has been set up with a script to more effectively manage changees (beyond what the git cli offers):
```
=> npm run commit
```
This will run the formatter, then the linter, then the tester.  If both the linter and tester pass, then all changes are added to git staging, then commited.  This is to ensure the quality of the code being commited, prevent any regressions from being check in.

If you really don't want to run the validation tools, you can always commit by the following steps:
```
=> git add -A
=> git commit -m 'Enter a commit message describing your change'
```