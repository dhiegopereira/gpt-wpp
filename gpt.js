const TOKEN = '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';

const axios = require('axios');

async function generateResponse(prompt) {
  const response = await axios({
    method: 'post',
    url: 'https://api.openai.com/v1/chat/completions',
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

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function chat() {
  while (true) {
    const prompt = await new Promise(resolve => rl.question('> ', resolve));
    const response = await generateResponse(prompt);
    console.log(response.message.content);
  }
}

chat();

generateResponse("Olá, como posso ajudar?")
  .then(response => {
    console.log(response.message.content);
  })
  .catch(error => {
    console.log(error);
  });

exports.default = generateResponse;