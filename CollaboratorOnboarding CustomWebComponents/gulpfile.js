const gulp = require('gulp');
const map = require('gulp-map');
const browserify = require('browserify');
const tsify = require('tsify');
const babelify = require('babelify');

const webserver = require('gulp-webserver');

const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');

const path = require('path');
const projectPath = path.join('.', 'lib');
const demoPath = path.join('.', 'demo');
var fs = require('fs');
const getFilename = (src) => {
	const filename = src.replace(/^.*[\\\/]/, '');
	const extIndex = filename.lastIndexOf('.');
	return filename.substr(0, extIndex);
};

const compileTS = () => {
	const bundle = browserify(path.join('.', 'src', 'index.ts'), {
			debug: true,
		})
		.plugin(tsify)
		.transform(babelify, {
			presets: ["@babel/preset-env", "@babel/preset-react"]
		})
		.bundle()
		.pipe(source('index.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.join(projectPath)))
		.on('end', () => console.log(`[${new Date().toLocaleTimeString()}] -> js non-minified complete...`));

	// also make a minified version.
	return bundle
		.pipe(buffer())
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		// .pipe(uglify({
		//     sourceMap: true,
		// }))
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.join(projectPath)))
		.on('end', () => console.log(`[${new Date().toLocaleTimeString()}] -> js bundling complete...`));
};

const compileDemoTS = () => {
	const bundle = browserify(path.join('.', 'demo', 'index.ts'), {
			debug: true,
		})
		.plugin(tsify)
		.transform(babelify, {
			presets: ["@babel/preset-env", "@babel/preset-react"]
		})
		.bundle()
		.pipe(source('index.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.join(demoPath)))
		.on('end', () => console.log(`[${new Date().toLocaleTimeString()}] -> js non-minified complete...`));

	// also make a minified version.
	return bundle
		.pipe(buffer())
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		// .pipe(uglify({
		//     sourceMap: true,
		// }))
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.join(demoPath)))
		.on('end', () => console.log(`[${new Date().toLocaleTimeString()}] -> js bundling complete...`));
};

gulp.task('ts', gulp.series(compileTS, compileDemoTS));

gulp.task('watch', () => {
	const paths = [
		// `./framework/*.ts`,
		`./src/*.ts`,
		`./src/**/*.ts`,
		`./demo/*.ts`,
	];
	gulp.watch(paths, gulp.series('ts'));
});

/*
 * Run the server.
 */
gulp.task('server', () => {
	return gulp.src('./demo')
		.pipe(webserver({
			fallback: './index.html',
			livereload: true,
			open: true,
			port: 8081
		}));
});

gulp.task('default', gulp.parallel(['ts', 'watch', 'server']));

// gulp.task('elements', function () {
//     return gulp.src([
//         'src/**/*.ts'
//     ])
//         .pipe(map((file) => {
//             var obj = require(file.path)
//             console.log(obj)
//         }));

// });
// gulp.task('default', gulp.parallel(['elements']));