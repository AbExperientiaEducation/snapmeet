var dest = "./public/js"
var src = './src'

module.exports = {
  sass: {
    src: src + "/style/app.scss",
    watch: src + "/style/**/*.{sass,scss}",
    dest: "./public/css",
    settings: {
      imagePath: 'images' // Used by the image-url helper
    }
  },
  browserify: {
    entries: [src + '/client/main.es6'],
    dest: dest,
    outputName: 'bundle.js',
    detectGlobals: true,
    fast: true,
    noBundleExternal: true,
    // cache opts are necessary for watchify to work correctly
    cache: {}, 
    packageCache: {}, 
    fullPaths: true
  },
  nodemon: {
    script: 'src/server/server.es6',
    watch: 'src/server/',
    execMap: {
      es6: 'babel-node'
    }
  },
  production: {
    cssSrc: dest + '/*.css',
    jsSrc: dest + '/*.js',
    dest: dest
  },
  libs: {
    dest: dest,
    srcs: [
      "reqwest",
      "lodash",
      "keymirror",
      "flux",
      "react",
      "react/addons",
      "co",
      "events",
      "shortid",
      "immutable",
      "quill",
      "rich-text",
      "share/lib/client/index.js",
      "react-router"
    ]
  }
}