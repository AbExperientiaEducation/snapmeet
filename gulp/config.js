var dest = "./public"
var src = './src'

module.exports = {
  sass: {
    src: src + "/style/app.scss"
    , watch: src + "/style/**/*.scss"
    , dest: "./public"
    , settings: {
      imagePath: 'images' // Used by the image-url helper
      , includePaths: require('node-bourbon').includePaths
    }
  }
  , less: {
    src: src + "/style/addons.less"
    , watch: src + "/style/**/*.less"
    , dest: "./public"
  }
  , browserify: {
    entries: [src + '/client/main.es6']
    , dest: dest
    , outputName: 'js/bundle.js'
    , detectGlobals: true
    , fast: true
    , noBundleExternal: true
    // cache opts are necessary for watchify to work correctly
    , cache: {} 
    , packageCache: {} 
    , fullPaths: true
  }
  , revReplace: {
    manifestFile: './public/manifest.json'
    , indexPath: './views/'
    , indexName: 'index.html'
    , watch: ['public/js/**', 'public/style/**', 'views/index.html']
  }
  , nodemon: {
    script: 'src/server/server.es6'
    , watch: ['src/server/', 'src/shared/']
    , execMap: {
      es6: 'babel-node'
    }
  }
  , production: {
    cssSrc: dest + '/*.css'
    , jsSrc: dest + '/*.js'
    , dest: dest
  }
  , libs: {
    dest: dest
    , srcs: [
      "reqwest"
      , "socket.io-client"
      , "lodash"
      , "keymirror"
      , "flux"
      , "react"
      , "react/addons"
      , "co"
      , "events"
      , "shortid"
      , "immutable"
      , "quill"
      , "rich-text"
      , "share/lib/client/index.js"
      , "react-router"
      , "share/lib/client/textarea.js"
      , "ot-text"
      , "material-ui"
      , "simplewebrtc"
      , "react-spinkit"
    ]
  }
}
