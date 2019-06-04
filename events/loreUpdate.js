const fs = require('chokidar');

var watcher = null;
var changeList = []; //list of updated classes

//notify a class when their lore has been updated
module.exports = {	

	//update path to watch
	watchNewDir: function(client, newPath)
	{
		if(watcher != null)
		{watcher.close();}
	
		console.log("Switching listening directory to: " + newPath + "/Lore");
		
		changeList = []; //reset change list
	
		watcher = fs.watch(newPath + "/Lore", {recursive: true});
		
		watcher.on('add', (filePath) => {
			//console.log("File Found: " + filePath);
		});
		
		watcher.on('change', (filePath) => {
			//find Class that updated lore file belongs to
			let dirSplit = filePath.split('\\');
			let targetClass = dirSplit[dirSplit.length - 2];
					
			console.log(`${targetClass} has updated lore`);
			
			if(!changeList.includes(targetClass))
			{
				if(targetClass == 'All')
				{changeList.push('everyone');}
			
				else if(targetClass == 'DM' || targetClass == 'Lore')
				{/*ignore*/}
			
				else
				{changeList.push(targetClass);}
			}
		});
	},
	
	//report all changed lore folders
	notifyUpdates: function(message)
	{
		if(changeList.length == 0)
		{
			message.reply("No lore updates detected");
			return;
		}
		
		for(var i in changeList)
		{
			message.channel.send(`${changeList[i]} has updated lore`);
		}
		
		changeList = [];
	}
};