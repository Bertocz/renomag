/*
You can use following commands:
    gulp build : creates css and script builds ready for production use
    gulp watch : watch for changes in sass/html/js and reload browser on change
    gulp sprite: create sprite.png and sprite.svg from images/icons    
*/

'use strict'

var pump = require('pump');
var gulp = require('gulp'),
    browserSync = require('browser-sync').create();

var plugin = require('gulp-load-plugins')({
    DEBUG: false,
    pattern: ['gulp-*', 'gulp.*', 'merge-stream', 'streamqueue'],
    scope: ['dependencies', 'devDependencies'],
    replaceString: /^gulp(-|\.)/,
    camelize: true,
    lazy: true
});

gulp.task('default', ['build'], function () {

});

gulp.task('build', ['css-build', 'js-build'], function () {

});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch('script/**/*.js', ['js-reload']);
    gulp.watch('*.html').on('change', browserSync.reload);
});

gulp.task('browser-sync', ['sass'], function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('js-reload', ['js'], browserSync.reload);

gulp.task('js', function () {
    return gulp.src('./script/script.js')
        .pipe(plugin.jshint())
        .pipe(plugin.jshint.reporter('default'));
});

gulp.task('js-concat', function () {
    return plugin.streamqueue({ objectMode: true },
        gulp.src('./script/svg_ie.js'),
        gulp.src('./script/wallop.js'),
        gulp.src('./script/helpers.js'),
        gulp.src('./script/script.js'))
        .pipe(plugin.concat('script.min.js'));
});

gulp.task('js-build',['js-concat'], function (){
    pump([
            gulp.src('build/*.js'),
            plugin.uglify(),
            gulp.dest('build')
        ]);
});


gulp.task('sass', ['sass:lint'], function () {
    return gulp.src('./sass/*.scss')
        .pipe(plugin.sass({ includePaths: ['./sass/'] }).on('error', plugin.sass.logError))
        .pipe(plugin.autoprefixer())
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});

gulp.task('sass:lint', function () {
    return gulp.src(['./sass/**/*.s+(a|c)ss','!./sass/shevy/*','!./sass/_sprite.scss'])
        .pipe(plugin.sassLint({
            options: {
                formatter: 'stylish'
            },
            configFile: './.sass-lint.yml'
        }))
        .pipe(plugin.sassLint.format())
        .pipe(plugin.sassLint.failOnError());
});

gulp.task('css-build', function () {
    return gulp.src('./css/*.css')
        .pipe(plugin.concatCss('style.min.css'))
        .pipe(plugin.cleanCss())
        .pipe(gulp.dest('./build'));
});

gulp.task('sprite', ['png-sprite', 'svg-sprite'], function () {
    return plugin.mergeStream(
        gulp.src('./symbol/svg/*')
            .pipe(gulp.dest('./images'))
    );
});

gulp.task('png-sprite', function () {
    var spriteData = gulp.src('images/icons/*.png').pipe(plugin.spritesmith({
        imgName: 'images/sprite.png',
        cssName: 'sass/_sprite.scss',
        imgPath: '../images/sprite.png'
    }));
    return spriteData.pipe(gulp.dest('./'));
});

gulp.task('svg-sprite', function () {

    var config = {
        log: 'info',
        dest: './',
        mode: {
            symbol: {
                render: {
                    scss: {

                    }
                }
            }
        }
    };

    return gulp.src('./images/icons/*.svg', {
        cwd: './'
    })
        .pipe(plugin.plumber())
        .pipe(plugin.svgSprite(config)).on('error', function (error) {
            console.log(error);
        })
        .pipe(gulp.dest('./'));
});