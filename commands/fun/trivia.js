//Short term TO-DO
//Read trivia.json
//Read preset questions from trivia.json and send them to discord
//Listen for correct answer
//message.channel.send(`Congratulations! ${member.user.displayName} got it!`); when correct answer is given

const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const { reportQuestion } = require('../../functions.js');



module.exports = {
    name: 'trivia',
    category: 'fun',
    run: async (client, message, args) => {

        var status;

        if (status == "running") return;

        status = "running";

        let data = JSON.parse(fs.readFileSync('commands/fun/trivia.json'));
        var length = data.trivia.length;
        var randomNumber = Math.floor(Math.random() * length);
        var randomQuestion = data.trivia[randomNumber];
        var question = randomQuestion.question;
        var type = randomQuestion.type;
        var unit = randomQuestion.unit;
        var answer = randomQuestion.answer;
        var id = randomQuestion.id;

        const embed = new MessageEmbed()
            .setTitle(question)
            .setDescription(type)
            .setFooter(`${unit} Question, ID: ${id}`)
            .setColor("#BF0000")

        const m = await message.channel.send(embed);




        if (type == "Reveal Answer")
        {
            await m.react('🅰️');
            const filter = (reaction) => reaction.emoji.name === '🅰️';
            await m.awaitReactions(filter, { maxUsers: 2, idle: 40000 })
                .then(collected => console.log(`Collected ${collected.size} reactions`))
                .catch(console.error)
            const embed2 = new MessageEmbed()
                .setDescription(`Q: "**${question}**"\nA: **${answer}**`)
                .setFooter(`React to the '📰' to report a question/answer, ID: ${id}`)
                .setColor("YELLOW")
            
            const m2 = await message.channel.send(embed2);

            m.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
            
            await m2.react('📰');


        }

        //Create 'report' function
        //Add newspaper emoji to answer embed
        //If reacted to, send user to 'report channel'
        //If not reacted to in 2 minutes, emoji is cleared


        //Types: 'true/false', 'one word/number', 'sentence'

        // if, else if, else? OR three ifs?

        client.on('message', (message) => {
            if (message.author.bot) return; 
                if (message.content == answer) 
                {
                    message.channel.send(`**${message.member} got it right!** ✅`);
                    return;
                }

        });

        status = "idle";
    }
}