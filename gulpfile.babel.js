import gulp from 'gulp'
import babel from 'gulp-babel'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import webpack from 'webpack-stream'

gulp.task('build', () => {
	gulp.src('src/**/main.js')
		.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
		.pipe(babel())
		.pipe(gulp.dest('lib'))
})

gulp.task('bundle', () => {
	gulp.src('main.js')
		.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
		.pipe(webpack({
			output: {filename: 'browser.js'}
		}))
		.pipe(gulp.dest('./'))
})

gulp.task('watch', () => {
	gulp.watch('src/**/*.js', ['build'])
	gulp.watch('main.js', ['bundle'])
})

gulp.task('default', ['build', 'watch'])
