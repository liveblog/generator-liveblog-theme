'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the brilliant ' + chalk.red('generator-lbtheme') + ' generator!'
    ));

    const prompts = [
      {
        type: 'confirm',
        name: 'someAnswer',
        message: 'Would you like to create a new liveblog theme in the current directory?',
        default: true
      },
      {
        type: 'input',
        name: 'name',
        message: 'Your theme name',
        default: this.appname
      },
      {
        type: 'input',
        name: 'label',
        message: 'Your theme title',
        default: 'My Super Theme'
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      { name: this.props.name }
    );

    this.fs.copyTpl(
      this.templatePath('_Makefile'),
      this.destinationPath('Makefile'),
      { name: this.props.name }
    );

    this.fs.copyTpl(
      this.templatePath('_theme.json'),
      this.destinationPath('theme.json'),
      { name: this.props.name, label: this.props.label }
    );

    this.fs.copy(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js')
    );

    mkdirp.sync('templates');
    mkdirp.sync('less');
  }

  install() {
    this.npmInstall();
  }
};
