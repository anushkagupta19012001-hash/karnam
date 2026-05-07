require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function run() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: "You are a helpful assistant." 
    });

    const chat = model.startChat({
      history: [],
    });

    const result = await chat.sendMessage("Hello");
    console.log(result.response.text());
  } catch (error) {
    console.error("Error:", error);
  }
}

run();
