require('dotenv').config();
// import Game from 'hangman-game-engine';
const Game = require('hangman-game-engine')

const roasts = require('./roasts.js')

const word = "word";
const MAX_GUESS = 5;

const { exec } = require("child_process");
const Discord = require('discord.js');
const client = new Discord.Client();
let token = process.env.token;
client.login(token);

let hangmanGames = [];

client.on('ready', readyDiscord);

function readyDiscord(msg){
    console.log("Bot is Ready to Roll");
    client.user.setActivity("Press &help for help"); 
}

const commands = ["&help", "&roast", "&bored", "&hi", "&hang"];

client.on('message', gotMessage);

function gotMessage(msg){

    if(msg.channel.id != "793403873951612931" && commands.includes(msg.content))
    {
        msg.channel.send("`Dot the bot is under maintenance.`");
        return;
    }

    console.log(msg.content);
    if(msg.content === '&help')
        msg.channel.send("```Commands u can use are &hi, &roast, &bored. Wanna know what they are? Fucking try for yourself.```")

    if(msg.content === '&hi')
        msg.reply('hi');

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

    if(msg.content === '&hang') // initialise and start a new hangman game for the current user
    {
        // extract the sender id and create  a new game
        let id = msg.author.id;
        hangmanGames[id] = new Game(word, {concealCharacter: '*', maxAttempt: 5});
        hangmanGames[id].status = 'IN_PROGRESS';
        msg.reply("`A new game has been created for you. Start guessing with &hang 'character'`");
        return;
    }

    if(msg.content.startsWith("&hang")) // to guess a letter
    {

        // input form: &hang char
        let id = msg.author.id
        
        let currentGame = hangmanGames[id]
        if(currentGame == undefined)
        {
            msg.reply("`You have not yet started a hangman game. Start one by typing &hang`");
            return;
        }
        hangmanGames[id].status = 'IN_PROGRESS';

        let char = (msg.content.split(' '))[1];
        
        console.log({char});

        let initialFailGuess = currentGame.failedGuesses;
        currentGame.guess(char);

        if(currentGame.failedGuesses === MAX_GUESS)
        {
            currentGame.revealHiddenWord();
            let reply = `Better luck next time. The correct word was: ${currentGame.hiddenWord.join('')}`;
            msg.reply("`" + reply + "`");
        }

        if(!currentGame.hiddenWord.includes('*'))
        {
            msg.reply("You guessed the word.");
        }

        if(currentGame.failedGuesses == initialFailGuess) //successful guess
        {
            let reply = `The letter you guessed is present in the word. The word now is: ${currentGame.hiddenWord.join('')}`;

            console.log(reply);
            msg.reply("'" + reply + "'");
        }
        else //failed guess
        {
            msg.reply("Incorrect guess");
        }

        console.log(JSON.stringify(currentGame));
        hangmanGames[id] = currentGame;
    }
}

