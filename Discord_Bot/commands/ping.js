const { SlashCommandBuilder } = require('@discordjs/builders')
module.exports = {
    data : new SlashCommandBuilder()
    
    .setName('ping')
    .setDescription('Repplies with pong !')
    ,
    async execute(interaction) {
        await interaction.reply('Pong!')
    }
}