### Version Control Repo

* **Uses:** GitHub

This is a remote repository, where you code is stored and can be viewed, forked, or cloned by just about anybody.  This way other contributors are able to view and work on your project.  As changes are committed locally (as described above), you can then push the changes to the remote repo.  In this case, we're using GitHub.  The tool automation will go ahead and set up a repo on GitHub with your project name, assuming you've set your credentials as environmental variables at the tool root directory (don't worry, just run the tool and it'll explain how to do this).

As you'll see below, this process is handled with CI and versioning with the script:
```
=> npm run release
```
Otherwise you can just use:
```
=> git push
```