const Discord = require('discord.js');
const config = require('../config.json');
module.exports = {
	name: 'help',
	description: 'Sends a list of commands.\nTo learn more about any specific command, type \`${config.prefix} help <command>\`.',
	execute(message, args, commands, devMode) {
    if (!args.length) {

      const helpEmbed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setTitle('OS Wars Judge Bot Help')
        .attachFiles(['icon.png'])
        .setThumbnail('attachment://icon.png')
        .setDescription(`To learn more about any specific command, type \`${config.prefix} help <command>\`.`)
        .addFields(
          { name: 'Bot Info', value: '`help`\\*, `changelog`, `test`' },
          { name: 'Judging', value: '`team`\\*, `mydata`\\*' },
          { name: 'Admin', value: '`generate`, `reset`, `dev`'},
        )
        .setFooter(`* = has subcommands (use ${config.prefix} help <command> for more info)`)

      message.channel.send(helpEmbed);

    } else {
      
      const helpName = commands.get(args[0].toLowerCase())
      if (!helpName) {
        message.channel.send('Sorry, I can\'t provide help because that command isn\'t supported. Check for typos or try another one!');
      } else {
        const helpEmbed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setTitle(config.prefix + ' ' + helpName.name)
        .setDescription(helpName.description)

        message.channel.send(helpEmbed);
      }

    }
	}
};