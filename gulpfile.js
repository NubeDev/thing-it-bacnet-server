const gulp = require('gulp');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const mocha = require('gulp-mocha');
const clean = require('gulp-clean');

const folderApp = './dist'; // .
const folderSrc = './src'; // ./src
const folderConf = '.'; // .
const folderTests = `./tests`;

const tsProject = ts.createProject(`${folderConf}/tsconfig.app.json`);
const tsTest = ts.createProject(`${folderConf}/tsconfig.spec.json`);

gulp.task('clean:code', () => {
    return gulp.src(folderApp, { read: false })
        .pipe(clean({ force: true }));
});
gulp.task('clean:test', () => {
    return gulp.src(folderTests, { read: false })
        .pipe(clean({ force: true }));
});

gulp.task('build:code', gulp.series( 'clean:code', () => {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest(folderApp));
}));
gulp.task('build:test', gulp.series( 'clean:test', () => {
    return tsTest.src()
        .pipe(tsTest())
        .js.pipe(gulp.dest(folderTests));
}));

gulp.task('start:test:unit', () => {
    return gulp.src([ `${folderTests}/**/*.spec.js`, `!${folderTests}/thing-it-tests/**/*.spec.js` ])
        .pipe(mocha({
            reporter: 'progress'
        }));
});
gulp.task('start:test:mock', () => {
    return gulp.src(`${folderTests}/thing-it-tests/**/*.spec.js`)
        .pipe(mocha({
            reporter: 'progress'
        }));
});

gulp.task('tslint:test', () =>
    gulp.src([ `${folderSrc}/**/*`, '!node_modules/**' ])
        .pipe(tslint({
            configuration: `${folderConf}/tslint.json`,
        }))
        .pipe(tslint.report())
);
gulp.task('tslint:code', () =>
    gulp.src([ `${folderSrc}/**/*.ts`, '!./node_modules/**/*', `!${folderSrc}/**/*.spec.ts` ])
        .pipe(tslint({
            configuration: `${folderConf}/tslint.json`,
        }))
        .pipe(tslint.report())
);

gulp.task('watch:test:unit', gulp.series(  'tslint:test', 'build:test' , 'start:test:unit', () => {

    gulp.watch([ `${folderSrc}/**/*.ts` ], gulp.series('tslint:test', 'build:test', 'start:test:unit'));
}));
gulp.task('watch:test:mock', gulp.series(  'tslint:test', 'build:test', 'start:test:mock', () => {

    gulp.watch([ `${folderSrc}/**/*.ts` ], gulp.series('tslint:test', 'build:test', 'start:test:mock'));
}));

gulp.task('watch:build:test', gulp.series(  'tslint:test', 'build:test' , () => {
    gulp.watch([ `${folderSrc}/**/*.ts` ], gulp.series('tslint:test', 'build:test'));
}));

let spawn = require('child_process').spawn;
let node;

gulp.task('start', () => {
    if (node) node.kill();
    node = spawn('node', [`${folderApp}/index.js`], { stdio: 'inherit' });
});

gulp.task('watch:build:code', gulp.series(  'tslint:code', 'build:code', 'start', () => {

    gulp.watch([ `${folderSrc}/**/*.ts`, '!./node_modules/**/*', `!${folderSrc}/**/*.spec.ts` ], gulp.series('tslint:code', 'build:code', 'start'));
}));


