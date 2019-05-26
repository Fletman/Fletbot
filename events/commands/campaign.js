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
	},
	
	switchCamp: function(basePath, newCamp, message)
	{
		//only DM role can switch campaign
		if(!message.member.roles.find(r => r.name === "DM"))
		{
			message.reply("Only the DM can switch the campaign. Try asking them");
			return;
		}
		
		//check if campaign data exists before switching
		fs.access(basePath + newCamp, (err) => {
			if(err)
			{
				console.log(err);
				message.reply("Failed to find campaign");
				return;
			}
			
			//update campaign
			process.argv[2] = newCamp;
			message.reply("Switched campaign to: " + newCamp);
		});
	}
};