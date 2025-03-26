const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const header = require('gulp-header');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');
const pkg = require('./package.json');

// Set the banner content
const banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
  ' */\n',
  ''
].join('');

// Compiles SCSS files from /scss into /css
function compileSass() {
  return src('scss/resume.scss')
    .pipe(sass())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(dest('css'))
    .pipe(browserSync.reload({ stream: true }));
}

// Minify compiled CSS
function minifyCss() {
  return src('css/resume.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('css'))
    .pipe(browserSync.reload({ stream: true }));
}

// Minify custom JS
function minifyJs() {
  return src('js/resume.js')
    .pipe(uglify())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('js'))
    .pipe(browserSync.reload({ stream: true }));
}

// Copy vendor files from /node_modules into /vendor
function copyBootstrap() {
  return src([
    'node_modules/bootstrap/dist/**/*',
    '!**/npm.js',
    '!**/bootstrap-theme.*',
    '!**/*.map'
  ]).pipe(dest('vendor/bootstrap'));
}

function copyJquery() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/jquery/dist/jquery.min.js'
  ]).pipe(dest('vendor/jquery'));
}

function copyJqueryEasing() {
  return src(['node_modules/jquery.easing/*.js'])
    .pipe(dest('vendor/jquery-easing'));
}

function copyFontAwesome() {
  return src([
    'node_modules/font-awesome/**',
    '!node_modules/font-awesome/**/*.map',
    '!node_modules/font-awesome/.npmignore',
    '!node_modules/font-awesome/*.txt',
    '!node_modules/font-awesome/*.md',
    '!node_modules/font-awesome/*.json'
  ]).pipe(dest('vendor/font-awesome'));
}

function copyDevicons() {
  return src([
    'node_modules/devicons/**/*',
    '!node_modules/devicons/*.json',
    '!node_modules/devicons/*.md',
    '!node_modules/devicons/!PNG',
    '!node_modules/devicons/!PNG/**/*',
    '!node_modules/devicons/!SVG',
    '!node_modules/devicons/!SVG/**/*'
  ]).pipe(dest('vendor/devicons'));
}

function copySimpleLineIcons() {
  return src([
    'node_modules/simple-line-icons/**/*',
    '!node_modules/simple-line-icons/*.json',
    '!node_modules/simple-line-icons/*.md'
  ]).pipe(dest('vendor/simple-line-icons'));
}

function copyVendor(done) {
  return parallel(
    copyBootstrap,
    copyJquery,
    copyJqueryEasing, 
    copyFontAwesome,
    copyDevicons,
    copySimpleLineIcons
  )(done);
}

// Configure the browserSync task
function serve() {
  browserSync.init({
    server: { baseDir: '' }
  });
}

// Watch files and reload
function watchFiles() {
  watch('scss/*.scss', compileSass);
  watch('css/*.css', minifyCss);
  watch('js/*.js', minifyJs);
  watch('*.html').on('change', browserSync.reload);
  watch('js/**/*.js').on('change', browserSync.reload);
}

// Define complex tasks
const build = series(
  compileSass,
  minifyCss,
  minifyJs,
  copyVendor()
);

const dev = series(
  compileSass,
  minifyCss,
  minifyJs,
  serve,
  watchFiles
);

// Export tasks
exports.sass = compileSass;
exports.minifyCss = minifyCss;
exports.minifyJs = minifyJs;
exports.copy = copyVendor;
exports.build = build;
exports.dev = dev;
exports.default = build;
