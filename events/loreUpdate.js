const fs = require('chokidar');

var watcher = null;

//notify a class when their lore has been updated
module.exports = {	

	//update path to watch
	watchNewDir: function(client, newPath)
	{
		if(watcher != null)
		{watcher.close();}
	
		console.log("Switching listening directory to: " + newPath + "/Lore");
	
		watcher = fs.watch(newPath + "/Lore", {recursive: true});
		
		watcher.on('add', (filePath) => {
			console.log("File Found: " + filePath);
		});
		
		watcher.on('change', (filePath) => {
			//find Class that updated lore file belongs to
			let dirSplit = filePath.split('\\');
			let targetClass = dirSplit[dirSplit.length - 2];
					
			console.log(`${targetClass} has updated lore`);
		});
	}
};