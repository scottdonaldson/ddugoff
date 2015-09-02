module.exports = function(grunt) {

    // not available as grunt module?
    // after running grunt stuff, we're going to take screenshot-base.png
    // and add the current version number
    var fs = require('fs'),
        gm = require('gm');

    var css = fs.readFileSync(__dirname + '/style.css', 'utf8'),
        version;
    // break into array of lines
    css = css.split('\n');
    // find the line that starts with "Version:"
    css.forEach(function(line) {
        if ( !!line.match(/Version: /) ) version = line.slice(9);
    });

    var screenshotBase = gm(__dirname + '/screenshot-base.png');
    screenshotBase
        .font(__dirname + '/fonts/295954_1_0.ttf', 28)
        .drawText(20, 40, 'v' + version, 'NorthEast')
        .write(__dirname + '/screenshot.png', function(err) {
            if ( !err ) console.log('Generated screenshot.png');
        });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                force: true
            },
            all: ['Gruntfile.js', 'js/src/*.script.js']
        },

        uglify: {
            build: {
                files: {
                    'js/min/script.min.js': ['js/src/plugins.js', 'js/src/script.js']
                }
            }
        },

        sass: {
            dist: {
                options: {
                    compass: true,
                    style: 'compressed'
                },
                files: {
                    'css/style.min.css': 'sass/style.scss'
                }
            }
        },

        autoprefixer: {
            options: {
                browsers: ['> 1%']
            },
            no_dest: {
                src: 'css/style.min.css'
            }
        },

        watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: ['js/src/*.js'],
                tasks: ['uglify', 'jshint'],
                options: {
                    spawn: false,
                }
            },
            css: {
                files: ['sass/*.scss', 'css/style.css'],
                tasks: ['sass', 'autoprefixer'],
                options: {
                    spawn: false
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint', 'uglify', 'sass', 'autoprefixer', 'watch']);

};
