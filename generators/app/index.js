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
        message: 'Your theme name ( uniq key used internal )',
        default: `${this.appname[0]}${this.appname.substr(1).replace(/([A-Z])/g,'-$1').replace(/\s/g, '-').toLowerCase()}`
      },
      {
        type: 'input',
        name: 'description',
        message: 'Your theme title',
        default: this.appname
      },
      {
        type: 'list',
        name: 'base',
        message: 'Which theme you want to extend',
        choices: ['default', 'amp'],
        default: 'default'
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
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('_Makefile'),
      this.destinationPath('Makefile'),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('_theme.json'),
      this.destinationPath('theme.json'),
      this.props
    );

    this.fs.copy(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js')
    );

    this.fs.copyTpl(
      this.templatePath('_rev-manifest.json'),
      this.destinationPath('dist/rev-manifest.json'),
      this.props
    );

    this.fs.copy(
      this.templatePath('images'),
      this.destinationPath('images')
    );

    this.fs.copy(
      this.templatePath('test'),
      this.destinationPath('test')
    );

    this.fs.copyTpl(
      this.templatePath('less/_theme.less'),
      this.destinationPath('less/' + this.props.name + '.less'),
      this.props
    );
    
    this.fs.copyTpl(
      this.templatePath('less/topImport.less'),
      this.destinationPath('less/topImport.less')
    );

    mkdirp('templates');
    mkdirp('less');
  }

  install() {
    this.npmInstall();
  }
};
