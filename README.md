# Fletbot: A Discord bot for D&amp;D
## Contents
* [Setup](#setup)
* [File Structure](#file-structure)
* [Running Fletbot](#running)

## Setup
- Download this repository to a location of your choice.
- Sign into the [Discord Developer Portal](https://discordapp.com/developers).
- Once signed in, click the Applications tab atop the page, then click the New Application button.
- In the settings pane to the left, click Bot, then select Add Bot.
  - Your bot can be either public or private; the choice is yours.
- Select OAuth2 in the left pane and select 'bot' under scopes.
- Choose any set of permissions for your bot, but **the Send Messages text permission must be enabled**.
  - In order for YouTube song requests to work, the Embed Links permission must also be enabled.
  - Permissions can be changed at any point by someone in the Discord server with appropriate access.
- Once permissions have been selected, open the link at the bottom of the scope section.
- Select a server, then click Authorize to add your bot to that server.

## File Structure
#### Bot Files
- Included in the downloaded repository should be a file called 'campaigns_base'. This file stores a path to the base directory for your campaigns.
- Overwrite the path in this file with wherever you wish to save all your D&amp;D campaigns.
- Navigate to the directory written in campaigns_base and create a file named 'botToken'.
  - Note: [Discord tokens](https://discordhelp.net/discord-token) are 'keys' that give access to an account. **DO NOT SHARE TOKENS WITH OTHERS UNDER ANY CIRCUMSTANCES**.
- In the Discord Developer Portal, select Bot in the left pane, then click Copy under Token.
- Paste this token into the botToken file.
#### Campaign Directory
- The path that was stored to campaigns_base is the directory that will contain all data for each created D&amp;D campaign
  - Note: Creating a new campaign is covered under [bot commands](#commands)
- Each campaign created within this directory will contain a Lore folder, within which there will be a folder for every class.
  - Note: At present, Fletbot only supports the core 5e classes. A future update will allow for players to be differentiated by Discord server roles.
  - Each class's folder contains data that only a character of that class knows.
    - To add a lore fact to a class, inside the class folder create a file whose name is the lore's name.
    - To add information that will be available to all players, create a file in the All folder instead of a specific class.
    - Each folder also contains a 'knowledge.txt' file. This file contains a list of all the monsters a character is able to see the stats of.
      - See [bot commands](#commands) for adding monsters to these lists.
- The campaign directory also contains a Maps folder to store maps in any (Discord-supported) image format

## Running
### Startup
- To run Fletbot, navigate to the repository directory in a Node.js terminal and type ```npm run fletbot```.
  - Note: The name of the bot can be changed in package.json by editing the values for "name" and under "scripts".
- If a campaign already exists, Fletbot can be started with an active campaign by typing ```npm run fletbot "[campaign name]"```.
  - Ex. ```npm run fletbot "a heroic tale"```
### Commands
- ```!roll [dice count] d [dice type] + [modifier]``` | Roll Dice
  - Modifier is optional and can be omitted
  - Ex. ```!roll 8d6```
  - Ex. ```!roll 1d6 + 3```
- ```!lookup [type] [subject]``` | Lookup a 5e subject on [Roll20](https://roll20.net)
  - Types are:
    - spell
    - item
    - weapon
    - class
    - race
    - monster
    - misc (WIP)
  - Ex. ```!lookup item dungeoneer's pack```
  - Note: due to Discord's message size limit, messages can get a bit 'spammy'. Working on a better solution.
- ```!lore [subject]``` | See what your character knows about a particular subject
  - Ex. ```!lore underdark```
  - type ```!lore ?``` for a list of all subjects known to a character
- ```!map [name]``` | Load an image of a map
  - Ex. ```!map Greenland```
- ```!check``` | Check if there have been any updates to lore since the last check
  - Note: only checks as far back as beginning of process
- ```!learn [class] [monster]``` | Allow a class to be able to look up stats of a monster
  - Use 'All' as the class argument to allow all players to access a monster's stats
  - Ex. ```!learn druid dire wolf```
- ```!current``` | See which campaign is currently active
- ```!generate [name]``` | Create a new campaign
  - Ex. ```!generate a heroic tale```
- ```!switch [name]``` | Switch to a different existing campaign
  - Ex. ```!switch a heroic tale```
- ```!song [artist] [song]``` | Play a song from YouTube
  - Ex. ```!song queen don't stop me now```
- ```!kill``` | Terminate Fletbot
- Please note: Although commands must be made in a server channel, Fletbot answers may be sent to PM channels to avoid clogging main channels.

## Thank you for using Fletbot!
