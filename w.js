//https://waguide.pedroslopez.me/
//npm install qrcode-terminal
//npm i whatsapp-web.js

//https://pedroslopez.me/whatsapp-web.js/

//https://github.com/pedroslopez/whatsapp-web.js/releases

//    msg.reply(`Hello @${user.id.user}`, {

    var Jimp = require('jimp');
    var qrcode = require('qrcode-terminal');
    const { createContext } = require('vm');
    const { Client, MessageMedia } = require('whatsapp-web.js');
    
    
    
    
    
    
    
    
    
    
    
    
    
    const fs = require('fs');
const { bitmap } = require('jimp');
const { getBase64 } = require('jimp');
const { resolve } = require('path');
    
    // Path where the session data will be stored
    const SESSION_FILE_PATH = './session.json';
    
    // Load the session data if it has been previously saved
    let sessionData;
    if(fs.existsSync(SESSION_FILE_PATH)) {
        sessionData = require(SESSION_FILE_PATH);
    }
    
    // Use the saved values
    const client = new Client({
        session: sessionData
    });
    
    // Save session values to the file upon successful auth
    client.on('authenticated', (session) => {
        sessionData = session;
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
            if (err) {
                console.error(err);
            }
        });
    });
    
    
    const Duels = {};
    client.initialize()  ;
    
    client.on('qr', (qr) => {
        // Generate and scan this code with your phone
        console.log('QR RECEIVED', qr);
        qrcode.generate(qr, {small: true});
    });
    
    client.on('ready', () => {
        console.log('Client is ready!');
    });
    
    client.on('message', async msg => {
        if (msg.body == '!ping') {
            for (let index = 0; index < 10; index++) {
                msg.reply('pong' + index);
    
            }
        }
        else if(msg.body.startsWith('!duel') &&  (await msg.getMentions()).length == 1 ){
            let mentioned  = (await msg.getMentions())[0];
            console.log(`${mentioned.number} was mentioned`);
            //const user = await msg.getContact();
            //(await msg.reply('do u accept @' + `${mentioned.number}`));
            //(await msg.reply('do u accept @' + `${mentioned.id.user}`))
            (await msg.getChat()).sendMessage(`Hello @${mentioned.id.user}`+ '\n send !accept + @person to start the fight!',{mentions: [mentioned]} );
            Duels[mentioned.id] = (await msg.getContact()).id
        }
        else if (msg.body.startsWith('!accept') &&  (await msg.getMentions()).length == 1 ){
            let mentioned  = (await msg.getMentions())[0];
            (await msg.getChat()).sendMessage(`Hello @${mentioned.id.user} @${(mentioned.id.user)}` ,{mentions: [mentioned, msg.getContact()]} );
            //if (Duels[(await msg.getContact()).id] == await msg.getMentions()[0].id){
            //    (await msg.getChat()).sendMessage(`Hello @${mentioned.id.user} @${(await msg.getContact()).id.user}`,{mentions: [mentioned.msg.getContact()]} + '\n The games has been started. \n reply me privatly the number of the tool you want to use \n 1 - rock \n 2 - paper \n siccores- 3');
            //}
        }
       // if (msg.body == '!sticker'){ 
       //     const sticker = MessageMedia.fromFilePath(await msg.downloadMedia());
       // }
        else if(msg.hasMedia && msg.body.startsWith('סטיקר')) {
            var media = await msg.downloadMedia();
            if (msg.body!= 'סטיקר'){
                var text = msg.body.split(' ')[1]
                let  bitmap = Buffer.from(media.data, 'base64');
                console.log(bitmap == null);
                let image = await Jimp.read(bitmap);
                //console.log(image == null);
               await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE).then(font => {
                image.print(
                  font,0,0,text) // prints 'Hello world!' on an image, middle and center-aligned, when x = 0 and y = 0
              });
                await (await image).write('vrvw.jpeg');
                 // let base644 = media.data;
                  console.log(media.mimetype);
                  //media.mimetype = 'image/jpeg';
             let data =  await image.getBase64Async(Jimp.MIME_JPEG).then(data =>{
                   return (data)     
               }).catch(r=>{console.log(r)});
              
               var dataa = (await image.getBufferAsync('image/jpeg')).toString('base64');
               media = new MessageMedia('image/jpeg',dataa);
             //  console.log(data);
               //(await msg.getChat()).sendMessage(new MessageMedia('image/jpeg',dataa))
          // (await msg.getChat()).sendMessage(MessageMedia.fromFilePath('vrvw.jpeg'), { sendMediaAsSticker: true });
            }//

           (await msg.getChat()).sendMessage(media, { sendMediaAsSticker: true });


        }
                    
        else if(msg.body === '!everyone') {
            const chat = await msg.getChat();
            
            let text = "";
            let mentions = [];
    
            for(let participant of chat.participants) {
                const contact = await client.getContactById(participant.id._serialized);
                
                mentions.push(contact);
                text += `@${participant.id.user} `;
            }
    
            chat.sendMessage(text, { mentions });
        }
            
    });
    
    
    
    
    //client.on('message', async msg => {
    //    if(msg.hasMedia) {
    //        const media = await msg.downloadMedia();
    //        // do something with the media data here
    //    }
    //});
    
    
    client.on('disconnected', (reason) => {
        console.log('Client was logged out', reason);
    });
    //const sticker = MessageMedia.fromFilePath('/path/to/image.png');
    //chat.sendMessage(sticker, { sendMediaAsSticker: true });
    //var canvas = document.getElementById('canvas'),
    //        ctx = canvas.getContext('2d');
    //canvas.width = $('img').width();
    //canvas.crossOrigin = "Anonymous";
    //canvas.height = $('img').height();
    //ctx.drawImage($('img').get(0), 0, 0);
    //ctx.font = "36pt Verdana";
    //$(document).on('input','#inp',function(){
    //    //redraw image
    //    ctx.clearRect(0,0,canvas.width,canvas.height);
    //    ctx.drawImage($('img').get(0), 0, 0);
    //    //refill text
    //    ctx.fillStyle = "red";
    //    ctx.fillText($(this).val(),40,80);
    //});
    //$('button').click(function(){
    //    console.log(ctx.getImageData(50, 50, 100, 100));
    //});