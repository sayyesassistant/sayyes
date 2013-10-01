# view_list
	- items Array of screen
	- start_at
	- id

# view
	- name
	- template_name
	- data
		- title String
		- description String
		- input [] of input_data
		- buttons : [] of button

# button
	- type nav|submit|link
	- label
	- value (next screen id ?)
	- hidden_fieds [] input_item

# input_data
	- type : text / select/ file
	- mask : number/ email/ date

# input_item
	- label : String
	- value : String