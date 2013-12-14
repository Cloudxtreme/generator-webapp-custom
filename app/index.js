'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var WebappCustomGenerator = module.exports = function WebappCustomGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.installDependencies({ skipInstall: options['skip-install'] });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(WebappCustomGenerator, yeoman.generators.Base);

WebappCustomGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    // have Yeoman greet the user.
    console.log(this.yeoman);


    var prompts = [
        {
            name: 'appName',
            message: 'Insert the App name please.'
        },
        {
            type: 'checkbox',
            name: 'features',
            message: 'What more would you like?',
            choices: [
                {
                    name: 'Modernizr',
                    value: 'includeModernizr',
                    checked: false
                }
            ]
        }
    ];

    this.prompt(prompts, function (props) {
        this.appName = props.appName;

        var features = props.features;
        function hasFeature(feat) {
            return features.indexOf(feat) !== -1;
        }

        // manually deal with the response, get back and store the results.
        // we change a bit this way of doing to automatically do this in the self.prompt() method.
        this.includeModernizr = hasFeature('includeModernizr');

        cb();
    }.bind(this));
};

// WebappCustomGenerator.prototype.gruntfile = function gruntfile() {
// };

WebappCustomGenerator.prototype.writeIndex = function writeIndex() {
    // leo el fichero
    this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
    // proceso pasandole this que contiene los datos que he capturado
    this.indexFile = this.engine(this.indexFile, this);
    // añado scripts to index
    this.indexFile = this.appendScripts(this.indexFile, 'scripts/main.js', [
        'scripts/main.js'
    ]);
};

WebappCustomGenerator.prototype.h5bp = function h5bp() {
    this.copy('favicon.ico', 'app/favicon.ico');
    this.copy('404.html', 'app/404.html');
    this.copy('robots.txt', 'app/robots.txt');
    this.copy('htaccess', 'app/.htaccess');
};

WebappCustomGenerator.prototype.mainStylesheet = function mainStylesheet() {
    this.copy('main.scss', 'app/styles/main.scss');
};

WebappCustomGenerator.prototype.dependencies = function dependencies() {
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.copy('bowerrc', '.bowerrc');
    this.mkdir('app/bower_components');
};

WebappCustomGenerator.prototype.git = function git() {
    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
};

WebappCustomGenerator.prototype.projectfiles = function projectfiles() {
    this.copy('jshintrc', '.jshintrc');
    this.template('Gruntfile.js');
};

WebappCustomGenerator.prototype.app = function app() {
    this.mkdir('app');
    this.mkdir('app/scripts');
    this.mkdir('app/styles');
    this.mkdir('app/images');
    this.write('app/index.html', this.indexFile);
    this.write('app/scripts/main.js', 'console.log(\'Estoy dentro...\');');
};
