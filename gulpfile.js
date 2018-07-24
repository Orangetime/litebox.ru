var gulp       = require('gulp'),
    sass         = require('gulp-sass'), 
    browserSync  = require('browser-sync'), 
    concat       = require('gulp-concat'), 
    cssnano      = require('gulp-cssnano'), 
    rename       = require('gulp-rename'), 
    del          = require('del'), 
    imagemin     = require('gulp-imagemin'), 
    pngquant     = require('imagemin-pngquant'), 
    cache        = require('gulp-cache'), 
    autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function(){ 
    return gulp.src('src/sass/**/*.sass') 
        .pipe(sass()) 
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('src/css')) 
        .pipe(browserSync.reload({stream: true})) 
});

gulp.task('browser-sync', function() { 
    browserSync({ 
        server: { 
            baseDir: 'src' 
        },
        notify: false 
    });
});

gulp.task('css-icon', ['sass'], function() {
    return gulp.src(['src/css/fontello.css', 'src/css/iconmoon.css']) 
        .pipe(cssnano()) 
        .pipe(rename({suffix: '.min'})) 
        .pipe(gulp.dest('src/css')); 
});

gulp.task('watch', ['browser-sync', 'css-icon'], function() {
    gulp.watch('src/sass/**/*.sass', ['sass']); 
    gulp.watch('src/*.html', browserSync.reload); 
});

gulp.task('clean', function() {
    return del.sync('dist'); 
});

gulp.task('img', function() {
    return gulp.src('src/img/**/*') 
        .pipe(cache(imagemin({ 
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')); 
});

gulp.task('build', ['clean', 'img', 'sass', 'css-icon'], function() {

    var buildCss = gulp.src([ 
        'src/css/main.css',
        'src/css/fontello.min.css',
        'src/css/iconmoon.min.css'
        ])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('src/fonts/**/*') 
    .pipe(gulp.dest('dist/fonts'))


    var buildHtml = gulp.src('src/*.html') 
    .pipe(gulp.dest('dist'));

});

gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('default', ['watch']);