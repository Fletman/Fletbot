//kill process
module.exports = (message) => {
	//only Admin has privilege to end Fletbot
	if(!message.member.roles.find(r => r.name === "Admin"))
	{
		message.reply("Only a server admin can terminate Fletbot");
		return;
	}
	
	//notify users of Fletbot's termination
	message.channel.send("Fletbot will now be going offline");
	
	//tell process to exit naturally rather than immediately/forcibly closing
	//TODO: double-check some things here, setting process exitcode doesn't work?
	//process.exitCode = 0;
	console.log(`Exiting with code ${process.exitCode}`);
	process.exit(0); //this is temporary until more research done
};