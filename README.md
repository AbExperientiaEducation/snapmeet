## Getting started

### Install Global Dependencies
- Install node through nvm. See https://github.com/creationix/nvm
- Install babel
`npm install --global babel`
- Install gulp
`npm install --global gulp`
- install node-migrate from our harmony fork
`npm install -g migrate`
- install npm-shrinkwrap
`npm install -g npm-shrinkwrap`
- install neo4j
`brew install neo4j`
- install JDK7 (neo4j dependency)
`http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html`
- install and setup mongo
`brew install mongo`
`sudo mkdir /data`
`sudo mkdir /data/db`
`sudo chown `whoami` /data/db`

### Install Project Dependencies
`npm install`

### Run Migrations
`tasks/harmony_migrate`

### Start build process/server
`gulp`
`mongod`

### Server-side Debugging
Node-inspector looks/works a lot like the chrome inspector, and makes it significantly easier to debug node.

- Make sure you have node-inspector installed
`npm install -g node-inspector`
- Start build process/server in debug mode
`gulp --debug`
- Start node-inspector (it should attach to the running node process)
`node-debug`

### Sublime Text Setup
* Add Package Control by following `https://sublime.wbond.net/installation`
* Add packages via Package Control `cmd + shift + p`
    - SublimeGit 
    - Fix Mac Path
    - Babel
    - SCSS
* Optional Packages
    - BracketHiglighter
    - GitGutter
    - GotoRowCol

* Add to sublime settings:
    "tab_size": 2,
    "translate_tabs_to_spaces": true

### Dev Environment Additions
#### Git hooks
- Add a pre-commit hook for `shrinkwrap`
    - `touch .git/hooks/pre-commit`
    - `chmod +x !$`
    - Add this to the newly created file
        ```
        #!/bin/sh

        if ( git diff --cached --name-status | grep -q '[[:blank:]]package.json' ) && ! ( git diff --cached --name-status | grep -q npm-shrinkwrap.json ); then
            echo "Running shrinkwrap and adding new npm-shrinkwrap.json to staged files"
            npm-shrinkwrap --dev
            git add ./npm-shrinkwrap.json
        fi
        ```

## Helpful development stuff

- Ignore node_modules and bundles in sublime text search
`Sublime Text -> Preferences -> Settings - User`
`"binary_file_patterns":
 [
   "node_modules/*",
   "public/js/bundle.js",
   "public/lib/common.js"
 ],`
- Install react developer tools for chrome
`https://github.com/facebook/react-devtools`

## Running in Production
### WIP
- `gulp build`
- `babel-node src/server/server.es6`
