var gulp = require('gulp');

var dest = 'www/';

// gulp.task('copy-config', () => {
//     return gulp.src('jspm.config.js')
//         .pipe(gulp.dest(dest))
// });

// gulp.task('copy-jspm', () => {
//     return gulp.src('jspm_packages/**/*', { base: 'jspm_packages/' })
//         .pipe(gulp.dest(dest + 'jspm_packages/'))
// });

// gulp.task('watch', () => {
//     gulp.watch(['jspm.config.js'], ['copy-config']);
//     gulp.watch(['jspm_packages/**/*'], ['copy-jspm']);
//
// });

//gulp.task('default', ['copy-config', 'copy-jspm', 'watch']);
gulp.task('default');