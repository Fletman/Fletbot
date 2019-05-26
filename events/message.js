const http = require('request');
const dom = require('cheerio');
const fs = require('fs');

//user roles as D&D classes
const classes = ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'];

//command list, displayed on !help
const commands = "\n!roll [dice count] d [dice type] + [modifier (optional)]\t-\tRoll dice\n" +
				 "\n!lookup [type] [subject]\t-\tLookup a 5e subject on Roll20.net by type: spell/item/weapon/class/race/monster/misc\n" +
				 "\n!learn [class] [monster]\t-\tAllow a class to learn the stats of a monster (set class to 'All' for public knowledge)\n" +
				 "\n!lore [subject]\t-\tSee what your character knows about a particular subject (type '!lore ?' for a list of subjects)\n" +
				 "\n!song [artist] [song]\t-\tRequest a song from YouTube to play\n" +
				 "\n!current\t-\tGet name of currently-active campaign\n" +
				 "\n!generate [name]\t-\tInitialize new campaign\n" +
				 "\n!switch [name]\t-\tSwitch to a different existing campaign\n" +
				 "\nPlease note: Although requests must be made from a server channel, Fletbot answers may be sent to PM channels to avoid clogging main channels";

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
	if(msg.includes("fletbot") || message.isMemberMentioned(client.user))
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

	//display command list
	else if(msg === '!help')
	{message.reply(commands);}

	//roll dice
	else if(msg.startsWith('!roll'))
	{
		let eventHandler = require('./commands/roll.js');
		eventHandler(message, msg);
	}

	//get music video from youtube
	else if(msg.startsWith('!song'))
	{
		let eventHandler = require('./commands/song.js');
		eventHandler(message, msg);
	}
	
	//lookup item from Roll20.net
	else if(msg.startsWith('!lookup'))
	{
		let eventHandler = require('./commands/lookup.js');
		eventHandler(message, msg, path + 'Lore/');
	}
	
	//add monster to list of knowns
	else if(msg.startsWith('!learn'))
	{
		let eventHandler = require('./commands/learn.js');
		eventHandler(message, msg, path + 'Lore/');
	}
	
	//read lore from files stored to OneDrive server
	//TODO: maybe look into more accessible storage locations
	else if(msg.startsWith('!lore'))
	{
		let eventHandler = require('./commands/lore.js');
		eventHandler(message, msg, path + 'Lore/');
	}
	
	//display name of currently active campaign
	else if(msg === '!current')
	{
		message.reply(require('./commands/campaign.js').getCurrent());
	}
	
	//switch to a different campaign
	else if(msg.startsWith('!switch'))
	{
		let newCamp = msg.substring(8);
		require('./commands/campaign.js').switchCamp(basePath, newCamp, message);
	}
	
	//generate files for a new campaign
	else if(msg.startsWith('!generate'))
	{
		let newCamp = msg.substring(10);
		require('./commands/campaign.js').generate(basePath, newCamp, classes, message);
	}
};