// this would be an alternative solution: https://github.com/visionmedia/rework :: .prefixSelectors(string)

var cssom = require('cssom');
var cssbeautify = require('cssbeautify');
var fs = require('fs');
var eol = require('os').EOL;

/**
 * Automated css transformation
 * @param  {String} css Path to the css file to read
 * @return {Object}     the new created CCST Object that holds the parsed css dom for further transformations.
 *
 * usage example:
 * <pre>
 * var path = require('path');
 * var dir = path.normalize(__dirname + '../../../../public/css/admin/');
 * var csstransform = require('csstransform');
 * var csst = csstransform(dir + 'bootstrap.css');
 * csst.transformSelectorText({prepend: '.bootstrap-admin', match:/^.modal/g});
 * csst.toString(dir + 'bootstrap-admin.css');
 * </pre>
 */
var csstransform = module.exports = exports = function(css) {
	return new CSST(css);
}

	function CSST(css) {
		var cssString = fs.readFileSync(css, 'utf-8');
		this.objectModel = cssom.parse(cssString);
	}

	/**
	 * Transforms the css selectors.
	 * @param  {Object} op  {[match,] [exclude,] [append,] [prepend,] [replace]}
	 * @param  {Object} dom The parsed css dom.
	 * @return {Object}     this CSST object for function chanining.
	 */
	CSST.prototype.transformSelectorText = function(op, dom) {
		var self = this;
		dom = dom || this.objectModel;
		if (dom.cssRules) {
			dom.cssRules.forEach(function(el, i, arr) {
				if (el.selectorText) {

					var selectors = el.selectorText.split(',');
					var leadingSpaces = '';
					var newSelectors = selectors.map(function(selector) {

						// only do the transformation if it matches the requirements.
						// inclusive filter: match
						var match = true;
						if (op.match) {
							if (typeof op.match == 'string') {
								if (selector.indexOf(op.match) < 0) {
									match = false;
								}
							} else {
								if (!selector.match(op.match)) {
									match = false;
								}
							}
						}
						// exclusive filter: exclude
						if (op.exclude) {
							if (typeof op.exclude == 'string') {
								if (selector.indexOf(op.exclude) > -1) {
									match = false;
								}
							} else {
								if (selector.match(op.exclude)) {
									match = false;
								}
							}
						}

						var newSelector = selector.replace(eol, '');

						if (match) {
							if (op.prepend) {
								newSelector = op.prepend + ' ' + newSelector;
							}
							if (op.append) {
								newSelector = newSelector + ' ' + op.append;
							}
							if (op.replace && op.replace.length == 2) {
								newSelector = newSelector.replace(op.replace[0], op.replace[1]);
							}
						}
						newSelector = newSelector.replace(/ +/g, ' '); // remove more than one space
						return newSelector;
					});
					el.selectorText = newSelectors.join(',' + eol);

					//console.log('cssRules: ' + i + newSelectors);
				} else if (el.cssRules) {
					self.transformSelectorText(op, el);
				}

			})

		}
		return this;
	}

	/**
	 * writes the the formatted css to the target file.
	 * @param  {String} target Path to the target file.
	 * @return {String}        The formatted css.
	 */
	CSST.prototype.toString = function(target) {
		var formattedCss = cssbeautify(this.objectModel.toString(), {
			indent: '  ',
			openbrace: 'end-of-line',
			autosemicolon: true
		});

		fs.writeFileSync(target, formattedCss, 'utf-8');
		return formattedCss;
	}