var dest = "./public/js"
var src = './src'

module.exports = {
  browserSync: {
    server: {
      // Serve up our build folder
      baseDir: ["./views", "public"]
    }
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
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries: [require.resolve('babelify/polyfill'), src + '/js/main.es6'],
      dest: dest,
      outputName: 'bundle.js',
      // list of externally available modules to exclude from the bundle
      external: ['jquery', 'underscore']
    }]
  },
  production: {
    cssSrc: dest + '/*.css',
    jsSrc: dest + '/*.js',
    dest: dest
  }
}