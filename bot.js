require('dotenv').config();
// import Game from 'hangman-game-engine';
const Game = require('hangman-game-engine')

const { exec } = require("child_process");
const Discord = require('discord.js');
const client = new Discord.Client();
let token = process.env.token;
client.login(token);

var id;

client.on('ready', readyDiscord);

function readyDiscord(msg){
    client.user.setActivity("Press &help for help"); 
}

client.on('message', gotMessage);

function gotMessage(msg){


    const roasts = [
        'You suck more than PHP',
        "You're as useful as the 'ueue' in 'queue'",
        "Mirrors can't talk. Lucky for u they can't laugh either",
        "You're the reason the gene pool needs a lifegaurd",
        "If I had a face like yours, I'd sue my parents",
        "You're ass must be jealous of the shit that is coming out of your mouth",
        "Some day you'll go far... and I hope you stay there",
        'If your brain was dynamite, there wouldn’t be enough to blow your hat off.',
        'Your face makes onions cry',
        'Yo momma is so fat when she got on the scale it said, "I need your weight not your phone number."',
        'Yo momma is so fat, I took a picture of her last Christmas and its still printing.',
        'Yo mamma is so ugly when she tried to join an ugly contest they said, "Sorry, no professionals."',
        'Yo momma so fat and old when God said, "Let there be light," he asked your mother to move out of the way.',
        'Yo momma so fat, that when she fell, no one was laughing but the ground was cracking up.',
        'Yo momma is so fat when she sat on WalMart, she lowered the prices.',
        'Yo momma is so fat that Dora cant even explore her!',
        'Your momma is so ugly she made One Direction go another direction.',
        'Yo momma so stupid, she put two quarters in her ears and thought she was listening to 50 Cent.',
        'If I had a dollar for every time you said somethng smart I would be broke',
        "When you were born the doctor threw you out the windows and the window threw you back"
    ]

    console.log(msg.content);
    if(msg.content === '&help')
    {
        msg.channel.send("```Commands u can use are &hi, &roast, &bored. Wanna know what they are? Fucking try for yourself.```")
    }
    if(msg.content === '&hi')
    {
        msg.channel.send('hi');
    }
    if(msg.content === '&roast')
    {
        const index = Math.floor(Math.random() * roasts.length);
        msg.channel.send("```"+roasts[index]+"```");
    }
    if(msg.content === '&bored')
    {
        exec("fortune|cowsay", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                
            }
            console.log(`stdout: ${stdout}`);
            msg.channel.send("```"+stdout+"```")
        });
    }
    if(msg.content === '&hang')
    {
        id = msg.author.id;
        console.log(id);
    }
}

