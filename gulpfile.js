import gulp from "gulp";
import {
  deleteAsync
} from "del";
import yargs from 'yargs';
import {
  hideBin
} from 'yargs/helpers';
import gulpif from "gulp-if";
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
import cleancss from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import groupmediaqueries from 'gulp-group-css-media-queries';
import sourcemaps from 'gulp-sourcemaps';
import webpHtmlNosvg from "gulp-webp-html-nosvg";
import htmlmin from 'gulp-htmlmin';
import browsersync from 'browser-sync';
import terser from 'gulp-terser'; // бывший uglify-es
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import svgsprite from "gulp-svg-sprite";
import webp from "gulp-webp";
import imagemin from "gulp-imagemin";
import newer from "gulp-newer";

// переменные окружения
const argv = yargs(hideBin(process.argv)).argv;
const isDev = () => {
  return !argv.docs;
}
const isProd = () => {
  return !!argv.docs;
}

// очистка билд директории
const clean = () => {
  return deleteAsync(['docs']);
}

// копирование доп файлов
const resources = () => {
  return gulp.src('dev/res/**')
    .pipe(gulp.dest('docs'));
}

const fonts = () => {
  return gulp.src('dev/fonts/**')
    .pipe(gulp.dest('docs/fonts'));
}

const json = () => {
  return gulp.src('dev/json/**')
    .pipe(gulp.dest('docs/json'));
}

// сервер
const server = (done) => {
  browsersync.init({
    server: {
      baseDir: `${'docs'}`
    },
    notify: false,
    port: 3000,
  });
}

// стили
const sass = gulpSass(dartSass);
const scss = () => {
  return gulp.src("dev/styles/**/*.scss", {
      sourcemaps: isDev
    })
    // .pipe(gulpif((isDev), sourcemaps.init()))
    .pipe(sass({
      outputStyle: 'expanded' // красивая табуляция
      // outputStyle: 'compressed'  // минификация
    }))
    // .pipe(gulpif((isProd), groupmediaqueries()))
    .pipe(gulpif((isProd),
      autoprefixer({
        grid: true,
        overrideBrowserslist: ["last 3 versions"],
        cascade: true
      })
    ))
    .pipe(gulpif((isProd), cleancss()))
    .pipe(rename({
      extname: ".min.css"
    }))
    .pipe(gulp.dest('docs/css'))
    .on("end", browsersync.reload);
}

const html = () => {
  return gulp.src("dev/**/*.html")
    .pipe(webpHtmlNosvg())
    .pipe(gulpif(isProd, htmlmin({
      collapseWhitespace: true
    })))
    .pipe(gulp.dest('docs'))
    .pipe(browsersync.stream());
}

// js
const js = () => {
  return gulp.src(['dev/js/lib/*.js', 'dev/js/blocks/*.js'])
    .pipe(gulpif((!isProd), sourcemaps.init()))
    .pipe(gulpif(isProd, babel({
      presets: ['@babel/env']
    })))
    .pipe(concat('all.min.js'))
    .pipe(gulpif(isProd, terser()))
    .pipe(gulpif(!isProd, sourcemaps.write("../maps")))
    .pipe(gulp.dest('docs/js'))
    .on("end", browsersync.reload);
}

// svg
const svgSprite = () => {
  return gulp.src('dev/images/svg/*.svg')
    .pipe(svgsprite({
      mode: {
        stack: {
          sprite: `../svg/sprite.svg`,
          // example: true // превью всех свгшек , можно не включать
        }
      }
    }))
    .pipe(gulp.dest('docs/images/'));
}

// image, webp
const images = () => {
  return gulp.src('dev/images/*.*')
    .pipe(newer('docs/images'))
    .pipe(webp())
    .pipe(gulp.dest('docs/images'))
    .pipe(gulpif(isProd, gulp.src('dev/images/*.*')))
    .pipe(gulpif(isProd, newer('docs/images')))
    .pipe(gulpif(isProd,
      imagemin({
        progressive: true,
        svgPlugins: [{
          removeViewBox: false
        }],
        interlaced: true,
        optimizationLevel: 3 // 0 to 7
      })
    ))
    .pipe(gulp.dest('docs/images'))
    .on("end", browsersync.reload);
}


function watcher() {
  gulp.watch('dev/res/**/*.*', resources);
  gulp.watch('dev/fonts/**', fonts);
  gulp.watch('dev/**/*.html', html);
  gulp.watch('dev/styles/**/*.scss', scss);
  gulp.watch('dev/js/**/*.*', js);
  gulp.watch('dev/images/svg/*.svg', svgSprite);
  gulp.watch('dev/images/*.*', images);
  gulp.watch('dev/json/*.*', json);
}


const main = gulp.parallel(resources, fonts, json, html, scss, js, svgSprite, images);
export const dev = gulp.series(clean, main, gulp.parallel(watcher, server));
export const docs = gulp.series(clean, main);
gulp.task('default', dev);