#Say Yes!

---

###Table of contents:

- [Getting started](#gs)

- [Template Modelling](#dm)

- [Service standards](#ss)

##<a id="gs"></a>Getting started

###Front end dependencies setup:

You must have the following tool installed before:

(they are all free and plataform agnostic)

- [nodejs](http://nodejs.org/download/);
- [sass 3.2.12](http://sass-lang.com/);

####After installed all the tools above we have a few more things to do before working:

- Install [bower](http://bower.io/)

		sudo npm install bower -g

- Installing bower dependencies (@see [bower.json](bower.json))

		bower intall

- Install [grunt-cli](http://gruntjs.com/getting-started/)

		sudo npm install grunt-cli -g

- Installing grunt dependencies (@see [package.json](package.json))

		npm install

###Perfect!

Now that you are good to go, check grunt available tasks by hitting:

		grunt -h (@see 'Available tasks')

##<a id="dm"></a>Template Modeling

All the core of Say Yes! is about providing a reliable json config and the javascript and tempaltes will do the magic.

There is list of available models for this purposes.

[Check here](https://github.com/sayyesassistant/sayyes/blob/master/static/templates/README.md)

##<a id="ss"></a>Service standards

###Service modeling

Every single service must be a json object with the following properties:

-`status` **String** *required* and `not null`. Possible values: success, error, output.

Designed to work as flag for success or failure

-`exception` **String** *required*

Designed for **success=false**. Place the system exeption here for debug purposes

-`message` **String** *required*

Designed for **success=false**. Place a human like text here

-`value` **\*** *required*

Designed to provice extra values on result.

---

* *required*: means that even `null` the property must be there

* `not null`: means that the property value can't be null and must respect the data type definition

###Success example:

Simple success example:

		{
			"status" : "success",
			"exception" : null,
			"message" : null,
			"value" : null
		}

Simple success example with `value` set (just for example purposes):

		{
			"status" : "success",
			"exception" : null,
			"message" : null,
			"value" : {
				"first_name" : "foo"
				"last_name" : "bar"
			}
		}

###Fail example:

Simple fail example:

		{
			"status" : "error",
			"exception" : 123,
			"message" : "Sorry! something wrong happend. Try again later",
			"value" : null
		}

###Output example:

Simple fail example:

		{
			"status" : "output",
			"exception" : null,
			"message" : null,
			"value" : "data outputed, could be HTML o binary"
		}

###Exception Index:

* #1 - Validation error, entity could not be created.