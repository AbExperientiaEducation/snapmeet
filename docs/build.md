# Snapmeet Build Process
Snapmeet uses Gulp as a task runner to create the production versions of our files.

## Overview
All gulp tasks are located in the `gulp/tasks` directory. Each task has config options specified in the file `gulp/config.js`

## Versioning
Any asset bundling tasks use the gulp-rev plugin to generate a unique hash code. Cache expiration is handled by changing the file names, which forces the browser to request the updated copy.

We try to split code that changes rarely (library code) from code that changes often (application code) into separate bundles. This allows clients to keep the library code cached longer, at the expense of requiring an extra request the first time the page is loaded.

## Tasks

### default

Running `gulp` with no args triggers the default task, which is solely a runner for the following tasks: 

```
nodemon
start-db
start-mongo
common-js
watch
```

### nodemon
nodemon starts our node process (using babel-node), watches for changes in src/server and src/shared, and restarts the node process whenever anything changes.  These directories are specified in config.js

### start-db
This runs `neo4j` to start our graph database process.

### start-mongo
This run `mongod` to start the mongo database process.

### common-js
This task externally bundles all of our library dependencies into a common.js file. Keeping the dependencies out of our core bundle makes for faster incremental builds when developing. Anything we want to include in the external bundle must be specified in config.js.

IMPORTANT: If you make a library external by listing it in config.js you will need to run the common-js task to update the common.js bundle.

### watch
This is another task running task. It runs sets up gulp.watch for the `less`, `sass`, and `rev-replace` tasks. It also runs the `watchify` task.

### less
We do not use less directly for any of our own CSS. However, we do use the material-ui package, which is built using less.  This task builds those files into addons.css. We do not bundle them with our regular stylesheet as they rarely change and can benefit from long-term caching.

### sass
This task watches the `/style/` directory and converts our multiple sass files into a single app.css file. Note that we currently append an inline sourcemap (via gulp-sourcemaps) to refer back to the original files. This could be optimized to not load in production and save some bytes on load (~30kb).

### rev-replace
This task watches `.public/style` and `public/js` for new bundles. It builds an index.html file with appropriate references to the versioned files generated in other tasks.

### watchify
This task automatically reruns our browserify task. Watchify behaves differently from gulp.watch; rather than specifying directories to observe, it uses browserify's require graph to determine when rebundles are necessary.

### browserify
This task uses browserify to generate our js bundles. We tell browserify to ignore external libraries when building our bundle.js. We also perform a transform in this step to transpile our es6 code to es5.