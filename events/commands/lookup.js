const http = require('request');
const dom = require('cheerio');
const fs = require('fs');
const helper = require('../helperFunctions.js');

module.exports = (message, msg, path, classes) => {
	//can't handle requests in private channels
	if(helper.pmChannel(message))
	{return;}
	
	let words = msg.split(' ');
	let type = words[1];
	let subject = msg.substring(words[0].length + words[1].length + 2);
	let uri = '';

	switch(type)
	{
		case "spell":
		case "item":
		case "race":
		case "misc":
			uri = "https://roll20.net/compendium/dnd5e/" + encodeURIComponent(subject) + "#content";
			break;
			
		case "weapon":
			uri = "https://roll20.net/compendium/dnd5e/Items:" + encodeURIComponent(subject);
			break;

		case "class":
			uri = "https://roll20.net/compendium/dnd5e/Classes:" + encodeURIComponent(subject) + "#content";
			break;
			
		case "monster":
			//DM can bypass role knowledge checks
			if(message.member.roles.find(r => r.name === "DM"))
			{
				uri = "https://roll20.net/compendium/dnd5e/" + encodeURIComponent(subject) + "#content";
			}
			
			else
			{
				//search public-knowledge list of known monsters
				let pubKnow = fs.readFileSync(path + 'All/knowledge.txt', 'utf8');
				let pubList = pubKnow.split('\n');
				
				if(pubList.includes(subject))
				{
					uri = "https://roll20.net/compendium/dnd5e/" + encodeURIComponent(subject) + "#content";
				}
				
				else
				{
					//search role-specific list of known monsters for a match
					message.member.roles.forEach((role, index) => {
						if(classes.includes(role.name))
						{
							let knowns = fs.readFileSync(path + role.name + "/knowledge.txt", 'utf8');
							let knownList = knowns.split('\n');
							
							if(knownList.includes(subject))
							{
								uri = "https://roll20.net/compendium/dnd5e/" + encodeURIComponent(subject) + "#content";
							}
							
							else
							{
								message.author.send("\nYou do not have access to lookup this monster\n");
							}
							
							return false;
						}
					});		
				}					
			}
			
			break;
			
		default:
			message.author.send("\nUnknown subject type '" + subject + "'. Type !help for a list of types\n");
			return;
	}
	
	if(uri.length == 0)
	{return;}
	
	console.log(uri);
	
	//make http request to specified uri to begin webcrawl
	http(uri, (err, response, body) => {
		if(err)
		{
			console.log("Failed to lookup " + uri);
			message.author.send("Failed to lookup subject");
			return;
		}
		
		//read text from content section of page
		let $ = dom.load(body); //load html body
		
		//make sure crawler has landed on the correct/existing page
		let pageTitle;
		$('.page-title').each((index, value) => {
			pageTitle = $(value).text().toLowerCase();
			pageTitle = pageTitle.split('\n')[1];
			return false;
		});
		
		if(!pageTitle || subject != pageTitle.trim())
		{
			message.author.send("Invalid request");
			console.log("'" + pageTitle + "' vs '" + subject + "'");
			return;
		}
		
		$('h1').replaceWith('\n');
		$('h2').replaceWith('\n');
		$('h3').replaceWith('\n');
		let infoText = $('#pagecontent').text() + '\n' + $('#pageAttrs').text();
	
		//invalid request/failed lookup
		if(infoText.length < 3)
		{
			message.author.send("No info could be found for '" + subject + "'. Check your spelling, maybe?\nYou can also type !help for command formatting\n");
			return;
		}
		
		/*break up message to avoid Discord's message size restriction*/
		let lines = infoText.split('\n');
		
		message.author.send("\n" + subject.toUpperCase() + ":\n");
		for(var l in lines)
		{
			lines[l] = lines[l].trim();
			if(lines[l].length > 0 && lines[l] != '\n')
			{
				const msgSize = 1990; //max size of Discord message
				
				//if message too big, break into chunks
				if(lines[l].length > msgSize)
				{
					helper.breakupMsg(lines[l], msgSize, message.author);
				}
				
				else
				{message.author.send("```" + lines[l] + "```");}				
			}
		}			
	});
};