// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');

const TOKEN = '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';

const axios = require('axios');

// async function generateResponse(prompt) {
//   const response = await axios({
//     method: 'post',
//     url: 'https://api.openai.com/v1/chat/completions',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${TOKEN}`
//     },
//     data: {
//      model: 'gpt-3.5-turbo',
//      messages: [{"role": "user", "content": prompt}],
//      temperature: 0.7
//     }
//   });

//   return response.data.choices[0];
// }

// import requests

// url = "https://api.theb.ai/chatbot"
// headers = {"Content-Type": "application/json"}
// data = {
//     "key": "<sua chave de API aqui>",
//     "message": "Olá, como você está?"
// }
// response = requests.post(url, headers=headers, json=data)

// print(response.json())


async function generateResponse(prompt) {
  const response = await axios({
    method: 'post',
    url: 'https://api.theb.ai/chatbot',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    },
    data: {
     model: 'gpt-3.5-turbo',
     messages: [{"role": "user", "content": prompt}],
     temperature: 0.7
    }
  });

  return response.data.choices[0];
}

let gpt = false;

venom
  .create({
    session: 'session-name', //name of session
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
    let result = '';
  client.onMessage((message) => {
    if (message.isGroupMsg === false) {
        if (message.body === 'GPT ON') {
            gpt = true;
            result = "GPT activated";
        } else if (message.body === 'GPT OFF') {
            gpt = false;
            result = "GPT disabled";
        } 

        if (gpt && (message.body !== 'GPT ON' && message.body !== 'GPT OFF')) {

            generateResponse(message.body)
                .then(response => {
    
                    console.log(response.message.content);
                    client
                    .sendText(message.from, response.message.content)
                    .then((result) => {
                    console.log('Result: ', result); //return object success
                    result = ''
                    })
                    .catch((erro) => {
                    console.error('Error when sending: ', erro); //return object error
                    result = ''
                    });
                })
                .catch(error => {
                    console.log(error);
                    result = ''
                });
        } else {
            client
                .sendText(message.from, result)
                .then((result) => {
                  result = ''
                console.log('Result: ', result); //return object success
                })
                .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
                result=''
                });
        }
        
    }
  });
}
