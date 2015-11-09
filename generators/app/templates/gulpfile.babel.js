'use strict';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import {stream as wiredep} from 'wiredep';

const fs = require('fs');
const $ = gulpLoadPlugins();
const reload = browserSync.reload;


function lint(files, options) {
    return () => {
        return gulp.src(files)
            .pipe(reload({stream: true, once: true}))
            .pipe($.eslint(options))
            .pipe($.eslint.format())
            .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
    };
}

gulp.task('lint', lint('theme/*.js'));

gulp.task('embed', () => {
    var theme = JSON.parse(fs.readFileSync('theme/theme.json', 'utf8'));
    function prependIfLocal(url, prefix) {
        if (!url) { return [];}
        return url.map(function(source) {
            if (source.startsWith('//') || source.startsWith('http://') || source.startsWith('https://')) {
                return source;
            }
            return prefix + source;
        });
    }
    var depsCss = [], depsJavascript = [];
<% if (useAngularBase) { %>

    // angular base
    var angularBase = JSON.parse(fs.readFileSync('deps/angular/theme.json', 'utf8'));
    depsCss = prependIfLocal(angularBase.styles, 'deps/angular/');
    depsJavascript = prependIfLocal(angularBase.scripts, 'deps/angular/');
<% } %>
    // custom theme
    depsCss = depsCss.concat(prependIfLocal(theme.styles, 'theme/'));
    depsJavascript = depsJavascript.concat(prependIfLocal(theme.scripts, 'theme/'));
    // format links
    depsCss = depsCss.map(function(url) {return '<link rel="stylesheet" media="all" href="'+url+'" />';});
    depsJavascript = depsJavascript.map(function(url) {return '<script src="'+url+'"></script>';});
    return gulp.src('./embed.html')
        .pipe($.template({
            depsCss: depsCss.join('\n'),
            depsJavascript: depsJavascript.join('\n'),
            themeLabel: theme.label
        }))
        .pipe($.include())
            .on('error', console.log)
        .pipe(gulp.dest('./.tmp/'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['lint', 'embed'], () => {
    browserSync({
        notify: false,
        port: 9000,
        server: {
            index: 'embed.html',
            baseDir: ['.tmp', 'theme'],
            routes: {
                '/bower_components': 'bower_components',
                '/deps': 'deps',
                '/theme': 'theme'
            }
        }
    });

    gulp.watch([
        'theme/**',
        '.tmp/*',
    ]).on('change', reload);
    gulp.watch(['embed.html', 'theme/template.html', 'theme/theme.json'], ['embed']);
    gulp.watch('bower.json', ['wiredep']);
});

// inject bower components
gulp.task('wiredep', () => {
    gulp.src('theme/*.html')
        .pipe(wiredep({
            ignorePath: /^(\.\.\/)*\.\./
        }))
        .pipe(gulp.dest('theme'));
});

gulp.task('build', ['lint'], () => {
    var theme = JSON.parse(fs.readFileSync('theme/theme.json', 'utf8'));
    return gulp.src(['theme/**/*'])
        .pipe($.zip(theme.name + '-' + new Date().toISOString().slice(0, 10) + '.zip'))
        .pipe(gulp.dest('dist'))
        .pipe($.size({title: 'build'}));
});

gulp.task('default', ['clean'], () => {
    gulp.start('build');
});
