'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _s = require('underscore.string');

module.exports = yeoman.generators.Base.extend({
    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the ' + chalk.red('LiveblogTheme') + ' generator!'
        ));
        var prompts = [
            {
                type: 'input',
                name: 'themeLabel',
                message: 'What is the name of the theme ?',
                default: this.appname
            },
            {
                type: 'input',
                name: 'authorName',
                message: 'What is your name ?',
                default: 'anonymous'
            },
            {
                type: 'confirm',
                name: 'useAngularBase',
                message: 'Would you like to use angular ?',
                default: true
            }
        ];

        this.prompt(prompts, function (props) {
            props.themeName = _s.dasherize(props.themeLabel);
            this.props = props;
            // To access props later use this.props.someOption;
            done();
        }.bind(this));
    },

    writing: {
        app: function () {
            var files = [
                {
                    path: 'deps',
                    hide: !this.props.useAngularBase
                },
                {
                    path: 'bower.json'
                },
                {
                    path: 'embed.html'
                },
                {
                    path: 'gulpfile.babel.js',
                    template: true
                },
                {
                    path: 'package.json'
                },
                {
                    path: '.bowerrc'
                },
                {
                    path: '.editorconfig'
                },
                {
                    path: '.eslintrc'
                },
                {
                    path: '.gitattributes'
                },
                {
                    path: '.gitignore'
                },
                {
                    path: '.yo-rc.json'
                },
                {
                    path: 'theme'
                },
                {
                    path: 'theme/main.js',
                    template: true
                },
                {
                    path: 'theme/template.html',
                    template: true
                },
                {
                    path: 'theme/theme.json',
                    template: true
                }
            ];
            var generator = this;
            files.forEach(function(file) {
                if (file.hide) {
                    return;
                }
                if (file.template) {
                    generator.fs.copyTpl(
                        generator.templatePath(file.path),
                        generator.destinationPath(file.path),
                        generator.props
                    );
                } else {
                    generator.fs.copy(
                        generator.templatePath(file.path),
                        generator.destinationPath(file.path)
                    );
                }
            });
        }
    },

    install: function () {
        this.installDependencies({
            bower: false,
            npm: true
        });
    }
});
