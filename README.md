#<a name="top"></a>Say Yes!

###Table of contents:

- [Getting started](#gs)

- [Template Modelling](#dm)

- [Service standards](#ss)

##<a name="gs"># </a>Getting started

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

[#top](#top)

##<a name="dm"># </a>Template Modeling

All the core of Say Yes! is about providing a reliable json config and the javascript will do the magic using some mustache tamplates.

There is list of available models for this purposes.

[Check here](https://github.com/sayyesassistant/sayyes/blob/master/static/templates/README.md)

[#top](#top)

##<a name="ss"># </a>Service standards

###Service modeling

Every single service must be a json object with the following properties:

- `status` **String** *required* and `not null`.

	Possible values: `success`, `error`, `output`.
	
	Designed to work as flag for success or failure

- `exception` **String** *required*

	Designed for **status="error"**. Place the system exeption here for debug purposes

- `message` **String** *required*

	Designed for **status="error"**. Place a human like text here

- `value` **\*** *required*

	Designed to provice extra values on result.

---

* `required` : means that even `null` the property must be there

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
        
###Authentication examples:

For requests from outside the app:

Param #1 accessKey => "user access key"
Param #2 email => "user e-mail"

For requests from inside the app:

Param #1 request type => "ajax"
Param #2 key => "some entity key in tune with the service consumed"

###Exception Index:

* `#1` - Validation error, entity could not be created.
* `#2` - Authentication failure.

[#top](#top)