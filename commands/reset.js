module.exports = {
	name: 'reset',
	description: 'Wipes the output files. Make sure to save the files before performing this! (Only available to bot owners)',
	execute(message, args, devMode, client) {
    const config = require('../config.json');
    const database = require("../database");
    var confirm = false;
    var done = false;
    var count = 0;
    
    if (config.teams.length === 0 || config.judges.length === 0 || config.criteria.length === 0) {
		  message.channel.send(`Sorry, you cannot reset the files because either the teams, judges, or criteria have not been configured properly. Tell the bot owner to go to \`config.json\` in this bot's code and fill everything out.`)
    } else {
      if (!config.bot_owner_ids.includes(message.author.id)) {
        message.channel.send(`Sorry, only the bot owners ${config.bot_owners} can use this command.`)
      } else {
        message.channel.send(`Are you really sure you want to do this? Make sure that you've successfully downloaded the files before continuing. Type your username to continue. Type anything else to cancel.`)
        confirm = true;
      }
    }

    client.on('message', msg => {
      count += 1
      if (msg.author.bot || count == 1 || done) return;
      if (confirm && config.bot_owner_ids.includes(msg.author.id) && (config.requiredChannel === "" || msg.channel.id === config.requiredChannel) && config.bot_owners.includes(msg.content)) {
        done = true;
        message.channel.send('Resetting...')

        const fs = require('fs');
        var assembly = ''

        for (i=0;i<config.teams.length * config.judges.length * config.criteria.length;i++){
          assembly += "0\n"
        }
        fs.writeFileSync('/home/runner/OSWarsJudgeBot/output/scores.txt', assembly)

        assembly = ''
        for (i=0;i<config.teams.length * config.judges.length * config.criteria.length;i++){
          assembly += "\n"
        }
        fs.writeFileSync('/home/runner/OSWarsJudgeBot/output/feedback.txt', assembly)

        database.resetDatabase()
        
        message.channel.send('Output files and database successfully reset.')
      } else if (confirm && !done) {
        confirm = false;
        message.channel.send(`OK, reset cancelled.`)
      }
    });
  },

};