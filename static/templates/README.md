#Sayeys data modeling

---

Following all available data models.

The main object that handles all models is the [controller](#controller)


##<a id="controller"></a>controller

-`id` **String**

-`attendant` intance of [attendant_data](#attendant_data)

-`client` intance of [client_data](#client_data)

-`start_with` **String** (view name) or **Number** (view's array index)

-`views` **Array** of [view](#view)

##<a id="attendant_data"></a>attendant_data

-`id` **String**

-`name` **String**

-`email` **String**

-`phone` **String**

##<a id="client_data"></a>client_data

-`id` **String**

-`name` **String**

-`email` **String**

##<a id="view"></a>view

-`name` **String** must match `/[\w-]+/`

-`template_name` **String** must match `/[\w-]+/`

-`data` intance of [view_data](#view_data)

##<a id="view_data"></a>view_data

-`title` **String**

-`description` **String**

-`text`	**String**

-`picture` intance of [picture_data](#picture_data)

-`form` intance of [form_data](#form_data)

##<a id="picture_data"></a>picture_data

-`url` **String**

-`caption` **String**

##<a id="form_data"></a>form_data

-`id` **String**

-`action` **String**

-`method` **String**

-`on_success` **String** (action to be taken after service's response. ie: nav=foo or alert)
-`on_error` **String** (action to be taken after service's response. ie: nav=foo or alert)

-`hiddens` **Array** of [hidden_data](#hidden_data)

-`buttons` **Array** of [form_button](#form_button)

-`inputs` **Array** of [form_input](#form_input)

##<a id="hidden_data"></a>hidden_data

-`name` **String**

-`value` **String**

##<a id="form_button"></a>form_button

-`value` **String**

-`label` **String**

##<a id="form_input"></a>form_input

-`name` **String**

-`type` **String** ([full list](http://www.w3schools.com/html/html5_form_input_types.asp). take care with browser legacy)

-`placeholder` **String**

-`required` **String** (value must be "required" or `null`)