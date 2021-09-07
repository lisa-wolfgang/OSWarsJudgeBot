const Discord = require('discord.js');
const pagination = require('discord.js-pagination');

module.exports = {
  name: 'changelog',
  description: 'View update information for this bot',
  execute(message, args, devMode) {
    const updates = [
      new Discord.MessageEmbed()
        .setColor('#000000')
        .setTitle('OS Wars Judge Bot Changelog')
        .attachFiles(['icon.png'])
        .setThumbnail('attachment://icon.png')
        .addFields(
          { name: 'Version 2.0.2', value: `-**Fixed reset bug**` },
          { name: 'Version 2.0.1', value: `-**Fixed round total judging bug**` },
          { name: 'Version 2.0.0', value: `-**Added mydata command**\nmydata allows judges to view which teams and criteria they have judged or are in progress of judging. Judges can also use this command to see what their feedback and scores are.\n-**Added generate command**\ngenerate parses the data from the database into files which can then be transfered into the project where results are displayed.\n-**Updated team command**\nNow you can judge an entire team at once or one criteria at a time. Want to edit your judging or score? Just use the updated team command.\n-**Added changelog command**\n-**Integrated a database into the bot**\n-**Fixed a parsing-related bug**\n-**Improved general bot stability and performance**` },
        )
    ,
    new Discord.MessageEmbed()
        .setColor('#000000')
        .setTitle('OS Wars Judge Bot Changelog')
        .attachFiles(['icon.png'])
        .setThumbnail('attachment://icon.png')
        .addFields(
          { name: 'Version 1.0.0', value: `**Bot Release**\n-**PEANUTKIT**\n-**Added reset command**\n-**Added team command**\n-**Added help command**\n-**Added test command**` },
        )
    ]
    
    pagination(message, updates);
  }
}