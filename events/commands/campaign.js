const fs = require('fs');

module.exports = {
	getCurrent: function()
	{
		let output;
		process.argv.length == 3 ?
			output = "Active campaign is: " + process.argv[2]:
			output = "No active campagin.\n" +
			"Use !generate [name] to create a new campaign\n" +
			"Use !switch [name] to set an active campagin";
			
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
			
			//update lore change listener
			//require('../loreUpdate.js').watchNewDir(message, basePath + newCamp);
			
			message.reply("Switching Active Campaign to: " + newCamp);
		});
	},
	
	generate: function(basePath, newCamp, classes, message)
	{
		//only DM role can make new campaign
		if(!message.member.roles.find(r => r.name === "DM"))
		{
			message.reply("Only the DM can switch the campaign. Try asking them");
			return;
		}
		
		if(fs.existsSync(basePath + newCamp))
		{
			message.reply("Campaign already exists");
			return;
		}
		
		fs.mkdirSync(basePath + newCamp);
		fs.mkdirSync(basePath + newCamp + "/Lore");
		
		let lorePath = (basePath + newCamp + "/Lore/");
		console.log("Generating files for:\n" + lorePath);
		
		fs.mkdir(lorePath + "All", (err) => {
			if(err)
			{
				console.log(err);
				return false;
			}
			
			//create public lore file
			fs.open(lorePath + "All/knowledge.txt", 'w', (error, fd) => {
				if(error)
				{
					console.log(error);
					return false;
				}
				
				fs.close(fd, (errors) => {
					if(errors)
					{
						console.log(errors);
						return false;
					}
				});
			});
		});
		
		//make lore files for each class
		for(var c in classes)
		{
			fs.mkdirSync(lorePath + classes[c]);

			fs.open(lorePath + classes[c] + "/knowledge.txt", 'w', (error, fd) => {
				if(error)
				{
					console.log("Create Error:\n" + error);
					return false;
				}
				
				fs.close(fd, (errors) => {
					if(errors)
					{
						console.log("Close Error:\n" + errors);
						return false;
					}
				});
			});				
		}
		
		//TODO: look over failure checking
		message.reply("Generated New Campaign: " + newCamp);
	}
};