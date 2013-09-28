# screens
	- items Array of screen
	- start_at
	- template

# screen
	- id
	- title String
	- description String
	- input [] of input_data
	- buttons : [] of button
	- hidden_fieds [] input_item

# button
	- label
	- value (next screen id ?)

# input_data
	- type : text / select/ file
	- mask : number/ email/ date
	- options : [] of input_item

# input_item
	- label : String
	- value : String

# message
	- label
	- severity