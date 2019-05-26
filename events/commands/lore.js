const fs = require('fs');
const helper = require('../helperFunctions.js');

module.exports = (message, msg, path) => {
	//can't handle requests in private channels
	if(helper.pmChannel(message))
	{return;}
	
	var loreRequest = msg.substring(6);
	var success = false;
	
	console.log("Lore request: " + loreRequest);
	
	//return list of all known subjects
	if(loreRequest == '?')
	{
		//retrieve all public-knowledge subjects
		let files = fs.readdirSync(path + 'All/', 'utf8');

		message.author.send("Public-Knowledge Subjects:\n");
		
		let output = "```";
		for(var i = 0; i < files.length; i++)
		{
			if(files[i] == 'knowledge.txt')
			{continue;}
			
			output += ("'" + files[i].split('.')[0] + "' ");
		}
		output += "```";
		message.author.send(output);
		
		//retrieve class-specific subjects
		let folders = fs.readdirSync(path, 'utf8');

		message.author.send("\nPrivate-Knowledge Subjects:\n");
		
		for(var i = 0; i < folders.length; i++)
		{
			if(message.member.roles.some(r => r.name === folders[i]))
			{
				let fi = fs.readdirSync(path + folders[i] + "/", 'utf8');

				let output = "```";
				for(var j = 0; j < fi.length; j++)
				{
					if(fi[j] == 'knowledge.txt')
					{continue;}
					
					output += ("'" + fi[j].split('.')[0] + "' ");
				}
				output += "```";
				message.author.send(output);
			}
		}		
		
		success = true;
	}
	
	//lookup specific subject
	else
	{
		//read through list of public-knowledge subjects
		success = helper.findLore(path + 'All/', loreRequest, message.author)
		
		if(success)
		{return;}
		
		//read through all folders accessible by role
		fs.readdir(path, (err, folders) => {
			if(err)
			{
				console.log(err);
				return;
			}
			
			for(var i = 0; i < folders.length; i++)
			{
				//check role permissions before accessing folder
				if(!message.member.roles.find(r => r.name == folders[i]) && !message.member.roles.find(r => r.name === "DM"))
				{continue;}
			
				success = helper.findLore(path + folders[i] + '/', loreRequest, message.author);
				
				if(success)
				{
					console.log(path + folders[i] + '/' + loreRequest);
					return;
				}
			}
			
			message.author.send("No information found on '" + loreRequest + "'");
		});
	}
};