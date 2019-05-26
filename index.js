require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

//scan event directory for js files
fs.readdir('./events/', (err, files) => {
	if(err)
	{
		console.log("FS error");
		return;
	}
		
	//each Discord event has a corresponding js file to handle it, for the sake of cleanliness and my sanity
	files.forEach((file, index) => {
		const eventHandler = require(`./events/${file}`);
		const eventName = file.split('.')[0];
		client.on(eventName, arg => eventHandler(client, arg));
	});
});

client.login('NTgxMzI5MTcyNDA5MDkwMDQ5.XOdsHg.jaDvMhRNg1Tt_IZZRvypZ9dtKvw');