
const { Console } = require("console");
var Discord = require("discord.js-selfbot");
const { Client, MessageEmbed } = require("discord.js-selfbot");
const fs = require('fs');
const sharp = require("sharp");
const fetch = require('node-fetch');
const client = new Client();


var lastmsgauthormention= false;
var lastsenderid = "";
client.on("ready", () => {
    console.log("I am ready!");
  });

  client.on("message", message => {
 
        try{
            if(message.channel.guild.id=="694869493582790676"){
                if(message.content.toString().includes(".gif")){
                    console.log("aha");
                    var name = message.content.split("/");
                    download(message.content,name[name.length-1],Math.floor(Math.random()*10000))
                }
                if(message.content.toString().includes("tenor")){
                    return;
                }
               message.attachments.map(x=>{
                
                    if(x.name){
                        console.log(x);
                        download(x.attachment,x.name,x.id);
                    }
                });
            }
        }catch(err){
                console.log(err);
        }

  });
  
async function download(url,name,id) {

    const response = await fetch(url);
    const buffer = await response.buffer();

    compareBuffers(buffer,name,id);
 
  }

async function compareBuffers(buff,name,id){
    var dup = false;
    fs.readdir("images", function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 

        var buf= sharp(buff)
        .webp({ quality: 70 }).toBuffer().then(data=>{
            if(name.includes(".gif")){
                data = buff;
            }
            files.forEach(function (file) {
                var buffer = fs.readFileSync("images/"+file);
                if(Buffer.compare(buffer,data)==0){
                    console.log("dupp")
                    dup=true;
                    return
                    
                }
                  
                
            });
            if(dup==false){
                try{
                   
                 data
                   .toFile(`images/${id+"-"+name}`).catch(()=>{
                       fs.writeFile(`images/${id+"-"+name}`, buff, () => 
                       console.log(`${name} - finished downloading!`));
                   })
                }catch(er){
                    fs.writeFile(`images/${id+"-"+name}`, data, () => 
                    console.log(`${name} - finished downloading!`));
                }
                   
               }
        }).catch(()=>{
            fs.writeFile(`images/${id+"-"+name}`, buff, () => 
            console.log(`${name} - finished downloading!`));
        });
      
        //listing all files using forEach
      
      
    });
}
  // Log our bot in using the token from https://discordapp.com/developers/applications/me
  client.login("dc token");
  