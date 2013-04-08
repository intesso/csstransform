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
    }
  });

  grunt.loadNpmTasks("grunt-contrib-less");

  grunt.registerMultiTask('csstransform', 'Admin Bootstrap build post processing...', function() {
    //grunt.log.writeln(this.target);
    if (!this.data || !this.data.files) return;

    var files = this.data.files;
    for (target in files) {
      var src = files[target];
      var csstransform = require("csstransform");
      var csst = csstransform(src);
      csst.transformSelectorText({
        prepend: '.bootstrap-admin',
        exclude: /(.modal-backdrop|.fade)/g
      });
      csst.toString(target);
      grunt.log.writeln("File " + src + " -> " + target + " created.");
    }
  });

  grunt.registerTask("default", ["less", "csstransform"]);
};