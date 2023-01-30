require('dotenv').config()

const { REST } =require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { Client,GatewayIntentBits,Collection} = require('discord.js')
//Client to create bot , Intends : the bot should about to do (to production) 
const fs = require('fs')
const path = require('path')

const clients = new Client({
    //we want the bot to get access from guild and modify the server "arr(0)"  and to send messages on the server "arr(1)"
    intents : [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
})


//List of all commands 

const commands =  []
clients.commands = new Collection() ;

const commandPath = path.join(__dirname,"commands")
const commandFile = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'))


//Load the commands 

for ( const file of commandFile) {
    //we get our file from each command
    const FilePath = path.join(commandPath,file)
    //we load the command 
    const command = require(FilePath)
    //we store our command in commands as an object 
    clients.commands.set(command.data.name, command) ;
    //load the commands as json into command    (is array )
    commands.push(command.data.toJSON())
}

clients.on("ready",()=>{
    //get all the id of the servers 
    const guild_id = clients.guilds.cache.map(guild => guild.id)
    //create a rest client
    const rest = new REST({version : '9'}).setToken(process.env.TOKEN)
    //register the commands
    rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID,guild_id),{body : commands})
    .then(()=>console.log("Successfully registered application commands."))
    .catch(console.error)
})
clients.on("interactionCreate",async interaction => {
    if(!interaction.isCommand()) return ;
    const {commandName} = interaction
    const command = clients.commands.get(commandName)
    if(!command) return ;
    try {
        await command.execute(interaction)
        } catch (error) {
            console.error(error)
        }
    })

//now we need to make our bot active and pop up online 

clients.login(process.env.TOKEN)
