var js = [
];
var jsProd = [
    'scripts/app.min.js',
];


module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: ['**/*.less'],
        tasks: ['less:development'],
        options: {
          spawn: false,
        },
      },
    },

    connect: {
        server: {
            options: {
                port: 9000,
                base: 'app'
            }
        }
    },

    less: {
      development: {
        options: {
          paths: ["app"]
        },
        files: {
          "styles/app.css": "styles/app.less"
        }
      }
    },

    cssmin: {
        target: {
            files: [{
                expand: true,
                cwd: 'styles',
                src: ['app.css'],
                dest: 'styles',
            }]
        }
    },

    uglify: {
        options: {
          mangle: true,
          compress: {
            drop_console: true
          }
        },
        my_target: {
            files: {
                'scripts/app.min.js': js
            }
        }
    }
  });



  grunt.registerTask('run', [
     'less',
     'watch'
  ]);

  grunt.registerTask('runProd', [
      'less',
      'cssmin',
      'uglify',
      'watch'
  ]);

  grunt.registerTask('build', [
      'less',
      'cssmin',
      'uglify'
  ]);

};
