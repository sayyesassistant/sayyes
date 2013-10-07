#Sayeys data model

##<a id="controller"></a>controller

-`start_with` *String* (view name), *Number* (array index)

-`id` *String* any hash

-`views` *Array* of [view](#view)

##<a id="view"></a>view

-`name` **String** must macth */[\w-]+/*

-`template_name` **String** must macth */[\w-]+/*

-`data` instance of [view_data](#view_data)

##<a id="view_data"></a>view_data

-`title` **String**

-`description` **String**

-`text`	**String**

-`picture` intance of `picture`


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