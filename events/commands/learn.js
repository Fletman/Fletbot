const fs = require('fs');

module.exports = (message, msg, path) => {
	//only DM role can update knowledge
	if(!message.member.roles.find(r => r.name === "DM"))
	{
		message.reply("Only the DM can add monsters to known list");
		return;
	}
	
	let scope = msg.split(' ')[1];
	let subject = msg.substring(msg.indexOf(scope) + scope.length + 1);
	
	let fPath = (path + scope + "/knowledge.txt");
	
	//add new subject to end of file
	fs.appendFile(fPath, '\n' + subject, 'utf8', (err) => {
		if(err)
		{
			console.log(err);
			return;
		}
		
		message.reply("Added " + subject + " knowledge for " + scope);
	});
};