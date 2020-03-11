### Commit Linter

* **Uses:** Commitizen & Commit Lint
* **Config File:** /commitlint.config.js

When commiting to version control you always have to enter a message, sometimes followed by a longer description.  A quick way to get an overview of the project history is to run:
```
=> git log --oneline
```
This will print all commits with the commit message.  This can get messy pretty fast and obscure the flow of changes if the messaging isn't clear or direct.  There are a few standards out there for enforcing clear, consistent messages, this just happens to be one of them.  

When using **npm run commit**, a prompter will launch after the validation scripts have run and ask a series a questions which will generate a formatted commit message (this is commitizen).  Afterwards, the tool Commit Lint will check that this message matches the enforced format.  If you just want to use **git commit -m 'message here'**, you won't have to go through the prompter, but the linter will still run so you'll need to follow the proper format.  This looks something like the following:

```
type(subject): message
```
In this case the dominant types are 'fix' & 'feature' (which will later tell our release tool how to bump the SemVer), but there are many types that are used like 'chore', 'refactor', 'documentation'.  The subject is one word describing the subject of the changes ('interface','prompter','data').  The message is less than 60 characters describing the change.  All characters of the type, subject, and message must be lower case.  Again, commitzen takes care of all of this.