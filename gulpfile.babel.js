import gulp from 'gulp'
import babel from 'gulp-babel'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'

gulp.task('build', ()=>{
	gulp.src('src/**/main.js')
		.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
		.pipe(babel())
		.pipe(gulp.dest('lib'))
})

gulp.task('watch', ()=>{
	gulp.watch('src/**/*.js', ['build'])
})

gulp.task('default', ['build', 'watch'])
