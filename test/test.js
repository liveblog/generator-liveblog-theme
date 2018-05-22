var helpers = require('yeoman-test');
var fs = require('fs-extra');
var path = require('path');
var assert = require('yeoman-assert');

it('Test: generate a liveblog theme', () => helpers.run(path.join(__dirname, '../generators/app'))
    .on('error', (error) => {
        console.log('Error:', error);
    })
    .on('ready', (generator) => {
        console.log('Start...');
    })
    .on('end', () => {
        console.log('Done!');
    })
    .withOptions({foo: 'bar'}) // Mock options passed in
    .withArguments(['name-x']) // Mock the arguments
    .withPrompts({coffee: false}) // Mock the prompt answers
    .withLocalConfig({lang: 'en'}) // Mock the local config
    .inTmpDir((dir) => {
        fs.copySync(path.join(__dirname, '../generators/app'), dir);
    })
    .then(() => {
        assert.file('dist/rev-manifest.json');
        assert.file(['gulpfile.js', 'package.json', 'images', 'less', 'Makefile', 'templates', 'test', 'theme.json']);
        assert.fileContent('Makefile', /THEME_ARCHIVE/);
    }));