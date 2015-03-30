## Getting started

### Install Global Dependencies
- Install node through nvm. See https://github.com/creationix/nvm
- Install gulp
`npm install --global gulp`
- install neo4j
`brew install neo4j`
- install JDK7 (neo4j dependency)
`http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html`

### Install Project Dependencies
`npm install`

### Start build process/server
`gulp`

### Server-side Debugging
Node-inspector looks/works a lot like the chrome inspector, and makes it significantly easier to debug node.

- Make sure you have node-inspector installed
`npm install -g node-inspector`
- Start build process/server in debug mode
`gulp --debug`
- Start node-inspector (it should attach to the running node process)
`node-debug`

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
