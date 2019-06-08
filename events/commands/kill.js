//kill bot
module.exports = (client, message) => {
	//only Admin has privilege to end Fletbot
	if(!message.member.roles.find(r => r.name === "Admin"))
	{
		message.reply("Only a server admin can terminate Fletbot");
		return;
	}
	
	console.log("Fletbot exiting");	
	message.channel.send("Fletbot will now be going offline")
		.then(() => client.destroy())
		.then(() => process.exit(0));
};