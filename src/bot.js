require('dotenv').config();
const Game = require('hangman-game-engine')
const randomWords = require('random-words');
const roasts = require('./roasts.js')
const facts = require('fun-facts');
const fetch = require('node-fetch');

const MAX_GUESS = 8;
let maintenance = false;

const { exec } = require("child_process");
const Discord = require('discord.js');
const client = new Discord.Client();
let token = process.env.token;
client.login(token).then(() => {console.log("Bot is Ready to Roll")});


let hangmanGames = [];

client.on('ready', readyDiscord);

async function readyDiscord(){
    
    await client.user.setActivity("Press &help for help");
}

const commands = ["&help", "&roast", "&bored", "&hi", "&hang", "&fact", "&gals", "&anime", "&catto", "&doggo"];

client.on('message', gotMessage);

async function gotMessage(msg){

    console.log(msg.content);

    if(msg.content === "&cease")
    {
        const clientApplication = await client.fetchApplication();
        if(msg.author.id === clientApplication.owner.id)
        {
            await msg.channel.send("`Ceasing to exist in 3... 2... 1..`")
            client.destroy();
        }
        else
            await msg.channel.send("`You dont have perms bruh.`")
    }
    else if(msg.content === "&retire" )
    {
        const clientApplication = await client.fetchApplication();
        if(msg.author.id === clientApplication.owner.id)
        {
            await msg.channel.send("Maintenance mode: `On`")
            maintenance = true;
        }
        else
            await msg.channel.send("`You dont have perms bruh.`")
    }
    else if(msg.content === "&arise" )
    {
        const clientApplication = await client.fetchApplication();
        if(msg.author.id === clientApplication.owner.id)
        {
            await msg.channel.send("Maintenance mode: `Off`")
            maintenance = false;
        }
        else
            await msg.channel.send("`You dont have perms bruh.`")
    }
    else if(maintenance)
    {
        if(msg.channel.id !== "793403873951612931" && commands.includes(msg.content))
            await msg.channel.send("`Dot the bot is under maintenance.`");
    }
    else if(msg.content === '&help')
        await msg.channel.send("```Commands u can use are &hi, &bored, &hang, &fact, &anime, &catto and &doggo. Try to know what they are....```")

    else if(msg.content === '&hi')
        msg.reply('hi');

    else if(msg.content === '&roast')
    {
        const index = Math.floor(Math.random() * roasts.length);
        await msg.channel.send("```"+roasts[index]+"```");
    }
    else if(msg.content === '&bored')
    {
        exec("fortune | cowsay", (error, stdout, stderr) => {
            if (error)
                console.log(`error: ${error.message}`);
            else if (stderr)
                console.log(`stderr: ${stderr}`);

            console.log(`stdout: ${stdout}`);
            msg.channel.send("```"+stdout+"```")
        });
    }

    else if(msg.content === "&fact")
    {
        const getFact = facts.get();
        console.log(getFact);
        await msg.channel.send("`"+getFact.fact+"`")
    }

    else if(msg.content === "&anime")
    {
        let url = `https://api.tenor.com/v1/search?q=anime+cute&${process.env.tenorKey}=LIVDSRZULELAcontentfilter=high`
        let response = await fetch(url);
        let json = await response.json();
        console.log(json);
        let index = Math.floor(Math.random() * json.results.length)
        await msg.channel.send(json.results[index].url);
    }

    else if(msg.content === "&catto")
    {
        let url = `https://api.tenor.com/v1/search?q=kitten+cute&${process.env.tenorKey}=LIVDSRZULELA&contentfilter=high`
        let response = await fetch(url);
        let json = await response.json();
        console.log(json);
        let index = Math.floor(Math.random() * json.results.length)
        await msg.channel.send(json.results[index].url);
    }

    else if(msg.content === "&doggo")
    {
        let url = `https://api.tenor.com/v1/search?q=puppy+cute&${process.env.tenorKey}=LIVDSRZULELAcontentfilter=high`
        let response = await fetch(url);
        let json = await response.json();
        console.log(json);
        let index = Math.floor(Math.random() * json.results.length)
        await msg.channel.send(json.results[index].url);
    }

    else if(msg.content === '&hang') // initialise and start a new hangman game for the current user
    {
        // extract the sender id and create  a new game
        let id = msg.author.id;
        let currentGame = hangmanGames[id]
        if(currentGame !== undefined)
        {
            msg.reply("`You already started a hangman game. First complete it`");
            return;
        }
        const word_array = randomWords({exactly: 1, maxLength: 6}); 
        const word = word_array.join('')
        console.log({word});
        hangmanGames[id] = new Game(word, {concealCharacter: '*', maxAttempt: MAX_GUESS});
        hangmanGames[id].status = 'IN_PROGRESS';
        msg.reply("`A new game has been created for you. Start guessing with &hang 'character'`");
        let reply = `The word now is: ${hangmanGames[id].hiddenWord.join('')}`;
        msg.reply("`" + reply + "`");
    }

    else if(msg.content.startsWith("&hang")) // to guess a letter
    {
        // input form: &hang char
        let id = msg.author.id
        
        let currentGame = hangmanGames[id]
        if(currentGame === undefined)
        {
            msg.reply("`You have not yet started a hangman game. Start one by typing &hang`");
            return;
        }
        hangmanGames[id].status = 'IN_PROGRESS';

        let char = (msg.content.split(' '))[1];
        
        console.log({char});

        let initialFailGuess = currentGame.failedGuesses;
        if(currentGame.word.includes(char))
        {
            msg.reply("`You have already guessed this letter, dude.`")
            return;
        }
        currentGame.guess(char);

        if(currentGame.failedGuesses === MAX_GUESS)
        {
            currentGame.revealHiddenWord();
            let reply = `You lost. Anyhow better luck next time. The correct word was: ${currentGame.hiddenWord.join('')}`;
            msg.reply("`" + reply + "`");
            delete hangmanGames[id];
            return;
        }

        if(!currentGame.hiddenWord.includes('*'))
        {
            msg.reply("`Cool you guessed it!`");
            delete hangmanGames[id];
            return;
        }

        if(currentGame.failedGuesses === initialFailGuess) //successful guess
        {
            let reply = `The letter you guessed is present in the word. The word now is: ${currentGame.hiddenWord.join('')}`;

            console.log(reply);
            msg.reply("`" + reply + "`");
        }
        else //failed guess
        {
            msg.reply("`The letter you guessed is incorrect`\n" + 'You have wrongly guessed ' + currentGame.failedGuesses + " times. (Maximum is " + MAX_GUESS + " times)");
            let reply = `The word now is: ${hangmanGames[id].hiddenWord.join('')}`;
            msg.reply("`" + reply + "`");
        }

        console.log(JSON.stringify(currentGame));
        hangmanGames[id] = currentGame;
    }
}

