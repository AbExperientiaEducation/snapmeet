var dest = "./public/js"
var src = './src'

module.exports = {
  browserSync: {
    proxy: "http://localhost:3000",
    port: "5000",
    browser: ['google chrome']
  },
  sass: {
    src: src + "/sass/**/*.{sass,scss}",
    dest: dest,
    settings: {
      indentedSyntax: true, // Enable .sass syntax!
      imagePath: 'images' // Used by the image-url helper
    }
  },
  browserify: {
    entries: [src + '/client/main.es6'],
    dest: dest,
    outputName: 'bundle.js',
    detectGlobals: false,
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
      es6: 'node --harmony'
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
      "immutable"
    ]
  }
}