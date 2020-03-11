### Formatter

Ensures consistent formatting across your project, mostly for readability.  Will keep line indents, characters per line, etc in check.

* **Uses:** Prettier
* **Config File:** /.prettierrc.js

prettier out of the box has a default for all of its settings, but these can be adjusted by declaring in the config as a key/value pairing.

i.e.   
```
semi: false
```
This setting will remove semi colons from statement/line endings as they aren't necessary for the JS compiler, but could be changed to 'true' if you would prefer to always use semi-colons.