module.exports = (message, msg) => {
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
};