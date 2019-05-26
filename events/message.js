const http = require('request');
const dom = require('cheerio');
const fs = require('fs');
/*
Separate monster lists for 'known' monsters
Update lore visibility
*/

//path to lore files
const basePath = 'C:/Users/Lance/OneDrive/Documents/D&D/';
var path = (basePath + process.argv[2] + "/Lore/");

//user roles as D&D classes
const classes = ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'];

//command list, displayed on !help
const commands = "\n!roll [dice count] d [dice type] + [modifier (optional)]\t-\tRoll dice\n" +
				 "\n!lookup [type] [subject]\t-\tLookup a 5e subject on Roll20.net by type: spell/item/weapon/class/race/monster/misc\n" +
				 "\n!learn [class] [monster]\t-\tAllow a class to learn the stats of a monster (set class to 'All' for public knowledge)\n" +
				 "\n!lore [subject]\t-\tSee what your character knows about a particular subject (type '!lore ?' for a list of subjects)\n" +
				 "\n!song [artist] [song]\t-\tRequest a song from YouTube to play\n" +
				 "\n{WIP} !generate [name]\t-\tInitialize new campaign\n" + //TODO:
				 "\n{WIP} !switch [name]\t-\tSwitch to a different existing campaign\n" + //TODO:
				 "\n{WIP} !current\t-\tGet name of currently-active campaign\n" + //TODO:
				 "\nPlease note: Although requests must be made from a server channel, Fletbot answers may be sent to PM channels to avoid clogging main channels";

module.exports = (client, message) => {
	//ignore messages sent by Fletbot
	if(message.author.tag === client.user.tag)
	{return;}
	
	let msg = message.content.toLowerCase();
	
	//banter with Fletbot
	if(msg.includes("fletbot") || message.isMemberMentioned(client.user))
	{
		if(msg.includes("who ") || msg.includes("who's") || msg.includes("what"))
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
		/*parse roll string*/
		let diceQuery = msg.substring(6).toLowerCase();
		let d = diceQuery.indexOf('d');
		let diceCount = parseInt(diceQuery.substring(0, d));
		let temp = diceQuery.substring(d+1).split('+');
		let diceType = temp[0];
		let modifier = null;
		if(temp.length > 1)
		{modifier = temp[1];}
	
		let output = "";
		let total = 0;
		
		//roll dice, keep running total and string
		for(var i = 0; i < diceCount; i++)
		{
			let roll = Math.floor(Math.random() * diceType) + 1;
			output += (roll + "\t");
			total += roll;
		}
		
		//apply modifier if one exists
		if(modifier)
		{
			output += ("(+" + modifier + ")");
			total += parseInt(modifier);
		}
		
		//lowest possible roll is 1
		if(total < 1)
		{total = 1;}

		message.reply("\n" + output + "\nTotal: " + total);
	}

	//get music video from youtube
	else if(msg.startsWith('!song'))
	{
		//only DM is allowed to request music
		if(!message.member.roles.find(r => r.name === "DM"))
		{
			message.reply("\nSorry, only the DM can request music. Try asking them instead.");
			return;
		}
		
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
		
	}
	
	//lookup item from Roll20.net
	else if(msg.startsWith('!lookup'))
	{
		//can't handle requests in private channels
		if(pmChannel(message))
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
			
			if(subject != pageTitle)
			{
				message.author.send("Invalid request");
				console.log("'" + pageTitle + "' vs '" + subject + "'");
				return;
			}
			
			$('h1').replaceWith('\n');
			$('h2').replaceWith('\n');
			$('h3').replaceWith('\n');
			$('tr').replaceWith('\n');
			$('td').replaceWith(' ');
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
				if(lines[l].length > 0 && lines[l] != '\n')
				{message.author.send("```" + lines[l] + "```");}
			}			
		});
	}
	
	//add monster to list of knowns
	else if(msg.startsWith('!learn'))
	{
		if(!message.member.roles.find(r => r.name === "DM"))
		{
			message.reply("Only the DM can add monsters to known list");
			return;
		}
		
		let scope = msg.split(' ')[1];
		let subject = msg.substring(msg.indexOf(scope) + scope.length + 1).toLowerCase();
		
		let fPath = (path + scope + "/knowledge.txt");
		
		fs.appendFile(fPath, '\n' + subject, 'utf8', (err) => {
			if(err)
			{
				console.log(err);
				return;
			}
			
			message.reply("Added " + subject + " knowledge for " + scope);
		});
	}
	
	//read lore from files stored to OneDrive server
	else if(msg.startsWith('!lore'))
	{
		//can't handle requests in private channels
		if(pmChannel(message))
		{return;}
		
		var loreRequest = msg.toLowerCase().substring(6);
		var success = false;
		
		console.log("Lore request: " + loreRequest);
		
		//return list of all known subjects
		if(loreRequest == '?')
		{
			//retrieve all public-knowledge subjects
			let files = fs.readdirSync(path + 'All/', 'utf8');

			message.author.send("Public-Knowledge Subjects:\n");
			
			let output = "```";
			for(var i = 0; i < files.length; i++)
			{
				if(files[i] == 'knowledge.txt')
				{continue;}
				
				output += ("'" + files[i] + "' ");
			}
			output += "```";
			message.author.send(output);
			
			//retrieve class-specific subjects
			let folders = fs.readdirSync(path, 'utf8');

			message.author.send("\nPrivate-Knowledge Subjects:\n");
			
			for(var i = 0; i < folders.length; i++)
			{
				if(message.member.roles.some(r => r.name === folders[i]))
				{
					let fi = fs.readdirSync(path + folders[i] + "/", 'utf8');

					let output = "```";
					for(var j = 0; j < fi.length; j++)
					{
						if(fi[j] == 'knowledge.txt')
						{continue;}
						
						output += ("'" + fi[j] + "' ");
					}
					output += "```";
					message.author.send(output);
				}
			}
			
			
			success = true;
		}
		
		//lookup specific subject
		else
		{
			//read through list of public-knowledge subjects
			success = findLore(path + 'All/', loreRequest, message.author)
			
			if(success)
			{return;}
			
			//read through all folders accessible by role
			fs.readdir(path, (err, folders) => {
				if(err)
				{
					console.log(err);
					return;
				}
				
				for(var i = 0; i < folders.length; i++)
				{
					//check role permissions before accessing folder
					if(!message.member.roles.find(r => r.name == folders[i]) && !message.member.roles.find(r => r.name === "DM"))
					{continue;}
				
					success = findLore(path + folders[i] + '/', loreRequest, message.author);
					
					if(success)
					{
						console.log(path + folders[i] + '/' + loreRequest);
						return;
					}
				}
				
				message.author.send("No information found on '" + loreRequest + "'");
			});
		}
	}
};

//make sure message isn't a PM; roles cannot be checked in private-message channels which will cause issues
function pmChannel(message)
{
	if(message.guild === null || message.channel.type === 'dm')
	{
		message.author.send("Sorry, I need you to be part of a server before I can do that.\nTry asking again from the #fletbot server channel\n");
		return true;
	}
	
	return false;
}

//retrieve and read lore message to requester
function findLore(dPath, loreName, requester)
{
	let files = fs.readdirSync(dPath, 'utf8');

	for(var i = 0; i < files.length; i++)
	{
		if(files[i] == loreName)
		{
			let file = fs.readFileSync(dPath + files[i], 'utf8');
			let lines = file.split('\n');
			requester.send(loreName.toUpperCase() + ":\n");
			
			for(var l in lines)
			{
				if(lines[l].length > 1)
				{requester.send("```" + lines[l] + "```");}
			}
			
			return true;
		}
	}
	
	return false;
}