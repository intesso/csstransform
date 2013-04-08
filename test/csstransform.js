var assert = require('assert');
var Lazy = require('lazy');
var fs = require('fs');

describe('csstransform(css)', function() {
	it('should read the css file', function(done) {

		var path = require('path');
		var css = path.normalize(__dirname + '/input/bootstrap.css');
		var target = path.normalize(__dirname + '/output/bootstrap1.css');
		var csstransform = require('../index');
		var csst = csstransform(css);
		csst.transformSelectorText({
			prepend: '.bootstrap-admin',
			match: ".modal"
		});
		csst.toString(target);

		// validate output
		var count = 0;
		var lazy = new Lazy(fs.createReadStream(target));
		lazy.lines.map(String).forEach(function(line) {
			var l = line;
			if (l.indexOf('.bootstrap-admin') > -1 && l.indexOf('.modal') > -1) {
				count++;
			}
			console.log("" , l);
		});
		lazy.on('end', function() {
			done();
			assert(count > 0);
		})

	});
});

describe('CSST.transformSelectorText()', function() {
	it('should transform the css selectors', function(done) {

		var path = require('path');
		var css = path.normalize(__dirname + '/input/bootstrap.css');
		var target = path.normalize(__dirname + '/output/bootstrap2.css');
		var csstransform = require('../index');
		var csst = csstransform(css);
		csst.transformSelectorText({
			prepend: '.bootstrap-admin',
			match: /^((?!(.modal-backdrop|.fade)).)*$/g
			//match: /[^(.fade|.fade.in|(.modal\-backdrop))]/g // |.modal\W{1}backdrop)]/g
		});
		csst.toString(target);

		// validate output
		var count = 0;
		var lazy = new Lazy(fs.createReadStream(target));
		lazy.lines.map(String).forEach(function(line) {
			var l = line;
			if (l.indexOf('.bootstrap-admin') > -1 && l.indexOf('.modal') > -1) {
				count++;
			}
			console.log("" , l);
		});
		lazy.on('end', function() {
			done();
			//assert(count > 0);
		})

	});
});