const fs = require('fs');

module.exports = {
	getCurrent: function()
	{
		let output;
		process.argv.length == 3 ?
			output = "Active campaign is: " + process.argv[2]:
			output = "No active campagin.\n" +
			"Use !switch [name] to set an active campagin or\n" +
			"Use !generate [name] to create a new campaign";
			
		return output;
	}
};