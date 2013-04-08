#csstransform


Automated css transformations.

[![Build Status](https://travis-ci.org/intesso/csstransform.png)](https://travis-ci.org/intesso/csstransform)

#Example Usage
csstransform can be used to transform existing css and transform for example it's selectors.

```javascript
		var path = require('path');
		var css = path.normalize(__dirname + '/input/bootstrap.css');
		var target = path.normalize(__dirname + '/output/bootstrap-transformed.css');
		var csstransform = require('../index');
		var csst = csstransform(css);
		csst.transformSelectorText({
			prepend: '.bootstrap-admin'
		});
		csst.toString(target);
```

#How it works
csstransform uses cssom (a full fledged css parser) to parse the css into an internal css dom. When calling `toString(target)`, the css is formatted with cssbeautify.

#API

##csstransform(css)
Creates a new CSST Object and parses the css file into a cssom Object.

**Parameters**
**css**:  *String*,  css Path to the css file to read

**Returns**
*Object*,  the new created CCST Object that holds the parsed css dom for further transformations.



##transformSelectorText(op)
Transforms the css selectors.
transformSelectorText is chainable. Therefore several Transformation can take place.

**Parameters**
**op**:  *Object*,  {[match,] [append,] [prepend,] [replace]}

**Returns**
*Object*,  this CSST object for function chanining.

**op Object**
```
{	
	prepend: String,
	append: String,
	replace: [String, String],
	match: String or Regex
}
```

**op Object Description**
####prepend
prepend will prepend the given string to the selector.

####append
append will append the given string to the selector.

####replace
replace is an Array where the first element is the String that should be replaced and the second element is the String that will be used as replacement.

####match
If match is missing, it matches every selector. If match is provided with a String value, it will be used as contains(). If match is a Regex, it will directly be used in the .match(regex) function.



##toString(target)
writes the the formatted css to the target file.

**Parameters**
**target**:  *String*,  Path to the target file.

**Returns**
*String*,  The formatted css.

#Tests
Run tests with mocha:
```
mocha
```
