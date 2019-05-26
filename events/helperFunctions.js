const fs = require('fs');

module.exports = {
	//check if a channel is a private one
	pmChannel: function(message) {
		if(message.guild === null || message.channel.type === 'dm')
		{
			message.author.send("Sorry, I need you to be part of a server before I can do that.\nTry asking again from the #fletbot server channel\n");
			return true;
		}
		
		return false;
	},
	
	//check for permissions, then read lore
	findLore: function(dPath, loreName, requester) {
		let files = fs.readdirSync(dPath, 'utf8');

		for(var i = 0; i < files.length; i++)
		{
			if(files[i] == loreName)
			{
				let file = fs.readFileSync(dPath + files[i], 'utf8');
				let lines = file.split('\n');
				requester.send(loreName.toUpperCase() + ":\n");
				
				for(var l in lines)
				{
					if(lines[l].length > 1)
					{requester.send("```" + lines[l] + "```");}
				}
				
				return true;
			}
		}

		return false;
	}
};