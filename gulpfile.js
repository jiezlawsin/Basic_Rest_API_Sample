var gulp = require('gulp'),
    clean = require('gulp-clean'),
    elixir = require('laravel-elixir'),
    jshint = require('gulp-jshint'),
    livereload = require('gulp-livereload');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix.task('copy');

    //===== APP CSS AND JS
    mix
      .sass('app.scss')
      .scripts([
        'app.js'
        ], 'public/js/app.js')
      .scripts([
        'jquery.min.js',
        'bootstrap.min.js',
        'parsley.min.js',
        'underscore-min.js',
        ], 'public/js/all.js')
      .styles([
        'font-awesome.css',
        ], 'public/css/all.css');

    //===== ADMIN CSS AND JS
    mix
      .sass([
        'admin-import.scss'
        ], 'public/.tmp/admin-sass-import.css')
      .sass([
        'admin.scss'
        ], 'public/.tmp/admin-sass.css')
      .scripts([
        'admin-sass-import.css',
        'admin-sass.css'
        ], 'public/css/admin.css', 'public/.tmp')
      .styles([
        'dataTables.bootstrap.min.css',
        'Jcrop.min.css',
        'animate.min.css',
        'bootstrap-toggle.css',
        'redactor.css'
        ], 'public/css/admin-plugins.css')
      .scripts([
        'jquery.min.js',
        'bootstrap.min.js',
        'jquery.dataTables.min.js',
        'jquery.sumo-datepicker.min.js',
        'dataTables.bootstrap.min.js',
        'select2.full.min.js',
        'parsley.min.js',
        'underscore-min.js',
        'jquery-ui.min.js',
        'bootstrap-notify.min.js',
        'Jcrop.min.js',
        'redactor.min.js',
        'bootstrap-toggle.min.js',
        'sumo-admin.js',
      	'sumo-asset-manager.js'
        ], 'public/js/admin.js');

    mix.task('livereload', 'public/css/app.css');

    mix.version([
        'public/css/app.css',
        'public/css/all.css',
        'public/js/all.js',
        'public/js/app.js'
    ]);
});

gulp.task("cleantmp", function () {
  return gulp.src('public/.tmp', {read: false})
    .pipe(clean());
});

gulp.on('task_start', function (e) {
  // only start LiveReload server if task is 'watch'
  if (e.task === 'watch') {
    livereload.listen();
  }
});

gulp.task("livereload", function() {
  livereload.changed('app.css');
});

// configure the jshint task
gulp.task('jshint', function() {
  return gulp.src('resources/assets/js/app.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest('public/js'));
});

// configure which files to watch and what tasks to use on file changes
gulp.watch('resources/assets/js/app.js', ['jshint']);

gulp.task("copy", function() {
    // bootstrap
    gulp.src("node_modules/bootstrap-sass/assets/fonts/bootstrap/**").pipe(gulp.dest("public/fonts/bootstrap"));
    gulp.src("node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js").pipe(gulp.dest("resources/assets/js/"));

    // font-awesome
    gulp.src("resources/bower/font-awesome/css/font-awesome.css").pipe(gulp.dest("resources/assets/css/"));
    gulp.src("resources/bower/font-awesome/fonts/**").pipe(gulp.dest("resources/assets/fonts/"));

    gulp.src("resources/bower/jquery/dist/jquery.min.js").pipe(gulp.dest("resources/assets/js/"));
    gulp.src("resources/bower/select2/dist/js/select2.full.min.js").pipe(gulp.dest("resources/assets/js/"));
    gulp.src("resources/bower/parsleyjs/dist/parsley.min.js").pipe(gulp.dest("resources/assets/js/"));

    // data tables
    gulp.src("resources/bower/datatables/media/css/dataTables.bootstrap.min.css").pipe(gulp.dest("resources/assets/css/"));
    gulp.src("resources/bower/datatables/media/images").pipe(gulp.dest("resources/assets/images/"));
    gulp.src("resources/bower/datatables/media/js/jquery.dataTables.min.js").pipe(gulp.dest("resources/assets/js/"));
    gulp.src("resources/bower/datatables/media/js/dataTables.bootstrap.min.js").pipe(gulp.dest("resources/assets/js/"));

    // jcrop 
    gulp.src("resources/bower/Jcrop/css/Jcrop.min.css").pipe(gulp.dest("resources/assets/css/"));
    gulp.src("resources/bower/Jcrop/css/Jcrop.gif").pipe(gulp.dest("public/css/"));
    gulp.src("resources/bower/Jcrop/js/Jcrop.min.js").pipe(gulp.dest("resources/assets/js/"));

    gulp.src("resources/bower/remarkable-bootstrap-notify/dist/bootstrap-notify.min.js").pipe(gulp.dest("resources/assets/js/"));
    gulp.src("resources/bower/underscore/underscore-min.js").pipe(gulp.dest("resources/assets/js/"));
    gulp.src("resources/bower/animate.css/animate.min.css").pipe(gulp.dest("resources/assets/css/"));
    
    // assets: images & fonts
    gulp.src("resources/assets/images/**").pipe(gulp.dest("public/img"));
    gulp.src("resources/assets/fonts/**").pipe(gulp.dest("public/fonts"));

});