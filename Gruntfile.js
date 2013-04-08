var settings = require("./settings");
var port = (settings.webserver.port) ? settings.webserver.port : 3000;

module.exports = function(grunt) {
  grunt.initConfig({
    less: {
      all: {
        files: {
          "public/css/application.css": "app/styles/application.less",
          "public/css/responsive.css": "app/styles/responsive.less",
          "public/css/admin/bootstrap.css": "app/styles/admin/bootstrap.less",
          "public/css/admin/responsive.css": "app/styles/admin/responsive.less"
        }
      }
    },
    csstransform: {
      all: {
        files: {
          "public/css/admin/bootstrap-admin.css": "public/css/admin/bootstrap.css",
          "public/css/admin/responsive-admin.css": "public/css/admin/responsive.css"
        }
      }
    },
    watch: {
      all: {
        files: ["app/views/**/*", "app/styles/**/*", "vendor/**/*", "public/img/**/*", "app/client/**/*"],
        tasks: ["less", "csstransform", "reload"],
        options: {
          nospawn: true,
          interrupt: false,
          debounceDelay: 250
        }
      }
    },
    reload: {
      port: 35729,
      liveReload: {},
      proxy: {
        host: "localhost",
        port: port
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-reload");


  grunt.registerMultiTask('csstransform', 'Admin Bootstrap build post processing...', function() {
    //grunt.log.writeln(this.target);
    if (!this.data || !this.data.files) return;

    ba = require("./app/server/helpers/bootstrap-admin.js");
    var files = this.data.files;
    for(target in files) {
      var src = files[target];
      grunt.log.writeln("File " + src + " -> " + target + " created.");
      ba.prependCssSelectors(src, target, ".bootstrap-admin");
    }
  });

  grunt.registerTask("build", ["less", "csstransform", "removelogging", "min"]);
  grunt.registerTask("default", ["less", "csstransform", "reload", "watch"]);
};