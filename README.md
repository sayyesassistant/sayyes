#Say Yes!

---

###Table of contents:

- [Getting started](#gs)

- [Template Modelling](#dm)

- [Service standards](#ss)

- [Testing workflow](#tw)

##<a name="gs"></a>Getting started

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

##<a name="dm"></a>Template Modeling

All the core of Say Yes! is about providing a reliable json config and the javascript and tempaltes will do the magic.

There is list of available models for this purposes.

[Check here](https://github.com/sayyesassistant/sayyes/blob/master/static/templates/README.md)

##<a name="ss"></a>Service standards

###Service modeling

Every single service must be a json object with the following properties:

-`status` **String** *required* and `not null`.

Possible values: `success`, `error`, `output`.

Designed to work as flag for success or failure

-`exception` **String** *required*

Designed for **status="error"**. Place the system exeption here for debug purposes

-`message` **String** *required*

Designed for **status="error"**. Place a human like text here

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

###Fail example:

Simple fail example:

		{
			"status" : "error",
			"exception" : 123,
			"message" : "Sorry! something wrong happend. Try again later",
			"value" : null
		}

###Output example:

Simple output example (data outputed, could be object/html or even binary):

		{
			"status" : "output",
			"exception" : null,
			"message" : null,
			"value" : {
				"first_name" : "foo"
				"last_name" : "bar"
			}
		}

###Exception Index:

* `#1` - Validation error, entity could not be created.
* `#2` - Authentication failure.

##<a name="tw"></a>Testing workflow

When you pull the repository no test page will be available.

Test pages won't be committed since they are designed to test only and the best way to keep them updated is making sure that all developers will generate a fresh version.

There is a grunt task designed to wrap everything:

		grunt run-tests -reset=true

After running this command you should be able to see the tests index page:

		http://<YOUR-ENV>/tests/index.html