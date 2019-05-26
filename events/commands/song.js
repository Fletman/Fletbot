const http = require('request');
const dom = require('cheerio');

module.exports = (message, msg) => {
	//TODO: should anyone be able to request music?
	/*
	//only DM is allowed to request music
	if(!message.member.roles.find(r => r.name === "DM"))
	{
		message.reply("\nSorry, only the DM can request music. Try asking them instead.");
		return;
	}
	*/
	
	let song = msg.substring(6);
	message.reply("Loading Song: " + song);
	let uri = "https://www.youtube.com/search?q=" + encodeURIComponent(song);
	console.log(uri);
	
	//make http request to specified uri to begin webcrawl
	http(uri, (error, response, body) => {
		if(error)
		{
			console.log("Failed YT request");
			console.log(error);
			return;
		}
		
		let $ = dom.load(body);
		let vidLink;
		
		//search a tags for video link
		$('a').each((index, value) => {
			let alink = $(value).attr('href');
			if(alink.startsWith('/watch'))
			{
				vidLink = alink;
				return false; //return false to break from loop
			}
			
		});
		
		//sanity/success check
		if(vidLink && vidLink.length > 0)
		{message.reply("https://www.youtube.com" + vidLink);}
	
		else
		{message.reply("Unable to find song");}
	});
};