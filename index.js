const { Client, Collection, MessageEmbed } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");

const client = new Client({
    disableEveryone: true
});

client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");

config({
    path: __dirname + "/.env"
});

["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});


//Discord Presence Description
client.on("ready", () => {
    console.log(`Hi, ${client.user.username} is now online!`);

    client.user.setPresence({
        status: "online",
        activity: {
            name: "my development",
            type: "WATCHING"
        }
    }); 
});

//Handling reports
client.on('messageReactionAdd', (reaction, user) => {
    if(!user.bot) {
        if (reaction.emoji.name === '📰')
        {
        client.channels.cache.get('702904618534961183').send(`${user} please type the ID of the question you are reporting:`).then(msg => msg.delete({timeout: 50000}));
        client.on('message', (message) => {
            if (message.channel == '702904618534961183' && message.author == user) {
                message.delete();
                let data = JSON.parse(fs.readFileSync('commands/fun/trivia.json'));
                var num = message.content;
                var id = data.trivia[num - 1];
                var question = id.question;
                var answer = id.answer;
                
                const embed = new MessageEmbed()
                .setDescription(`Q: "**${question}**"\nA: **${answer}**`)
                .setFooter("")
                .setColor("GREEN")
                
                message.channel.send(embed);
                message.channel.send("**FEEDBACK:**");
            }
        })
        }

        // if (message.content <= data.trivia.length && message.author.id == user.id) {
        //     const id = message.content + 1;
        //     console.log(id);
        //     // const question = data.trivia[id].question;
        //     // const answer = data.trivia[id].answer;
        //     // message.channel.send(`${question}, and ${answer}`);
        
        reaction.remove(user);
        
    }
});

//Handling commands
client.on("message", async message => {
    const prefix = "!";

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) 
        command.run(client, message, args);
});

//Console logging messages
client.on('message', message => {
    if (message.author.bot)
    {
        console.log(`🤖 ${client.user.username} said: ${message.content}`);
    }
    else
    {
        console.log(`💬 ${message.member.user.tag} said: ${message.content}`);
    }
})

client.login(process.env.TOKEN);