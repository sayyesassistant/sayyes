#Sayeys data modeling

---

Following all available data models.

The main object that handles all models is the [controller](#controller)


##<a id="controller"></a>controller

-`start_with` **String** (view name) or **Number** (view's array index)

-`id` [!] **String**

-`views` **Array** of [view](#view)

##<a id="view"></a>view

-`name` **String** must match `/[\w-]+/`

-`template_name` **String** must match `/[\w-]+/`

-`data` [view_data](#view_data)

##<a id="view_data"></a>view_data

-`title` **String**

-`description` **String**

-`text`	**String**

-`picture` intance of [picture_data](#picture_data)

##<a id="picture_data"></a>picture_data

-`url` **String**

-`caption` **String**


##button
	- type nav|submit|link
	- label
	- value (next screen id ?)
	- hidden_fieds [] input_item

##input_data
	- type : text / select/ file
	- mask : number/ email/ date

##input_item
	- label : String
	- value : String

	form
	button
		value
		label
	hidden
		name
		value
	input
		name
		mask