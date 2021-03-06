#<a name="top"></a>Say Yes!

##Following all available data models for rendering view templates.

Table of contents

- [controller](#controller)
	- [attendant_data](#attendant_data)
	- [client_data](#client_data)
	- [view](#view)
		- [view_data](#view_data)
		- [nav_data](#nav_data)
		- [picture_data](#picture_data)
		- [form_data](#form_data)
			- [hidden_data](#hidden_data)
			- [form_button](#form_button)
			- [form_input](#form_input)
			- [form_radio](#form_radio)
			- [form_checkbox](#form_checkbox)

The main wrapper is the [controller](#controller) model

---

- ###<a name="controller"># </a>controller

	Designed for wrapping all controller's information

	- `id` **String**

	- `attendant` intance of [attendant_data](#attendant_data)

	- `client` intance of [client_data](#client_data)

	- `start_with` **String** (view name) or **Number** (view's array index)

	- `views` **Array** of [view](#view)

- ###<a name="attendant_data"># </a>attendant_data

	Designed for wrapping attendant's information

	- `id` **String**

	- `name` **String**

	- `email` **String**

	- `phone` **String**

- ###<a name="client_data"># </a>client_data

	Designed for wrapping client's information

	- `id` **String**

	- `name` **String**

	- `email` **String**

- ###<a name="view"># </a>view

	Designed for wrapping views

	- `name` **String** must match `/[\w-]+/`

	- `template_name` **String** must match `/[\w-]+/`

	- `eol` **Boolean** `true` when the view is the *end of line*;

	- `data` intance of [view_data](#view_data)

- ###<a name="view_data"># </a>view_data

	Designed for wrapping all possible data that can be **rendered by the template**.

	- `title` **String**

	- `description` **String**

	- `text`	**String**

	- `nav` **Array** of [nav_data](#nav_data)

	- `picture` intance of [picture_data](#picture_data)

	- `form` intance of [form_data](#form_data)

- ###<a name="nav_data"># </a>nav_data

	Designed for navigation buttons

	- `view` **String** must match `/[\w-]+/`

	- `label` **String**

- ###<a name="picture_data"></a>picture_data

	Designed for showing pictures.

	- `url` **String**

	- `caption` **String**

- ###<a name="form_data"># </a>form_data

	Designed for creating forms.

	- `id` **String**

	- `action` **String** When `null`/`empty` the value will be evaluated to "#". It means that the submit method will always skipped and the callback will always open the `on_success` target.

	- `method` **String**

	- `on_success` **String** view's name. This property work as a [nav_data](#nav_data) when the service succeed. *status='output|success'*

	- `on_error` **String** view's name. This property work as a [nav_data](#nav_data) when the service fails. *status='error'*

	- `hiddens` **Array** of [hidden_data](#hidden_data)

	- `buttons` **Array** of [form_button](#form_button)

	- `inputs` **Array** of [form_input](#form_input)

	- `radios` **Array** of [form_radio](#form_radio)

	- `checkboxes` **Array** of [form_radio](#form_radio)

	- ####<a name="hidden_data"># </a>hidden_data

		Designed for rendering hidden informations

		- `name` **String**

		- `value` **String**

	- ####<a name="form_button"># </a>form_button

		Designed for rendering form buttons

		- `value` **String**

		- `name` **String**

		- `label` **String**

	- ####<a name="form_input"># </a>form_input

		Designed for rendering **input text**

		- `name` **String**

		- `type` **String** ([full list](http://www.w3schools.com/html/html5_form_input_types.asp). take care with browser legacy)

		- `placeholder` **String

		- `required` **String** (value must be "required" or `null`)

	- ####<a name="form_radio"># </a>form_radio

		Designed for rendering **input type='radio'**

		- `value` **String**

		- `name` **String**

		- `label` **String**

		- `required` **String** (value must be "required" or `null`)

	- ####<a name="form_checkbox"># </a>form_checkbox

		Designed for rendering **input type='checkbox'**

		- `value` **String**

		- `name` **String**

		- `label` **String**

		- `required` **String** (value must be "required" or `null`)