const http = require('request');
const dom = require('cheerio');
const fs = require('fs');

//user roles as D&D classes
//TODO: retrieve this from list of Server Roles
const classes = ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'];

//command list, displayed on !help
let commandList;
fs.readFile('./events/commands/commandList.txt', 'utf8', (err, file) => {
	if(err)
	{throw err;}
	
	commandList = file;
});	

module.exports = (client, message, basePath) => {
	//get campaign directory path
	var path = basePath;
	if(process.argv.length == 3)
	{path += (process.argv[2] + '/');}
	
	//ignore messages sent by Fletbot
	if(message.author.tag === client.user.tag)
	{return;}
	
	let msg = message.content.toLowerCase();
	
	//banter with Fletbot
	if(msg.includes("fletbot"))
	{
		if(msg.includes("who") || msg.includes("what"))
		{
			message.reply("\nI'm here to help manage this Discord server and streamline D&D sessions.\nType !help for a list of commands I can perform.");
		}
		
		else if(msg.includes("hi") || msg.includes("hello") || msg.includes("greetings"))
		{message.reply("Hello there");}
		
		else if(msg.includes("thank") || msg.includes("love") || msg.includes("cool"))
		{message.reply(":blue_heart:");}
	
		else if(msg.includes("good"))
		{message.reply("Thanks");}
	
		else
		{
			let randMsg = Math.floor(Math.random() * 2);
			randMsg == 0 ?
				message.reply("You called?"):
				message.reply("That's me");
		}
	}

	else
	{
		let command = msg.split(' ')[0];
		let eventHandler;
		
		switch(command)
		{
			case '!help': //display command list
				message.reply(commandList);
				
				break;
				
			case '!roll': //roll dice
				eventHandler = require('./commands/roll.js');
				eventHandler(message, msg);
				
				break;
				
			case '!song': //get music video from youtube
				eventHandler = require('./commands/song.js');
				eventHandler(message, msg);
		
				break;
				
			case '!lookup': //lookup subject from Roll20.net
				eventHandler = require('./commands/lookup.js');
				eventHandler(message, msg, path + 'Lore/', classes);
				
				break;
				
			case '!learn': //add monster to list of knowns
				eventHandler = require('./commands/learn.js');
				eventHandler(message, msg, path + 'Lore/');
		
				break;
			
			case '!lore': //read lore from stored files
				//TODO: maybe look into more accessible storage locations
				eventHandler = require('./commands/lore.js');
				eventHandler(message, msg, path + 'Lore/');
				
				break;
				
			case '!check': //check for any updates to lore
				require('./loreUpdate.js').notifyUpdates(message);
				
				break;
					
			case '!current': //display name of currently active campaign
				message.reply(require('./commands/campaign.js').getCurrent());
				
				break;
				
			case '!switch': //switch to a different campaign
				let campSwitchTo = msg.substring(8);
				require('./commands/campaign.js').switchCamp(basePath, campSwitchTo, message);
				
				break;
				
			case '!generate': //generate files for a new campaign
				let newCamp = msg.substring(10);
				require('./commands/campaign.js').generate(basePath, newCamp, classes, message);
				
				break;
	
			case '!source': //link to repository
				message.reply('https://github.com/Fletman/Fletbot');
				
				break;
				
			case '!kill': //terminate Fletbot
				let termination = require('./commands/kill.js');
				termination(client, message);
				
				break;
				
			default: //no command used, nothing to do here
				return;
		}
	}
};