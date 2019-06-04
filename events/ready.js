module.exports = (client) => {
	console.log("\nFletbot now online\n");
	client.channels.find(channel => channel.name === 'fletbot').send("Fletbot is now online");
};