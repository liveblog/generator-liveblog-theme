# generator-liveblog-theme

> [Yeoman](http://yeoman.io)


The generator allows you to easily create and scaffold your own liveblog themes.

## Getting Started

First some dependencies need to be installed (ignore `yo doctor` warnings for now):

```bash
npm install -g yo@3.1.0 generator-liveblog-theme
```

Then, initiate the generator inside an empty working directory

```bash
mkdir my-fantastic-theme
cd my-fantastic-theme
yo liveblog-theme
```
Here is the resulting directory structure of your new theme:
```bash
my-fantastic-theme $ ls   
▕ drwxr-xr-x▏32 sec │   4K│less
▕ drwxr-xr-x▏<  sec │  20K│node_modules
▕ drwxr-xr-x▏32 sec │   4K│templates
▕ -rw-r--r--▏32 sec │ 322B│Makefile
▕ -rw-r--r--▏32 sec │  95B│gulpfile.js
▕ -rw-r--r--▏32 sec │   1K│package.json
▕ -rw-r--r--▏32 sec │   4K│theme.json
```
You can now start your theme development server with:
```bash
gulp watch-static
```

Custom theme allow you to do two different things:
* Extend templates, by creating your own template following this [naming convention](https://github.com/liveblog/liveblog-default-theme/tree/master/templates) inside the `templates/` directory
* Create your own css. Just a file with the `.less` extension inside the `less/` directory, and this one will automatically be appended at the end of the existing CSS.


## License

MIT
