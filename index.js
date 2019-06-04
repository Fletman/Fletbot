require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();


//retrieve campaign directory
var basePath = fs.readFileSync('./campaigns_base', 'utf8');
if(!basePath.endsWith('\\') && !basePath.endsWith('/'))
{basePath += '/';}

//homogenize folder name
if(process.argv.length == 3)
{process.argv[2] = process.argv[2].toLowerCase();}

//read bot's client token
const tokenPath = basePath + 'botToken';

//scan event directory for js files
fs.readdir('./events/', (err, files) => {
	if(err)
	{
		console.log(err);
		return;
	}
		
	//each Discord event has a corresponding js file to handle it, for the sake of cleanliness and my sanity
	files.forEach((file, index) => {
		//skip folders/files not event-named
		if(file == 'commands' || file == 'helperFunctions.js' || file == 'loreUpdate.js')
		{return;}
	
		//create event handler for each file corresponding to an event
		const eventHandler = require(`./events/${file}`);
		const eventName = file.split('.')[0];
		client.on(eventName, arg => eventHandler(client, arg, basePath));
	});
});

//login to server
fs.readFile(tokenPath, 'utf8', (err, token) => {
	if(err)
	{
		console.log(err);
		return;
	}
	
	client.login(token);
});

//listen for lore changes in active campaign
if(process.argv.length == 3)
{
	//still in testing; fs.watch is VERY unstable
	//require('./events/loreUpdate.js').watchNewDir(client, basePath + process.argv[2]);
}