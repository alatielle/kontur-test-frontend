"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var run = require("run-sequence");
var del = require("del");

gulp.task("clean", function() {
  return del("build");
});

gulp.task("copy", function() {
  return gulp.src([
    "fonts/**/*.{woff,woff2,ttf,eot}",
    "js/**",
    "*.html"
    ], {
      base: "."
    })
    .pipe(gulp.dest("build"));
});

gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 2 versions",
        "ie >= 10",
        "Firefox >= 3.6",
        "Chrome >= 10",
        "Safari >= 5.1",
        "Opera >= 11.5"
      ]})
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.reload({stream: true}));
  gulp.src("style.ie-old.css")
    .pipe(plumber())
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.ie-old.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.reload({stream: true}));
});

gulp.task("pages", function() {
  gulp.src("*.html")
    .pipe(plumber())
    .pipe(gulp.dest("build"))
    .pipe(server.reload({stream: true}));
});

gulp.task("scripts", function() {
  gulp.src("js/*.js")
    .pipe(plumber())
    .pipe(gulp.dest("build/js"))
    .pipe(server.reload({stream: true}));
});

gulp.task("serve", function() {
  server.init({
    server: "build",
    notify: false,
    open: true,
    ui: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.css", ["style"]);
  gulp.watch("*.html", ["pages"]);
  gulp.watch("js/*.js", ["scripts"]);
});

gulp.task("build", function(fn) {
  run(
    "clean",
    "copy",
    "style",
    fn
  );
});
