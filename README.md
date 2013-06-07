#csstransform


Automated css transformations.

[![Build Status](https://travis-ci.org/intesso/csstransform.png)](https://travis-ci.org/intesso/csstransform)
[![NPM version](https://badge.fury.io/js/csstransform.png)](http://badge.fury.io/js/csstransform)

#Installation
```bash
npm install csstransform --save-dev
```


#Example Usage
csstransform can be used to transform existing css and transform for example it's selectors.

```javascript
var css = __dirname + '/input/bootstrap.css';
var target = __dirname + '/output/bootstrap-match-string.css';

var csstransform = require('../index');
var csst = csstransform(css);
csst.transformSelectorText({
  prepend: '.bootstrap-admin',
  exclude: /(.modal-backdrop|.fade)/g
});
csst.toString(target);
```

We use it for post processing the compiled bootstrap.css files. 
The transformation is done like this:
```javascript
var csstransform = require("csstransform");
var csst = csstransform(src);
csst.transformSelectorText({
  prepend: '.bootstrap-admin',
  exclude: /(.modal-backdrop|.fade)/g
}).transformSelectorText({
  replace: ['.bootstrap-admin body', 'body .bootstrap-admin']
}).transformSelectorText({
  replace: ['.bootstrap-admin html', 'html .bootstrap-admin']
});
csst.toString(target);
```

With this you can easily create a Grunt task like this:
```javascript
module.exports = function(grunt) {
  grunt.initConfig({
    less: {
      all: {
        files: {
          "public/css/application.css": "app/styles/application.less",
          "public/css/responsive.css": "app/styles/responsive.less",
          "public/css/admin/bootstrap.css": "app/styles/admin/bootstrap.less",
          "public/css/admin/responsive.css": "app/styles/admin/responsive.less"
        }
      }
    },
    csstransform: {
      all: {
        files: {
          "public/css/admin/bootstrap-admin.css": "public/css/admin/bootstrap.css",
          "public/css/admin/responsive-admin.css": "public/css/admin/responsive.css"
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-less");

  grunt.registerMultiTask('csstransform', 'Admin Bootstrap build post processing...', function() {
    //grunt.log.writeln(this.target);
    if (!this.data || !this.data.files) return;

    var files = this.data.files;
    for (target in files) {
      var src = files[target];
      var csstransform = require("csstransform");
      var csst = csstransform(src);
      csst.transformSelectorText({
        prepend: '.bootstrap-admin',
        exclude: /(.modal-backdrop|.fade)/g
      }).transformSelectorText({
        replace: ['.bootstrap-admin body', 'body .bootstrap-admin']
      }).transformSelectorText({
        replace: ['.bootstrap-admin html', 'html .bootstrap-admin']
      });
      csst.toString(target);
      grunt.log.writeln("File " + src + " -> " + target + " created.");
    }
  });

  grunt.registerTask("default", ["less", "csstransform"]);
};
```

#Usage for twitter bootstrap
Note: The Gruntfile above is how we post process twitter bootstrap in order to allow different bootstrap builds on the same page.
Just wrap the elements that use the custom bootstrap build in a div like this:

```html
<div class="bootstrap-admin">
  ... inline editing that uses the post processed twitter bootstrap build.
</div>
```
With this, the custom bootstrap does not interfere with your custom styles. 
The custom bootstrap styles are only applied within the elements inside of the elements with the class `bootstrap-admin`.

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
**op**:  *Object*,  {[match,] [exclude,] [append,] [prepend,] [replace]}

**Returns**
*Object*,  this CSST object for function chanining.

**op Object**
```
{	
	prepend: String,
	append: String,
	replace: [String, String],
	match: String or Regex,
	exclude: String or Regex
}
```

**Example**
```javascript
csst.transformSelectorText({
	prepend: '.bootstrap-admin',
	exclude: /(.modal-backdrop|.fade)/g
}).transformSelectorText({
	replace: ['.bootstrap-admin ', ''],
	match: ".tooltip"
});
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

####exclude
Opposite of match. The found selectors will be excluded from the transfomration. 



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
