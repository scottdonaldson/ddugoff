var _ = require('lodash'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    browserify = require('browserify'),
    uglify = require('gulp-uglify'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    buffer = require('vinyl-buffer'),
    babelify = require('babelify'),
    watchify = require('watchify'),
    fs = require('fs'),
    gm = require('gm');

var paths = {
    jsIn: 'js/src/script.js',
    jsOut: 'js/min',
    cssIn: 'sass/style.scss',
    cssOut: 'css'
};

function screenshot() {
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
}

function css() {

    var processors = [
        autoprefixer('last 2 versions')
    ];

    gulp.src( paths.cssIn )
        .pipe( sourcemaps.init() )
        .pipe( 
            sass({
                outputStyle: 'compressed'
            }).on('error', sass.logError)
        )
        .pipe( postcss(processors) )
        .pipe( sourcemaps.write('./') )
        .pipe( gulp.dest( paths.cssOut ) );

}

function build(watch) {

    var bundler;

    if ( watch ) {
        bundler = watchify(
            browserify(paths.jsIn,
                _.assign(watchify.args, {
                    debug: true
                })
            )
        );

        bundler.on('update', bundle);
    } else {
        bundler = browserify(paths.jsIn, {
            debug: true
        });
    }

    bundler.on('error', function(error) {
        console.log('Browserify error', error);
    });

    function bundle() {

        console.log('Bundle...');

        var hrTime = process.hrtime();
        var t1 = hrTime[0] * 1000 + hrTime[1] / 1000000;

        bundler
            .transform('babelify', {
                presets: ['es2015']
            })
            .bundle()
            .pipe(source('script.min.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.jsOut));

        hrTime = process.hrtime();
        var t2 = hrTime[0] * 1000 + hrTime[1] / 1000000;

        console.log('Bundle took ' + Math.round(t2 - t1) + ' ms');

    }

    return bundle();
}

gulp.task('screenshot', screenshot);
gulp.task('css', css);

gulp.task('build', function() {
    build();
});

gulp.task('build-watch', function() {
    build(true);
});

gulp.task('watch', ['screenshot', 'css', 'build-watch'], function() {
    gulp.watch('./style.css', ['screenshot']);
    gulp.watch('./sass/*.scss', ['css']);
});

gulp.task('default', ['screenshot', 'css', 'watch']);