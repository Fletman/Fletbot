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
	},
	
	//break message into chunks if it exceeds a max size
	breakupMsg: function(msg, maxSize, dest) {
		let msgCount = Math.ceil(msg.length/maxSize); //determine amount of required messages/chunks
		let start = 0; //index for start of a chunk
		
		for(var i = 0; i < msgCount; i++)
		{
			/*message broken into largest possible chunks separated by periods*/
			let tempChunk = msg.slice(start, start + maxSize); //create chunk of size max message
			//NOTE: slice's ending index uses the smaller of string length and given arg
			
			let period = tempChunk.lastIndexOf('.'); //find index of last period in chunk (inclusive)
			
			if(period < 0)
			{
				console.log("Failed to find a suitable format for: '" + tempChunk + "'");
				return;
			}
			period += 1; //increment index so that substring is inclusive of period
			
			let chunk = tempChunk.substring(start, period); //create slice from start to period
			start = period; //increment starting point to after last period
			
			if(chunk.length > 0)
			{dest.send("```" + chunk + "```");}
		}
	}
};