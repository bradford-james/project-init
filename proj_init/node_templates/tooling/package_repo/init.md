### Package Repo

* **Uses:** npmjs.com (NPM official)

Since this is a Node 'package', a plugin to the NPM remote repo has been included in Semantic-Versioning.  So if a commit to GitHub passes CI and is versioned, it will be published out to NPM.

NPM host all packages in the Node ecosystem and is actually where the tools set up in this template repo came from.  Publishing to NPM allows other users to download your code in a way that will either install it as a code dependancy in their own project, or install it globally and set the executable in your OS's path variable (which is how you can just type **proj-init commands-and-such** from anywhere and it just works).