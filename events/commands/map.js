const fs = require('fs');

module.exports = (mapPath, message) => {
	let targetMap = message.content.substring(5).toLowerCase();
	
	fs.readdir(mapPath, 'utf8', (err, maps) => {
		if(err)
		{
			console.log(`Failed to open directory: ${mapPath}`);
			return;
		}
		
		for(var i = 0; i < maps.length; i++)
		{
			if(maps[i].toLowerCase().split('.')[0] === targetMap)
			{
				message.channel.send({
					files: [mapPath + maps[i]]
				});
				return;
			}
		}
		
		message.reply("No map found");
	});
};