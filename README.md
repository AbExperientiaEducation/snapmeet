## Getting started

### Install Global Dependencies
- Install node through nvm. See https://github.com/creationix/nvm
- Install babel
`npm install --global babel`
- Install gulp
`npm install --global gulp`
- install node-migrate from our harmony fork
`npm install -g igmcdowell/node-migrate`
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

### Configure DBs
- For `mongo`
  - Start the mongo server
  `mongod --auth`
  - Run the mongo client on command line
  `mongo`
  - Then create our admin user
  `use admin`
  `db.createUser({user:'admin', pwd:'REPLACE_FROM_ENV', roles: [{role:"userAdminAnyDatabase", db: "admin"}]})`
  - Then `exit` from the mongo shell
  - Then start a new mongo shell as our admin
  `mongo -u admin -p REPLACE_FROM_ENV --authenticationDatabase admin`
  - Then create our working user
  `use test`
  `db.createUser({user:'meetgun', pwd:'REPLACE_FROM_ENV', roles: [{role:"readWrite", db: "test"}]})`

- For neo4j
  - Copy the neo4j auth file from somewhere... Ian and Ben have it.

### Install Project Dependencies
`npm install`

### Run Migrations
`migrate`

### Start build process/server
`gulp`
`mongod --auth`

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
* Optional sublime settings (prevent built stuff from showing up in your search):
  "binary_file_patterns":
    [
      "node_modules/*",
      "public/js/bundle*",
      "public/js/common*",
      "public/style/addons*",
      "public/style/app*"
    ]

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
See `deploy.md`
