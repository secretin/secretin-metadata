# secretin-metadata
Poc of nodejs usage to validate metadata and keys are ok

`yarn install`

`node index.js <username> <password> (<totp>)`

## What ?

This script verify and try to fix (WIP) any error between folders metadata and reality.

* Is there a orphan secret id with no associated metadata ?

* Is there metadata pointing on nonexistent keys ?

* Is there a secret with no user ?

* Is there a secret in no folder ? (will put it back to ROOT)

* Is there a secret in nonexistent folder ?
